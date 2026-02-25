import { useState, useEffect } from 'react';

/**
 * SplashScreen v10 — Route-aware splash
 *
 * HOME PAGE (/):
 *   Full animation: BWR reveal → tagline → fly up → dissolve into brand bar
 *
 * OTHER PAGES:
 *   Quick reveal: BWR centered → brief pause → fade out
 *   Brand bar is already visible (no animation needed)
 */
export const SplashScreen = ({ onComplete, isHomePage = true }) => {
	const [phase, setPhase] = useState(0);

	useEffect(() => {
		const t = [];

		if (isHomePage) {
			// ═══ FULL HOME ANIMATION (~4s total) ═══
			t.push(setTimeout(() => setPhase(1), 150));     // reveal letters
			t.push(setTimeout(() => setPhase(2), 1200));    // tagline
			t.push(setTimeout(() => setPhase(3), 2200));    // fly up + bg fades
			t.push(setTimeout(() => {
				onComplete?.();
				setPhase(4);                                 // dissolve
			}, 3000));
			t.push(setTimeout(() => setPhase(5), 3800));    // remove (~4s total)
		} else {
			// ═══ OTHER PAGES: Quick reveal (~1.8s) ═══
			t.push(setTimeout(() => setPhase(1), 150));     // reveal letters
			t.push(setTimeout(() => {
				setPhase(4);                                 // fade out
				onComplete?.();
			}, 1200));
			t.push(setTimeout(() => setPhase(5), 1800));    // remove
		}

		return () => t.forEach(clearTimeout);
	}, [onComplete, isHomePage]);

	if (phase === 5) return null;

	const isFlying = isHomePage && phase >= 3;
	const isDissolving = phase >= 4;

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 10000,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: isFlying || isDissolving ? 'transparent' : '#000',
				transition: isFlying || isDissolving
					? 'background-color 1s cubic-bezier(0.25, 0.1, 0.25, 1)'
					: 'none',
				// Also fade out the entire overlay for non-home pages
				opacity: (!isHomePage && isDissolving) ? 0 : 1,
				pointerEvents: isFlying || isDissolving ? 'none' : 'auto',
			}}
			// Add transition for opacity on the container for non-home fade out
			ref={null}
		>
			{/* BWR Letters */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: isFlying ? 'clamp(30px, 8vw, 80px)' : 'clamp(12px, 3vw, 28px)',
					opacity: isDissolving ? 0 : 1,
					transition: [
						'gap 1.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
						isDissolving ? 'opacity 0.8s ease' : null,
					].filter(Boolean).join(', '),
				}}
			>
				{['B', 'W', 'R'].map((letter, i) => {
					const revealDelay = i * 0.35;
					const isRevealed = phase >= 1;

					return (
						<span
							key={letter}
							style={{
								display: 'inline-block',
								fontFamily: "'Cormorant Garamond', Georgia, serif",
								fontSize: 'clamp(72px, 15vw, 140px)',
								fontWeight: 700,
								letterSpacing: '0.04em',
								color: isFlying ? '#1a1a1a' : '#fff',
								opacity: isRevealed ? 1 : 0,
								transform: isFlying
									? 'translateY(calc(-50vh + 70px)) scale(0.28)'
									: isRevealed
										? 'translateY(0) scale(1)'
										: 'translateY(40px) scale(1)',
								transition: isFlying
									? `transform 1.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.04}s, color 0.6s ease 0.2s`
									: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${revealDelay}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${revealDelay}s`,
								willChange: 'transform, opacity, color',
							}}
						>
							{letter}
						</span>
					);
				})}
			</div>

			{/* Gold Underline — only on home page */}
			{isHomePage && phase <= 3 && (
				<div
					style={{
						width: phase === 2 ? 'clamp(120px, 20vw, 200px)' : '0px',
						height: 2,
						background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent)',
						marginTop: 'clamp(16px, 2vw, 24px)',
						transition: isFlying ? 'opacity 0.3s ease' : 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
						opacity: isFlying ? 0 : 1,
					}}
				/>
			)}

			{/* Tagline — only on home page */}
			{isHomePage && phase <= 3 && (
				<div
					style={{
						marginTop: 'clamp(20px, 3vw, 32px)',
						fontFamily: "'DM Sans', sans-serif",
						fontSize: 'clamp(11px, 1.5vw, 14px)',
						fontWeight: 300,
						letterSpacing: '0.3em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.4)',
						opacity: phase === 2 ? 1 : 0,
						transform: phase === 2 ? 'translateY(0)' : 'translateY(10px)',
						transition: isFlying
							? 'opacity 0.3s ease'
							: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
					}}
				>
					Where Rebellion Meets Precision
				</div>
			)}
		</div>
	);
};
