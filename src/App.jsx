import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// ===== GLOBAL STYLES & COMPONENTS =====
import { GlobalStyles } from './components/common/GlobalStyles';
import { CustomCursor } from './components/common/CustomCursor';
import { Toast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { CartSidebar } from './components/common/CartSidebar';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollUpButton } from './components/common/ScrollUpButton';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';

// Page components (lazy-loaded for performance)
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Studio = lazy(() => import('./pages/Studio'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// =====================================================
// PAGE LOADING FALLBACK
// =====================================================
const PageLoader = () => (
	<div
		style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: '#fafafa',
		}}
	>
		<div style={{ textAlign: 'center' }}>
			<div
				style={{
					width: 40,
					height: 40,
					border: '3px solid #ebebeb',
					borderTop: '3px solid #000',
					borderRadius: '50%',
					animation: 'spin 0.8s linear infinite',
					margin: '0 auto 20px',
				}}
			/>
			<div
				style={{
					fontSize: 12,
					fontWeight: 600,
					letterSpacing: '.14em',
					textTransform: 'uppercase',
					color: 'rgba(0,0,0,0.3)',
				}}
			>
				Loading
			</div>
		</div>
	</div>
);

// =====================================================
// INNER APP (has access to contexts)
// =====================================================
function AppInner() {
	const { user } = useAuth();
	const { cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount } = useCart();
	const [cartOpen, setCartOpen] = useState(false);
	const [toastMsg, setToastMsg] = useState('');
	const navigate = useNavigate();

	const showToast = useCallback((msg) => {
		setToastMsg(msg);
		setTimeout(() => setToastMsg(''), 3000);
	}, []);

	const handleAddToCart = useCallback(
		(item) => {
			addToCart(item);
			showToast(`Added: ${item.name}`);
		},
		[addToCart, showToast],
	);

	const onOrderComplete = useCallback(() => {
		clearCart();
		showToast('Order placed! Thank you.');
	}, [clearCart, showToast]);

	useEffect(() => {
		document.title = 'BWR 3D Works — Where Rebellion Meets Precision';
	}, []);

	return (
		<>
			<GlobalStyles />
			<CustomCursor />
			<Toast message={toastMsg} />
			<ScrollToTop />
			<ScrollUpButton />

			<Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

			<Suspense fallback={<PageLoader />}>
				<Routes>
					<Route path='/' element={<Home addToCart={handleAddToCart} />} />
					<Route path='/products' element={<Products addToCart={handleAddToCart} />} />
					<Route path='/products/:id' element={<ProductDetail addToCart={handleAddToCart} />} />
					<Route path='/studio' element={<Studio addToCart={handleAddToCart} />} />
					<Route path='/about' element={<About />} />
					<Route path='/contact' element={<Contact />} />
					<Route
						path='/checkout'
						element={<Checkout cart={cart} onOrderComplete={onOrderComplete} user={user} />}
					/>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/account' element={<Account />} />
					<Route path='/admin' element={<AdminDashboard />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</Suspense>

			{cartOpen && (
				<CartSidebar
					cart={cart}
					onClose={() => setCartOpen(false)}
					onRemove={removeFromCart}
					onUpdateQty={updateCartQty}
				/>
			)}
		</>
	);
}

// =====================================================
// ROOT APP — wraps everything in providers
// =====================================================
export default function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<AppInner />
			</CartProvider>
		</AuthProvider>
	);
}
