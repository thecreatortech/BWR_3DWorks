import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured, getSupabase } from '../lib/supabase';
import { hashPassword, sanitize, isSessionExpired } from '../utils/security';

const AuthContext = createContext(null);

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};

// Demo mode storage helpers
const DEMO_USERS_KEY = 'bwr3d_demo_users';
const DEMO_SESSION_KEY = 'bwr3d_demo_session';
const DEMO_ORDERS_KEY = 'bwr3d_demo_orders';

const getDemoUsers = () => {
	try { return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]'); } catch { return []; }
};

const saveDemoUsers = (users) => localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));

const getDemoSession = () => {
	try {
		const session = JSON.parse(localStorage.getItem(DEMO_SESSION_KEY));
		// Check session expiry (24 hours)
		if (session && isSessionExpired(session._sessionCreatedAt, 24 * 60 * 60 * 1000)) {
			localStorage.removeItem(DEMO_SESSION_KEY);
			return null;
		}
		return session;
	} catch { return null; }
};

const saveDemoSession = (session) => {
	if (session) {
		session._sessionCreatedAt = Date.now();
		localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
	} else {
		localStorage.removeItem(DEMO_SESSION_KEY);
	}
};

export const getDemoOrders = () => {
	try { return JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]'); } catch { return []; }
};

export const saveDemoOrders = (orders) => localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));

/** Save a new order to demo storage */
export const saveDemoOrder = (order) => {
	const orders = getDemoOrders();
	orders.unshift(order); // newest first
	saveDemoOrders(orders);
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Initialize — check for existing session
	useEffect(() => {
		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase) {
				supabase.auth.getSession().then(({ data: { session } }) => {
					if (session?.user) {
						fetchProfile(session.user);
					}
					setLoading(false);
				});

				const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
					if (session?.user) fetchProfile(session.user);
					else setUser(null);
				});

				return () => subscription?.unsubscribe();
			}
		}

		// Demo mode — restore session with expiry check
		const session = getDemoSession();
		if (session) setUser(session);
		setLoading(false);
	}, []);

	const fetchProfile = async (authUser) => {
		const supabase = getSupabase();
		if (!supabase) return;

		const { data } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', authUser.id)
			.single();

		setUser({
			id: authUser.id,
			email: authUser.email,
			name: data?.name || authUser.user_metadata?.full_name || '',
			phone: data?.phone || '',
			role: data?.role || 'customer',
		});
	};

	const login = useCallback(async (email, password) => {
		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase) {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				return data;
			}
		}

		// Demo mode — hash password and compare
		const hashedPassword = await hashPassword(password);
		const users = getDemoUsers();
		const found = users.find((u) => u.email === sanitize(email) && u.password === hashedPassword);
		if (!found) throw new Error('Invalid email or password');

		const sessionUser = { id: found.id, email: found.email, name: found.name, phone: found.phone, role: found.role };
		setUser(sessionUser);
		saveDemoSession(sessionUser);
		return sessionUser;
	}, []);

	const register = useCallback(async ({ name, email, phone, password }) => {
		// Sanitize all inputs
		const cleanName = sanitize(name);
		const cleanEmail = sanitize(email);
		const cleanPhone = sanitize(phone || '');

		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase) {
				const { data, error } = await supabase.auth.signUp({
					email: cleanEmail,
					password,
					options: { data: { full_name: cleanName } },
				});
				if (error) throw error;

				if (data.user) {
					await supabase.from('profiles').upsert({
						id: data.user.id,
						name: cleanName,
						phone: cleanPhone,
						role: 'customer',
					});
				}
				return data;
			}
		}

		// Demo mode — hash password before storing
		const users = getDemoUsers();
		if (users.find((u) => u.email === cleanEmail)) {
			throw new Error('An account with this email already exists');
		}

		const hashedPassword = await hashPassword(password);
		const newUser = {
			id: `demo_${Date.now()}`,
			email: cleanEmail,
			name: cleanName,
			phone: cleanPhone,
			password: hashedPassword, // stored as SHA-256 hash, not plaintext
			role: 'customer',
			created_at: new Date().toISOString(),
		};
		users.push(newUser);
		saveDemoUsers(users);

		const sessionUser = { id: newUser.id, email: cleanEmail, name: cleanName, phone: cleanPhone, role: 'customer' };
		setUser(sessionUser);
		saveDemoSession(sessionUser);
		return sessionUser;
	}, []);

	const logout = useCallback(async () => {
		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase) await supabase.auth.signOut();
		}
		setUser(null);
		saveDemoSession(null);
	}, []);

	const updateProfile = useCallback(async (updates) => {
		// Sanitize updates
		const cleanUpdates = {};
		if (updates.name) cleanUpdates.name = sanitize(updates.name);
		if (updates.phone) cleanUpdates.phone = sanitize(updates.phone);

		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase && user) {
				await supabase.from('profiles').update(cleanUpdates).eq('id', user.id);
			}
		}

		// Demo mode — update local
		if (user) {
			const users = getDemoUsers();
			const idx = users.findIndex((u) => u.id === user.id);
			if (idx >= 0) {
				users[idx] = { ...users[idx], ...cleanUpdates };
				saveDemoUsers(users);
			}
			const updatedUser = { ...user, ...cleanUpdates };
			setUser(updatedUser);
			saveDemoSession(updatedUser);
		}
	}, [user]);

	const loginWithGoogle = useCallback(async () => {
		if (isSupabaseConfigured) {
			const supabase = getSupabase();
			if (supabase) {
				const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
				if (error) throw error;
				return;
			}
		}
		throw new Error('Google login requires Supabase configuration. Please use email login in demo mode.');
	}, []);

	const isAdmin = user?.role === 'admin';

	return (
		<AuthContext.Provider value={{
			user, loading, isAdmin,
			login, register, logout, updateProfile, loginWithGoogle,
		}}>
			{children}
		</AuthContext.Provider>
	);
};
