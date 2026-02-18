export const Toast = ({ message }) => (
	<div
		style={{
			position: 'fixed',
			bottom: 36,
			left: '50%',
			transform: message
				? 'translateX(-50%) translateY(0)'
				: 'translateX(-50%) translateY(80px)',
			background: '#000',
			color: '#fff',
			padding: '14px 28px',
			fontSize: 13,
			fontWeight: 400,
			letterSpacing: '.04em',
			zIndex: 99999,
			transition: 'transform .45s cubic-bezier(0.22, 1, 0.36, 1)',
			whiteSpace: 'nowrap',
			border: '1px solid rgba(255,255,255,0.1)',
			pointerEvents: 'none',
		}}
	>
		{message}
	</div>
);
