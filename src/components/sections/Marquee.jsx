export const Marquee = () => {
	const items = [
		'Precision Manufacturing',
		'0.05mm Resolution',
		'Limited Editions',
		'Parametric Design',
		'12-Step Finishing',
		'Hand Crafted',
		'Numbered Objects',
		'Where Rebellion Meets Precision',
	];
	const all = [...items, ...items, ...items];
	return (
		<div
			data-dark
			style={{
				background: '#000',
				padding: '20px 0',
				overflow: 'hidden',
				borderTop: '1px solid rgba(255,255,255,0.06)',
				borderBottom: '1px solid rgba(255,255,255,0.06)',
			}}
		>
			<div
				style={{
					display: 'flex',
					gap: 0,
					whiteSpace: 'nowrap',
					animation: 'marquee 25s linear infinite',
				}}
			>
				{all.map((t, i) => (
					<span
						key={i}
						style={{
							flexShrink: 0,
							display: 'inline-flex',
							alignItems: 'center',
							gap: 40,
							padding: '0 40px',
							fontSize: 13,
							fontWeight: 500,
							letterSpacing: '.1em',
							textTransform: 'uppercase',
							color: 'rgba(255,255,255,0.35)',
						}}
					>
						{t}
						<span
							style={{
								width: 4,
								height: 4,
								borderRadius: '50%',
								background: 'rgba(255,255,255,0.2)',
								display: 'inline-block',
							}}
						/>
					</span>
				))}
			</div>
		</div>
	);
};
