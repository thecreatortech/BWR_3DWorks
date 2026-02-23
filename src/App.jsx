import { useState, useEffect, useRef, useCallback } from 'react';

// ===== GLOBAL STYLES & COMPONENTS =====
import { GlobalStyles } from './components/common/GlobalStyles';
import { CustomCursor } from './components/common/CustomCursor';
import { Toast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { CartSidebar } from './components/common/CartSidebar';
import { Footer } from './components/common/Footer';
import { GLCanvas } from './components/common/GLCanvas';
import { GLBViewer } from './components/common/GLBViewer';
import { AnimatedCarViewer } from './components/common/AnimatedCarViewer';
import { HeroBgCanvas } from './components/common/HeroBgCanvas';

// ===== SECTIONS & UTILS =====
import { Marquee } from './components/sections/Marquee';
import { StudioPage } from './components/StudioPage';
import { useScrollReveal } from './hooks/useScrollReveal';
import { PRODUCTS, CATEGORIES } from './utils/products';
import { WebGLScene } from './utils/engine/WebGLScene';

// =====================================================
// HERO SECTION
// =====================================================
const HeroSection = ({ onStartShop }) => {
	return (
		<section
			style={{
				position: 'relative',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden',
				paddingTop: 68,
			}}
		>
			<HeroBgCanvas />
			<div
				style={{
					position: 'relative',
					textAlign: 'center',
					zIndex: 10,
					maxWidth: 900,
					padding: '0 40px',
				}}
			>
				<h1
					className='reveal d0'
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 100,
						fontWeight: 400,
						letterSpacing: '-0.03em',
						lineHeight: 1.1,
						marginBottom: 28,
						color: '#fff',
					}}
				>
					3D Precision Objects
				</h1>
				<p
					className='reveal d1'
					style={{
						fontFamily: 'var(--font-sans)',
						fontSize: 20,
						fontWeight: 300,
						letterSpacing: '0.02em',
						color: 'rgba(255,255,255,0.8)',
						marginBottom: 48,
						lineHeight: 1.6,
						maxWidth: 600,
						margin: '0 auto 48px',
					}}
				>
					Precision 3D objects engineered at 0.05mm tolerance. Limited editions.
					Parametric design meets hand craft.
				</p>
				<button
					data-clickable
					onClick={onStartShop}
					className='btn btn-white reveal d2'
					style={{ fontSize: 14 }}
				>
					Explore Collection →
				</button>
			</div>
		</section>
	);
};

// =====================================================
// FEATURED PRODUCT SECTION
// =====================================================
const FeaturedProductSection = ({ onViewProduct, addToCart }) => {
	const prod = PRODUCTS[0];
	const [selectedMaterial, setSelectedMaterial] = useState(0);
	const materials = [
		{ name: 'Standard', price: 29999 },
		{ name: 'Matte Black', price: 34999, label: '+₹5,000' },
		{ name: 'Polished', price: 39312, label: '+₹9,313' },
	];

	return (
		<section style={{ padding: '120px 52px', background: '#f7f7f7' }}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 80,
					maxWidth: 1400,
					margin: '0 auto',
					alignItems: 'center',
				}}
				className='grid-col-2'
			>
				<div
					style={{ height: 500, background: '#fff', borderRadius: 2, overflow: 'hidden' }}
				>
					<GLCanvas
						opts={{
							geom: prod.geom,
							color: [0.08, 0.08, 0.08],
							rough: 0.35,
							metal: 0.15,
						}}
					/>
				</div>
				<div className='reveal d0'>
					<div
						style={{
							fontSize: 11,
							fontWeight: 700,
							letterSpacing: '.16em',
							textTransform: 'uppercase',
							color: 'rgba(0,0,0,0.35)',
							marginBottom: 12,
						}}
					>
						Featured
					</div>
					<h2
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 48,
							fontWeight: 400,
							letterSpacing: '-0.02em',
							marginBottom: 20,
							color: '#000',
						}}
					>
						{prod.name}
					</h2>
					<p
						style={{
							fontSize: 14,
							fontWeight: 300,
							color: 'rgba(0,0,0,0.6)',
							lineHeight: 1.7,
							marginBottom: 28,
						}}
					>
						{prod.desc}
					</p>

					<div style={{ marginBottom: 36 }}>
						<div
							style={{
								fontSize: 11,
								fontWeight: 700,
								letterSpacing: '.1em',
								textTransform: 'uppercase',
								color: 'rgba(0,0,0,0.4)',
								marginBottom: 16,
							}}
						>
							Material Option
						</div>
						<div style={{ display: 'flex', gap: 12 }}>
							{materials.map((m, i) => (
								<button
									key={i}
									data-clickable
									onClick={() => setSelectedMaterial(i)}
									style={{
										padding: '10px 20px',
										background: i === selectedMaterial ? '#000' : '#fff',
										color: i === selectedMaterial ? '#fff' : '#000',
										border: '1px solid #ddd',
										cursor: 'pointer',
										fontSize: 12,
										fontWeight: 500,
										transition: 'all .2s',
									}}
								>
									{m.name}{' '}
									{m.label && (
										<span style={{ fontSize: 10, opacity: 0.7 }}>
											({m.label})
										</span>
									)}
								</button>
							))}
						</div>
					</div>

					<div
						style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 32 }}
					>
						<div>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: 'rgba(0,0,0,0.4)',
									letterSpacing: '.1em',
								}}
							>
								PRICE
							</div>
							<div
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 42,
									fontWeight: 400,
								}}
							>
								₹{materials[selectedMaterial].price.toLocaleString('en-IN')}
							</div>
						</div>
						<button
							data-clickable
							onClick={() =>
								addToCart({
									id: prod.id,
									name: prod.name,
									price: materials[selectedMaterial].price,
								})
							}
							className='btn btn-dark'
							style={{ flex: 1 }}
						>
							Add to Cart →
						</button>
					</div>

					<button
						data-clickable
						onClick={() => onViewProduct(prod)}
						style={{
							width: '100%',
							background: 'none',
							border: 'none',
							fontSize: 13,
							color: 'rgba(0,0,0,0.4)',
							cursor: 'pointer',
							padding: '8px 0',
							fontFamily: 'var(--font-sans)',
						}}
					>
						View Full Specifications
					</button>
				</div>
			</div>
		</section>
	);
};

