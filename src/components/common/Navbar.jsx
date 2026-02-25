import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = ({ cartCount, onCartOpen, user, onAccountClick, splashComplete }) => {
	const location = useLocation();
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const [brandVisible, setBrandVisible] = useState(false);
	const navRef = useRef(null);

	// Show brand bar instantly when splash completes
	useEffect(() => {
		if (splashComplete) {
			setBrandVisible(true);
		}
	}, [splashComplete]);

	// Scroll listener
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 60);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// Dynamic dark/light navbar via IntersectionObserver
	useEffect(() => {
		// Delay slightly to ensure DOM is ready after route change
		const timer = setTimeout(() => {
			const darkSections = document.querySelectorAll('[data-dark]');
			if (!darkSections.length) {
				setIsDark(false);
				return;
			}

			// Filter out the navbar itself to prevent self-referencing loop
			const filteredSections = Array.from(darkSections).filter(
				(el) => el.tagName !== 'NAV' && !el.closest('nav')
			);

			if (!filteredSections.length) {
				setIsDark(false);
				return;
			}

			const visibleDarkSections = new Set();

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							visibleDarkSections.add(entry.target);
						} else {
							visibleDarkSections.delete(entry.target);
						}
					});

					// Check if any dark section overlaps with the navbar area (top 68px)
					let navInDark = false;
					visibleDarkSections.forEach((section) => {
						const rect = section.getBoundingClientRect();
						if (rect.top < 68 && rect.bottom > 0) {
							navInDark = true;
						}
					});
					setIsDark(navInDark);
				},
				{
					threshold: 0,
					rootMargin: '0px 0px -90% 0px',
				},
			);

			filteredSections.forEach((el) => observer.observe(el));

			// Also check on scroll for more accuracy
			const checkDarkOnScroll = () => {
				let navInDark = false;
				filteredSections.forEach((section) => {
					const rect = section.getBoundingClientRect();
					if (rect.top < 68 && rect.bottom > 0) {
						navInDark = true;
					}
				});
				setIsDark(navInDark);
			};

			window.addEventListener('scroll', checkDarkOnScroll, { passive: true });

			return () => {
				observer.disconnect();
				window.removeEventListener('scroll', checkDarkOnScroll);
			};
		}, 100);

		return () => clearTimeout(timer);
	}, [location.pathname]);

	// Close mobile menu on route change
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	// Close mobile menu on Escape
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === 'Escape') setMobileMenuOpen(false);
		};
		if (mobileMenuOpen) {
			document.addEventListener('keydown', handleEsc);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.removeEventListener('keydown', handleEsc);
			document.body.style.overflow = '';
		};
	}, [mobileMenuOpen]);

	const navLinks = [
		{ to: '/', label: 'Home', match: /^\/$/ },
		{ to: '/products', label: 'Products', match: /^\/products/ },
		{ to: '/about', label: 'About', match: /^\/about/ },
		{ to: '/contact', label: 'Contact', match: /^\/contact/ },
		{ to: '/studio', label: 'Studio', match: /^\/studio/ },
	];

	const toggleMobileMenu = useCallback(() => {
		setMobileMenuOpen((prev) => !prev);
	}, []);

	return (
		<>
			<nav
				ref={navRef}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
					display: 'flex',
					flexDirection: 'column',
					background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
					backdropFilter: 'saturate(180%) blur(20px)',
					WebkitBackdropFilter: 'saturate(180%) blur(20px)',
					boxShadow: scrolled
						? isDark
							? '0 1px 0 rgba(255,255,255,0.06)'
							: '0 1px 12px rgba(0,0,0,0.08)'
						: 'none',
					transition: 'background .4s, box-shadow .4s',
				}}
			>
				{/* ═══ ROW 1: Brand Bar — Black & White Rouge (centered) ═══ */}
				<div
					style={{
						display: 'flex',
						alignItems: 'baseline',
						justifyContent: 'center',
						padding: 'clamp(14px, 2vw, 22px) clamp(16px, 4vw, 52px)',
						borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
						opacity: brandVisible ? 1 : 0,
						transition: 'opacity 0.8s ease',
					}}
				>
					<Link to="/" data-clickable style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 0 }}>
						{/* B */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(28px, 4.5vw, 48px)',
							fontWeight: 700,
							color: isDark ? '#fff' : '#1a1a1a',
							letterSpacing: '0.01em',
							transition: 'color .3s',
						}}>B</span>
						{/* lack */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(24px, 3.8vw, 42px)',
							fontWeight: 400,
							color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
							letterSpacing: '0.02em',
							transition: 'color .3s',
						}}>lack</span>

						{/* & */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(22px, 3.5vw, 38px)',
							fontWeight: 300,
							color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
							margin: '0 clamp(8px, 1.5vw, 16px)',
							transition: 'color .3s',
						}}>&amp;</span>

						{/* W */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(28px, 4.5vw, 48px)',
							fontWeight: 700,
							color: isDark ? '#fff' : '#1a1a1a',
							letterSpacing: '0.01em',
							transition: 'color .3s',
						}}>W</span>
						{/* hite */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(24px, 3.8vw, 42px)',
							fontWeight: 400,
							color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
							letterSpacing: '0.02em',
							transition: 'color .3s',
							marginRight: 'clamp(8px, 1.5vw, 16px)',
						}}>hite</span>

						{/* R */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(28px, 4.5vw, 48px)',
							fontWeight: 700,
							color: isDark ? '#fff' : '#1a1a1a',
							letterSpacing: '0.01em',
							transition: 'color .3s',
						}}>R</span>
						{/* ouge */}
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(24px, 3.8vw, 42px)',
							fontWeight: 400,
							color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
							letterSpacing: '0.02em',
							transition: 'color .3s',
						}}>ouge</span>
					</Link>
				</div>

				{/* ═══ ROW 2: Navigation + Actions ═══ */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 clamp(16px, 4vw, 52px)',
						height: 44,
					}}
				>
					{/* Left: BWR Works branding */}
					<Link
						to="/"
						data-clickable
						style={{
							textDecoration: 'none',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<span style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(14px, 2vw, 18px)',
							fontWeight: 700,
							letterSpacing: '0.08em',
							color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
							transition: 'color .3s',
							whiteSpace: 'nowrap',
						}}>BWR</span>
						<span style={{
							fontFamily: 'var(--font-sans)',
							fontSize: 'clamp(9px, 1.3vw, 11px)',
							fontWeight: 500,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
							transition: 'color .3s',
							whiteSpace: 'nowrap',
						}}>Works</span>
					</Link>

				{/* Desktop nav links */}
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
					{navLinks.map((l) => {
						const isActive = l.match.test(location.pathname);
						return (
							<li key={l.to}>
								<Link
									to={l.to}
									style={{
										fontSize: 'clamp(11px, 1.5vw, 15px)',
										fontWeight: 400,
										letterSpacing: '.03em',
										cursor: 'pointer',
										color: isDark
											? isActive
												? '#fff'
												: 'rgba(255,255,255,0.8)'
											: isActive
												? '#000'
												: '#333',
										textDecoration: 'none',
										transition: 'color .2s',
										borderBottom:
											isActive
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
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Right actions: Account + Cart + Hamburger */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					{/* Account / Login button */}
					<Link
						to={user ? '/account' : '/login'}
						data-clickable
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							color: isDark ? '#fff' : '#000',
							display: 'flex',
							alignItems: 'center',
							padding: 4,
							transition: 'opacity .2s',
							flexShrink: 0,
							textDecoration: 'none',
						}}
						title={user ? 'My Account' : 'Login'}
					>
						<svg
							width={20}
							height={20}
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth={1.5}
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
							<circle cx={12} cy={7} r={4} />
						</svg>
					</Link>

					{/* Cart button */}
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

					{/* Hamburger button (mobile only) */}
					<button
						data-clickable
						className='mobile-menu-trigger'
						onClick={toggleMobileMenu}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							color: isDark ? '#fff' : '#000',
							padding: 8,
							display: 'none', /* shown via CSS on mobile */
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 5,
							width: 36,
							height: 36,
						}}
						aria-label='Toggle menu'
					>
						<span
							style={{
								display: 'block',
								width: 20,
								height: 2,
								background: 'currentColor',
								borderRadius: 1,
								transition: 'transform .3s, opacity .3s',
								transform: mobileMenuOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
							}}
						/>
						<span
							style={{
								display: 'block',
								width: 20,
								height: 2,
								background: 'currentColor',
								borderRadius: 1,
								transition: 'opacity .3s',
								opacity: mobileMenuOpen ? 0 : 1,
							}}
						/>
						<span
							style={{
								display: 'block',
								width: 20,
								height: 2,
								background: 'currentColor',
								borderRadius: 1,
								transition: 'transform .3s, opacity .3s',
								transform: mobileMenuOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
							}}
						/>
					</button>
				</div>
			</div>{/* end row 2 */}
			</nav>

			{/* Mobile menu drawer */}
			{mobileMenuOpen && (
				<>
					{/* Overlay */}
					<div
						onClick={() => setMobileMenuOpen(false)}
						style={{
							position: 'fixed',
							inset: 0,
							background: 'rgba(0,0,0,0.5)',
							zIndex: 998,
							backdropFilter: 'blur(4px)',
							animation: 'fadeIn .3s',
						}}
					/>
					{/* Drawer */}
					<div
						className='mobile-nav-drawer'
						style={{
							position: 'fixed',
							top: 0,
							right: 0,
							bottom: 0,
							width: '80%',
							maxWidth: 320,
							background: '#000',
							zIndex: 999,
							display: 'flex',
							flexDirection: 'column',
							padding: '80px 32px 40px',
							animation: 'slideInRight .35s cubic-bezier(0.22, 1, 0.36, 1)',
						}}
					>
						{/* Close button */}
						<button
							onClick={() => setMobileMenuOpen(false)}
							style={{
								position: 'absolute',
								top: 20,
								right: 20,
								background: 'rgba(255,255,255,0.1)',
								border: 'none',
								color: '#fff',
								width: 36,
								height: 36,
								borderRadius: '50%',
								fontSize: 18,
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							×
						</button>

						{/* Nav links */}
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
							{navLinks.map((l) => {
								const isActive = l.match.test(location.pathname);
								return (
									<Link
										key={l.to}
										to={l.to}
										onClick={() => setMobileMenuOpen(false)}
										style={{
											fontFamily: 'var(--font-display)',
											fontSize: 28,
											fontWeight: 400,
											color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
											textDecoration: 'none',
											padding: '12px 0',
											borderBottom: '1px solid rgba(255,255,255,0.08)',
											transition: 'color .2s',
											letterSpacing: '-0.01em',
										}}
									>
										{l.label}
									</Link>
								);
							})}

							{/* Account link in mobile menu */}
							<Link
								to={user ? '/account' : '/login'}
								onClick={() => setMobileMenuOpen(false)}
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 28,
									fontWeight: 400,
									color: 'rgba(255,255,255,0.5)',
									textDecoration: 'none',
									padding: '12px 0',
									borderBottom: '1px solid rgba(255,255,255,0.08)',
									transition: 'color .2s',
									letterSpacing: '-0.01em',
								}}
							>
								{user ? 'My Account' : 'Login'}
							</Link>
						</div>

						{/* Bottom info */}
						<div
							style={{
								borderTop: '1px solid rgba(255,255,255,0.1)',
								paddingTop: 24,
								marginTop: 'auto',
							}}
						>
							<div
								style={{
									fontSize: 11,
									fontWeight: 600,
									letterSpacing: '.12em',
									textTransform: 'uppercase',
									color: 'rgba(255,255,255,0.25)',
									marginBottom: 8,
								}}
							>
								BWR Works
							</div>
							<div
								style={{
									fontSize: 12,
									color: 'rgba(255,255,255,0.35)',
									lineHeight: 1.6,
								}}
							>
								Craft Objects That Mean Something
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};
