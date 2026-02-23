import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTS } from '../../utils/products';

export default function AdminDashboard() {
	const { user, loading, isAdmin } = useAuth();
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState('overview');

	// Redirect if not logged in — must be in useEffect
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

	if (!user) return null; // Will redirect via useEffect

	// For demo mode — allow any logged-in user to view admin as demo
	const isDemoAdmin = !isAdmin && user;

	const sidebarItems = [
		{ id: 'overview', label: 'Dashboard', icon: '📊' },
		{ id: 'products', label: 'Products', icon: '📦' },
		{ id: 'orders', label: 'Orders', icon: '📋' },
		{ id: 'customers', label: 'Customers', icon: '👥' },
	];

	const stats = [
		{ label: 'Total Revenue', value: '₹45,200', change: '+12%', up: true },
		{ label: 'Orders', value: '23', change: '+8%', up: true },
		{ label: 'Products', value: String(PRODUCTS.length), change: '—', up: null },
		{ label: 'Customers', value: '18', change: '+15%', up: true },
	];

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
							Demo Mode
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
				{/* Overview */}
				{activeSection === 'overview' && (
					<div>
						<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, marginBottom: 32 }}>
							Dashboard Overview
						</h2>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }} className='grid-col-2'>
							{stats.map((s, i) => (
								<div key={i} style={{ padding: 24, background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4 }}>
									<div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>
										{s.label}
									</div>
									<div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: '#000', marginBottom: 4 }}>
										{s.value}
									</div>
									{s.up !== null && (
										<div style={{ fontSize: 12, color: s.up ? '#059669' : '#dc2626', fontWeight: 600 }}>
											{s.change} this month
										</div>
									)}
								</div>
							))}
						</div>

						<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Activity</h3>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
							{[
								{ time: '2 hours ago', text: 'New order #1024 — Premium Nameplate', type: 'order' },
								{ time: '5 hours ago', text: 'Customer Priya Sharma registered', type: 'user' },
								{ time: '1 day ago', text: 'Ganesha Sculpture stock updated', type: 'product' },
								{ time: '2 days ago', text: 'Order #1023 shipped via BlueDart', type: 'order' },
							].map((item, i) => (
								<div key={i} style={{
									padding: '16px 20px', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none',
									display: 'flex', justifyContent: 'space-between', alignItems: 'center',
								}}>
									<span style={{ fontSize: 14, color: '#000' }}>{item.text}</span>
									<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)' }}>{item.time}</span>
								</div>
							))}
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
							<button className='btn btn-dark' style={{ fontSize: 12, padding: '10px 20px' }}>
								+ Add Product
							</button>
						</div>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
							<div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px', gap: 0, padding: '12px 20px', background: '#f7f7f7', fontWeight: 600, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
								<div></div>
								<div>Product</div>
								<div>Category</div>
								<div>Price</div>
								<div>Actions</div>
							</div>
							{PRODUCTS.map((prod) => (
								<div key={prod.id} style={{
									display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px',
									gap: 0, padding: '12px 20px', borderTop: '1px solid #f5f5f5', alignItems: 'center',
								}}>
									<img src={prod.image} alt={prod.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2 }} />
									<div>
										<div style={{ fontSize: 14, fontWeight: 500 }}>{prod.name}</div>
										{prod.badge && <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{prod.badge}</span>}
									</div>
									<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', textTransform: 'capitalize' }}>{prod.cat}</div>
									<div style={{ fontSize: 14, fontWeight: 500 }}>₹{prod.price.toLocaleString('en-IN')}</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<button style={{ padding: '4px 8px', background: 'none', border: '1px solid #ddd', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Edit</button>
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
							Orders
						</h2>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, padding: 40, textAlign: 'center' }}>
							<div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
							<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }}>
								No orders yet. Orders will appear here when customers make purchases.
							</p>
						</div>
					</div>
				)}

				{/* Customers */}
				{activeSection === 'customers' && (
					<div>
						<h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, marginBottom: 32 }}>
							Customers
						</h2>
						<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4, padding: 40, textAlign: 'center' }}>
							<div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
							<p style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)' }}>
								Customer list will populate as users register.
							</p>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