// =====================================================
// HOME PAGE
// =====================================================
const HomePage = ({ setPage, addToCart }) => {
	useScrollReveal();
	const featSceneRef = useRef(null);

	return (
		<div>
			{/* HERO */}
			<section
				style={{
					position: 'relative',
					height: '100vh',
					minHeight: 'clamp(600px, 90vh, 100vh)',
					background: '#0a0a0a',
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
				}}
				data-dark
			>
				<HeroBgCanvas />
				<div
					style={{
						position: 'absolute',
						right: 0,
						top: 0,
						width: '60%',
						height: '100%',
						zIndex: 2,
						display: 'block',
					}}
					className='desktop-only'
				>
					<AnimatedCarViewer
						modelPath='/assets/models/McLaren_F1.glb'
						style={{ width: '100%', height: '100%' }}
					/>
				</div>
				<div
					style={{
						position: 'relative',
						zIndex: 10,
						padding: 'clamp(16px, 5vw, 52px)',
						maxWidth: 600,
						width: '100%',
					}}
				>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 10,
							fontSize: 'clamp(9px, 2vw, 11px)',
							fontWeight: 600,
							letterSpacing: '.18em',
							textTransform: 'uppercase',
							color: 'rgba(255,255,255,0.35)',
							marginBottom: 'clamp(16px, 4vw, 32px)',
							opacity: 0,
							transform: 'translateY(16px)',
							animation: 'aUp .8s .2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
						}}
					>
						<div
							style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.25)' }}
						/>
						Est. 2024 — Precision Objects
					</div>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(56px, 7.5vw, 110px)',
							fontWeight: 400,
							lineHeight: 0.95,
							letterSpacing: '-0.03em',
							color: '#fff',
							marginBottom: 32,
							opacity: 0,
							transform: 'translateY(24px)',
							animation: 'aUp 1s .4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
						}}
					>
						Where
						<br />
						Rebellion
						<br />
						<em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.28)' }}>
							Meets Precision.
						</em>
					</h1>
					<p
						style={{
							fontSize: 'clamp(14px, 3.5vw, 16px)',
							fontWeight: 300,
							lineHeight: 1.75,
							color: 'rgba(255,255,255,0.5)',
							maxWidth: 420,
							marginBottom: 'clamp(28px, 6vw, 52px)',
							opacity: 0,
							transform: 'translateY(16px)',
							animation: 'aUp .8s .6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
						}}
					>
						3D printed objects engineered to outlast trends. Every layer calculated.
						Every surface earned.
					</p>
					<div
						style={{
							display: 'flex',
							gap: 14,
							flexWrap: 'wrap',
							flexDirection: 'column',
							opacity: 0,
							transform: 'translateY(16px)',
							animation: 'aUp .8s .8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
						}}
					>
						<button
							data-clickable
							className='btn btn-white'
							onClick={() => setPage('products')}
							style={{ width: '100%', justifyContent: 'center' }}
						>
							Explore Collection
						</button>
						<button
							data-clickable
							className='btn btn-ghost'
							onClick={() => setPage('product', PRODUCTS[0])}
							style={{ width: '100%', justifyContent: 'center' }}
						>
							Featured Drop
						</button>
					</div>
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 36,
						left: 'clamp(16px, 5vw, 52px)',
						display: 'none',
						alignItems: 'center',
						gap: 12,
						fontSize: 11,
						fontWeight: 500,
						letterSpacing: '.14em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.25)',
						opacity: 0,
						animation: 'aUp .6s 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
					}}
					className='desktop-only'
				>
					<div
						style={{
							width: 36,
							height: 1,
							background: 'rgba(255,255,255,0.2)',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: '-100%',
								top: 0,
								width: '100%',
								height: '100%',
								background: 'rgba(255,255,255,0.7)',
								animation: 'scanLine 2s ease-in-out infinite',
							}}
						/>
					</div>
					Scroll to discover
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 36,
						right: 'clamp(16px, 5vw, 52px)',
						fontSize: 11,
						fontWeight: 500,
						letterSpacing: '.14em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.22)',
						opacity: 0,
						animation: 'aUp .6s 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
						display: 'none',
						alignItems: 'center',
						gap: 8,
					}}
					className='desktop-only'
				>
					<div
						style={{
							width: 22,
							height: 22,
							border: '1px solid rgba(255,255,255,0.2)',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 10,
							animation: 'float 3s ease-in-out infinite',
						}}
					>
						↺
					</div>
					Drag to rotate
				</div>
			</section>

			<Marquee />

			{/* FEATURED PRODUCT */}
			<section
				style={{ background: '#fff', padding: 'clamp(40px 16px, 5vw 5vw, 140px 52px)' }}
			>
				<div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
					<div
						className='reveal'
						style={{
							fontSize: 'clamp(9px, 2vw, 11px)',
							fontWeight: 600,
							letterSpacing: '.2em',
							textTransform: 'uppercase',
							opacity: 0.35,
							marginBottom: 'clamp(12px, 3vw, 20px)',
						}}
					>
						Featured Release — 2024
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 68px)',
							fontWeight: 400,
							lineHeight: 1.05,
							letterSpacing: '-0.025em',
						}}
					>
						The Orbital
						<br />
						<em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>
							Vase Series.
						</em>
					</h2>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 'clamp(24px, 6vw, 80px)',
						alignItems: 'center',
						maxWidth: 1280,
						margin: '0 auto',
					}}
					className='grid-responsive'
				>
					<div
						className='reveal'
						style={{
							background: '#f0f0f0',
							height: 'clamp(300px, 50vw, 580px)',
							position: 'relative',
							overflow: 'hidden',
							borderRadius: 2,
						}}
					>
						<GLBViewer
							modelPath='/assets/models/orbital-vase.glb'
							color='#111111'
							style={{ width: '100%', height: '100%' }}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: 20,
								left: 20,
								fontSize: 'clamp(8px, 1.5vw, 10px)',
								fontWeight: 600,
								letterSpacing: '.14em',
								textTransform: 'uppercase',
								color: 'rgba(0,0,0,0.3)',
								display: 'none',
								alignItems: 'center',
								gap: 6,
							}}
							className='desktop-only'
						>
							<div
								style={{
									width: 6,
									height: 6,
									borderRadius: '50%',
									background: '#22c55e',
									boxShadow: '0 0 8px #22c55e',
									animation: 'pulse-dot 2s infinite',
								}}
							/>
							Live 3D Preview — Drag to Rotate
						</div>
						<div
							style={{
								position: 'absolute',
								bottom: 20,
								right: 20,
								display: 'none',
								gap: 8,
							}}
							className='desktop-only'
						>
							{[
								['⟳', () => featSceneRef.current?.reset()],
								['◫', () => featSceneRef.current?.toggleWire()],
							].map(([icon, fn], i) => (
								<button
									key={i}
									data-clickable
									onClick={fn}
									style={{
										width: 36,
										height: 36,
										background: 'rgba(0,0,0,0.06)',
										border: 'none',
										borderRadius: '50%',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 14,
										color: '#000',
										backdropFilter: 'blur(10px)',
										transition: 'background .2s',
									}}
								>
									{icon}
								</button>
							))}
						</div>
					</div>
					<div className='reveal d2' style={{ padding: 'clamp(0px, 3vw, 20px 0)' }}>
						<div
							style={{
								display: 'inline-block',
								background: '#000',
								color: '#fff',
								fontSize: 10,
								fontWeight: 700,
								letterSpacing: '.15em',
								textTransform: 'uppercase',
								padding: '5px 14px',
								marginBottom: 28,
							}}
						>
							Limited — 12 Units
						</div>
						<div
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(38px, 4vw, 60px)',
								fontWeight: 400,
								lineHeight: 1.05,
								letterSpacing: '-0.025em',
								marginBottom: 24,
							}}
						>
							Orbital
							<br />
							Vase No. 7
						</div>
						<div
							style={{
								fontSize: 52,
								fontWeight: 200,
								letterSpacing: '-0.04em',
								marginBottom: 28,
								lineHeight: 1,
							}}
						>
							<sup style={{ fontSize: 22, fontWeight: 400, verticalAlign: 'super' }}>
								$
							</sup>
							348
						</div>
						<p
							style={{
								fontSize: 15,
								fontWeight: 300,
								lineHeight: 1.8,
								color: 'rgba(0,0,0,0.5)',
								maxWidth: 380,
								marginBottom: 40,
							}}
						>
							A sculptural study in negative space. Fluid curvature meets mathematical
							precision. Printed at 0.05mm layer resolution.
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '12px 32px',
								marginBottom: 40,
							}}
							className='grid-col-2'
						>
							{[
								['Material', 'PETG Matte'],
								['Resolution', '0.05mm'],
								['Finish', 'Hand-polished'],
								['Ships In', '3–5 Days'],
							].map(([k, v]) => (
								<div key={k}>
									<div
										style={{
											fontSize: 10,
											fontWeight: 600,
											letterSpacing: '.12em',
											textTransform: 'uppercase',
											color: 'rgba(0,0,0,0.3)',
											marginBottom: 4,
										}}
									>
										{k}
									</div>
									<div style={{ fontSize: 14, fontWeight: 400, color: '#000' }}>
										{v}
									</div>
								</div>
							))}
						</div>
						<div style={{ display: 'flex', gap: 12 }}>
							<button
								data-clickable
								className='btn btn-dark'
								onClick={() => setPage('product', PRODUCTS[0])}
							>
								View Full Details
							</button>
							<button
								data-clickable
								className='btn btn-outline-dark'
								onClick={() => addToCart(PRODUCTS[0])}
							>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* PARALLAX STRIP */}
			<div
				data-dark
				style={{
					position: 'relative',
					height: 500,
					background: '#0a0a0a',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(44px, 7vw, 108px)',
						fontWeight: 400,
						color: '#fff',
						letterSpacing: '-0.03em',
						lineHeight: 1,
						opacity: 0.06,
						userSelect: 'none',
					}}
				>
					REBELLION
				</div>
				<div
					className='reveal'
					style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
				>
					<div
						style={{
							fontSize: 11,
							fontWeight: 600,
							letterSpacing: '.2em',
							textTransform: 'uppercase',
							color: 'rgba(255,255,255,0.35)',
							marginBottom: 20,
						}}
					>
						Our Standard
					</div>
					<div
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(36px, 4.5vw, 68px)',
							fontWeight: 400,
							lineHeight: 1.05,
							letterSpacing: '-0.025em',
							color: '#fff',
						}}
					>
						0.05mm
						<br />
						Layer Precision.
					</div>
					<p
						style={{
							fontSize: 17,
							fontWeight: 300,
							color: 'rgba(255,255,255,0.45)',
							marginTop: 16,
							maxWidth: 500,
						}}
					>
						The difference between ordinary and extraordinary
						<br />
						is measured in microns.
					</p>
				</div>
			</div>

			{/* WHY US */}
			<section style={{ background: '#fff', padding: '120px 52px' }}>
				<div style={{ maxWidth: 600, margin: '0 auto 80px', textAlign: 'center' }}>
					<div
						className='reveal'
						style={{
							fontSize: 11,
							fontWeight: 600,
							letterSpacing: '.2em',
							textTransform: 'uppercase',
							opacity: 0.35,
							marginBottom: 20,
						}}
					>
						Why BWR 3D Works
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(36px, 4.5vw, 68px)',
							fontWeight: 400,
							lineHeight: 1.05,
							letterSpacing: '-0.025em',
						}}
					>
						Built for those
						<br />
						who{' '}
						<em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>
							see the difference.
						</em>
					</h2>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 'clamp(16px, 4vw, 40px)',
						maxWidth: 1200,
						margin: '0 auto',
					}}
					className='grid-col-3'
				>
					{[
						{
							icon: '◎',
							title: 'Micron Precision',
							desc: 'Industrial-grade FDM + SLA printers achieve ±0.05mm tolerances. The aerospace standard — applied to everyday objects.',
						},
						{
							icon: '◈',
							title: 'Curated Materials',
							desc: '23 hand-selected filaments, dried before every run. Medical-grade PETG to engineering PLA+. Consistency is non-negotiable.',
						},
						{
							icon: '✓',
							title: '12-Step Finishing',
							desc: '80-grit to 2000-grit. Primer. Coating. Every surface hand-finished until it earns the right to be called complete.',
						},
						{
							icon: '✦',
							title: 'Parametric Design',
							desc: 'Forms generated by algorithm, refined by human judgement. Mathematics of beauty made physical.',
						},
						{
							icon: '□',
							title: 'Numbered Editions',
							desc: '12 units maximum per colorway. Certificate of authenticity, print parameters, operator signature. Collectible by design.',
						},
						{
							icon: '○',
							title: 'Zero Compromise',
							desc: "We reject 40% of prints internally. If it doesn't meet spec, it doesn't ship. Ever.",
						},
					].map((card, i) => (
						<div
							key={i}
							className={`reveal${i % 3 > 0 ? ` d${i % 3}` : ''}`}
							style={{
								padding: 'clamp(24px, 4vw, 48px) clamp(20px, 3vw, 40px)',
								border: '1px solid #ebebeb',
								background: '#fafafa',
								transition: 'transform .4s, box-shadow .4s, border-color .4s',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-8px)';
								e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.08)';
								e.currentTarget.style.borderColor = '#d6d6d6';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = '';
								e.currentTarget.style.boxShadow = '';
								e.currentTarget.style.borderColor = '#ebebeb';
							}}
						>
							<div
								style={{
									fontSize: 'clamp(20px, 4vw, 28px)',
									marginBottom: 'clamp(16px, 3vw, 28px)',
									color: '#000',
								}}
							>
								{card.icon}
							</div>
							<h3
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(16px, 3vw, 22px)',
									fontWeight: 400,
									color: '#000',
									marginBottom: 'clamp(8px, 2vw, 14px)',
									letterSpacing: '-0.01em',
								}}
							>
								{card.title}
							</h3>
							<p
								style={{
									fontSize: 'clamp(12px, 2vw, 14px)',
									fontWeight: 300,
									lineHeight: 1.75,
									color: 'rgba(0,0,0,0.45)',
								}}
							>
								{card.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* STATS */}
			<div
				data-dark
				style={{
					background: '#000',
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					borderTop: '1px solid rgba(255,255,255,0.06)',
				}}
			>
				{[
					['12', 'Max units per edition'],
					['0.05', 'Millimeter resolution'],
					['48h', 'Minimum print time'],
				].map(([num, desc], i) => (
					<div
						key={i}
						className={`reveal${i > 0 ? ` d${i}` : ''}`}
						style={{
							padding: 'clamp(40px 16px, 10vw 5vw, 80px 52px)',
							borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
							borderBottom: 'clamp(1px, 0px, 1px) solid rgba(255,255,255,0.06)',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(40px, 8vw, 80px)',
								fontWeight: 400,
								letterSpacing: '-0.04em',
								lineHeight: 1,
								color: '#fff',
								marginBottom: 'clamp(6px, 2vw, 12px)',
							}}
						>
							{num}
						</div>
						<div
							style={{
								fontSize: 'clamp(12px, 2vw, 14px)',
								fontWeight: 300,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: '.04em',
							}}
						>
							{desc}
						</div>
					</div>
				))}
			</div>

			{/* TESTIMONIALS */}
			<section
				style={{ background: '#f7f7f7', padding: 'clamp(40px 16px, 10vw 5vw, 120px 52px)' }}
			>
				<div
					style={{
						fontSize: 11,
						fontWeight: 600,
						letterSpacing: '.2em',
						textTransform: 'uppercase',
						opacity: 0.35,
						marginBottom: 20,
					}}
					className='reveal'
				>
					What collectors say
				</div>
				<h2
					className='reveal d1'
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(36px, 4.5vw, 68px)',
						fontWeight: 400,
						lineHeight: 1.05,
						letterSpacing: '-0.025em',
						marginBottom: 60,
					}}
				>
					Precision, recognized.
				</h2>
				<div
					style={{
						display: 'flex',
						gap: 24,
						overflowX: 'auto',
						paddingBottom: 12,
						scrollbarWidth: 'none',
					}}
				>
					{[
						{
							q: "The Orbital Vase sits at the intersection of sculpture and function. I've never seen 3D printing treated as a luxury medium before.",
							name: 'Charlotte M.',
							role: 'Interior Architect, London',
						},
						{
							q: 'Unboxing felt like receiving a museum acquisition. Every detail — including the packaging — communicates obsession.',
							name: 'Ren T.',
							role: 'Art Director, Tokyo',
						},
						{
							q: 'The surface finish defies what I thought was possible with additive manufacturing. It belongs in galleries.',
							name: 'Marcus F.',
							role: 'Product Designer, Berlin',
						},
						{
							q: 'Ordered the Helical Tower for a client project. The quality justified the premium without a single conversation.',
							name: 'Sofia A.',
							role: 'Architect, Milan',
						},
					].map((t, i) => (
						<div
							key={i}
							style={{
								flex: '0 0 380px',
								background: '#fff',
								padding: 44,
								border: '1px solid #ebebeb',
								transition: 'transform .4s, box-shadow .4s',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-6px)';
								e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = '';
								e.currentTarget.style.boxShadow = '';
							}}
						>
							<div style={{ display: 'flex', gap: 3, marginBottom: 22 }}>
								{'★★★★★'.split('').map((s, j) => (
									<span key={j} style={{ fontSize: 14, color: '#000' }}>
										{s}
									</span>
								))}
							</div>
							<p
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 19,
									fontWeight: 400,
									lineHeight: 1.6,
									color: '#000',
									marginBottom: 30,
								}}
							>
								"{t.q}"
							</p>
							<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
								<div
									style={{
										width: 42,
										height: 42,
										background: '#000',
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#fff',
										fontSize: 15,
										fontFamily: 'var(--font-display)',
									}}
								>
									{t.name[0]}
								</div>
								<div>
									<div style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>
										{t.name}
									</div>
									<div
										style={{
											fontSize: 12,
											color: 'rgba(0,0,0,0.35)',
											marginTop: 2,
										}}
									>
										{t.role}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<div
				data-dark
				style={{
					background: '#000',
					padding: '180px 52px',
					textAlign: 'center',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{[900, 560].map((s) => (
					<div
						key={s}
						style={{
							position: 'absolute',
							width: s,
							height: s,
							border: `1px solid rgba(255,255,255,${s === 900 ? 0.04 : 0.07})`,
							borderRadius: '50%',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-50%)',
						}}
					/>
				))}
				<h2
					className='reveal'
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(36px, 4.5vw, 68px)',
						fontWeight: 400,
						lineHeight: 1.05,
						letterSpacing: '-0.025em',
						color: '#fff',
						position: 'relative',
						zIndex: 2,
					}}
				>
					Commission
					<br />
					your object.
				</h2>
				<p
					className='reveal d1'
					style={{
						fontSize: 17,
						fontWeight: 300,
						color: 'rgba(255,255,255,0.42)',
						maxWidth: 480,
						margin: '24px auto 52px',
						lineHeight: 1.75,
						position: 'relative',
						zIndex: 2,
					}}
				>
					Have a vision? We'll engineer it. Submit a brief and receive a 3D concept within
					48 hours.
				</p>
				<div
					className='reveal d2'
					style={{
						display: 'flex',
						justifyContent: 'center',
						gap: 14,
						position: 'relative',
						zIndex: 2,
					}}
				>
					<button
						data-clickable
						className='btn btn-white'
						onClick={() => setPage('contact')}
					>
						Start a Commission
					</button>
					<button
						data-clickable
						className='btn btn-ghost'
						onClick={() => setPage('products')}
					>
						Browse Collection
					</button>
				</div>
			</div>

			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// PRODUCTS PAGE (Placeholder - existing logic)
