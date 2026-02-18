export const Footer = ({ setPage }) => (
	<footer
		data-dark
		style={{ background: '#000', padding: 'clamp(40px 16px, 8vw 5vw, 80px 52px 40px)' }}
	>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: 'clamp(40px, 8vw, 70px)',
				paddingBottom: 'clamp(40px, 6vw, 60px)',
				borderBottom: '1px solid rgba(255,255,255,0.07)',
			}}
			className='grid-col-2'
		>
			<div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(18px, 3vw, 24px)',
							fontWeight: 400,
							color: '#fff',
						}}
					>
						BWR
					</span>
					<span
						style={{
							fontFamily: 'var(--font-sans)',
							fontSize: 'clamp(9px, 1.5vw, 11px)',
							fontWeight: 600,
							letterSpacing: '0.08em',
							textTransform: 'uppercase',
							color: 'rgba(255,255,255,0.4)',
						}}
					>
						3D Works
					</span>
				</div>
				<p
					style={{
						fontSize: 'clamp(12px, 1.5vw, 14px)',
						fontWeight: 300,
						color: 'rgba(255,255,255,0.3)',
						maxWidth: 260,
						lineHeight: 1.7,
					}}
				>
					Where Rebellion Meets Precision. Limited edition 3D objects engineered to
					perfection.
				</p>
			</div>
			{[
				[
					'Collection',
					['Home', 'Products', 'Limited', 'Wearables'],
					['home', 'products', 'products', 'products'],
				],
				[
					'Studio',
					['Our Story', 'Process', 'Commissions', 'Contact'],
					['about', 'about', 'about', 'contact'],
				],
				[
					'Info',
					['Shipping', 'Returns', 'Care', 'FAQ'],
					['contact', 'contact', 'contact', 'contact'],
				],
			].map(([title, links, pages]) => (
				<div key={title}>
					<h4
						style={{
							fontSize: 'clamp(9px, 1.2vw, 10px)',
							fontWeight: 700,
							letterSpacing: '.16em',
							textTransform: 'uppercase',
							color: 'rgba(255,255,255,0.25)',
							marginBottom: 22,
						}}
					>
						{title}
					</h4>
					<ul
						style={{
							listStyle: 'none',
							display: 'flex',
							flexDirection: 'column',
							gap: 12,
						}}
					>
						{links.map((l, i) => (
							<li key={l}>
								<a
									data-clickable
									onClick={() => setPage(pages[i])}
									style={{
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										fontWeight: 300,
										color: 'rgba(255,255,255,0.45)',
										textDecoration: 'none',
										cursor: 'pointer',
										transition: 'color .2s',
									}}
									onMouseEnter={(e) => (e.target.style.color = '#fff')}
									onMouseLeave={(e) =>
										(e.target.style.color = 'rgba(255,255,255,0.45)')
									}
								>
									{l}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 'clamp(20px, 3vw, 30px)',
				flexDirection: 'column',
				gap: 'clamp(12px, 2vw, 16px)',
			}}
			className='footer-bottom'
		>
			<div
				style={{
					fontSize: 'clamp(10px, 1.5vw, 12px)',
					color: 'rgba(255,255,255,0.2)',
					letterSpacing: '.04em',
					textAlign: 'center',
				}}
			>
				© 2024 BWR 3D Works. Where Rebellion Meets Precision.
			</div>
			<div
				style={{
					fontSize: 'clamp(10px, 1.5vw, 12px)',
					color: 'rgba(255,255,255,0.2)',
					textAlign: 'center',
				}}
			>
				Limited editions · Precision objects
			</div>
		</div>
	</footer>
);
