import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PRODUCTS } from '../utils/products';
import { useCart } from '../contexts/CartContext';
import { Footer } from '../components/common/Footer';
import PageMeta, { productJsonLd } from '../components/common/PageMeta';

// Demo reviews data
const DEMO_REVIEWS_KEY = 'bwr3d_reviews';
const getReviews = (productId) => {
	try {
		const all = JSON.parse(localStorage.getItem(DEMO_REVIEWS_KEY) || '{}');
		return all[productId] || [];
	} catch { return []; }
};
const saveReview = (productId, review) => {
	const all = JSON.parse(localStorage.getItem(DEMO_REVIEWS_KEY) || '{}');
	if (!all[productId]) all[productId] = [];
	all[productId].unshift(review);
	localStorage.setItem(DEMO_REVIEWS_KEY, JSON.stringify(all));
};

// Pre-seeded reviews
const SEED_REVIEWS = {
	1: [
		{ name: 'Priya Sharma', rating: 5, text: 'Absolutely stunning nameplate! The gold accent finish is gorgeous. Delivery was on time.', date: '2024-12-15' },
		{ name: 'Rajesh K', rating: 4, text: 'Great quality, but took a week longer than expected. Still, very happy with the result.', date: '2024-11-28' },
	],
	3: [
		{ name: 'Ananya Patel', rating: 5, text: 'The Ganesha sculpture is breathtaking. Perfect for our puja room. Exceptional craftsmanship.', date: '2025-01-10' },
	],
	5: [
		{ name: 'Meera & Arjun', rating: 5, text: 'We received this as a wedding gift. The rose gold finish is stunning. A true heirloom piece.', date: '2025-02-01' },
	],
};