// =====================================================
const ProductsPage = ({ setPage, addToCart }) => {
	useScrollReveal();
	const [category, setCategory] = useState('all');
	const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === category);

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: '40px 52px' }}>
				<div
					style={{
						maxWidth: 1400,
						margin: '0 auto',
						marginBottom: 'clamp(16px, 3vw, 28px)',
					}}
				>
					<button
						data-clickable
						onClick={() => setPage('home')}
						style={{
							background: 'none',
							border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)',
							cursor: 'pointer',
							padding: 0,
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
						}}
					>
						← Home
					</button>
				</div>
			</section>
			<section style={{ padding: '40px 52px 80px' }}>
				<div style={{ maxWidth: 1400, margin: '0 auto' }}>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(32px, 6vw, 56px)',
							fontWeight: 400,
							marginBottom: 'clamp(24px, 4vw, 40px)',
							color: '#000',
						}}
					>
						Collection
					</h1>
					<div
						style={{
							display: 'flex',
							gap: 'clamp(8px, 2vw, 16px)',
							marginBottom: 'clamp(32px, 6vw, 60px)',
							flexWrap: 'wrap',
						}}
					>
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								data-clickable
								onClick={() => setCategory(cat)}
								style={{
									padding: 'clamp(8px 16px, 1vw 2vw, 10px 24px)',
									background: category === cat ? '#000' : '#f7f7f7',
									color: category === cat ? '#fff' : '#000',
									border: 'none',
									cursor: 'pointer',
									fontSize: 'clamp(11px, 1.5vw, 13px)',
									fontWeight: 600,
									letterSpacing: '.05em',
									textTransform: 'capitalize',
									transition: 'all .2s',
								}}
							>
								{cat}
							</button>
						))}
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 'clamp(16px, 4vw, 40px)',
						}}
						className='grid-col-3'
					>
						{filtered.map((prod, i) => (
							<div
								key={prod.id}
								className={`reveal d${i % 3}`}
								style={{ cursor: 'pointer' }}
							>
								<div
									onClick={() => setPage('product', prod)}
									style={{
										height: 'clamp(250px, 50vw, 380px)',
										background: '#f7f7f7',
										marginBottom: 'clamp(12px, 3vw, 20px)',
										borderRadius: 2,
										overflow: 'hidden',
									}}
								>
									<GLBViewer
										modelPath={prod.modelPath}
										color='#222222'
										style={{ width: '100%', height: '100%' }}
									/>
								</div>
								<h3
									onClick={() => setPage('product', prod)}
									style={{
										fontSize: 'clamp(14px, 2.5vw, 16px)',
										fontWeight: 500,
										marginBottom: 'clamp(6px, 1.5vw, 8px)',
										color: '#000',
										cursor: 'pointer',
									}}
								>
									{prod.name}
								</h3>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<div
										style={{
											fontFamily: 'var(--font-display)',
											fontSize: 'clamp(18px, 3vw, 22px)',
											fontWeight: 400,
											color: '#000',
										}}
									>
										₹{prod.price.toLocaleString('en-IN')}
									</div>
									<button
										data-clickable
										onClick={() =>
											addToCart({
												id: prod.id,
												name: prod.name,
												price: prod.price,
											})
										}
										style={{
											padding: 'clamp(6px 12px, 1vw 1.5vw, 8px 16px)',
											background: '#000',
											color: '#fff',
											border: 'none',
											cursor: 'pointer',
											fontSize: 'clamp(10px, 1.5vw, 11px)',
											fontWeight: 600,
										}}
									>
										Add
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// PRODUCT PAGE (Placeholder)
// =====================================================
const ProductPage = ({ product, setPage, addToCart }) => {
	const prod = product || PRODUCTS[0];
	const [qty, setQty] = useState(1);

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 60px 52px)' }}>
				<div
					style={{
						maxWidth: 1400,
						margin: '0 auto',
						marginBottom: 'clamp(16px, 3vw, 28px)',
					}}
				>
					<button
						data-clickable
						onClick={() => setPage('products')}
						style={{
							background: 'none',
							border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)',
							cursor: 'pointer',
							padding: 0,
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
						}}
					>
						← Collection
					</button>
				</div>
				<div
					style={{
						maxWidth: 1400,
						margin: '0 auto',
						display: 'grid',
						gridTemplateColumns: '1fr',
						gap: 'clamp(24px, 6vw, 60px)',
					}}
					className='grid-col-2'
				>
					<div
						style={{
							height: 'clamp(300px, 60vw, 600px)',
							background: '#f7f7f7',
							borderRadius: 2,
							overflow: 'hidden',
						}}
					>
						<GLBViewer
							modelPath={prod.modelPath}
							color='#1a1a1a'
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
					<div>
						<h1
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(32px, 6vw, 48px)',
								fontWeight: 400,
								marginBottom: 'clamp(12px, 3vw, 20px)',
								color: '#000',
							}}
						>
							{prod.name}
						</h1>
						<div
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 36px)',
								fontWeight: 400,
								marginBottom: 'clamp(20px, 4vw, 32px)',
								color: '#000',
							}}
						>
							₹{prod.price.toLocaleString('en-IN')}
						</div>
						<p
							style={{
								fontSize: 'clamp(13px, 2.5vw, 15px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.6)',
								lineHeight: 1.8,
								marginBottom: 'clamp(20px, 4vw, 32px)',
							}}
						>
							{prod.desc}
						</p>

						<div style={{ marginBottom: 32 }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 700,
									letterSpacing: '.1em',
									textTransform: 'uppercase',
									marginBottom: 12,
									color: 'rgba(0,0,0,0.4)',
								}}
							>
								Specifications
							</div>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: '140px 1fr',
									gap: 0,
									borderTop: '1px solid #eee',
								}}
							>
								{prod.specs.map((spec, i) => (
									<div key={i} style={{ display: 'contents' }}>
										<div
											style={{
												padding: '12px 0',
												fontWeight: 600,
												fontSize: 12,
												color: 'rgba(0,0,0,0.5)',
											}}
										>
											{spec[0]}
										</div>
										<div
											style={{
												padding: '12px 20px',
												fontSize: 14,
												color: '#000',
												borderLeft: '1px solid #eee',
											}}
										>
											{spec[1]}
										</div>
									</div>
								))}
							</div>
						</div>

						<div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									border: '1px solid #ddd',
								}}
							>
								<button
									data-clickable
									onClick={() => setQty(Math.max(1, qty - 1))}
									style={{
										padding: '10px 16px',
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										fontSize: 14,
									}}
								>
									−
								</button>
								<div
									style={{ padding: '0 20px', minWidth: 40, textAlign: 'center' }}
								>
									{qty}
								</div>
								<button
									data-clickable
									onClick={() => setQty(qty + 1)}
									style={{
										padding: '10px 16px',
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										fontSize: 14,
									}}
								>
									+
								</button>
							</div>
							<button
								data-clickable
								onClick={() => {
									addToCart({
										id: prod.id,
										name: prod.name,
										price: prod.price,
										qty,
									});
									setQty(1);
								}}
								className='btn btn-dark'
								style={{ flex: 1 }}
							>
								Add to Cart →
							</button>
						</div>
						<button
							data-clickable
							onClick={() => setPage('products')}
							style={{
								width: '100%',
								background: 'rgba(0,0,0,0.04)',
								border: '1px solid rgba(0,0,0,0.1)',
								fontSize: 'clamp(12px, 2vw, 13px)',
								color: '#000',
								cursor: 'pointer',
								padding: 'clamp(12px, 2vw, 16px)',
								fontWeight: 500,
								transition: 'all .2s',
								marginTop: 'clamp(16px, 3vw, 24px)',
								textAlign: 'center',
							}}
							onMouseEnter={(e) => {
								e.target.style.background = '#000';
								e.target.style.color = '#fff';
								e.target.style.borderColor = '#000';
							}}
							onMouseLeave={(e) => {
								e.target.style.background = 'rgba(0,0,0,0.04)';
								e.target.style.color = '#000';
								e.target.style.borderColor = 'rgba(0,0,0,0.1)';
							}}
						>
							← Back to Collection
						</button>
					</div>
				</div>
			</section>
			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// CHECKOUT PAGE (Minimal)
