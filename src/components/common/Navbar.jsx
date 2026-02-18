import { useState, useEffect } from 'react';

export const Navbar = ({ page, setPage, cartCount, onCartOpen }) => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 60);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const isDark = page === 'home' && !scrolled;
	const navLinks = [
		{ id: 'home', label: 'Home' },
		{ id: 'products', label: 'Collection' },
		{ id: 'studio', label: 'Studio' },
		{ id: 'about', label: 'About' },
		{ id: 'contact', label: 'Contact' },
	];

	return (
		<nav
			data-dark={isDark ? '' : undefined}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				height: 68,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 clamp(16px, 4vw, 52px)',
				background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.92)',
				backdropFilter: 'saturate(180%) blur(20px)',
				WebkitBackdropFilter: 'saturate(180%) blur(20px)',
				boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.06)' : '0 1px 0 rgba(0,0,0,0.08)',
				transition: 'background .5s, box-shadow .5s',
			}}
		>
			<div
				data-clickable
				onClick={() => setPage('home')}
				style={{
					display: 'flex',
					gap: 10,
					cursor: 'pointer',
					flexDirection: 'column',
					alignItems: 'flex-start',
					minWidth: 0,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<span
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(20px, 4vw, 28px)',
							fontWeight: 400,
							letterSpacing: '-0.02em',
							color: isDark ? '#fff' : '#000',
							transition: 'color .3s',
							whiteSpace: 'nowrap',
						}}
					>
						BWR
					</span>
					<span
						style={{
							fontFamily: 'var(--font-sans)',
							fontSize: 'clamp(10px, 1.5vw, 13px)',
							fontWeight: 600,
							letterSpacing: '0.08em',
							textTransform: 'uppercase',
							color: isDark ? '#fff' : '#000',
							transition: 'color .3s',
							whiteSpace: 'nowrap',
						}}
					>
						3D Works
					</span>
				</div>
				<span
					style={{
						fontFamily: 'var(--font-sans)',
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 400,
						letterSpacing: '0.05em',
						color: isDark ? 'rgba(255,255,255,0.7)' : '#333',
						transition: 'color .3s',
						marginTop: -2,
						whiteSpace: 'nowrap',
					}}
				>
					Where Rebellion Meets Precision
				</span>
			</div>

			<ul
				style={{
					display: 'flex',
					gap: 'clamp(14px, 3vw, 36px)',
					listStyle: 'none',
					justifyContent: 'center',
					flex: 1,
					marginLeft: 'clamp(20px, 3vw, 40px)',
				}}
				className='nav-links'
			>
				{navLinks.map((l) => (
					<li key={l.id}>
						<button
							data-clickable
							onClick={(e) => {
								e.preventDefault();
								setPage(l.id);
							}}
							style={{
								fontSize: 'clamp(11px, 1.5vw, 15px)',
								fontWeight: 400,
								letterSpacing: '.03em',
								cursor: 'pointer',
								color: isDark
									? page === l.id
										? '#fff'
										: 'rgba(255,255,255,0.8)'
									: page === l.id
										? '#000'
										: '#333',
								textDecoration: 'none',
								transition: 'color .2s',
								borderBottom:
									page === l.id
										? `1px solid ${isDark ? '#fff' : '#000'}`
										: '1px solid transparent',
								paddingBottom: 2,
								background: 'none',
								border: 'none',
								padding: 0,
								fontFamily: 'var(--font-sans)',
								whiteSpace: 'nowrap',
							}}
						>
							{l.label}
						</button>
					</li>
				))}
			</ul>

			<button
				data-clickable
				onClick={onCartOpen}
				style={{
					background: 'none',
					border: 'none',
					cursor: 'pointer',
					color: isDark ? '#fff' : '#000',
					display: 'flex',
					alignItems: 'center',
					position: 'relative',
					padding: 4,
					transition: 'opacity .2s',
					flexShrink: 0,
					marginLeft: 'clamp(12px, 2vw, 20px)',
				}}
			>
				<svg
					width={22}
					height={22}
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={1.5}
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
					<line x1='3' y1='6' x2='21' y2='6' />
					<path d='M16 10a4 4 0 01-8 0' />
				</svg>
				{cartCount > 0 && (
					<span
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							width: 15,
							height: 15,
							background: isDark ? '#fff' : '#000',
							color: isDark ? '#000' : '#fff',
							borderRadius: '50%',
							fontSize: 8,
							fontWeight: 700,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{cartCount}
					</span>
				)}
			</button>
		</nav>
	);
};
