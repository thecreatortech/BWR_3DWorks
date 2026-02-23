import { useNavigate }from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Footer } from '../components/common/Footer';

export default function About() {
	useScrollReveal();
	const navigate = useNavigate();

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			{/* Hero */}
			<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<button
						data-clickable
						onClick={() => navigate('/')}
						style={{
							background: 'none', border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)', cursor: 'pointer',
							padding: 0, fontWeight: 400, letterSpacing: '.05em',
							textTransform: 'uppercase', marginBottom: 'clamp(24px, 4vw, 40px)',
							display: 'block',
						}}
					>
						← Home
					</button>

					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(36px, 7vw, 64px)',
							fontWeight: 400,
							marginBottom: 'clamp(20px, 4vw, 32px)',
							color: '#000',
							maxWidth: 700,
						}}
					>
						We Started With One Question
					</h1>
					<div
						className='reveal d0'
						style={{
							fontSize: 'clamp(15px, 2.5vw, 20px)',
							fontWeight: 300,
							lineHeight: 1.8,
							color: 'rgba(0,0,0,0.65)',
							maxWidth: 800,
							marginBottom: 'clamp(40px, 6vw, 60px)',
						}}
					>
						"Why does every gift feel the same?"
						<br /><br />
						We noticed it at every wedding, every housewarming, every birthday — the same
						mass-produced items wrapped in different paper. Nothing personal. Nothing memorable.
						Nothing that says <em>"I thought about you."</em>
						<br /><br />
						So we built BWR 3D Works in Bengaluru — a studio that crafts objects
						with meaning, precision, and personality.
					</div>
				</div>
			</section>

			{/* 5 Emotional Drivers */}
			<section
				data-dark
				style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', background: '#000' }}
			>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700, letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
					}} className='reveal d0'>
						Why People Buy
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 44px)',
							fontWeight: 400, color: '#fff',
							marginBottom: 'clamp(40px, 6vw, 60px)',
						}}
					>
						Five Emotional Drivers
					</h2>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 'clamp(24px, 4vw, 48px)',
					}} className='grid-col-3'>
						{[
							{ num: '01', title: 'Identity Expression', desc: 'A nameplate isn\'t just a sign — it\'s the first thing guests see. It says who you are before you open the door.' },
							{ num: '02', title: 'Milestone Memory', desc: 'Birth weight, first steps, wedding date — numbers that mean everything. We make them permanent, physical, real.' },
							{ num: '03', title: 'Spiritual Connection', desc: 'A Ganesha for the modern home. Devotion doesn\'t need to look old-fashioned. Contemporary meets sacred.' },
							{ num: '04', title: 'Gift Anxiety', desc: 'The panic before every occasion: "What do I gift?" We solve this with objects that feel personal, premium, and unique.' },
							{ num: '05', title: 'Craft Appreciation', desc: 'People want to know their stuff was made with care — not injected from a mould. Layer by layer, our objects earn their value.' },
						].map((item, i) => (
							<div key={i} className={`reveal d${i % 3}`}>
								<div style={{
									fontSize: 'clamp(32px, 5vw, 48px)',
									fontWeight: 300,
									color: 'rgba(255,255,255,0.08)',
									marginBottom: 16,
								}}>
									{item.num}
								</div>
								<h3 style={{
									fontSize: 'clamp(15px, 2vw, 18px)',
									fontWeight: 600, color: '#fff',
									marginBottom: 10,
								}}>
									{item.title}
								</h3>
								<p style={{
									fontSize: 'clamp(12px, 1.5vw, 14px)',
									fontWeight: 300,
									color: 'rgba(255,255,255,0.4)',
									lineHeight: 1.7,
								}}>
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Our Machine */}
			<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', background: '#f7f7f7' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						display: 'grid',
						gridTemplateColumns: '1fr',
						gap: 'clamp(32px, 6vw, 60px)',
					}} className='grid-col-2'>
						<div className='reveal d0'>
							<div style={{
								fontSize: 'clamp(9px, 1.2vw, 11px)',
								fontWeight: 700, letterSpacing: '.16em',
								textTransform: 'uppercase',
								color: 'rgba(0,0,0,0.3)',
								marginBottom: 'clamp(16px, 3vw, 24px)',
							}}>
								Our Machine
							</div>
							<h2 style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 44px)',
								fontWeight: 400, color: '#000',
								marginBottom: 'clamp(16px, 3vw, 24px)',
							}}>
								Bambu Lab P1S
							</h2>
							<p style={{
								fontSize: 'clamp(14px, 2vw, 16px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.6)',
								lineHeight: 1.8,
								marginBottom: 'clamp(24px, 4vw, 32px)',
							}}>
								Our studio runs on the Bambu Lab P1S — one of the most advanced
								consumer 3D printers ever made. With CoreXY kinematics, auto-calibration,
								and precision down to 0.05mm layer height, it produces objects that most
								people can't believe are 3D printed.
							</p>
						</div>
						<div className='reveal d1' style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 16,
						}}>
							{[
								{ label: 'Print Speed', value: '500mm/s' },
								{ label: 'Layer Resolution', value: '0.05mm' },
								{ label: 'Build Volume', value: '256×256×256mm' },
								{ label: 'Multi-Material', value: 'AMS Support' },
								{ label: 'Auto Calibration', value: 'LiDAR + Camera' },
								{ label: 'Materials', value: 'PLA+, PETG, TPU' },
							].map((spec, i) => (
								<div key={i} style={{
									padding: 16,
									background: '#fff',
									border: '1px solid rgba(0,0,0,0.06)',
								}}>
									<div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>
										{spec.label}
									</div>
									<div style={{ fontSize: 16, fontWeight: 500, color: '#000' }}>
										{spec.value}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Our Process */}
			<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', background: '#fff' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700, letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(0,0,0,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
					}} className='reveal d0'>
						Our Process
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 44px)',
							fontWeight: 400, color: '#000',
							marginBottom: 'clamp(40px, 6vw, 60px)',
						}}
					>
						From Idea to Object
					</h2>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 'clamp(32px, 6vw, 80px)',
					}} className='grid-col-2'>
						{[
							{ num: '01', title: 'Design', desc: 'You share your vision — name, style, purpose. We design in CAD with multiple iterations until it\'s perfect.' },
							{ num: '02', title: 'Print', desc: 'Your object is printed layer by layer at 0.05mm resolution. No shortcuts, no batch production.' },
							{ num: '03', title: 'Finish', desc: 'Hand-sanded, coated, inspected. Our 12-point quality check ensures premium feel in every piece.' },
							{ num: '04', title: 'Deliver', desc: 'Carefully packaged in premium gift boxes. Shipped across India with tracking and care instructions.' },
						].map((step, i) => (
							<div key={i} className={`reveal d${i % 2}`}>
								<div style={{
									fontSize: 'clamp(40px, 7vw, 56px)',
									fontWeight: 300,
									color: 'rgba(0,0,0,0.08)',
									marginBottom: 16,
								}}>
									{step.num}
								</div>
								<h3 style={{
									fontSize: 'clamp(16px, 3vw, 20px)',
									fontWeight: 600, color: '#000',
									marginBottom: 12,
								}}>
									{step.title}
								</h3>
								<p style={{
									fontSize: 'clamp(12px, 2vw, 14px)',
									fontWeight: 300,
									color: 'rgba(0,0,0,0.6)',
									lineHeight: 1.7,
								}}>
									{step.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 5-Year Roadmap */}
			<section
				data-dark
				style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', background: '#111' }}
			>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700, letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
					}} className='reveal d0'>
						The Road Ahead
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 44px)',
							fontWeight: 400, color: '#fff',
							marginBottom: 'clamp(40px, 6vw, 60px)',
						}}
					>
						5-Year Vision
					</h2>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 'clamp(16px, 3vw, 32px)',
					}} className='grid-col-3'>
						{[
							{ year: 'Year 1', title: 'Foundation', points: ['Launch 5 hero products', 'Build brand presence online', 'Establish quality benchmark'] },
							{ year: 'Year 2', title: 'Growth', points: ['Expand to 20+ SKUs', 'Add resin printing capability', 'Enter gifting marketplaces'] },
							{ year: 'Year 3', title: 'Scale', points: ['Multi-printer production line', 'B2B corporate gifting', 'Pan-India same-day delivery'] },
							{ year: 'Year 4', title: 'Premium', points: ['Metal 3D printing capability', 'International shipping', 'Design collaboration platform'] },
							{ year: 'Year 5', title: 'Ecosystem', points: ['BWR Design Studio franchise', 'AI-powered customization', 'Market leader in premium 3D gifts'] },
						].map((phase, i) => (
							<div key={i} className={`reveal d${i % 3}`} style={{
								padding: 'clamp(20px, 3vw, 28px)',
								border: '1px solid rgba(255,255,255,0.08)',
								background: 'rgba(255,255,255,0.02)',
							}}>
								<div style={{
									fontSize: 11, fontWeight: 700,
									letterSpacing: '.12em', textTransform: 'uppercase',
									color: 'rgba(255,255,255,0.3)',
									marginBottom: 8,
								}}>
									{phase.year}
								</div>
								<h3 style={{
									fontSize: 'clamp(16px, 2.5vw, 20px)',
									fontWeight: 600, color: '#fff',
									marginBottom: 16,
								}}>
									{phase.title}
								</h3>
								<ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
									{phase.points.map((p, j) => (
										<li key={j} style={{
											fontSize: 'clamp(12px, 1.5vw, 13px)',
											color: 'rgba(255,255,255,0.4)',
											paddingLeft: 16,
											position: 'relative',
										}}>
											<span style={{
												position: 'absolute', left: 0, top: '50%',
												transform: 'translateY(-50%)',
												width: 4, height: 4,
												background: 'rgba(255,255,255,0.2)',
												borderRadius: '50%',
											}} />
											{p}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
