import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/common/Footer';
import { checkRateLimit, resetRateLimit } from '../utils/security';

export default function Login() {
	const { login, loginWithGoogle } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [lockoutMsg, setLockoutMsg] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLockoutMsg('');

		// Rate limiting — 5 attempts per 15 minutes
		const rateCheck = checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000);
		if (!rateCheck.allowed) {
			const mins = Math.ceil(rateCheck.remainingSeconds / 60);
			setLockoutMsg(`Too many login attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}.`);
			return;
		}

		setLoading(true);
		try {
			await login(email, password);
			resetRateLimit(`login_${email}`);
			navigate('/account');
		} catch (err) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	const handleGoogle = async () => {
		setError('');
		try { await loginWithGoogle(); }
		catch (err) { setError(err.message); }
	};

	const inputStyle = {
		width: '100%',
		padding: '14px 18px',
		border: '1px solid #ddd',
		fontSize: 15,
		fontFamily: 'inherit',
		borderRadius: 2,
		outline: 'none',
		transition: 'border-color .2s',
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 440, margin: '0 auto' }}>
					<h1 style={{
						fontFamily: 'var(--font-display)',
						fontSize: 'clamp(32px, 6vw, 48px)',
						fontWeight: 400, color: '#000',
						marginBottom: 12, textAlign: 'center',
					}}>
						Welcome Back
					</h1>
					<p style={{
						fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.5)',
						textAlign: 'center', marginBottom: 40,
					}}>
						Login to track orders and manage your account
					</p>

					{lockoutMsg && (
						<div style={{
							padding: '12px 16px', background: '#fef3c7',
							border: '1px solid #fbbf24', borderRadius: 4,
							color: '#92400e', fontSize: 13, marginBottom: 20, textAlign: 'center',
						}}>
							🔒 {lockoutMsg}
						</div>
					)}

					{error && (
						<div style={{
							padding: '12px 16px', background: '#fee2e2',
							border: '1px solid #fca5a5', borderRadius: 4,
							color: '#dc2626', fontSize: 13, marginBottom: 20,
						}}>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div style={{ marginBottom: 20 }}>
							<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'rgba(0,0,0,0.6)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
								Email
							</label>
							<input type='email' required value={email} onChange={(e) => setEmail(e.target.value)}
								style={inputStyle} placeholder='you@example.com'
								onFocus={(e) => e.target.style.borderColor = '#000'}
								onBlur={(e) => e.target.style.borderColor = '#ddd'}
							/>
						</div>
						<div style={{ marginBottom: 28 }}>
							<label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'rgba(0,0,0,0.6)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
								Password
							</label>
							<input type='password' required value={password} onChange={(e) => setPassword(e.target.value)}
								style={inputStyle} placeholder='••••••••'
								onFocus={(e) => e.target.style.borderColor = '#000'}
								onBlur={(e) => e.target.style.borderColor = '#ddd'}
							/>
						</div>
						<button type='submit' className='btn btn-dark' disabled={loading || !!lockoutMsg}
							style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '16px', opacity: (loading || lockoutMsg) ? 0.7 : 1 }}>
							{loading ? 'Signing in...' : 'Sign In'}
						</button>
					</form>

					<div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
						<div style={{ flex: 1, height: 1, background: '#eee' }} />
						<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>OR</span>
						<div style={{ flex: 1, height: 1, background: '#eee' }} />
					</div>

					<button onClick={handleGoogle} className='btn btn-outline-dark'
						style={{ width: '100%', justifyContent: 'center', fontSize: 13, gap: 10 }}>
						<svg width={18} height={18} viewBox='0 0 24 24'>
							<path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z' />
							<path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
							<path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
							<path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
						</svg>
						Sign in with Google
					</button>

					<div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>
						Don't have an account?{' '}
						<Link to='/register' style={{ color: '#000', fontWeight: 600, textDecoration: 'none' }}>
							Create one →
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