// =====================================================
const CheckoutPage = ({ cart, setPage, onOrderComplete }) => {
	const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
	const [formSubmitted, setFormSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setTimeout(() => {
			onOrderComplete();
			setFormSubmitted(true);
		}, 1000);
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 60px 52px)' }}>
				<div
					style={{
						maxWidth: 900,
						margin: '0 auto',
						marginBottom: 'clamp(16px, 3vw, 28px)',
					}}
				>
					<button
						data-clickable
						onClick={() => setPage('products')}
						style={{
							background: 'none',
							border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)',
							cursor: 'pointer',
							padding: 0,
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
						}}
					>
						← Continue Shopping
					</button>
				</div>
			</section>
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 40px 52px)' }}>
				<div style={{ maxWidth: 900, margin: '0 auto' }}>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(32px, 6vw, 56px)',
							fontWeight: 400,
							marginBottom: 'clamp(24px, 4vw, 40px)',
						}}
					>
						Checkout
					</h1>

					{!formSubmitted ? (
						<form onSubmit={handleSubmit}>
							<div
								style={{
									marginBottom: 'clamp(24px, 4vw, 40px)',
									padding: 'clamp(24px, 3vw, 32px)',
									background: '#f7f7f7',
								}}
							>
								<h3
									style={{
										fontSize: 'clamp(14px, 2vw, 16px)',
										fontWeight: 600,
										marginBottom: 'clamp(16px, 3vw, 20px)',
										color: '#000',
									}}
								>
									Order Summary
								</h3>
								{cart.map((item, i) => (
									<div
										key={i}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											padding: 'clamp(10px 0, 1vw 0, 12px 0)',
											borderBottom: '1px solid #ddd',
										}}
									>
										<div>
											<div
												style={{
													fontSize: 'clamp(12px, 1.5vw, 14px)',
													fontWeight: 500,
													color: '#000',
												}}
											>
												{item.name}
											</div>
											<div
												style={{
													fontSize: 'clamp(11px, 1.5vw, 12px)',
													color: 'rgba(0,0,0,0.4)',
												}}
											>
												Qty {item.qty || 1}
											</div>
										</div>
										<div
											style={{
												fontWeight: 500,
												color: '#000',
												fontSize: 'clamp(12px, 1.5vw, 14px)',
											}}
										>
											${item.price * (item.qty || 1)}
										</div>
									</div>
								))}
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										marginTop: 20,
										paddingTop: 20,
										borderTop: '2px solid #000',
										fontSize: 18,
										fontWeight: 600,
									}}
								>
									<div>Total</div>
									<div>${total}</div>
								</div>
							</div>

							<div style={{ marginBottom: 32 }}>
								<label
									style={{
										display: 'block',
										fontSize: 'clamp(11px, 1.5vw, 12px)',
										fontWeight: 600,
										marginBottom: 'clamp(6px, 1.5vw, 8px)',
										color: 'rgba(0,0,0,0.6)',
									}}
								>
									Email
								</label>
								<input
									type='email'
									required
									style={{
										width: '100%',
										padding: 'clamp(10px 14px, 1vw 1.5vw, 12px 16px)',
										border: '1px solid #ddd',
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										fontFamily: 'inherit',
									}}
									placeholder='you@example.com'
								/>
							</div>

							<button
								type='submit'
								className='btn btn-dark'
								style={{
									width: '100%',
									fontSize: 'clamp(11px, 1.5vw, 14px)',
									padding: 'clamp(12px 24px, 1vw 3vw, 16px 40px)',
								}}
							>
								Place Order →
							</button>
						</form>
					) : (
						<div style={{ textAlign: 'center', padding: '80px 40px' }}>
							<div style={{ fontSize: 64, marginBottom: 24, lineHeight: 1 }}>✓</div>
							<h3
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 32,
									fontWeight: 400,
									color: '#000',
									marginBottom: 16,
								}}
							>
								Order Confirmed
							</h3>
							<p
								style={{
									fontSize: 15,
									fontWeight: 300,
									color: 'rgba(0,0,0,0.5)',
									lineHeight: 1.7,
									marginBottom: 32,
								}}
							>
								Thank you for your order. You'll receive a confirmation email
								shortly.
							</p>
							<button
								data-clickable
								onClick={() => setPage('home')}
								className='btn btn-ghost'
								style={{ fontSize: 12, padding: '12px 28px' }}
							>
								Back to Home
							</button>
						</div>
					)}
				</div>
			</section>
			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// ABOUT PAGE
