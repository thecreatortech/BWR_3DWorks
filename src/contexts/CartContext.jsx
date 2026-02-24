import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PRODUCTS } from '../utils/products';

const CartContext = createContext(null);

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
};

const CART_KEY = 'bwr3d_cart';
const WISHLIST_KEY = 'bwr3d_wishlist';

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(() => {
		try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
	});
	const [wishlist, setWishlist] = useState(() => {
		try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch { return []; }
	});

	useEffect(() => {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}, [cart]);

	useEffect(() => {
		localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
	}, [wishlist]);

	const addToCart = useCallback((item) => {
		// Validate price against source of truth (products.js)
		const sourceProduct = PRODUCTS.find(p => p.id === item.id);
		if (sourceProduct) {
			// If a variant was selected, validate the variant price
			const variantMatch = sourceProduct.variants?.find(v => v.name === item.variant);
			const validPrice = variantMatch ? variantMatch.price : sourceProduct.price;
			// Use the validated price from products.js, not the client-submitted price
			item = { ...item, price: validPrice };
		}

		setCart((prev) => {
			const existing = prev.findIndex(
				(c) => c.id === item.id && c.variant === item.variant
			);
			if (existing >= 0) {
				const updated = [...prev];
				updated[existing] = { ...updated[existing], qty: (updated[existing].qty || 1) + (item.qty || 1) };
				return updated;
			}
			return [...prev, { ...item, qty: item.qty || 1 }];
		});
	}, []);

	const removeFromCart = useCallback((idx) => {
		setCart((prev) => prev.filter((_, i) => i !== idx));
	}, []);

	const updateCartQty = useCallback((idx, newQty) => {
		setCart((prev) => {
			if (newQty <= 0) return prev.filter((_, i) => i !== idx);
			return prev.map((item, i) => (i === idx ? { ...item, qty: newQty } : item));
		});
	}, []);

	const clearCart = useCallback(() => {
		setCart([]);
		localStorage.removeItem(CART_KEY);
	}, []);

	// Wishlist
	const toggleWishlist = useCallback((productId) => {
		setWishlist((prev) => {
			if (prev.includes(productId)) {
				return prev.filter(id => id !== productId);
			}
			return [...prev, productId];
		});
	}, []);

	const isInWishlist = useCallback((productId) => {
		return wishlist.includes(productId);
	}, [wishlist]);

	const cartCount = cart.reduce((s, c) => s + (c.qty || 1), 0);
	const cartTotal = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);

	return (
		<CartContext.Provider value={{
			cart, addToCart, removeFromCart, updateCartQty, clearCart,
			cartCount, cartTotal,
			wishlist, toggleWishlist, isInWishlist,
		}}>
			{children}
		</CartContext.Provider>
	);
};
