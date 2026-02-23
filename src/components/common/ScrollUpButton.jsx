import { useState, useEffect } from 'react';

export const ScrollUpButton = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 400);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	if (!visible) return null;

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label="Scroll to top"
			style={{
				position: 'fixed',
				bottom: 32,
				right: 32,
				zIndex: 900,
				width: 48,
				height: 48,
				borderRadius: '50%',
				border: 'none',
				background: '#000',
				color: '#fff',
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
				transition: 'transform .3s var(--ease-out), opacity .3s',
				opacity: visible ? 1 : 0,
				transform: visible ? 'translateY(0)' : 'translateY(20px)',
			}}
			onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)')}
			onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
		>
			<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
				<polyline points="18 15 12 9 6 15" />
			</svg>
		</button>
	);
};
