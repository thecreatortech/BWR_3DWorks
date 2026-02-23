import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PRODUCTS } from '../utils/products';
import { Footer } from '../components/common/Footer';

export default function ProductDetail({ addToCart }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const prod = PRODUCTS.find((p) => String(p.id) === id) || PRODUCTS[0];
	const [qty, setQty] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState(
		prod.variants ? prod.variants[0] : null
	);

	const currentPrice = selectedVariant ? selectedVariant.price : prod.price;

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)' }}>
				<div
					style={{
						maxWidth: 1400,
						margin: '0 auto',
						marginBottom: 'clamp(16px, 3vw, 28px)',
					}}
				>
					<Link
						to='/products'
						data-clickable
						style={{
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)',
							letterSpacing: '.05em',
							textTransform: 'uppercase',
							textDecoration: 'none',
						}}
					>
						← Collection
					</Link>
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
					{/* Product Image */}
					<div
						style={{
							height: 'clamp(300px, 60vw, 600px)',
							background: '#f7f7f7',
							borderRadius: 4,
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						<img
							src={prod.image}
							alt={prod.name}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
						{prod.badge && (
							<span style={{
								position: 'absolute',
								top: 16,
								left: 16,
								fontSize: 10,
								fontWeight: 700,
								letterSpacing: '.1em',
								textTransform: 'uppercase',
								background: '#000',
								color: '#fff',
								padding: '6px 14px',
							}}>
								{prod.badge}
							</span>
						)}
					</div>

					{/* Product Info */}
					<div>
						<h1
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 44px)',
								fontWeight: 400,
								marginBottom: 'clamp(8px, 2vw, 12px)',
								color: '#000',
							}}
						>
							{prod.name}
						</h1>

						<div style={{
							fontSize: 'clamp(12px, 1.5vw, 14px)',
							color: 'rgba(0,0,0,0.4)',
							marginBottom: 'clamp(12px, 2vw, 16px)',
						}}>
							{prod.priceRange}
						</div>

						<div
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(24px, 4vw, 36px)',
								fontWeight: 400,
								marginBottom: 'clamp(16px, 3vw, 24px)',
								color: '#000',
							}}
						>
							₹{currentPrice.toLocaleString('en-IN')}
						</div>

						<p
							style={{
								fontSize: 'clamp(13px, 2vw, 15px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.6)',
								lineHeight: 1.8,
								marginBottom: 'clamp(20px, 3vw, 28px)',
							}}
						>
							{prod.desc}
						</p>

						{/* Variants */}
						{prod.variants && prod.variants.length > 0 && (
							<div style={{ marginBottom: 'clamp(20px, 3vw, 28px)' }}>
								<div style={{
									fontSize: 11,
									fontWeight: 700,
									letterSpacing: '.1em',
									textTransform: 'uppercase',
									marginBottom: 12,
									color: 'rgba(0,0,0,0.4)',
								}}>
									Options
								</div>
								<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
									{prod.variants.map((v, i) => (
										<button
											key={i}
											data-clickable
											onClick={() => setSelectedVariant(v)}
											style={{
												padding: '8px 16px',
												border: selectedVariant?.name === v.name ? '2px solid #000' : '1px solid #ddd',
												background: selectedVariant?.name === v.name ? '#000' : '#fff',
												color: selectedVariant?.name === v.name ? '#fff' : '#000',
												cursor: 'pointer',
												fontSize: 12,
												fontWeight: 500,
												transition: 'all .2s',
												borderRadius: 2,
											}}
										>
											{v.name} — ₹{v.price.toLocaleString('en-IN')}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Specifications */}
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

						{/* Quantity + Add to Cart */}
						<div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
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
										name: prod.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
										price: currentPrice,
										qty,
									});
									setQty(1);
								}}
								className='btn btn-dark'
								style={{ flex: 1 }}
							>
								Add to Cart — ₹{(currentPrice * qty).toLocaleString('en-IN')}
							</button>
						</div>

						{/* Buy Now */}
						<button
							data-clickable
							onClick={() => {
								addToCart({
									id: prod.id,
									name: prod.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
									price: currentPrice,
									qty,
								});
								navigate('/checkout');
							}}
							className='btn btn-outline-dark'
							style={{ width: '100%', justifyContent: 'center' }}
						>
							Buy Now →
						</button>

						<Link
							to='/products'
							data-clickable
							style={{
								display: 'block',
								width: '100%',
								background: 'rgba(0,0,0,0.04)',
								border: '1px solid rgba(0,0,0,0.1)',
								fontSize: 'clamp(12px, 2vw, 13px)',
								color: '#000',
								padding: 'clamp(12px, 2vw, 16px)',
								fontWeight: 500,
								transition: 'all .2s',
								marginTop: 'clamp(16px, 3vw, 24px)',
								textAlign: 'center',
								textDecoration: 'none',
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
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
