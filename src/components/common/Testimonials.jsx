import { useState, useEffect, useCallback } from 'react';

const TESTIMONIALS = [
	{
		name: 'Priya Sharma',
		location: 'Mumbai',
		text: 'The nameplate exceeded our expectations. The gold finish catches light beautifully and our guests always compliment it. True craftsmanship.',
		rating: 5,
		product: 'Premium Architectural Nameplate',
	},
	{
		name: 'Rahul Krishnan',
		location: 'Bengaluru',
		text: 'Ordered the Ganesha sculpture as a housewarming gift. The detail at this scale is remarkable — it looks like it belongs in a gallery, not a 3D printer.',
		rating: 5,
		product: 'Contemporary Ganesha Sculpture',
	},
	{
		name: 'Ananya Patel',
		location: 'Delhi',
		text: "The milestone plaque for our daughter is our most treasured keepsake. The pastel tones and gold accents are absolutely perfect. We've ordered two more as gifts.",
		rating: 5,
		product: 'Birth Stats Milestone Plaque',
	},
	{
		name: 'Vikram & Meera',
		location: 'Hyderabad',
		text: 'We gave the wedding gift object to our best friends. The packaging alone felt luxury. When they opened it, there were tears. Worth every rupee.',
		rating: 5,
		product: 'Architectural Wedding Gift',
	},
	{
		name: 'Aditya Rajan',
		location: 'Chennai',
		text: 'The desk organizer set transformed my workspace. The modular design is genius — minimal, functional, and beautiful. Ordered the executive 7-piece set.',
		rating: 4,
		product: 'Premium Desk Organizer Set',
	},
];

export const Testimonials = () => {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);

	const next = useCallback(() => {
		setActive((prev) => (prev + 1) % TESTIMONIALS.length);
	}, []);

	const prev = useCallback(() => {
		setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
	}, []);

	useEffect(() => {
		if (paused) return;
		const interval = setInterval(next, 5000);
		return () => clearInterval(interval);
	}, [paused, next]);

	const t = TESTIMONIALS[active];

	return (
		<section
			style={{
				padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)',
				background: '#0a0a0a',
				color: '#fff',
				position: 'relative',
				overflow: 'hidden',
			}}
			data-dark
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* Decorative gold line */}
			<div style={{
				position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
				width: 60, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
			}} />

			<div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
				{/* Section label */}
				<div className="reveal" style={{
					fontSize: 'clamp(9px, 1.2vw, 11px)',
					fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase',
					color: 'var(--gold)', marginBottom: 'clamp(12px, 3vw, 20px)',
				}}>
					Client Stories
				</div>

				{/* Stars */}
				<div style={{ marginBottom: 24, fontSize: 18, letterSpacing: 4 }}>
					{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
				</div>

				{/* Quote */}
				<div key={active} style={{
					animation: 'pageIn .6s var(--ease-out) forwards',
				}}>
					<p style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(18px, 3vw, 28px)',
						fontWeight: 400,
						fontStyle: 'italic',
						lineHeight: 1.6,
						color: 'rgba(255,255,255,0.85)',
						marginBottom: 'clamp(20px, 4vw, 36px)',
					}}>
						"{t.text}"
					</p>

					<div style={{ marginBottom: 6 }}>
						<span style={{
							fontWeight: 600, fontSize: 'clamp(13px, 1.5vw, 15px)',
							color: '#fff', letterSpacing: '.02em',
						}}>
							{t.name}
						</span>
						<span style={{
							color: 'rgba(255,255,255,0.3)', margin: '0 8px',
						}}>·</span>
						<span style={{
							fontSize: 'clamp(11px, 1.3vw, 13px)', color: 'rgba(255,255,255,0.4)',
						}}>
							{t.location}
						</span>
					</div>
					<div style={{
						fontSize: 'clamp(10px, 1.2vw, 12px)',
						color: 'var(--gold)', fontWeight: 500,
						letterSpacing: '.04em',
					}}>
						{t.product}
					</div>
				</div>

				{/* Navigation */}
				<div style={{
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					gap: 20, marginTop: 'clamp(30px, 5vw, 48px)',
				}}>
					<button onClick={prev} style={{
						width: 40, height: 40, borderRadius: '50%',
						background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
						color: '#fff', cursor: 'pointer', fontSize: 16,
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						transition: 'all .3s',
					}} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
					   onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}>
						←
					</button>

					{/* Dots */}
					<div style={{ display: 'flex', gap: 8 }}>
						{TESTIMONIALS.map((_, i) => (
							<button key={i} onClick={() => setActive(i)} style={{
								width: active === i ? 24 : 8, height: 8,
								borderRadius: 4, border: 'none', cursor: 'pointer',
								background: active === i
									? 'linear-gradient(90deg, var(--gold), var(--gold-light))'
									: 'rgba(255,255,255,0.15)',
								transition: 'all .4s var(--ease-out)',
								padding: 0,
							}} />
						))}
					</div>

					<button onClick={next} style={{
						width: 40, height: 40, borderRadius: '50%',
						background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
						color: '#fff', cursor: 'pointer', fontSize: 16,
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						transition: 'all .3s',
					}} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
					   onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}>
						→
					</button>
				</div>
			</div>
		</section>
	);
};
