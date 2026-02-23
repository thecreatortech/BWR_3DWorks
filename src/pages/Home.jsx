import { useNavigate, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { HeroBgCanvas } from '../components/common/HeroBgCanvas';
import { AnimatedCarViewer } from '../components/common/AnimatedCarViewer';
import { Marquee } from '../components/sections/Marquee';
import { Footer } from '../components/common/Footer';
import { PRODUCTS } from '../utils/products';
import { useState } from 'react';

export default function Home({ addToCart }) {
	useScrollReveal();
	const navigate = useNavigate();
	const [hoveredProduct, setHoveredProduct] = useState(null);

	const featuredProduct = PRODUCTS[0]; // Premium Nameplate

	return (
		<div style={{ minHeight: '100vh' }}>
			{/* ===== HERO SECTION — Original Layout with 3D Car ===== */}
			<section
				data-dark
				style={{
					position: 'relative',
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					background: '#000',
					overflow: 'hidden',
					padding: 'clamp(100px, 15vw, 140px) clamp(16px, 5vw, 52px)',
				}}
			>
				<HeroBgCanvas />

				<div style={{
					position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', width: '100%',
					display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'center',
				}} className='grid-col-2'>
					{/* Left: Content */}
					<div style={{ textAlign: 'left' }}>
						{/* Subtitle with line */}
						<div
							className='reveal d0'
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								marginBottom: 'clamp(24px, 4vw, 40px)',
							}}
						>
							<div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.3)' }} />
							<span style={{
								fontSize: 'clamp(10px, 1.2vw, 12px)',
								fontWeight: 600,
								letterSpacing: '.2em',
								textTransform: 'uppercase',
								color: 'rgba(255,255,255,0.4)',
							}}>
								EST. 2024 — Precision Objects
							</span>
						</div>
						<h1
							className='reveal d1'
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(42px, 8vw, 90px)',
								fontWeight: 400,
								letterSpacing: '-0.02em',
								lineHeight: 1.05,
								color: '#fff',
								marginBottom: 'clamp(20px, 4vw, 32px)',
							}}
						>
							Where<br />
							Rebellion<br />
							<em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>Meets<br />Precision.</em>
						</h1>
						<p
							className='reveal d2'
							style={{
								fontSize: 'clamp(13px, 1.8vw, 16px)',
								fontWeight: 300,
								color: 'rgba(255,255,255,0.45)',
								lineHeight: 1.7,
								maxWidth: 400,
								marginBottom: 'clamp(28px, 5vw, 48px)',
							}}
						>
							3D printed objects engineered to outlast trends.
							Every layer calculated. Every surface earned.
						</p>
						<div className='reveal d3' style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
							<Link to='/products' className='btn btn-white' data-clickable style={{
								justifyContent: 'center', width: '100%',
							}}>
								Explore Collection
							</Link>
							<Link to='/products/1' className='btn btn-dark' data-clickable style={{
								justifyContent: 'center', width: '100%',
								border: '1px solid rgba(255,255,255,0.15)',
							}}>
								Featured Drop
							</Link>
						</div>

						{/* Scroll hint */}
						<div className='reveal d4' style={{
							marginTop: 'clamp(40px, 6vw, 60px)',
							display: 'flex', alignItems: 'center', gap: 12,
						}}>
							<div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.2)' }} />
							<span style={{
								fontSize: 10, fontWeight: 600, letterSpacing: '.18em',
								textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
							}}>
								Scroll to Discover
							</span>
						</div>
					</div>

					{/* Right: 3D McLaren Car Viewer */}
					<div style={{
						height: 'clamp(300px, 50vw, 550px)',
						position: 'relative',
					}}>
						<AnimatedCarViewer
							modelPath='/assets/models/McLaren_F1.glb'
							style={{ width: '100%', height: '100%' }}
						/>
						{/* Drag hint */}
						<div style={{
							position: 'absolute', bottom: 16, right: 16,
							display: 'flex', alignItems: 'center', gap: 8,
						}}>
							<span style={{
								fontSize: 10, fontWeight: 600, letterSpacing: '.12em',
								textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
							}}>
								Drag to Rotate
							</span>
							<div style={{
								width: 24, height: 24, borderRadius: '50%',
								border: '1px solid rgba(255,255,255,0.2)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								fontSize: 10, color: 'rgba(255,255,255,0.3)',
							}}>
								↻
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ===== MARQUEE ===== */}
			<Marquee />

			{/* ===== STATS SECTION ===== */}
			<section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)', background: '#fff' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 'clamp(24px, 4vw, 60px)',
							textAlign: 'center',
						}}
						className='grid-col-3'
					>
						{[
							{ num: '₹75B+', label: 'Indian Gift Market', sub: 'Growing 15% annually' },
							{ num: '67%', label: 'Personalization Premium', sub: 'Consumers pay more for custom' },
							{ num: '0.05mm', label: 'Print Resolution', sub: 'Bambu Lab P1S precision' },
						].map((stat, i) => (
							<div key={i} className={`reveal d${i}`}>
								<div style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(32px, 6vw, 56px)',
									fontWeight: 400,
									color: '#000',
									marginBottom: 8,
								}}>
									{stat.num}
								</div>
								<div style={{
									fontSize: 'clamp(12px, 1.5vw, 14px)',
									fontWeight: 600,
									letterSpacing: '.06em',
									textTransform: 'uppercase',
									color: '#000',
									marginBottom: 6,
								}}>
									{stat.label}
								</div>
								<div style={{
									fontSize: 'clamp(11px, 1.3vw, 13px)',
									fontWeight: 300,
									color: 'rgba(0,0,0,0.4)',
								}}>
									{stat.sub}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== FEATURED PRODUCT ===== */}
			<section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)', background: '#f7f7f7' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700,
						letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(0,0,0,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
					}}
						className='reveal d0'
					>
						Featured Product
					</div>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(32px, 6vw, 60px)' }} className='grid-col-2'>
						<div className='reveal d1' style={{ overflow: 'hidden', borderRadius: 4 }}>
							<img
								src={featuredProduct.image}
								alt={featuredProduct.name}
								style={{
									width: '100%',
									height: 'clamp(300px, 50vw, 500px)',
									objectFit: 'cover',
									display: 'block',
								}}
							/>
						</div>
						<div className='reveal d2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							{featuredProduct.badge && (
								<span style={{
									display: 'inline-block',
									fontSize: 10,
									fontWeight: 700,
									letterSpacing: '.12em',
									textTransform: 'uppercase',
									background: '#000',
									color: '#fff',
									padding: '4px 12px',
									marginBottom: 16,
									alignSelf: 'flex-start',
								}}>
									{featuredProduct.badge}
								</span>
							)}
							<h2 style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 44px)',
								fontWeight: 400,
								color: '#000',
								marginBottom: 'clamp(12px, 2vw, 20px)',
							}}>
								{featuredProduct.name}
							</h2>
							<p style={{
								fontSize: 'clamp(13px, 2vw, 15px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.6)',
								lineHeight: 1.8,
								marginBottom: 'clamp(16px, 3vw, 24px)',
							}}>
								{featuredProduct.desc}
							</p>
							<div style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(22px, 4vw, 32px)',
								fontWeight: 400,
								color: '#000',
								marginBottom: 'clamp(20px, 3vw, 28px)',
							}}>
								{featuredProduct.priceRange}
							</div>
							<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
								<Link to={`/products/${featuredProduct.id}`} className='btn btn-dark' data-clickable>
									View Details →
								</Link>
								<button
									className='btn btn-outline-dark'
									data-clickable
									onClick={() => addToCart({ id: featuredProduct.id, name: featuredProduct.name, price: featuredProduct.price })}
								>
									Add to Cart
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ===== PRODUCT GRID ===== */}
			<section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)', background: '#fff' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(32px, 5vw, 48px)', flexWrap: 'wrap', gap: 16 }}>
						<div>
							<div style={{
								fontSize: 'clamp(9px, 1.2vw, 11px)',
								fontWeight: 700,
								letterSpacing: '.16em',
								textTransform: 'uppercase',
								color: 'rgba(0,0,0,0.3)',
								marginBottom: 12,
							}}>
								Collection
							</div>
							<h2 style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 44px)',
								fontWeight: 400,
								color: '#000',
							}}>
								Our Products
							</h2>
						</div>
						<Link to='/products' data-clickable style={{
							fontSize: 'clamp(11px, 1.5vw, 13px)',
							fontWeight: 500,
							color: '#000',
							textDecoration: 'none',
							letterSpacing: '.04em',
							borderBottom: '1px solid #000',
							paddingBottom: 2,
						}}>
							View All →
						</Link>
					</div>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 'clamp(16px, 4vw, 40px)',
						}}
						className='grid-col-3'
					>
						{PRODUCTS.slice(0, 3).map((prod, i) => (
							<div key={prod.id} className={`reveal d${i}`}>
								<Link
									to={`/products/${prod.id}`}
									style={{
										display: 'block',
										height: 'clamp(250px, 45vw, 380px)',
										marginBottom: 'clamp(12px, 2vw, 20px)',
										borderRadius: 4,
										overflow: 'hidden',
										textDecoration: 'none',
										position: 'relative',
									}}
									onMouseEnter={() => setHoveredProduct(prod.id)}
									onMouseLeave={() => setHoveredProduct(null)}
								>
									<img
										src={prod.image}
										alt={prod.name}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											transition: 'transform .6s var(--ease-out)',
											transform: hoveredProduct === prod.id ? 'scale(1.05)' : 'scale(1)',
										}}
									/>
									{prod.badge && (
										<span style={{
											position: 'absolute',
											top: 12,
											left: 12,
											fontSize: 9,
											fontWeight: 700,
											letterSpacing: '.1em',
											textTransform: 'uppercase',
											background: '#000',
											color: '#fff',
											padding: '4px 10px',
										}}>
											{prod.badge}
										</span>
									)}
								</Link>
								<Link to={`/products/${prod.id}`} style={{
									fontSize: 'clamp(14px, 2.5vw, 16px)',
									fontWeight: 500,
									color: '#000',
									textDecoration: 'none',
									display: 'block',
									marginBottom: 6,
								}}>
									{prod.name}
								</Link>
								<div style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(16px, 2.5vw, 20px)',
									fontWeight: 400,
									color: '#000',
								}}>
									₹{prod.price.toLocaleString('en-IN')}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== WHY BWR — 6 PRINCIPLES ===== */}
			<section
				data-dark
				style={{
					padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)',
					background: '#000',
				}}
			>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700,
						letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
					}}
						className='reveal d0'
					>
						Why BWR
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 44px)',
							fontWeight: 400,
							color: '#fff',
							marginBottom: 'clamp(40px, 6vw, 60px)',
							maxWidth: 600,
						}}
					>
						Six Non-Negotiable Principles
					</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 'clamp(24px, 4vw, 48px)',
						}}
						className='grid-col-3'
					>
						{[
							{ icon: '◆', title: 'Premium Only', desc: 'No cheap prints. Every object passes a 12-point quality check before shipping.' },
							{ icon: '◉', title: 'Made to Order', desc: 'Each piece is printed fresh for you. No warehouse stock, no mass production.' },
							{ icon: '▲', title: 'Indian Design', desc: 'Every product celebrates Indian aesthetics — from Ganesha to geometric rangoli.' },
							{ icon: '■', title: 'Precision Engineering', desc: 'Bambu Lab P1S @ 0.05mm resolution. Automotive-grade finishes.' },
							{ icon: '●', title: 'Personal Touch', desc: 'Custom names, dates, messages. Every object tells your story.' },
							{ icon: '★', title: 'Gift-Ready', desc: 'Premium packaging, handwritten notes. Ready to gift straight from the box.' },
						].map((item, i) => (
							<div key={i} className={`reveal d${i % 3}`}>
								<div style={{ fontSize: 20, marginBottom: 16, color: 'rgba(255,255,255,0.3)' }}>
									{item.icon}
								</div>
								<h3 style={{
									fontSize: 'clamp(14px, 2vw, 16px)',
									fontWeight: 600,
									color: '#fff',
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

			{/* ===== TESTIMONIALS ===== */}
			<section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)', background: '#fafafa' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)',
						fontWeight: 700,
						letterSpacing: '.16em',
						textTransform: 'uppercase',
						color: 'rgba(0,0,0,0.3)',
						marginBottom: 'clamp(16px, 3vw, 24px)',
						textAlign: 'center',
					}}
						className='reveal d0'
					>
						What People Say
					</div>
					<h2
						className='reveal d1'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 44px)',
							fontWeight: 400,
							color: '#000',
							textAlign: 'center',
							marginBottom: 'clamp(40px, 6vw, 60px)',
						}}
					>
						Loved by Families Across India
					</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 'clamp(16px, 4vw, 32px)',
						}}
						className='grid-col-3'
					>
						{[
							{
								name: 'Priya Sharma',
								location: 'Mumbai',
								text: 'The nameplate for our new home is absolutely stunning. The metallic finish is premium and the font is exactly what we wanted. Everyone who visits compliments it!',
								product: 'Premium Architectural Nameplate',
								rating: 5,
							},
							{
								name: 'Arjun Reddy',
								location: 'Hyderabad',
								text: 'Ordered the Ganesha sculpture for Diwali gifting. The quality is unreal — you can\'t tell it\'s 3D printed. My mother was emotional when she received it.',
								product: 'Contemporary Ganesha Sculpture',
								rating: 5,
							},
							{
								name: 'Meera Krishnan',
								location: 'Chennai',
								text: 'Got the milestone plaque for my daughter\'s first birthday. The pastel colors and gold accents are beautiful. It\'s now the centerpiece of her nursery.',
								product: 'Birth Stats Milestone Plaque',
								rating: 5,
							},
						].map((t, i) => (
							<div
								key={i}
								className={`reveal d${i}`}
								style={{
									padding: 'clamp(24px, 3vw, 32px)',
									background: '#fff',
									border: '1px solid rgba(0,0,0,0.06)',
								}}
							>
								<div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
									{Array(t.rating).fill(0).map((_, j) => (
										<span key={j} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
									))}
								</div>
								<p style={{
									fontSize: 'clamp(13px, 2vw, 15px)',
									fontWeight: 300,
									color: 'rgba(0,0,0,0.7)',
									lineHeight: 1.7,
									marginBottom: 20,
									fontStyle: 'italic',
								}}>
									"{t.text}"
								</p>
								<div style={{
									borderTop: '1px solid rgba(0,0,0,0.06)',
									paddingTop: 16,
								}}>
									<div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>{t.name}</div>
									<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginBottom: 4 }}>{t.location}</div>
									<div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.3)', letterSpacing: '.03em' }}>
										Purchased: {t.product}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== CTA SECTION ===== */}
			<section
				data-dark
				style={{
					padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)',
					background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
					textAlign: 'center',
				}}
			>
				<div style={{ maxWidth: 700, margin: '0 auto' }}>
					<h2
						className='reveal d0'
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 5vw, 48px)',
							fontWeight: 400,
							color: '#fff',
							marginBottom: 'clamp(16px, 3vw, 20px)',
						}}
					>
						Ready to Create Something Meaningful?
					</h2>
					<p
						className='reveal d1'
						style={{
							fontSize: 'clamp(14px, 2vw, 16px)',
							fontWeight: 300,
							color: 'rgba(255,255,255,0.5)',
							lineHeight: 1.7,
							marginBottom: 'clamp(28px, 5vw, 40px)',
						}}
					>
						Every BWR object is made to order, customized to your story.
						From nameplates to wedding gifts — precision-crafted in Bengaluru.
					</p>
					<div className='reveal d2' style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
						<Link to='/products' className='btn btn-white' data-clickable>
							Shop Now →
						</Link>
						<Link to='/contact' className='btn btn-ghost' data-clickable>
							Custom Order
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