// =====================================================
const AboutPage = ({ setPage }) => {
	useScrollReveal();
	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 60px 52px)' }}>
				<div
					style={{
						maxWidth: 1200,
						margin: '0 auto',
						marginBottom: 'clamp(16px, 3vw, 28px)',
					}}
				>
					<button
						data-clickable
						onClick={() => setPage('home')}
						style={{
							background: 'none',
							border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)',
							cursor: 'pointer',
							padding: 0,
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
						}}
					>
						← Home
					</button>
				</div>
			</section>
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 40px 52px)' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(32px, 6vw, 56px)',
							fontWeight: 400,
							marginBottom: 'clamp(32px, 6vw, 60px)',
							color: '#000',
						}}
					>
						Our Studio
					</h1>

					<div
						className='reveal d0'
						style={{
							fontSize: 'clamp(14px, 2.5vw, 18px)',
							fontWeight: 300,
							lineHeight: 1.8,
							marginBottom: 'clamp(40px, 6vw, 60px)',
							maxWidth: 800,
							color: 'rgba(0,0,0,0.7)',
						}}
					>
						BWR 3D Works exists at the intersection of precision manufacturing and
						parametric design. We create limited-edition objects that challenge
						conventional aesthetics while maintaining uncompromising attention to
						detail.
					</div>

					<h2
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 4vw, 42px)',
							fontWeight: 400,
							marginBottom: 'clamp(28px, 5vw, 40px)',
							color: '#000',
						}}
					>
						Our Process
					</h2>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(2, 1fr)',
							gap: 'clamp(32px, 6vw, 80px)',
						}}
						className='grid-col-2'
					>
						{[
							{
								num: '01',
								title: 'Concept',
								desc: 'Every object begins as a mathematical equation. We define parametric relationships and design constraints.',
							},
							{
								num: '02',
								title: 'Refinement',
								desc: 'Iterative testing. Tolerances tested. Material properties optimized. Zero compromise on precision.',
							},
							{
								num: '03',
								title: 'Manufacturing',
								desc: 'Multi-axis precision printing at 0.05mm resolution. Each layer calculated. No room for error.',
							},
							{
								num: '04',
								title: 'Finishing',
								desc: 'Twelve-step finishing protocol. Hand-polished surfaces. Quality control at every stage.',
							},
						].map((step, i) => (
							<div key={i} className={`reveal d${i}`}>
								<div
									style={{
										fontSize: 'clamp(40px, 7vw, 56px)',
										fontWeight: 300,
										color: 'rgba(0,0,0,0.1)',
										marginBottom: 'clamp(16px, 3vw, 20px)',
									}}
								>
									{step.num}
								</div>
								<h3
									style={{
										fontSize: 'clamp(16px, 3vw, 20px)',
										fontWeight: 600,
										marginBottom: 'clamp(10px, 2vw, 12px)',
										color: '#000',
									}}
								>
									{step.title}
								</h3>
								<p
									style={{
										fontSize: 'clamp(12px, 2vw, 14px)',
										fontWeight: 300,
										color: 'rgba(0,0,0,0.6)',
										lineHeight: 1.7,
									}}
								>
									{step.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// CONTACT PAGE
// =====================================================
const ContactPage = ({ setPage }) => {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		projectType: 'Prototype Development',
		message: '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setTimeout(() => setSubmitted(true), 800);
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			{/* Hero Section */}
			<section
				style={{
					background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
					padding: 'clamp(60px 16px, 12vw 5vw, 100px 52px)',
					textAlign: 'center',
					color: '#fff',
				}}
			>
				<div style={{ maxWidth: 900, margin: '0 auto' }}>
					<button
						data-clickable
						onClick={() => setPage('home')}
						style={{
							background: 'rgba(255,255,255,0.1)',
							border: '1px solid rgba(255,255,255,0.3)',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(255,255,255,0.7)',
							cursor: 'pointer',
							padding: '8px 16px',
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
							marginBottom: '32px',
							borderRadius: '4px',
							transition: 'all 0.3s ease',
						}}
						onMouseEnter={(e) => {
							e.target.style.background = 'rgba(255,255,255,0.15)';
							e.target.style.color = '#fff';
						}}
						onMouseLeave={(e) => {
							e.target.style.background = 'rgba(255,255,255,0.1)';
							e.target.style.color = 'rgba(255,255,255,0.7)';
						}}
					>
						← Back Home
					</button>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(40px, 8vw, 72px)',
							fontWeight: 400,
							marginBottom: 'clamp(16px, 3vw, 24px)',
							color: '#fff',
							letterSpacing: '-0.02em',
						}}
					>
						Let's Work Together
					</h1>
					<p
						style={{
							fontSize: 'clamp(13px, 2vw, 18px)',
							color: 'rgba(255,255,255,0.8)',
							lineHeight: 1.6,
							fontWeight: 300,
							maxWidth: 600,
							margin: '0 auto',
						}}
					>
						From concept to reality. We transform your ideas into precision-engineered
						3D solutions.
					</p>
				</div>
			</section>

			{/* Two Column Layout - Info & Form */}
			<section style={{ padding: 'clamp(40px 16px, 8vw 5vw, 80px 52px)' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 'clamp(40px, 8vw, 80px)',
						}}
						className='grid-col-2'
					>
						{/* Contact Information */}
						<div>
							<h2
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(24px, 4vw, 36px)',
									fontWeight: 400,
									marginBottom: 'clamp(32px, 6vw, 48px)',
									color: '#000',
									letterSpacing: '-0.01em',
								}}
							>
								Get in touch
							</h2>

							{/* Contact Items */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 'clamp(28px, 5vw, 40px)',
									marginBottom: 'clamp(40px, 8vw, 60px)',
								}}
							>
								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Address
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										Bangalore, India
										<br />
										Design District
									</p>
								</div>

								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Phone
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										+91 (080) 4141-7722
									</p>
								</div>

								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Email
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										hello@bwr3dworks.com
									</p>
								</div>

								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Business Hours
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										Mon - Sat: 9 AM - 6 PM
										<br />
										Sunday: By appointment
									</p>
								</div>
							</div>

							{/* Info Box */}
							<div
								style={{
									background: '#f5f5f5',
									padding: 'clamp(20px, 3vw, 28px)',
									borderRadius: '8px',
									borderLeft: '3px solid #000',
								}}
							>
								<h4
									style={{
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										color: '#000',
										fontWeight: 500,
										marginBottom: 8,
										textTransform: 'uppercase',
										letterSpacing: '.06em',
									}}
								>
									Response Time
								</h4>
								<p
									style={{
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										color: 'rgba(0,0,0,0.7)',
										lineHeight: 1.6,
										fontWeight: 300,
									}}
								>
									We typically respond to all inquiries within 24 hours during
									business days.
								</p>
							</div>
						</div>

						{/* Contact Form */}
						<div>
							{!submitted ? (
								<form onSubmit={handleSubmit}>
									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Full Name
										</label>
										<input
											type='text'
											name='name'
											value={formData.name}
											onChange={handleChange}
											required
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>

									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Email Address
										</label>
										<input
											type='email'
											name='email'
											value={formData.email}
											onChange={handleChange}
											required
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>

									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Phone (Optional)
										</label>
										<input
											type='tel'
											name='phone'
											value={formData.phone}
											onChange={handleChange}
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>

									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Project Type
										</label>
										<select
											name='projectType'
											value={formData.projectType}
											onChange={handleChange}
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
												cursor: 'pointer',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										>
											<option>Prototype Development</option>
											<option>Production Manufacturing</option>
											<option>Design Consultation</option>
											<option>Quality Testing</option>
											<option>Other</option>
										</select>
									</div>

									<div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Project Details
										</label>
										<textarea
											name='message'
											value={formData.message}
											onChange={handleChange}
											required
											rows={6}
											placeholder='Tell us about your project, requirements, and timeline...'
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												resize: 'vertical',
												minHeight: '140px',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>

									<button
										type='submit'
										className='btn btn-dark'
										style={{
											width: '100%',
											fontSize: 'clamp(11px, 1.5vw, 14px)',
											padding: 'clamp(14px 24px, 1.5vw 3vw, 18px 40px)',
											fontWeight: 500,
											letterSpacing: '.04em',
										}}
									>
										Send Message →
									</button>
								</form>
							) : (
								<div style={{ textAlign: 'center', padding: '80px 40px' }}>
									<div
										style={{
											fontSize: 'clamp(48px, 12vw, 64px)',
											marginBottom: 24,
											lineHeight: 1,
										}}
									>
										✓
									</div>
									<h3
										style={{
											fontFamily: 'var(--font-display)',
											fontSize: 'clamp(24px, 4vw, 36px)',
											fontWeight: 400,
											color: '#000',
											marginBottom: 16,
											letterSpacing: '-0.01em',
										}}
									>
										Message Received
									</h3>
									<p
										style={{
											fontSize: 'clamp(13px, 1.5vw, 15px)',
											fontWeight: 300,
											color: 'rgba(0,0,0,0.6)',
											lineHeight: 1.7,
											marginBottom: 32,
										}}
									>
										Thank you for reaching out. We'll review your message and
										get back to you within 24 hours.
									</p>
									<button
										data-clickable
										onClick={() => setPage('home')}
										className='btn btn-ghost'
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											padding: '12px 28px',
										}}
									>
										← Back to Home
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			<Footer setPage={setPage} />
		</div>
	);
};

