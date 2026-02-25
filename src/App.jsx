import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// ===== COMPONENTS =====
import { CustomCursor } from './components/common/CustomCursor';
import { Toast } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { CartSidebar } from './components/common/CartSidebar';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollUpButton } from './components/common/ScrollUpButton';
import { ErrorBoundary } from './components/common/ErrorBoundary';
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
// PAGE LOADING FALLBACK — Skeleton Loaders
// =====================================================
import { PageSkeleton } from './components/common/PageSkeleton';
import { PageTransition } from './components/common/PageTransition';
import { SplashScreen } from './components/common/SplashScreen';


// =====================================================
// INNER APP (has access to contexts)
// =====================================================
function AppInner() {
	const { user } = useAuth();
	const { cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount } = useCart();
	const [cartOpen, setCartOpen] = useState(false);
	const [toastMsg, setToastMsg] = useState('');
	const [splashComplete, setSplashComplete] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const isHomePage = location.pathname === '/';

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

	// Checkout now handles order saving internally via CartContext + AuthContext

	useEffect(() => {
		document.title = 'BWR Works — Where Rebellion Meets Precision';
	}, []);

	return (
		<>
			{!splashComplete && (
				<SplashScreen
					isHomePage={isHomePage}
					onComplete={() => setSplashComplete(true)}
				/>
			)}

			<CustomCursor />
			<Toast message={toastMsg} />
			<ScrollToTop />
			<ScrollUpButton />

			<Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} splashComplete={splashComplete} />

			<Suspense fallback={<PageSkeleton />}>
			<PageTransition>
				<Routes>
					<Route path='/' element={<Home addToCart={handleAddToCart} />} />
					<Route path='/products' element={<Products addToCart={handleAddToCart} />} />
					<Route path='/products/:slug' element={<ProductDetail addToCart={handleAddToCart} />} />
					<Route path='/studio' element={<Studio addToCart={handleAddToCart} />} />
					<Route path='/about' element={<About />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/checkout' element={<Checkout />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/account' element={<Account />} />
					<Route path='/admin' element={<AdminDashboard />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</PageTransition>
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
		<ErrorBoundary>
			<AuthProvider>
				<CartProvider>
					<AppInner />
				</CartProvider>
			</AuthProvider>
		</ErrorBoundary>
	);
}
