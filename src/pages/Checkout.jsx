import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, saveDemoOrder } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Footer } from '../components/common/Footer';
import { sanitize, validatePincode } from '../utils/security';

const COUPON_CODES = {
	'BWR10': { discount: 10, type: 'percent', label: '10% off' },
	'FIRST500': { discount: 500, type: 'flat', label: '₹500 off' },
	'WELCOME': { discount: 15, type: 'percent', label: '15% off (Welcome)' },
};

export default function Checkout() {
	const { user, loading: authLoading } = useAuth();
	const { cart, clearCart, cartTotal } = useCart();
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderId, setOrderId] = useState(null);
	const [couponCode, setCouponCode] = useState('');
	const [appliedCoupon, setAppliedCoupon] = useState(null);
	const [couponError, setCouponError] = useState('');
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: '', email: '', phone: '',
		address: '', city: '', state: '', pincode: '',
	});

	// Pre-fill form with user data when available
	useEffect(() => {
		if (user) {
			setForm(prev => ({
				...prev,
				name: prev.name || user.name || '',
				email: prev.email || user.email || '',
				phone: prev.phone || user.phone || '',
			}));
		}
	}, [user]);

	const handleChange = (field) => (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const applyCoupon = () => {
		setCouponError('');
		const code = couponCode.trim().toUpperCase();
		if (!code) return;
		const coupon = COUPON_CODES[code];
		if (!coupon) {
			setCouponError('Invalid coupon code');
			return;
		}
		setAppliedCoupon({ code, ...coupon });
	};

	const removeCoupon = () => {
		setAppliedCoupon(null);
		setCouponCode('');
		setCouponError('');
	};

	// Calculate discount
	let discount = 0;
	if (appliedCoupon) {
		if (appliedCoupon.type === 'percent') {
			discount = Math.round(cartTotal * appliedCoupon.discount / 100);
		} else {
			discount = Math.min(appliedCoupon.discount, cartTotal);
		}
	}
	const finalTotal = cartTotal - discount;

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validate pincode
		if (!validatePincode(form.pincode)) {
			alert('Please enter a valid 6-digit Indian pincode');
			return;
		}

		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			const id = `BWR${Date.now().toString(36).toUpperCase()}`;

			// Save order to demo storage
			const order = {
				id,
				userId: user?.id || 'guest',
				date: new Date().toISOString(),
				status: 'pending',
				items: cart.map(item => ({
					id: item.id,
					name: item.name,
					variant: item.variant || null,
					qty: item.qty,
					price: item.price,
				})),
				total: finalTotal,
				discount: discount > 0 ? discount : null,
				coupon: appliedCoupon?.code || null,
				shipping: {
					name: sanitize(form.name),
					email: sanitize(form.email),
					phone: sanitize(form.phone),
					address: sanitize(form.address),
					city: sanitize(form.city),
					state: sanitize(form.state),
					pincode: sanitize(form.pincode),
				},
			};
			saveDemoOrder(order);

			clearCart();
			setOrderId(id);
			setFormSubmitted(true);
			setIsProcessing(false);
		}, 1500);
	};

	const inputStyle = {
		width: '100%',
		padding: 'clamp(10px, 1.5vw, 14px) clamp(14px, 2vw, 18px)',
		border: '1px solid #ddd', fontSize: 'clamp(13px, 1.5vw, 15px)',
		fontFamily: 'inherit', borderRadius: 2, transition: 'border-color .2s', outline: 'none',
	};
	const labelStyle = {
		display: 'block', fontSize: 'clamp(11px, 1.5vw, 12px)', fontWeight: 600,
		marginBottom: 'clamp(6px, 1vw, 8px)', color: 'rgba(0,0,0,0.6)',
		letterSpacing: '.04em', textTransform: 'uppercase',
	};

	// Empty cart
	if (cart.length === 0 && !formSubmitted) {
		return (
			<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
				<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', textAlign: 'center' }}>
					<div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
					<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, marginBottom: 12 }}>Your cart is empty</h2>
					<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', marginBottom: 32 }}>Add some products to get started</p>
					<Link to='/products' className='btn btn-dark' style={{ display: 'inline-flex' }}>Browse Products →</Link>
				</section>
				<Footer />
			</div>
		);
	}

	// Order confirmation
	if (formSubmitted) {
		return (
			<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
				<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)', textAlign: 'center' }}>
					<div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>✓</div>
					<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, marginBottom: 12 }}>Order Confirmed!</h2>
					<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', marginBottom: 8 }}>Thank you for your order.</p>
					<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>Order ID: <strong style={{ color: '#000' }}>#{orderId}</strong></p>
					<p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>
						You'll receive a confirmation email at <strong>{form.email}</strong>
					</p>
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
						{user && (
							<Link to='/account' className='btn btn-dark'>View Order History</Link>
						)}
						<Link to='/products' className='btn btn-outline-dark'>Continue Shopping</Link>
					</div>
				</section>
				<Footer />
			</div>
		);
	}

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 1100, margin: '0 auto' }}>
					<Link to='/products' style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
						← Continue Shopping
					</Link>
					<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, marginBottom: 40 }}>
						Checkout
					</h1>

					{/* Login prompt if not authenticated */}
					{!user && !authLoading && (
						<div style={{
							padding: '16px 20px', background: '#f0f9ff', border: '1px solid #bae6fd',
							borderRadius: 4, marginBottom: 32, display: 'flex', justifyContent: 'space-between',
							alignItems: 'center', flexWrap: 'wrap', gap: 12,
						}}>
							<div>
								<div style={{ fontSize: 14, fontWeight: 500, color: '#0369a1', marginBottom: 2 }}>
									Have an account?
								</div>
								<div style={{ fontSize: 13, color: '#0284c7' }}>
									Login to track orders and save your details
								</div>
							</div>
							<Link to='/login' className='btn btn-dark' style={{ fontSize: 12, padding: '8px 20px' }}>
								Login / Register
							</Link>
						</div>
					)}

					<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className='grid-col-2'>
						{/* Shipping Form */}
						<form onSubmit={handleSubmit}>
							<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, letterSpacing: '.04em', textTransform: 'uppercase' }}>
								Shipping Information
							</h3>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
								<div>
									<label style={labelStyle}>Full Name *</label>
									<input required value={form.name} onChange={handleChange('name')} style={inputStyle} />
								</div>
								<div>
									<label style={labelStyle}>Phone *</label>
									<input type='tel' required value={form.phone} onChange={handleChange('phone')} style={inputStyle} placeholder='+91 98765 43210' />
								</div>
							</div>
							<div style={{ marginBottom: 16 }}>
								<label style={labelStyle}>Email *</label>
								<input type='email' required value={form.email} onChange={handleChange('email')} style={inputStyle} />
							</div>
							<div style={{ marginBottom: 16 }}>
								<label style={labelStyle}>Address *</label>
								<textarea required value={form.address} onChange={handleChange('address')} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
								<div>
									<label style={labelStyle}>City *</label>
									<input required value={form.city} onChange={handleChange('city')} style={inputStyle} />
								</div>
								<div>
									<label style={labelStyle}>State *</label>
									<input required value={form.state} onChange={handleChange('state')} style={inputStyle} />
								</div>
								<div>
									<label style={labelStyle}>Pincode *</label>
									<input required value={form.pincode} onChange={handleChange('pincode')} style={inputStyle} maxLength={6} placeholder='560001' />
								</div>
							</div>

							<button type='submit' className='btn btn-dark' disabled={isProcessing}
								style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '18px', opacity: isProcessing ? 0.7 : 1 }}>
								{isProcessing ? 'Processing...' : `Place Order — ₹${finalTotal.toLocaleString('en-IN')}`}
							</button>
						</form>

						{/* Order Summary */}
						<div>
							<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, letterSpacing: '.04em', textTransform: 'uppercase' }}>
								Order Summary
							</h3>
							<div style={{ border: '1px solid #eee', borderRadius: 4 }}>
								{cart.map((item, i) => (
									<div key={i} style={{
										display: 'flex', justifyContent: 'space-between', alignItems: 'center',
										padding: '16px 20px', borderBottom: i < cart.length - 1 ? '1px solid #f5f5f5' : 'none',
									}}>
										<div>
											<div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
											{item.variant && <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>{item.variant}</div>}
											<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>Qty: {item.qty || 1}</div>
										</div>
										<div style={{ fontSize: 14, fontWeight: 500 }}>
											₹{(item.price * (item.qty || 1)).toLocaleString('en-IN')}
										</div>
									</div>
								))}

								{/* Coupon */}
								<div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
									{!appliedCoupon ? (
										<div style={{ display: 'flex', gap: 8 }}>
											<input
												value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
												placeholder='Coupon code'
												style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontSize: 13, fontFamily: 'inherit', borderRadius: 2, outline: 'none' }}
											/>
											<button onClick={applyCoupon} className='btn btn-outline-dark' style={{ fontSize: 12, padding: '8px 16px' }}>
												Apply
											</button>
										</div>
									) : (
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div>
												<span style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>✓ {appliedCoupon.code}</span>
												<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginLeft: 8 }}>{appliedCoupon.label}</span>
											</div>
											<button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}>
												Remove
											</button>
										</div>
									)}
									{couponError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{couponError}</div>}
								</div>

								{/* Totals */}
								<div style={{ padding: '16px 20px', borderTop: '2px solid #000', background: '#fafafa' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
										<span>Subtotal</span>
										<span>₹{cartTotal.toLocaleString('en-IN')}</span>
									</div>
									{discount > 0 && (
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#059669' }}>
											<span>Discount</span>
											<span>-₹{discount.toLocaleString('en-IN')}</span>
										</div>
									)}
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
										<span>Shipping</span>
										<span style={{ color: '#059669' }}>Free</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, paddingTop: 12, borderTop: '1px solid #eee' }}>
										<span>Total</span>
										<span>₹{finalTotal.toLocaleString('en-IN')}</span>
									</div>
								</div>
							</div>

							{/* Try coupon codes hint */}
							<div style={{ marginTop: 12, fontSize: 11, color: 'rgba(0,0,0,0.3)', textAlign: 'center' }}>
								Try: BWR10, FIRST500, or WELCOME
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
