import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDemoOrders } from '../../contexts/AuthContext';
import { PRODUCTS } from '../../utils/products';

export default function AdminDashboard() {
	const { user, loading, isAdmin } = useAuth();
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState('overview');
	const [editingProduct, setEditingProduct] = useState(null);
	const [productForm, setProductForm] = useState({});
	const [showAddModal, setShowAddModal] = useState(false);

	// Redirect if not logged in
	useEffect(() => {
		if (!loading && !user) {
			navigate('/login', { replace: true });
		}
	}, [user, loading, navigate]);

	if (loading) {
		return (
			<div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<div style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>Loading...</div>
			</div>
		);
	}

	if (!user) return null;

	// Role-based access — show restricted notice for non-admins
	const isDemoAdmin = !isAdmin && user;

	// Get real orders from demo storage
	const allOrders = getDemoOrders();
	const totalRevenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
	const uniqueCustomers = [...new Set(allOrders.map(o => o.userId).filter(Boolean))];

	const sidebarItems = [
		{ id: 'overview', label: 'Dashboard', icon: '📊' },
		{ id: 'products', label: 'Products', icon: '📦' },
		{ id: 'orders', label: 'Orders', icon: '📋' },
		{ id: 'customers', label: 'Customers', icon: '👥' },
	];

	const stats = [
		{ label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: allOrders.length > 0 ? `${allOrders.length} orders` : 'No orders yet', up: allOrders.length > 0 },
		{ label: 'Orders', value: String(allOrders.length), change: allOrders.length > 0 ? 'Active' : '—', up: allOrders.length > 0 },
		{ label: 'Products', value: String(PRODUCTS.length), change: '—', up: null },
		{ label: 'Customers', value: String(uniqueCustomers.length), change: uniqueCustomers.length > 0 ? 'Registered' : '—', up: uniqueCustomers.length > 0 },
	];

	const openEditModal = (product) => {
		setEditingProduct(product.id);
		setProductForm({ name: product.name, price: product.price, cat: product.cat, badge: product.badge || '' });
	};

	const closeModal = () => { setEditingProduct(null); setShowAddModal(false); setProductForm({}); };

	const handleProductSave = () => {
		// In demo mode, just close — real save needs backend
		closeModal();
	};

	const updateOrderStatus = (orderId, newStatus) => {
		const orders = getDemoOrders();
		const idx = orders.findIndex(o => o.id === orderId);
		if (idx >= 0) {
			orders[idx].status = newStatus;
			localStorage.setItem('bwr3d_demo_orders', JSON.stringify(orders));
		}
	};

	const cardStyle = { padding: 24, background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4 };
	const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: 14, fontFamily: 'inherit', borderRadius: 2, outline: 'none' };

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', display: 'flex', background: '#f7f7f7' }}>
			{/* Sidebar */}
			<aside style={{
				width: 'clamp(200px, 18vw, 260px)', background: '#000', color: '#fff',
				padding: '32px 0', position: 'sticky', top: 68, height: 'calc(100vh - 68px)',
				display: 'flex', flexDirection: 'column',
			}}>
				<div style={{ padding: '0 24px', marginBottom: 32 }}>
					<div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
						Admin Panel
					</div>
					<div style={{ fontSize: 14, fontWeight: 500 }}>{user.name || user.email}</div>
					{isDemoAdmin && (
						<div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>
							Demo Mode — Read Only
						</div>
					)}
					{isAdmin && (
						<div style={{ fontSize: 10, color: '#059669', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>
							✓ Admin
						</div>
					)}
				</div>

				<nav style={{ flex: 1 }}>
					{sidebarItems.map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveSection(item.id)}
							style={{
								display: 'flex', alignItems: 'center', gap: 12,
								padding: '12px 24px', width: '100%',
								background: activeSection === item.id ? 'rgba(255,255,255,0.08)' : 'none',
								border: 'none', color: activeSection === item.id ? '#fff' : 'rgba(255,255,255,0.4)',
								fontSize: 13, fontWeight: 500, cursor: 'pointer',
								borderLeft: activeSection === item.id ? '3px solid #fff' : '3px solid transparent',
								transition: 'all .2s', textAlign: 'left',
							}}
						>
							<span style={{ fontSize: 16 }}>{item.icon}</span>
							{item.label}
						</button>
					))}
				</nav>

				<div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
					<button onClick={() => navigate('/')} style={{
						background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
						cursor: 'pointer', fontSize: 12, fontWeight: 500,
					}}>
						← Back to Store
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main style={{ flex: 1, padding: 'clamp(24px, 3vw, 40px)' }}>
				{/* Demo mode banner */}
				{isDemoAdmin && (
					<div style={{
						padding: '12px 20px', background: '#fef3c7', border: '1px solid #fbbf24',
						borderRadius: 4, marginBottom: 24, fontSize: 13, color: '#92400e',
						display: 'flex', alignItems: 'center', gap: 8,
					}}>
						🔒 <strong>Demo Mode</strong> — You are viewing the admin panel as a regular user. Write operations require admin role.
					</div>
				)}

				{/* Overview */}
				{activeSection === 'overview' && (
					<div>
						<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, marginBottom: 32 }}>
							Dashboard Overview
						</h2>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }} className='grid-col-2'>
							{stats.map((s, i) => (
								<div key={i} style={cardStyle}>
									<div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>
										{s.label}
									</div>
									<div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#000', marginBottom: 4 }}>
										{s.value}
									</div>
									{s.up !== null && (
										<div style={{ fontSize: 12, color: s.up ? '#059669' : 'rgba(0,0,0,0.3)', fontWeight: 600 }}>
											{s.change}
										</div>
									)}
								</div>
							))}
						</div>

						<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h3>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
							{allOrders.length === 0 ? (
								<div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.4)', fontSize: 14 }}>
									No orders yet. Orders will appear here when customers make purchases.
								</div>
							) : (
								allOrders.slice(0, 5).map((order, i) => (
									<div key={order.id} style={{
										padding: '16px 20px', borderBottom: i < Math.min(allOrders.length - 1, 4) ? '1px solid #f5f5f5' : 'none',
										display: 'flex', justifyContent: 'space-between', alignItems: 'center',
									}}>
										<div>
											<span style={{ fontSize: 14, fontWeight: 500 }}>Order #{order.id}</span>
											<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginLeft: 12 }}>
												{new Date(order.date).toLocaleDateString('en-IN')}
											</span>
										</div>
										<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
											<span style={{ fontSize: 14, fontWeight: 500 }}>₹{(order.total || 0).toLocaleString('en-IN')}</span>
											<span style={{
												padding: '3px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
												background: order.status === 'delivered' ? '#d1fae5' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
												color: order.status === 'delivered' ? '#059669' : order.status === 'shipped' ? '#2563eb' : '#d97706',
												borderRadius: 2,
											}}>
												{order.status}
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}

				{/* Products */}
				{activeSection === 'products' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
							<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400 }}>
								Products ({PRODUCTS.length})
							</h2>
							<button onClick={() => { if (!isDemoAdmin) setShowAddModal(true); }} className='btn btn-dark'
								style={{ fontSize: 12, padding: '10px 20px', opacity: isDemoAdmin ? 0.5 : 1 }}>
								+ Add Product
							</button>
						</div>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
							<div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 100px 80px', gap: 0, padding: '12px 20px', background: '#f7f7f7', fontWeight: 600, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
								<div></div><div>Product</div><div>Category</div><div>Price</div><div>Stock</div><div>Actions</div>
							</div>
							{PRODUCTS.map((prod) => (
								<div key={prod.id} style={{
									display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 100px 80px',
									gap: 0, padding: '12px 20px', borderTop: '1px solid #f5f5f5', alignItems: 'center',
								}}>
									<img src={prod.image} alt={prod.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2 }} />
									<div>
										<div style={{ fontSize: 14, fontWeight: 500 }}>{prod.name}</div>
										{prod.badge && <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{prod.badge}</span>}
									</div>
									<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', textTransform: 'capitalize' }}>{prod.cat}</div>
									<div style={{ fontSize: 14, fontWeight: 500 }}>₹{prod.price.toLocaleString('en-IN')}</div>
									<div>
										<span style={{
											padding: '2px 8px', fontSize: 11, fontWeight: 600,
											background: (prod.stock || 50) > 10 ? '#d1fae5' : (prod.stock || 50) > 0 ? '#fef3c7' : '#fee2e2',
											color: (prod.stock || 50) > 10 ? '#059669' : (prod.stock || 50) > 0 ? '#d97706' : '#dc2626',
											borderRadius: 2,
										}}>
											{prod.stock || 50} left
										</span>
									</div>
									<div style={{ display: 'flex', gap: 6 }}>
										<button onClick={() => { if (!isDemoAdmin) openEditModal(prod); }}
											style={{ padding: '4px 8px', background: 'none', border: '1px solid #ddd', cursor: isDemoAdmin ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 600, opacity: isDemoAdmin ? 0.5 : 1 }}>
											Edit
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Orders */}
				{activeSection === 'orders' && (
					<div>
						<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, marginBottom: 32 }}>
							Orders ({allOrders.length})
						</h2>
						{allOrders.length === 0 ? (
							<div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
								<div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
								<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }}>
									No orders yet. Orders will appear here when customers make purchases.
								</p>
							</div>
						) : (
							<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
								{allOrders.map((order) => (
									<div key={order.id} style={cardStyle}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
											<div>
												<div style={{ fontSize: 16, fontWeight: 500 }}>Order #{order.id}</div>
												<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginTop: 2 }}>
													{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
													{order.shipping && <span> • {order.shipping.name}</span>}
												</div>
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
												{!isDemoAdmin && (
													<select
														value={order.status}
														onChange={(e) => updateOrderStatus(order.id, e.target.value)}
														style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #ddd', borderRadius: 2, cursor: 'pointer' }}
													>
														<option value="pending">Pending</option>
														<option value="confirmed">Confirmed</option>
														<option value="shipped">Shipped</option>
														<option value="delivered">Delivered</option>
													</select>
												)}
												<span style={{
													padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
													background: order.status === 'delivered' ? '#d1fae5' : order.status === 'shipped' ? '#dbeafe' : order.status === 'confirmed' ? '#dbeafe' : '#fef3c7',
													color: order.status === 'delivered' ? '#059669' : order.status === 'shipped' ? '#2563eb' : order.status === 'confirmed' ? '#2563eb' : '#d97706',
													borderRadius: 2,
												}}>
													{order.status}
												</span>
											</div>
										</div>
										{order.items && order.items.map((item, i) => (
											<div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f5f5f5', fontSize: 14 }}>
												<span>{item.name} × {item.qty}</span>
												<span style={{ fontWeight: 500 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
											</div>
										))}
										<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #000', marginTop: 8, fontWeight: 700 }}>
											<span>Total</span>
											<span>₹{(order.total || 0).toLocaleString('en-IN')}</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Customers */}
				{activeSection === 'customers' && (
					<div>
						<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, marginBottom: 32 }}>
							Customers ({uniqueCustomers.length})
						</h2>
						{uniqueCustomers.length === 0 ? (
							<div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
								<div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
								<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }}>
									Customer list will populate as users place orders.
								</p>
							</div>
						) : (
							<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px', gap: 0, padding: '12px 20px', background: '#f7f7f7', fontWeight: 600, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
									<div>Name</div><div>Email</div><div>Orders</div><div>Total Spent</div>
								</div>
								{uniqueCustomers.map((customerId) => {
									const customerOrders = allOrders.filter(o => o.userId === customerId);
									const firstOrder = customerOrders[0];
									const totalSpent = customerOrders.reduce((s, o) => s + (o.total || 0), 0);
									return (
										<div key={customerId} style={{
											display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px',
											gap: 0, padding: '12px 20px', borderTop: '1px solid #f5f5f5', alignItems: 'center',
										}}>
											<div style={{ fontSize: 14, fontWeight: 500 }}>{firstOrder?.shipping?.name || 'Unknown'}</div>
											<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>{firstOrder?.shipping?.email || '—'}</div>
											<div style={{ fontSize: 14 }}>{customerOrders.length}</div>
											<div style={{ fontSize: 14, fontWeight: 500 }}>₹{totalSpent.toLocaleString('en-IN')}</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				)}
			</main>

			{/* Edit/Add Product Modal */}
			{(editingProduct || showAddModal) && (
				<div style={{
					position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
					display: 'flex', alignItems: 'center', justifyContent: 'center',
				}} onClick={closeModal}>
					<div style={{
						background: '#fff', padding: 32, borderRadius: 8, width: '90%', maxWidth: 500,
					}} onClick={e => e.stopPropagation()}>
						<h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 24 }}>
							{editingProduct ? 'Edit Product' : 'Add Product'}
						</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							<div>
								<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'rgba(0,0,0,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Name</label>
								<input type="text" value={productForm.name || ''} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
								<div>
									<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'rgba(0,0,0,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Price (₹)</label>
									<input type="number" value={productForm.price || ''} onChange={e => setProductForm(p => ({ ...p, price: +e.target.value }))} style={inputStyle} />
								</div>
								<div>
									<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'rgba(0,0,0,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Category</label>
									<select value={productForm.cat || ''} onChange={e => setProductForm(p => ({ ...p, cat: e.target.value }))} style={inputStyle}>
										<option value="">Select</option>
										<option value="nameplates">Nameplates</option>
										<option value="milestones">Milestones</option>
										<option value="spiritual">Spiritual</option>
										<option value="desk">Desk</option>
										<option value="wedding">Wedding</option>
									</select>
								</div>
							</div>
							<div>
								<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'rgba(0,0,0,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>3D Model URL (.glb/.stl/.obj)</label>
								<input type="text" value={productForm.modelPath || ''} onChange={e => setProductForm(p => ({ ...p, modelPath: e.target.value }))} style={inputStyle} placeholder="https://..." />
							</div>
						</div>
						<div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
							<button onClick={closeModal} className='btn btn-outline-dark' style={{ fontSize: 13, padding: '10px 20px' }}>Cancel</button>
							<button onClick={handleProductSave} className='btn btn-dark' style={{ fontSize: 13, padding: '10px 20px' }}>
								{editingProduct ? 'Save Changes' : 'Add Product'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
