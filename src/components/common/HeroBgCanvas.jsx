import { useRef, useEffect } from 'react';

export const HeroBgCanvas = () => {
	const canvasRef = useRef(null);
	useEffect(() => {
		const cv = canvasRef.current;
		if (!cv) return;
		const ctx = cv.getContext('2d');
		const dpr = Math.min(window.devicePixelRatio, 2);
		let animId;
		const resize = () => {
			cv.width = cv.offsetWidth * dpr;
			cv.height = cv.offsetHeight * dpr;
			ctx.scale(dpr, dpr);
		};
		resize();
		const W = () => cv.offsetWidth,
			H = () => cv.offsetHeight;
		const pts = Array.from({ length: 80 }, () => ({
			x: Math.random() * 2000,
			y: Math.random() * 1000,
			vx: (Math.random() - 0.5) * 0.2,
			vy: (Math.random() - 0.5) * 0.15,
			r: Math.random() * 1.5 + 0.3,
			op: Math.random() * 0.2 + 0.04,
		}));
		const gPts = [];
		for (let i = 0; i < 20; i++)
			for (let j = 0; j < 12; j++) gPts.push({ x: i / 19, y: j / 11 });
		let t2 = 0;
		const draw = () => {
			t2 += 0.01;
			ctx.clearRect(0, 0, W(), H());
			gPts.forEach((g, idx) => {
				const wave = Math.sin(g.x * 5 + t2) * 0.03 + Math.sin(g.y * 3 + t2 * 0.7) * 0.02;
				const px = g.x * W(),
					py = (g.y + wave) * H();
				const next = gPts[idx + 1];
				if (next && (idx + 1) % 12 !== 0) {
					const wave2 =
						Math.sin(next.x * 5 + t2) * 0.03 + Math.sin(next.y * 3 + t2 * 0.7) * 0.02;
					ctx.beginPath();
					ctx.moveTo(px, py);
					ctx.lineTo(next.x * W(), (next.y + wave2) * H());
					ctx.strokeStyle = 'rgba(255,255,255,0.045)';
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
			});
			pts.forEach((p) => {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0) p.x = W();
				if (p.x > W()) p.x = 0;
				if (p.y < 0) p.y = H();
				if (p.y > H()) p.y = 0;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255,255,255,${p.op})`;
				ctx.fill();
			});
			animId = requestAnimationFrame(draw);
		};
		draw();
		return () => cancelAnimationFrame(animId);
	}, []);
	return (
		<canvas
			ref={canvasRef}
			style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
		/>
	);
};
