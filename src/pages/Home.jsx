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
			{/* ===== HERO SECTION — Split White/Black Premium Design ===== */}

			{/* ── WHITE UPPER: Text Content ── */}
			<section
				style={{
					position: 'relative',
					background: '#fafafa',
					paddingTop: 'clamp(160px, 18vw, 200px)',
					paddingBottom: 'clamp(60px, 8vw, 100px)',
					paddingLeft: 'clamp(24px, 6vw, 80px)',
					paddingRight: 'clamp(24px, 6vw, 80px)',
					overflow: 'hidden',
				}}
			>
				{/* Subtle grid pattern for texture */}
				<div style={{
					position: 'absolute', inset: 0, opacity: 0.03,
					backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
					backgroundSize: '24px 24px',
					pointerEvents: 'none',
				}} />

				<div style={{
					position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto',
					display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'end',
				}} className='grid-col-2'>
					{/* Left: Headline */}
					<div>
						{/* Subtitle */}
						<div
							className='reveal d0'
							style={{
								display: 'flex', alignItems: 'center', gap: 16,
								marginBottom: 'clamp(20px, 3vw, 32px)',
							}}
						>
							<div style={{ width: 40, height: 1, background: 'var(--gold)' }} />
							<span style={{
								fontSize: 'clamp(10px, 1vw, 11px)',
								fontWeight: 600, letterSpacing: '.25em',
								textTransform: 'uppercase', color: 'var(--gold-dark, #8B7355)',
							}}>
								EST. 2024 — Precision Objects
							</span>
						</div>

						<h1
							className='reveal d1'
							style={{
								fontFamily: "'Cormorant Garamond', Georgia, serif",
								fontSize: 'clamp(48px, 9vw, 100px)',
								fontWeight: 300,
								letterSpacing: '-0.03em',
								lineHeight: 1.0,
								color: '#1a1a1a',
								marginBottom: 0,
							}}
						>
							Where<br />
							<span style={{
								fontWeight: 600,
								background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}>Rebellion</span><br />
							<em style={{
								fontStyle: 'italic',
								color: 'rgba(0,0,0,0.3)',
								fontWeight: 300,
							}}>Meets<br />Precision.</em>
						</h1>
					</div>

					{/* Right: Description + CTAs */}
					<div style={{ paddingBottom: 'clamp(8px, 2vw, 20px)' }}>
						<p
							className='reveal d2'
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 'clamp(14px, 1.6vw, 17px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.5)',
								lineHeight: 1.8,
								maxWidth: 380,
								marginBottom: 'clamp(28px, 4vw, 40px)',
							}}
						>
							3D printed objects engineered to outlast trends.
							Every layer calculated. Every surface earned.
						</p>
						<div className='reveal d3' style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
							<Link to='/products' data-clickable style={{
								display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
								padding: '14px 36px',
								background: '#1a1a1a', color: '#fff',
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 'clamp(11px, 1.2vw, 13px)',
								fontWeight: 500, letterSpacing: '0.1em',
								textTransform: 'uppercase', textDecoration: 'none',
								border: 'none', cursor: 'pointer',
								transition: 'all 0.3s ease',
							}}>
								Explore Collection
							</Link>
							<Link to='/products/premium-architectural-nameplate' data-clickable style={{
								display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
								padding: '14px 36px',
								background: 'transparent', color: '#1a1a1a',
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 'clamp(11px, 1.2vw, 13px)',
								fontWeight: 500, letterSpacing: '0.1em',
								textTransform: 'uppercase', textDecoration: 'none',
								border: '1px solid rgba(0,0,0,0.2)', cursor: 'pointer',
								transition: 'all 0.3s ease',
							}}>
								Featured Drop
							</Link>
						</div>
					</div>
				</div>

				{/* Diagonal slice transition to black */}
				<div style={{
					position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
					background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
					pointerEvents: 'none',
				}} />
			</section>

			{/* ── BLACK LOWER: 3D Car Showcase ── */}
			<section
				data-dark
				style={{
					position: 'relative',
					background: '#0a0a0a',
					padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)',
					overflow: 'hidden',
				}}
			>
				<div style={{
					maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2,
				}}>
					<div style={{
						height: 'clamp(350px, 55vw, 600px)',
						position: 'relative',
					}}>
						<AnimatedCarViewer
							modelPath='/assets/models/McLaren_F1.glb'
							style={{ width: '100%', height: '100%' }}
						/>
						{/* Drag hint */}
						<div style={{
							position: 'absolute', bottom: 20, right: 20,
							display: 'flex', alignItems: 'center', gap: 10,
						}}>
							<span style={{
								fontSize: 10, fontWeight: 600, letterSpacing: '.15em',
								textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
							}}>
								Drag to Rotate
							</span>
							<div style={{
								width: 28, height: 28, borderRadius: '50%',
								border: '1px solid rgba(255,255,255,0.15)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								fontSize: 12, color: 'rgba(255,255,255,0.25)',
							}}>
								↻
							</div>
						</div>
					</div>

					{/* Scroll hint */}
					<div className='reveal d4' style={{
						marginTop: 'clamp(24px, 3vw, 40px)',
						display: 'flex', alignItems: 'center', gap: 12,
						justifyContent: 'center',
					}}>
						<div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.12)' }} />
						<span style={{
							fontSize: 10, fontWeight: 600, letterSpacing: '.2em',
							textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
						}}>
							Scroll to Discover
						</span>
						<div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.12)' }} />
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
									to={`/products/${prod.slug}`}
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
								<Link to={`/products/${prod.slug}`} style={{
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
						color: 'var(--gold)',
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

			{/* ===== THE BWR PROCESS ===== */}
			<section data-dark style={{
				padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)',
				background: '#0a0a0a', color: '#fff', position: 'relative', overflow: 'hidden',
			}}>
				{/* Decorative gold line */}
				<div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 60, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div className='reveal d0' style={{
						fontSize: 'clamp(9px, 1.2vw, 11px)', fontWeight: 700,
						letterSpacing: '.2em', textTransform: 'uppercase',
						color: 'var(--gold)', textAlign: 'center',
						marginBottom: 'clamp(12px, 3vw, 20px)',
					}}>Our Process</div>
					<h2 className='reveal d1' style={{
						fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)',
						fontWeight: 400, color: '#fff', textAlign: 'center',
						marginBottom: 'clamp(50px, 8vw, 80px)',
					}}>From Vision to Object</h2>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(20px, 4vw, 40px)', position: 'relative' }} className='grid-col-2'>
						{/* Connecting line */}
						<div className='desktop-only' style={{
							position: 'absolute', top: 32, left: '12.5%', right: '12.5%',
							height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), var(--gold), transparent)',
							opacity: 0.3,
						}} />
						{[
							{ num: '01', title: 'Design', desc: 'Every object starts with a conversation. We translate your vision into precision CAD models, iterating until every detail is perfect.' },
							{ num: '02', title: 'Engineer', desc: 'Structural analysis, material selection, and layer optimization. We engineer for beauty and longevity — 0.04mm precision.' },
							{ num: '03', title: 'Craft', desc: 'Multi-day prints on professional-grade machines. Each layer is monitored. Hand-finishing, coating, and quality inspection follow.' },
							{ num: '04', title: 'Deliver', desc: 'Premium packaging with your personalized message. Insured shipping across India. Unboxing designed to feel special.' },
						].map((step, i) => (
							<div key={i} className={`reveal d${i}`} style={{ textAlign: 'center' }}>
								{/* Number circle */}
								<div style={{
									width: 64, height: 64, borderRadius: '50%',
									border: '1.5px solid var(--gold)', margin: '0 auto clamp(16px, 3vw, 24px)',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									background: 'rgba(201,169,110,0.06)',
									transition: 'all .4s var(--ease-out)',
								}}>
									<span style={{
										fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 2vw, 22px)',
										fontWeight: 400, color: 'var(--gold)',
									}}>{step.num}</span>
								</div>
								<h3 style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 400,
									color: '#fff', marginBottom: 12,
								}}>{step.title}</h3>
								<p style={{
									fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 300,
									lineHeight: 1.7, color: 'rgba(255,255,255,0.4)',
									maxWidth: 260, margin: '0 auto',
								}}>{step.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
