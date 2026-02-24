import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PRODUCTS, CATEGORIES } from '../utils/products';
import { useCart } from '../contexts/CartContext';
import { Footer } from '../components/common/Footer';
import PageMeta from '../components/common/PageMeta';

export default function Products({ addToCart }) {
	useScrollReveal();
	const { isInWishlist, toggleWishlist } = useCart();
	const [category, setCategory] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [hoveredId, setHoveredId] = useState(null);

	// Filter by category and search
	const filtered = useMemo(() => {
		let results = category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === category);
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			results = results.filter((p) =>
				p.name.toLowerCase().includes(q) ||
				p.desc.toLowerCase().includes(q) ||
				p.cat.toLowerCase().includes(q)
			);
		}
		return results;
	}, [category, searchQuery]);

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<PageMeta
				title="Collection"
				description="Premium 3D printed objects — nameplates, sculptures, gifts. Handcrafted in Bengaluru."
			/>
			<section className='responsive-section-padding'>
				<div style={{ maxWidth: 1400, margin: '0 auto' }}>
					<Link to='/' data-clickable style={{
						fontSize: 'clamp(11px, 1.5vw, 12px)', color: 'rgba(0,0,0,0.5)',
						letterSpacing: '.05em', textTransform: 'uppercase', textDecoration: 'none',
						marginBottom: 'clamp(24px, 4vw, 40px)', display: 'inline-block',
					}}>
						← Home
					</Link>

					<h1 style={{
						fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 56px)',
						fontWeight: 400, marginBottom: 'clamp(8px, 2vw, 12px)', color: '#000',
					}}>
						Collection
					</h1>
					<p style={{
						fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 300, color: 'rgba(0,0,0,0.5)',
						marginBottom: 'clamp(24px, 4vw, 40px)', maxWidth: 500,
					}}>
						Premium 3D printed objects crafted with precision in Bengaluru.
						Each piece is made to order with your personal touch.
					</p>

					{/* Search Bar */}
					<div style={{ marginBottom: 'clamp(20px, 3vw, 28px)', maxWidth: 400 }}>
						<div style={{ position: 'relative' }}>
							<span style={{
								position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
								fontSize: 16, color: 'rgba(0,0,0,0.3)', pointerEvents: 'none',
							}}>🔍</span>
							<input
								type="text"
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								style={{
									width: '100%', padding: '12px 16px 12px 40px',
									border: '1px solid #eee', fontSize: 14, fontFamily: 'inherit',
									borderRadius: 4, outline: 'none', transition: 'border-color .2s',
									background: '#fafafa',
								}}
								onFocus={(e) => { e.target.style.borderColor = '#000'; e.target.style.background = '#fff'; }}
								onBlur={(e) => { e.target.style.borderColor = '#eee'; e.target.style.background = '#fafafa'; }}
							/>
						</div>
					</div>

					{/* Category filters */}
					<div style={{
						display: 'flex', gap: 'clamp(6px, 1.5vw, 12px)',
						marginBottom: 'clamp(32px, 6vw, 60px)', flexWrap: 'wrap',
					}}>
						{CATEGORIES.map((cat) => (
							<button key={cat} data-clickable onClick={() => setCategory(cat)} style={{
								padding: 'clamp(8px, 1vw, 10px) clamp(14px, 2vw, 20px)',
								background: category === cat ? '#000' : '#f7f7f7',
								color: category === cat ? '#fff' : '#000',
								border: 'none', cursor: 'pointer',
								fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600,
								letterSpacing: '.05em', textTransform: 'capitalize',
								transition: 'all .2s', borderRadius: 2,
							}}>
								{cat}
							</button>
						))}
					</div>

					{/* Results count */}
					{searchQuery && (
						<div style={{ marginBottom: 20, fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>
							{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
						</div>
					)}

					{/* Product grid */}
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 4vw, 40px)' }} className='grid-col-3'>
						{filtered.map((prod, i) => (
							<div key={prod.id} className={`reveal d${i % 3}`}>
								<Link to={`/products/${prod.slug}`} style={{
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									height: 'clamp(250px, 50vw, 380px)',
									marginBottom: 'clamp(12px, 3vw, 20px)', borderRadius: 4,
									overflow: 'hidden', textDecoration: 'none', position: 'relative',
									background: '#f7f7f7',
								}} onMouseEnter={() => setHoveredId(prod.id)} onMouseLeave={() => setHoveredId(null)}>
									<img src={prod.image} alt={prod.name} style={{
										width: '100%', height: '100%', objectFit: 'contain',
										transition: 'transform .6s var(--ease-out)',
										transform: hoveredId === prod.id ? 'scale(1.05)' : 'scale(1)',
									}} />
									{prod.badge && (
										<span style={{
											position: 'absolute', top: 12, left: 12,
											fontSize: 9, fontWeight: 700, letterSpacing: '.1em',
											textTransform: 'uppercase', background: '#000', color: '#fff', padding: '4px 10px',
										}}>
											{prod.badge}
										</span>
									)}
									{/* Stock indicator */}
									{prod.stock <= 10 && (
										<span style={{
											position: 'absolute', bottom: 12, left: 12,
											fontSize: 10, fontWeight: 600, background: '#fef3c7',
											color: '#d97706', padding: '3px 8px', borderRadius: 2,
										}}>
											Only {prod.stock} left
										</span>
									)}
								</Link>

								{/* Product info row */}
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
									<div style={{ flex: 1 }}>
										<Link to={`/products/${prod.slug}`} style={{
											fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 500,
											marginBottom: 'clamp(4px, 1vw, 6px)', color: '#000',
											textDecoration: 'none', display: 'block',
										}}>
											{prod.name}
										</Link>
										<div style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: 'rgba(0,0,0,0.4)', marginBottom: 8 }}>
											{prod.priceRange}
										</div>
									</div>
									{/* Wishlist heart */}
									<button
										onClick={(e) => { e.preventDefault(); toggleWishlist(prod.id); }}
										style={{
											background: 'none', border: 'none', cursor: 'pointer',
											fontSize: 20, padding: '4px 8px', transition: 'transform .2s',
											color: isInWishlist(prod.id) ? '#dc2626' : 'rgba(0,0,0,0.15)',
										}}
										onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
										onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
										aria-label={isInWishlist(prod.id) ? 'Remove from wishlist' : 'Add to wishlist'}
									>
										{isInWishlist(prod.id) ? '❤️' : '🤍'}
									</button>
								</div>

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div style={{
										fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 22px)',
										fontWeight: 400, color: '#000',
									}}>
										₹{prod.price.toLocaleString('en-IN')}
									</div>
									<button data-clickable onClick={() => addToCart({
										id: prod.id, name: prod.name, price: prod.price,
									})} style={{
										padding: 'clamp(6px, 1vw, 8px) clamp(12px, 1.5vw, 16px)',
										background: '#000', color: '#fff', border: 'none', cursor: 'pointer',
										fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: 600, transition: 'transform .2s',
									}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
									   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
										Add to Cart
									</button>
								</div>
							</div>
						))}
					</div>

					{/* No results */}
					{filtered.length === 0 && (
						<div style={{ textAlign: 'center', padding: '60px 20px' }}>
							<div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
							<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }}>
								No products found{searchQuery ? ` for "${searchQuery}"` : ' in this category'}
							</p>
							<button onClick={() => { setSearchQuery(''); setCategory('all'); }} className='btn btn-outline-dark'
								style={{ marginTop: 20, fontSize: 13, padding: '10px 24px' }}>
								View All Products
							</button>
						</div>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
}
