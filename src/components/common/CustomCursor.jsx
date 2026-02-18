import { useRef, useEffect } from 'react';

export const CustomCursor = () => {
	const dotRef = useRef(null);
	const ringRef = useRef(null);
	const stateRef = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

	useEffect(() => {
		const dot = dotRef.current,
			ring = ringRef.current;
		if (!dot || !ring) return;
		const onMove = (e) => {
			stateRef.current.mx = e.clientX;
			stateRef.current.my = e.clientY;
			dot.style.left = e.clientX + 'px';
			dot.style.top = e.clientY + 'px';
		};
		const onOver = (e) => {
			const t = e.target;
			const isClickable = t.matches('button,a,[data-clickable],input,select,textarea');
			dot.classList.toggle('hover', isClickable);
			ring.classList.toggle('hover', isClickable);
			const isDark = t.closest('[data-dark]');
			dot.classList.toggle('on-dark', !!isDark);
			ring.classList.toggle('on-dark', !!isDark);
		};
		let animId;
		const animCursor = () => {
			const s = stateRef.current;
			s.rx += (s.mx - s.rx) * 0.1;
			s.ry += (s.my - s.ry) * 0.1;
			ring.style.left = s.rx + 'px';
			ring.style.top = s.ry + 'px';
			animId = requestAnimationFrame(animCursor);
		};
		animCursor();
		document.addEventListener('mousemove', onMove, { passive: true });
		document.addEventListener('mouseover', onOver);
		return () => {
			cancelAnimationFrame(animId);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseover', onOver);
		};
	}, []);

	return (
		<>
			<div id='cur-dot' ref={dotRef} />
			<div id='cur-ring' ref={ringRef} />
		</>
	);
};
