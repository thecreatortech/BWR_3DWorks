// =====================================================
// INPUT SANITIZATION & SECURITY UTILITIES
// =====================================================

/**
 * Sanitize a string to prevent XSS — strips HTML tags and trims whitespace
 */
export const sanitize = (str) => {
	if (typeof str !== 'string') return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.trim();
};

/**
 * Sanitize an object — applies sanitize() to all string values
 */
export const sanitizeObject = (obj) => {
	if (!obj || typeof obj !== 'object') return obj;
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'string') {
			result[key] = sanitize(value);
		} else if (typeof value === 'object' && value !== null) {
			result[key] = sanitizeObject(value);
		} else {
			result[key] = value;
		}
	}
	return result;
};

/**
 * Hash a password using SHA-256 (async, uses Web Crypto API)
 * Returns hex string
 */
export const hashPassword = async (password) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(password + '_bwr3d_salt_2024');
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate password strength
 * Returns { valid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
	const errors = [];
	if (password.length < 8) errors.push('At least 8 characters required');
	if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
	if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
	if (!/[0-9]/.test(password)) errors.push('At least one number');
	return { valid: errors.length === 0, errors };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate Indian phone number
 */
export const validatePhone = (phone) => {
	if (!phone) return true; // optional
	const cleaned = phone.replace(/[\s\-()]+/g, '');
	return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

/**
 * Validate Indian pincode
 */
export const validatePincode = (pincode) => {
	return /^[1-9][0-9]{5}$/.test(pincode);
};

/**
 * Rate limiter — tracks attempts per key
 */
const rateLimitStore = {};

export const checkRateLimit = (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
	const now = Date.now();
	if (!rateLimitStore[key]) {
		rateLimitStore[key] = { attempts: [], lockedUntil: 0 };
	}

	const entry = rateLimitStore[key];

	// Check if locked out
	if (entry.lockedUntil > now) {
		const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
		return { allowed: false, remainingSeconds };
	}

	// Clean old attempts
	entry.attempts = entry.attempts.filter(t => t > now - windowMs);

	if (entry.attempts.length >= maxAttempts) {
		entry.lockedUntil = now + windowMs;
		return { allowed: false, remainingSeconds: Math.ceil(windowMs / 1000) };
	}

	entry.attempts.push(now);
	return { allowed: true, attemptsLeft: maxAttempts - entry.attempts.length };
};

export const resetRateLimit = (key) => {
	delete rateLimitStore[key];
};

/**
 * Session expiry check — returns true if session is expired
 */
export const isSessionExpired = (sessionTimestamp, maxAgeMs = 24 * 60 * 60 * 1000) => {
	if (!sessionTimestamp) return true;
	return Date.now() - sessionTimestamp > maxAgeMs;
};