export default function ProductDetail({ addToCart }) {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isInWishlist, toggleWishlist } = useCart();
	const prod = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
	const [qty, setQty] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState(prod.variants ? prod.variants[0] : null);
	const [activeTab, setActiveTab] = useState('specs');
	const [activeImage, setActiveImage] = useState(0);
	const galleryImages = prod.images || [prod.image];
	const [reviews, setReviews] = useState(() => {
		const saved = getReviews(prod.id);
		return saved.length > 0 ? saved : (SEED_REVIEWS[prod.id] || []);
	});
	const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
	const [reviewSubmitted, setReviewSubmitted] = useState(false);

	const currentPrice = selectedVariant ? selectedVariant.price : prod.price;
	const avgRating = reviews.length > 0
		? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
		: null;

	const whatsAppMsg = encodeURIComponent(
		`Hi! I'm interested in ordering "${prod.name}"${selectedVariant ? ` (${selectedVariant.name})` : ''} — ₹${currentPrice.toLocaleString('en-IN')}. Can you help?`
	);

	const handleReviewSubmit = (e) => {
		e.preventDefault();
		const newReview = { ...reviewForm, date: new Date().toISOString().split('T')[0] };
		saveReview(prod.id, newReview);
		setReviews([newReview, ...reviews]);
		setReviewForm({ name: '', rating: 5, text: '' });
		setReviewSubmitted(true);
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<PageMeta
				title={prod.name}
				description={prod.desc.substring(0, 155)}
				jsonLd={productJsonLd(prod)}
			/>
			<section style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 1400, margin: '0 auto', marginBottom: 'clamp(16px, 3vw, 28px)' }}>
					<Link to='/products' data-clickable style={{
						fontSize: 'clamp(11px, 1.5vw, 12px)', color: 'rgba(0,0,0,0.5)',
						letterSpacing: '.05em', textTransform: 'uppercase', textDecoration: 'none',
					}}>
						← Collection
					</Link>
				</div>

				<div style={{
					maxWidth: 1400, margin: '0 auto', display: 'grid',
					gridTemplateColumns: '1fr', gap: 'clamp(24px, 6vw, 60px)',
				}} className='grid-col-2'>
					{/* Product Image Gallery */}
					<div>
						{/* Main image */}
						<div style={{
							height: 'clamp(300px, 60vw, 600px)', background: '#f7f7f7',
							borderRadius: 4, overflow: 'hidden', position: 'relative',
							display: 'flex', alignItems: 'center', justifyContent: 'center',
						}}>
							<img src={galleryImages[activeImage]} alt={`${prod.name} - Image ${activeImage + 1}`} style={{
								width: '100%', height: '100%', objectFit: 'contain',
								transition: 'opacity .3s ease',
							}} />
							{prod.badge && (
								<span style={{
									position: 'absolute', top: 16, left: 16,
									fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
									textTransform: 'uppercase', background: '#000', color: '#fff', padding: '6px 14px',
								}}>{prod.badge}</span>
							)}
							{/* Wishlist button */}
							<button onClick={() => toggleWishlist(prod.id)} style={{
								position: 'absolute', top: 16, right: 16,
								width: 40, height: 40, borderRadius: '50%',
								background: 'rgba(255,255,255,0.9)', border: 'none',
								cursor: 'pointer', fontSize: 18, display: 'flex',
								alignItems: 'center', justifyContent: 'center',
								boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform .2s',
							}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
							   onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
							   aria-label="Toggle wishlist">
								{isInWishlist(prod.id) ? '❤️' : '🤍'}
							</button>

							{/* Prev / Next arrows */}
							{galleryImages.length > 1 && (
								<>
									<button onClick={() => setActiveImage((activeImage - 1 + galleryImages.length) % galleryImages.length)}
										style={{
											position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
											width: 36, height: 36, borderRadius: '50%', border: 'none',
											background: 'rgba(255,255,255,0.85)', cursor: 'pointer',
											fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
											boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'opacity .2s',
										}} aria-label="Previous image">
										←
									</button>
									<button onClick={() => setActiveImage((activeImage + 1) % galleryImages.length)}
										style={{
											position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
											width: 36, height: 36, borderRadius: '50%', border: 'none',
											background: 'rgba(255,255,255,0.85)', cursor: 'pointer',
											fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
											boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'opacity .2s',
										}} aria-label="Next image">
										→
									</button>
								</>
							)}

							{/* Image counter */}
							{galleryImages.length > 1 && (
								<div style={{
									position: 'absolute', bottom: 12, right: 12,
									background: 'rgba(0,0,0,0.6)', color: '#fff',
									fontSize: 11, fontWeight: 600, padding: '4px 10px',
									borderRadius: 12,
								}}>
									{activeImage + 1} / {galleryImages.length}
								</div>
							)}
						</div>

						{/* Thumbnail strip */}
						{galleryImages.length > 1 && (
							<div style={{
								display: 'flex', gap: 8, marginTop: 12,
								overflowX: 'auto', paddingBottom: 4,
							}}>
								{galleryImages.map((img, i) => (
									<button key={i} onClick={() => setActiveImage(i)}
										style={{
											width: 72, height: 72, flexShrink: 0,
											borderRadius: 4, overflow: 'hidden',
											border: activeImage === i ? '2px solid #000' : '2px solid transparent',
											cursor: 'pointer', padding: 0,
											opacity: activeImage === i ? 1 : 0.5,
											transition: 'all .2s',
											background: 'none',
										}} aria-label={`View image ${i + 1}`}>
										<img src={img} alt={`${prod.name} thumbnail ${i + 1}`} style={{
											width: '100%', height: '100%', objectFit: 'cover',
										}} />
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
							<h1 style={{
								fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)',
								fontWeight: 400, color: '#000',
							}}>{prod.name}</h1>
						</div>

						{/* Rating */}
						{avgRating && (
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
								<span style={{ color: '#f59e0b', fontSize: 16 }}>
									{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
								</span>
								<span style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
									{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
								</span>
							</div>
						)}

						<div style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', color: 'rgba(0,0,0,0.4)', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
							{prod.priceRange}
						</div>

						<div style={{
							fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)',
							fontWeight: 400, marginBottom: 'clamp(16px, 3vw, 24px)', color: '#000',
						}}>₹{currentPrice.toLocaleString('en-IN')}</div>

						<p style={{
							fontSize: 'clamp(13px, 2vw, 15px)', fontWeight: 300, color: 'rgba(0,0,0,0.6)',
							lineHeight: 1.8, marginBottom: 'clamp(20px, 3vw, 28px)',
						}}>{prod.desc}</p>

						{/* Variants */}
						{prod.variants && prod.variants.length > 0 && (
							<div style={{ marginBottom: 'clamp(20px, 3vw, 28px)' }}>
								<div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12, color: 'rgba(0,0,0,0.4)' }}>Options</div>
								<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
									{prod.variants.map((v, i) => (
										<button key={i} data-clickable onClick={() => setSelectedVariant(v)} style={{
											padding: '8px 16px',
											border: selectedVariant?.name === v.name ? '2px solid #000' : '1px solid #ddd',
											background: selectedVariant?.name === v.name ? '#000' : '#fff',
											color: selectedVariant?.name === v.name ? '#fff' : '#000',
											cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all .2s', borderRadius: 2,
										}}>
											{v.name} — ₹{v.price.toLocaleString('en-IN')}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Tabs: Specs / Reviews */}
						<div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #eee', marginBottom: 20 }}>
							{['specs', 'reviews'].map(tab => (
								<button key={tab} onClick={() => setActiveTab(tab)} style={{
									padding: '12px 24px', background: 'none', border: 'none',
									borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
									fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
									color: activeTab === tab ? '#000' : 'rgba(0,0,0,0.3)', cursor: 'pointer',
									marginBottom: -2, transition: 'color .2s',
								}}>
									{tab === 'reviews' ? `Reviews (${reviews.length})` : 'Specifications'}
								</button>
							))}
						</div>

						{/* Specs Tab */}
						{activeTab === 'specs' && (
							<div style={{ marginBottom: 32 }}>
								<div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 0, borderTop: '1px solid #eee' }}>
									{prod.specs.map((spec, i) => (
										<div key={i} style={{ display: 'contents' }}>
											<div style={{ padding: '12px 0', fontWeight: 600, fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>{spec[0]}</div>
											<div style={{ padding: '12px 20px', fontSize: 14, color: '#000', borderLeft: '1px solid #eee' }}>{spec[1]}</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Reviews Tab */}
						{activeTab === 'reviews' && (
							<div style={{ marginBottom: 32 }}>
								{reviews.length > 0 ? (
									<div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
										{reviews.map((r, i) => (
											<div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5' }}>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
													<div>
														<span style={{ fontWeight: 600, fontSize: 14, marginRight: 8 }}>{r.name}</span>
														<span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
													</div>
													<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)' }}>{r.date}</span>
												</div>
												<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.6)', lineHeight: 1.6 }}>{r.text}</p>
											</div>
										))}
									</div>
								) : (
									<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 24 }}>No reviews yet. Be the first!</p>
								)}

								{/* Add Review Form */}
								{!reviewSubmitted ? (
									<form onSubmit={handleReviewSubmit} style={{ background: '#fafafa', padding: 20, borderRadius: 4 }}>
										<div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Write a Review</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
											<input required placeholder="Your name" value={reviewForm.name}
												onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
												style={{ padding: '10px 14px', border: '1px solid #ddd', fontSize: 14, fontFamily: 'inherit', borderRadius: 2, outline: 'none' }} />
											<select value={reviewForm.rating}
												onChange={e => setReviewForm(f => ({ ...f, rating: +e.target.value }))}
												style={{ padding: '10px 14px', border: '1px solid #ddd', fontSize: 14, fontFamily: 'inherit', borderRadius: 2, cursor: 'pointer' }}>
												<option value={5}>★★★★★ Excellent</option>
												<option value={4}>★★★★☆ Good</option>
												<option value={3}>★★★☆☆ Average</option>
												<option value={2}>★★☆☆☆ Poor</option>
												<option value={1}>★☆☆☆☆ Bad</option>
											</select>
										</div>
										<textarea required placeholder="Your review..." value={reviewForm.text}
											onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
											style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: 14, fontFamily: 'inherit', borderRadius: 2, outline: 'none', minHeight: 80, resize: 'vertical', marginBottom: 12 }} />
										<button type="submit" className='btn btn-dark' style={{ fontSize: 12, padding: '10px 24px' }}>
											Submit Review
										</button>
									</form>
								) : (
									<div style={{ background: '#d1fae5', padding: 16, borderRadius: 4, fontSize: 14, color: '#059669', fontWeight: 500 }}>
										✓ Thank you! Your review has been submitted.
									</div>
								)}
							</div>
						)}

						{/* Quantity + Add to Cart */}
						<div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
							<div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd' }}>
								<button data-clickable onClick={() => setQty(Math.max(1, qty - 1))} style={{
									padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
								}}>−</button>
								<div style={{ padding: '0 20px', minWidth: 40, textAlign: 'center' }}>{qty}</div>
								<button data-clickable onClick={() => setQty(qty + 1)} style={{
									padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
								}}>+</button>
							</div>
							<button data-clickable onClick={() => {
								addToCart({
									id: prod.id,
									name: prod.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
									variant: selectedVariant?.name,
									price: currentPrice, qty,
								});
								setQty(1);
							}} className='btn btn-dark' style={{ flex: 1 }}>
								Add to Cart — ₹{(currentPrice * qty).toLocaleString('en-IN')}
							</button>
						</div>

						{/* Buy Now */}
						<button data-clickable onClick={() => {
							addToCart({
								id: prod.id,
								name: prod.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
								variant: selectedVariant?.name,
								price: currentPrice, qty,
							});
							navigate('/checkout');
						}} className='btn btn-outline-dark' style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
							Buy Now →
						</button>

						{/* WhatsApp Order Button */}
						<a
							href={`https://wa.me/918041417722?text=${whatsAppMsg}`}
							target="_blank" rel="noopener noreferrer"
							style={{
								display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
								width: '100%', padding: '14px', background: '#25D366', color: '#fff',
								border: 'none', borderRadius: 2, fontSize: 14, fontWeight: 600,
								textDecoration: 'none', transition: 'opacity .2s', marginBottom: 16,
							}}
							onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
							onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
								<path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.637-1.467A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.586-5.934-1.608l-.425-.253-2.75.87.884-2.682-.277-.44A9.774 9.774 0 012.182 12 9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z"/>
							</svg>
							Order via WhatsApp
						</a>

						<Link to='/products' data-clickable style={{
							display: 'block', width: '100%', background: 'rgba(0,0,0,0.04)',
							border: '1px solid rgba(0,0,0,0.1)', fontSize: 'clamp(12px, 2vw, 13px)',
							color: '#000', padding: 'clamp(12px, 2vw, 16px)', fontWeight: 500,
							transition: 'all .2s', textAlign: 'center', textDecoration: 'none',
						}} onMouseEnter={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}
						   onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.04)'; e.target.style.color = '#000'; }}>
							← Back to Collection
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
