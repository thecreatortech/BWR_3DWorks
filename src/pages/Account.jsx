import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDemoOrders } from '../contexts/AuthContext';
import { Footer } from '../components/common/Footer';

export default function Account() {
	const { user, loading, logout, updateProfile } = useAuth();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('profile');
	const [editing, setEditing] = useState(false);
	const [editForm, setEditForm] = useState({ name: '', phone: '' });

	// Redirect to login if not authenticated — must be in useEffect
	useEffect(() => {
		if (!loading && !user) {
			navigate('/login', { replace: true });
		}
	}, [user, loading, navigate]);

	// Sync edit form with user data
	useEffect(() => {
		if (user) {
			setEditForm({ name: user.name || '', phone: user.phone || '' });
		}
	}, [user]);

	if (loading) {
		return (
			<div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<div style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>Loading...</div>
			</div>
		);
	}

	if (!user) return null; // Will redirect via useEffect

	const orders = getDemoOrders().filter((o) => o.userId === user.id);

	const handleSaveProfile = async () => {
		await updateProfile(editForm);
		setEditing(false);
	};

	const handleLogout = async () => {
		await logout();
		navigate('/');
	};

	const tabs = [
		{ id: 'profile', label: 'Profile' },
		{ id: 'orders', label: 'Orders' },
	];

	const inputStyle = {
		width: '100%', padding: '12px 16px', border: '1px solid #ddd',
		fontSize: 14, fontFamily: 'inherit', borderRadius: 2, outline: 'none',
	};
	const labelStyle = {
		display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 6,
		color: 'rgba(0,0,0,0.5)', letterSpacing: '.04em', textTransform: 'uppercase',
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 900, margin: '0 auto' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
						<div>
							<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, color: '#000' }}>
								My Account
							</h1>
							<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>
								Welcome, {user.name || user.email}
							</p>
						</div>
						<button onClick={handleLogout} className='btn btn-outline-dark' style={{ fontSize: 12, padding: '10px 24px' }}>
							Logout
						</button>
					</div>

					{/* Tabs */}
					<div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #eee', marginBottom: 32 }}>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								style={{
									padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
									fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
									color: activeTab === tab.id ? '#000' : 'rgba(0,0,0,0.4)',
									borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
									transition: 'all .2s', letterSpacing: '.04em', textTransform: 'uppercase',
								}}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Profile Tab */}
					{activeTab === 'profile' && (
						<div style={{ maxWidth: 500 }}>
							{!editing ? (
								<div>
									<div style={{ marginBottom: 24 }}>
										<div style={labelStyle}>Name</div>
										<div style={{ fontSize: 16, color: '#000' }}>{user.name || '—'}</div>
									</div>
									<div style={{ marginBottom: 24 }}>
										<div style={labelStyle}>Email</div>
										<div style={{ fontSize: 16, color: '#000' }}>{user.email}</div>
									</div>
									<div style={{ marginBottom: 32 }}>
										<div style={labelStyle}>Phone</div>
										<div style={{ fontSize: 16, color: '#000' }}>{user.phone || '—'}</div>
									</div>
									<button onClick={() => setEditing(true)} className='btn btn-dark' style={{ fontSize: 13, padding: '12px 28px' }}>
										Edit Profile
									</button>
								</div>
							) : (
								<div>
									<div style={{ marginBottom: 20 }}>
										<label style={labelStyle}>Name</label>
										<input type='text' value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
									</div>
									<div style={{ marginBottom: 24 }}>
										<label style={labelStyle}>Phone</label>
										<input type='tel' value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} style={inputStyle} />
									</div>
									<div style={{ display: 'flex', gap: 12 }}>
										<button onClick={handleSaveProfile} className='btn btn-dark' style={{ fontSize: 13, padding: '12px 28px' }}>
											Save Changes
										</button>
										<button onClick={() => setEditing(false)} className='btn btn-outline-dark' style={{ fontSize: 13, padding: '12px 28px' }}>
											Cancel
										</button>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Orders Tab */}
					{activeTab === 'orders' && (
						<div>
							{orders.length === 0 ? (
								<div style={{ textAlign: 'center', padding: '60px 20px' }}>
									<div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
									<h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: '#000', marginBottom: 8 }}>
										No orders yet
									</h3>
									<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 24 }}>
										Your order history will appear here after your first purchase.
									</p>
									<button onClick={() => navigate('/products')} className='btn btn-dark' style={{ fontSize: 13 }}>
										Browse Products →
									</button>
								</div>
							) : (
								<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
									{orders.map((order) => (
										<div key={order.id} style={{ padding: 24, border: '1px solid #eee', borderRadius: 4 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
										<div>
											<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
												Order #{order.id}
											</div>
											<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>
												{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
											</div>
										</div>
										<span style={{
											padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
											background: order.status === 'delivered' ? '#d1fae5' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
											color: order.status === 'delivered' ? '#059669' : order.status === 'shipped' ? '#2563eb' : '#d97706',
											borderRadius: 2,
										}}>
											{order.status}
										</span>
									</div>

									{/* Order Tracking Timeline */}
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, padding: '12px 0' }}>
										{['confirmed', 'printed', 'shipped', 'delivered'].map((step, i) => {
											const statusOrder = { pending: 0, confirmed: 1, printed: 2, shipped: 3, delivered: 4 };
											const current = statusOrder[order.status] || 0;
											const isActive = i < current;
											const isCurrent = i === current;
											return (
												<div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
													<div style={{
														width: 28, height: 28, borderRadius: '50%',
														background: isActive ? '#059669' : isCurrent ? '#000' : '#eee',
														color: isActive || isCurrent ? '#fff' : 'rgba(0,0,0,0.3)',
														display: 'flex', alignItems: 'center', justifyContent: 'center',
														fontSize: 12, fontWeight: 700, flexShrink: 0,
													}}>
														{isActive ? '✓' : i + 1}
													</div>
													<div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: isActive || isCurrent ? '#000' : 'rgba(0,0,0,0.2)', marginLeft: 6, marginRight: 6 }}>
														{step}
													</div>
													{i < 3 && (
														<div style={{ flex: 1, height: 2, background: isActive ? '#059669' : '#eee', marginRight: 6 }} />
													)}
												</div>
											);
										})}
									</div>

									{order.items.map((item, i) => (
										<div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f5f5f5' }}>
											<span style={{ fontSize: 14, color: '#000' }}>{item.name} × {item.qty}</span>
											<span style={{ fontSize: 14, fontWeight: 500 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
										</div>
									))}
									<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #000', marginTop: 8, fontWeight: 600 }}>
										<span>Total</span>
										<span>₹{order.total.toLocaleString('en-IN')}</span>
									</div>
								</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
}
