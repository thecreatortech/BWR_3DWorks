import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
};

const CART_KEY = 'bwr3d_cart';

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState(() => {
		try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
	});

	useEffect(() => {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}, [cart]);

	const addToCart = useCallback((item) => {
		setCart((prev) => {
			// Check if same product+variant exists
			const existing = prev.findIndex(
				(c) => c.id === item.id && c.name === item.name
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

	const cartCount = cart.reduce((s, c) => s + (c.qty || 1), 0);
	const cartTotal = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);

	return (
		<CartContext.Provider value={{
			cart, addToCart, removeFromCart, updateCartQty, clearCart,
			cartCount, cartTotal,
		}}>
			{children}
		</CartContext.Provider>
	);
};
