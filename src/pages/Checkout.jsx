import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

export default function Checkout({ cart, onOrderComplete, user }) {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const navigate = useNavigate();
	const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);

	const [form, setForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: user?.phone || '',
		address: '',
		city: '',
		state: '',
		pincode: '',
		createAccount: false,
	});

	const handleChange = (field) => (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsProcessing(true);
		setTimeout(() => {
			onOrderComplete();
			setFormSubmitted(true);
			setIsProcessing(false);
		}, 1500);
	};

	const inputStyle = {
		width: '100%',
		padding: 'clamp(10px, 1.5vw, 14px) clamp(14px, 2vw, 18px)',
		border: '1px solid #ddd',
		fontSize: 'clamp(13px, 1.5vw, 15px)',
		fontFamily: 'inherit',
		borderRadius: 2,
		transition: 'border-color .2s',
		outline: 'none',
	};

	const labelStyle = {
		display: 'block',
		fontSize: 'clamp(11px, 1.5vw, 12px)',
		fontWeight: 600,
		marginBottom: 'clamp(6px, 1vw, 8px)',
		color: 'rgba(0,0,0,0.6)',
		letterSpacing: '.04em',
		textTransform: 'uppercase',
	};

	if (cart.length === 0 && !formSubmitted) {
		return (
			<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
				<section style={{ padding: 'clamp(80px, 15vw, 140px) clamp(16px, 5vw, 52px)', textAlign: 'center' }}>
					<div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
					<h1 style={{
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(28px, 5vw, 44px)',
						fontWeight: 400, color: '#000', marginBottom: 16,
					}}>
						Your Cart is Empty
					</h1>
					<p style={{
						fontSize: 'clamp(14px, 2vw, 16px)',
						fontWeight: 300, color: 'rgba(0,0,0,0.5)',
						marginBottom: 32,
					}}>
						Explore our collection and find something meaningful.
					</p>
					<Link to='/products' className='btn btn-dark' data-clickable>
						Browse Products →
					</Link>
				</section>
				<Footer />
			</div>
		);
	}

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 'clamp(16px, 3vw, 28px)' }}>
					<button
						data-clickable
						onClick={() => navigate('/products')}
						style={{
							background: 'none', border: 'none',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(0,0,0,0.5)', cursor: 'pointer',
							padding: 0, fontWeight: 400,
							letterSpacing: '.05em', textTransform: 'uppercase',
						}}
					>
						← Continue Shopping
					</button>
				</div>
			</section>
			<section style={{ padding: 'clamp(0px, 1vw, 10px) clamp(16px, 5vw, 52px) clamp(40px, 8vw, 60px)' }}>
				<div style={{ maxWidth: 900, margin: '0 auto' }}>
					<h1 style={{
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(32px, 6vw, 56px)',
						fontWeight: 400,
						marginBottom: 'clamp(24px, 4vw, 40px)',
					}}>
						Checkout
					</h1>

					{!formSubmitted ? (
						<form onSubmit={handleSubmit}>
							{/* Order Summary */}
							<div style={{
								marginBottom: 'clamp(24px, 4vw, 40px)',
								padding: 'clamp(24px, 3vw, 32px)',
								background: '#f7f7f7',
								borderRadius: 4,
							}}>
								<h3 style={{
									fontSize: 'clamp(14px, 2vw, 16px)',
									fontWeight: 600,
									marginBottom: 'clamp(16px, 3vw, 20px)',
									color: '#000',
								}}>
									Order Summary
								</h3>
								{cart.map((item, i) => (
									<div key={i} style={{
										display: 'flex', justifyContent: 'space-between',
										padding: 'clamp(10px, 1.5vw, 14px) 0',
										borderBottom: '1px solid rgba(0,0,0,0.06)',
									}}>
										<div>
											<div style={{
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontWeight: 500, color: '#000',
											}}>
												{item.name}
											</div>
											<div style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: 'rgba(0,0,0,0.4)' }}>
												Qty: {item.qty || 1}
											</div>
										</div>
										<div style={{ fontWeight: 500, color: '#000', fontSize: 'clamp(13px, 1.5vw, 15px)' }}>
											₹{(item.price * (item.qty || 1)).toLocaleString('en-IN')}
										</div>
									</div>
								))}
								<div style={{
									display: 'flex', justifyContent: 'space-between',
									marginTop: 20, paddingTop: 20,
									borderTop: '2px solid #000',
									fontSize: 18, fontWeight: 600,
								}}>
									<div>Total</div>
									<div>₹{total.toLocaleString('en-IN')}</div>
								</div>
							</div>

							{/* Login prompt if not logged in */}
							{!user && (
								<div style={{
									padding: 'clamp(16px, 2vw, 24px)',
									background: '#fffce5',
									border: '1px solid #f0e68c',
									borderRadius: 4,
									marginBottom: 'clamp(24px, 4vw, 32px)',
									display: 'flex', justifyContent: 'space-between',
									alignItems: 'center', flexWrap: 'wrap', gap: 12,
								}}>
									<div>
										<div style={{ fontSize: 14, fontWeight: 600, color: '#000', marginBottom: 4 }}>
											Already have an account?
										</div>
										<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
											Login to track orders and save your details.
										</div>
									</div>
									<Link to='/login' className='btn btn-dark' data-clickable style={{ fontSize: 12, padding: '10px 24px' }}>
										Login
									</Link>
								</div>
							)}

							{/* Shipping Details */}
							<h3 style={{
								fontSize: 'clamp(14px, 2vw, 16px)',
								fontWeight: 600, marginBottom: 'clamp(16px, 3vw, 24px)', color: '#000',
							}}>
								Shipping Details
							</h3>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(16px, 2vw, 24px)' }} className='grid-col-2'>
								<div>
									<label style={labelStyle}>Full Name *</label>
									<input type='text' required value={form.name} onChange={handleChange('name')} style={inputStyle} placeholder='Priya Sharma' />
								</div>
								<div>
									<label style={labelStyle}>Phone *</label>
									<input type='tel' required value={form.phone} onChange={handleChange('phone')} style={inputStyle} placeholder='+91 98765 43210' />
								</div>
							</div>

							<div style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
								<label style={labelStyle}>Email *</label>
								<input type='email' required value={form.email} onChange={handleChange('email')} style={inputStyle} placeholder='priya@example.com' />
							</div>

							<div style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
								<label style={labelStyle}>Address *</label>
								<textarea
									required value={form.address} onChange={handleChange('address')}
									style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
									placeholder='House/Flat No., Building, Street, Locality'
								/>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(20px, 3vw, 32px)' }} className='grid-col-3'>
								<div>
									<label style={labelStyle}>City *</label>
									<input type='text' required value={form.city} onChange={handleChange('city')} style={inputStyle} placeholder='Bengaluru' />
								</div>
								<div>
									<label style={labelStyle}>State *</label>
									<input type='text' required value={form.state} onChange={handleChange('state')} style={inputStyle} placeholder='Karnataka' />
								</div>
								<div>
									<label style={labelStyle}>Pincode *</label>
									<input type='text' required value={form.pincode} onChange={handleChange('pincode')} style={inputStyle} placeholder='560001' pattern='[0-9]{6}' />
								</div>
							</div>

							{/* Create Account Checkbox */}
							{!user && (
								<label style={{
									display: 'flex', alignItems: 'center', gap: 10,
									marginBottom: 'clamp(24px, 4vw, 32px)',
									cursor: 'pointer',
								}}>
									<input
										type='checkbox'
										checked={form.createAccount}
										onChange={handleChange('createAccount')}
										style={{ width: 18, height: 18, cursor: 'pointer' }}
									/>
									<span style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)' }}>
										Create an account to track your orders and save shipping details
									</span>
								</label>
							)}

							<button
								type='submit'
								className='btn btn-dark'
								disabled={isProcessing}
								style={{
									width: '100%',
									fontSize: 'clamp(13px, 1.5vw, 15px)',
									padding: 'clamp(14px, 2vw, 18px) clamp(24px, 3vw, 40px)',
									opacity: isProcessing ? 0.7 : 1,
									justifyContent: 'center',
								}}
							>
								{isProcessing ? 'Processing...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
							</button>

							<div style={{
								fontSize: 12, color: 'rgba(0,0,0,0.3)',
								textAlign: 'center', marginTop: 16,
							}}>
								🔒 Your information is secure. We never share your data.
							</div>
						</form>
					) : (
						<div style={{ textAlign: 'center', padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 40px)' }}>
							<div style={{
								width: 80, height: 80, borderRadius: '50%',
								background: '#000', color: '#fff',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								fontSize: 36, margin: '0 auto 24px',
							}}>
								✓
							</div>
							<h3 style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 5vw, 40px)',
								fontWeight: 400, color: '#000',
								marginBottom: 16,
							}}>
								Order Confirmed!
							</h3>
							<p style={{
								fontSize: 'clamp(14px, 2vw, 16px)',
								fontWeight: 300,
								color: 'rgba(0,0,0,0.5)',
								lineHeight: 1.7, marginBottom: 12,
								maxWidth: 500, margin: '0 auto 32px',
							}}>
								Thank you for your order! We'll start crafting your object right away.
								You'll receive a confirmation email with tracking details shortly.
							</p>
							<div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
								<Link to='/' className='btn btn-dark' data-clickable>
									Back to Home
								</Link>
								{!user && (
									<Link to='/register' className='btn btn-outline-dark' data-clickable>
										Create Account →
									</Link>
								)}
							</div>
						</div>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
}
