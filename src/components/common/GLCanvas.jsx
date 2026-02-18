import { useRef, useEffect } from 'react';
import { WebGLScene } from '../../utils/engine/WebGLScene';

export const GLCanvas = ({ opts, style, className, onReady }) => {
	const canvasRef = useRef(null);
	const sceneRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		const timer = setTimeout(() => {
			if (sceneRef.current) {
				sceneRef.current.destroy();
				sceneRef.current = null;
			}
			sceneRef.current = new WebGLScene(canvasRef.current, opts);
			if (onReady) onReady(sceneRef.current);
		}, 100);
		return () => {
			clearTimeout(timer);
			if (sceneRef.current) {
				sceneRef.current.destroy();
				sceneRef.current = null;
			}
		};
	}, [opts.geom, opts.color?.join(',')]);

	return (
		<canvas
			ref={canvasRef}
			style={{ width: '100%', height: '100%', display: 'block', ...style }}
			className={className}
		/>
	);
};
