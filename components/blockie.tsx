"use client";

import React, { useEffect, useRef } from "react";
import sha256 from "crypto-js/sha256";

type Props = {
	address: string;
	size?: number;
	scale?: number;
	color?: string;
	bgcolor?: string;
	spotcolor?: string;
};

const Blockie: React.FC<Props> = ({
	address,
	size = 8,
	scale = 16,
	color,
	bgcolor,
	spotcolor,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		// The random number is a js implementation of the Xorshift PRNG
		const randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

		function seedrand(seed: string) {
			// Create a more diverse seed by hashing the input
			const hashedSeed = sha256(seed).toString();
			randseed.fill(0);

			// Use the full hash to initialize the seed
			for (let i = 0; i < hashedSeed.length; i++) {
				const value = parseInt(hashedSeed.substr(i * 2, 2), 16) || 0;
				randseed[i % 4] =
					((randseed[i % 4] << 5) - randseed[i % 4] + value) >>> 0;
			}

			// Additional mixing step
			for (let i = 0; i < 4; i++) {
				randseed[i] = randseed[i] ^ ((randseed[(i + 1) % 4] << 17) >>> 0);
			}
		}

		function rand() {
			// Enhanced mixing function
			const t = randseed[0] ^ (randseed[0] << 11);
			const s = t ^ (t >> 8) ^ (randseed[3] << 7);

			randseed[0] = randseed[1];
			randseed[1] = randseed[2];
			randseed[2] = randseed[3];
			randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ s) >>> 0;

			return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
		}

		// Create a set of base colors that are well-distributed
		function createBaseColors() {
			const goldenRatio = 0.618033988749895;
			let hue = rand();

			// Generate 3 distinct base hues
			const hues = [];
			for (let i = 0; i < 3; i++) {
				hue = (hue + goldenRatio) % 1;
				hues.push(Math.floor(hue * 360));
			}

			// Ensure hues are at least 90 degrees apart
			for (let i = 0; i < hues.length; i++) {
				for (let j = i + 1; j < hues.length; j++) {
					const diff = Math.abs(hues[i] - hues[j]);
					if (diff < 90 && diff > 0) {
						hues[j] = (hues[j] + 90) % 360;
					}
				}
			}

			return hues;
		}

		function createColor(baseHues: number[], index: number) {
			const hue = baseHues[index % baseHues.length];

			// High saturation for vivid colors
			const s = "95%";

			// Vary lightness based on role (background darker, foreground brighter)
			let l;
			if (index === 0) {
				// background
				l = "15%"; // Darker background
			} else if (index === 1) {
				// foreground
				l = "60%"; // Bright foreground
			} else {
				// spot color
				l = "45%"; // Medium brightness for spots
			}

			return `hsl(${hue}, ${s}, ${l})`;
		}

		function createImageData(size: number) {
			const width = size;
			const height = size;
			const dataWidth = Math.ceil(width / 2);
			const mirrorWidth = width - dataWidth;

			const data = [];
			for (let y = 0; y < height; y++) {
				let row = [];
				for (let x = 0; x < dataWidth; x++) {
					// More controlled distribution for better readability
					const r = rand();
					row[x] = r < 0.4 ? 0 : r < 0.8 ? 1 : 2; // 40% bg, 40% fg, 20% spot
				}
				const r = row.slice(0, mirrorWidth);
				r.reverse();
				row = row.concat(r);

				for (let i = 0; i < row.length; i++) {
					data.push(row[i]);
				}
			}

			return data;
		}

		function buildOpts() {
			const newOpts: any = {};

			// Create a unique seed that's highly sensitive to input changes
			const uniqueSeed =
				address.toLowerCase() +
				"-" +
				sha256(address).toString().substring(0, 8);
			newOpts.seed = uniqueSeed;

			seedrand(newOpts.seed);

			// Generate base colors
			const baseHues = createBaseColors();

			newOpts.size = size;
			newOpts.scale = scale;

			// Use provided colors or generate high-contrast ones
			newOpts.bgcolor = bgcolor || createColor(baseHues, 0);
			newOpts.color = color || createColor(baseHues, 1);
			newOpts.spotcolor = spotcolor || createColor(baseHues, 2);

			return newOpts;
		}

		function renderIcon(opts: any, canvas: HTMLCanvasElement) {
			opts = buildOpts();
			const imageData = createImageData(opts.size);
			const width = Math.sqrt(imageData.length);

			canvas.width = canvas.height = opts.size * opts.scale;

			const cc = canvas.getContext("2d");
			if (!cc) return;

			// Enable crisp pixel rendering
			cc.imageSmoothingEnabled = false;

			cc.fillStyle = opts.bgcolor;
			cc.fillRect(0, 0, canvas.width, canvas.height);
			cc.fillStyle = opts.color;

			for (let i = 0; i < imageData.length; i++) {
				if (imageData[i]) {
					const row = Math.floor(i / width);
					const col = i % width;

					cc.fillStyle = imageData[i] === 1 ? opts.color : opts.spotcolor;
					cc.fillRect(
						col * opts.scale,
						row * opts.scale,
						opts.scale,
						opts.scale,
					);
				}
			}

			return canvas;
		}

		if (canvasRef.current) {
			renderIcon({}, canvasRef.current);
		}
	}, [address, size, scale, color, bgcolor, spotcolor]);

	return <canvas ref={canvasRef} className="rounded-sm" />;
};

export default Blockie;