// =====================================================
// ROOT APP
// =====================================================
export default function App() {
	const [page, setPageRaw] = useState('home');
	const [productData, setProductData] = useState(null);
	const [cart, setCart] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('bwr3d_cart') || '[]');
		} catch {
			return [];
		}
	});
	const [cartOpen, setCartOpen] = useState(false);
	const [toastMsg, setToastMsg] = useState('');

	const setPage = useCallback((p, data) => {
		setProductData(data || null);
		setPageRaw(p);
		window.scrollTo({ top: 0, behavior: 'instant' });
	}, []);

	const showToast = useCallback((msg) => {
		setToastMsg(msg);
		setTimeout(() => setToastMsg(''), 3000);
	}, []);

	const addToCart = useCallback(
		(item) => {
			setCart((prev) => {
				const newCart = [...prev, { ...item, qty: item.qty || 1 }];
				localStorage.setItem('bwr3d_cart', JSON.stringify(newCart));
				return newCart;
			});
			showToast(`Added: ${item.name}`);
		},
		[showToast],
	);

	const removeFromCart = useCallback((idx) => {
		setCart((prev) => {
			const newCart = prev.filter((_, i) => i !== idx);
			localStorage.setItem('bwr3d_cart', JSON.stringify(newCart));
			return newCart;
		});
	}, []);

	const onOrderComplete = useCallback(() => {
		setCart([]);
		localStorage.removeItem('bwr3d_cart');
		showToast('Order placed! Thank you.');
	}, [showToast]);

	const cartCount = cart.reduce((s, c) => s + (c.qty || 1), 0);
	const currentProduct = productData || PRODUCTS[0];

	useEffect(() => {
		document.title = 'BWR 3D Works — Where Rebellion Meets Precision';
	}, []);

	return (
		<>
			<GlobalStyles />
			<CustomCursor />
			<Toast message={toastMsg} />

			<Navbar
				page={page}
				setPage={setPage}
				cartCount={cartCount}
				onCartOpen={() => setCartOpen(true)}
			/>

			{page === 'home' && <HomePage setPage={setPage} addToCart={addToCart} />}
			{page === 'products' && <ProductsPage setPage={setPage} addToCart={addToCart} />}
			{page === 'product' && (
				<ProductPage product={currentProduct} setPage={setPage} addToCart={addToCart} />
			)}
			{page === 'studio' && <StudioPage setPage={setPage} addToCart={addToCart} />}
			{page === 'about' && <AboutPage setPage={setPage} />}
			{page === 'contact' && <ContactPage setPage={setPage} />}
			{page === 'checkout' && (
				<CheckoutPage cart={cart} setPage={setPage} onOrderComplete={onOrderComplete} />
			)}

			{cartOpen && (
				<CartSidebar
					cart={cart}
					onClose={() => setCartOpen(false)}
					onRemove={removeFromCart}
					setPage={setPage}
				/>
			)}
		</>
	);
}
