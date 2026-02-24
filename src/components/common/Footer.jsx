import { Link } from 'react-router-dom';

export const Footer = () => (
	<footer
		data-dark
		style={{ background: '#000', padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 52px) 0' }}
	>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: 'clamp(40px, 8vw, 70px)',
				paddingBottom: 'clamp(40px, 6vw, 60px)',
				borderBottom: '1px solid rgba(255,255,255,0.07)',
			}}
			className='grid-col-4'
		>
			<div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(18px, 3vw, 24px)',
							fontWeight: 400,
							color: '#ffffffff',
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
							color: 'rgba(255, 255, 255, 1)',
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
						marginBottom: 16,
					}}
				>
					Craft Objects That Mean Something. Premium 3D printed gifts,
					nameplates & sculptures from Bengaluru, India.
				</p>
				<div
					style={{
						fontSize: 'clamp(10px, 1.2vw, 12px)',
						color: 'rgba(255,255,255,0.25)',
						display: 'flex',
						alignItems: 'center',
						gap: 6,
					}}
				>
					<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
						<circle cx={12} cy={10} r={3} />
					</svg>
					Bengaluru, India
				</div>
			</div>
			{[
				[
					'Collection',
					['Nameplates', 'Milestones', 'Spiritual', 'Desk', 'Wedding'],
					['/products', '/products', '/products', '/products', '/products'],
				],
				[
					'Company',
					['Our Story', 'Studio', 'Contact', 'Account'],
					['/about', '/studio', '/contact', '/account'],
				],
				[
					'Info',
					['Shipping', 'Returns', 'Care', 'FAQ'],
					['/contact', '/contact', '/contact', '/contact'],
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
								<Link
									to={pages[i]}
									data-clickable
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
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>

		{/* Giant BWR text — Antigravity-style */}
		<div
			style={{
				padding: 'clamp(40px, 8vw, 80px) 0 clamp(20px, 4vw, 40px)',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			<div
				style={{
					fontFamily: 'var(--font-display)',
					fontSize: 'clamp(100px, 22vw, 320px)',
					fontWeight: 400,
					lineHeight: 0.85,
					letterSpacing: '-0.03em',
					color: 'rgba(255, 255, 255, 1)',
					textAlign: 'center',
					userSelect: 'none',
					whiteSpace: 'nowrap',
				}}
			>
				B.W.R
			</div>
		</div>

		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 'clamp(16px, 2vw, 24px)',
				paddingBottom: 'clamp(16px, 2vw, 24px)',
				flexDirection: 'column',
				gap: 'clamp(8px, 1.5vw, 12px)',
				borderTop: '1px solid rgba(255,255,255,0.05)',
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
				© 2025 BWR 3D Works. Craft Objects That Mean Something.
			</div>
			<div
				style={{
					fontSize: 'clamp(10px, 1.5vw, 12px)',
					color: 'rgba(255,255,255,0.15)',
					textAlign: 'center',
				}}
			>
				Premium 3D printing · Bengaluru, India
			</div>
		</div>
	</footer>
);
