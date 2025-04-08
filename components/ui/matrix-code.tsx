import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
	fontSize?: number;
	color?: string;
	characters?: string;
	fadeOpacity?: number;
	speed?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
	fontSize = 20,
	color = "#00ff00",
	characters = "01",
	fadeOpacity = 0.1,
	speed = 1,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropsRef = useRef<number[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const initDrops = (width: number) => {
			const columnCount = Math.ceil(width / fontSize) + 1;
			dropsRef.current = Array(columnCount)
				.fill(0)
				.map(() => Math.random() * -100);
		};

		const resizeCanvas = () => {
			const rect = container.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
			initDrops(rect.width);
		};

		resizeCanvas();
		const resizeObserver = new ResizeObserver(resizeCanvas);
		resizeObserver.observe(container);

		const chars = characters.split("");

		const draw = () => {
			ctx.fillStyle = `rgba(10, 10, 10, 0.1)`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = color;
			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < dropsRef.current.length; i++) {
				const char = chars[Math.floor(Math.random() * chars.length)];
				ctx.fillText(char, i * fontSize, dropsRef.current[i] * fontSize);

				if (
					dropsRef.current[i] * fontSize > canvas.height &&
					Math.random() > 0.975
				) {
					dropsRef.current[i] = 0;
				}
				dropsRef.current[i] += speed;
			}
		};

		const interval = setInterval(draw, 33 / speed);

		return () => {
			clearInterval(interval);
			resizeObserver.disconnect();
		};
	}, [fontSize, color, characters, fadeOpacity, speed]);

	return (
		<div ref={containerRef} className="absolute inset-0">
			<canvas
				ref={canvasRef}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 0,
				}}
			/>
		</div>
	);
};

export default MatrixRain;
