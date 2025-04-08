"use client";

import { useEffect, useRef } from "react";

async function hashAddress(address: string): Promise<Uint8Array> {
	const encoder = new TextEncoder();
	const data = encoder.encode(address);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	return new Uint8Array(hashBuffer);
}

function generateOklchColor(hash: Uint8Array, index: number): string {
	// Use different parts of the hash for different color properties
	const lightness = 0.5 + hash[index % hash.length] / 512; // Range: 0.5-0.75
	const chroma = 0.1 + hash[(index + 1) % hash.length] / 640; // Range: 0.1-0.3
	const hue = (hash[(index + 2) % hash.length] * 1.40625) % 360; // Range: 0-360

	return `oklch(${lightness} ${chroma} ${hue})`;
}

export function AddressVisualizer({ address }: { address: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const drawCanvas = async () => {
			const hash = await hashAddress(address);
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const size = 16;
			canvas.width = size;
			canvas.height = size;

			for (let y = 0; y < size; y++) {
				for (let x = 0; x < size; x++) {
					const index = y * size + x;
					ctx.fillStyle = generateOklchColor(hash, index);
					ctx.fillRect(x, y, 1, 1);
				}
			}
		};

		drawCanvas();
	}, [address]);

	return (
		<canvas
			ref={canvasRef}
			className="w-32 h-32 border rounded"
			title={address}
		/>
	);
}
