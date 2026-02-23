import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/common/Footer';
import { validatePassword, validateEmail, validatePhone, sanitize } from '../utils/security';

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', terms: false });
	const [error, setError] = useState('');
	const [passwordErrors, setPasswordErrors] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleChange = (field) => (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));

		// Live password validation
		if (field === 'password') {
			const { errors } = validatePassword(value);
			setPasswordErrors(errors);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		// Validate
		if (!form.terms) { setError('Please accept the terms'); return; }
		if (!validateEmail(form.email)) { setError('Please enter a valid email address'); return; }
		if (form.phone && !validatePhone(form.phone)) { setError('Please enter a valid Indian phone number'); return; }
		const pwCheck = validatePassword(form.password);
		if (!pwCheck.valid) { setError(pwCheck.errors.join('. ')); return; }

		setLoading(true);
		try {
			await register({
				name: sanitize(form.name),
				email: sanitize(form.email),
				phone: sanitize(form.phone),
				password: form.password,
			});
			navigate('/account');
		} catch (err) {
			setError(err.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	const inputStyle = {
		width: '100%', padding: '14px 18px', border: '1px solid #ddd',
		fontSize: 15, fontFamily: 'inherit', borderRadius: 2,
		outline: 'none', transition: 'border-color .2s',
	};
	const labelStyle = {
		display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8,
		color: 'rgba(0,0,0,0.6)', letterSpacing: '.04em', textTransform: 'uppercase',
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			<section style={{ padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 440, margin: '0 auto' }}>
					<h1 style={{
						fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 48px)',
						fontWeight: 400, color: '#000', marginBottom: 12, textAlign: 'center',
					}}>
						Create Account
					</h1>
					<p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.5)', textAlign: 'center', marginBottom: 40 }}>
						Join BWR to track orders and save your preferences
					</p>

					{error && (
						<div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, color: '#dc2626', fontSize: 13, marginBottom: 20 }}>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div style={{ marginBottom: 20 }}>
							<label style={labelStyle}>Full Name *</label>
							<input type='text' required value={form.name} onChange={handleChange('name')} style={inputStyle} placeholder='Priya Sharma' />
						</div>
						<div style={{ marginBottom: 20 }}>
							<label style={labelStyle}>Email *</label>
							<input type='email' required value={form.email} onChange={handleChange('email')} style={inputStyle} placeholder='priya@example.com' />
						</div>
						<div style={{ marginBottom: 20 }}>
							<label style={labelStyle}>Phone</label>
							<input type='tel' value={form.phone} onChange={handleChange('phone')} style={inputStyle} placeholder='+91 98765 43210' />
						</div>
						<div style={{ marginBottom: 8 }}>
							<label style={labelStyle}>Password *</label>
							<input type='password' required value={form.password} onChange={handleChange('password')} style={inputStyle} placeholder='Strong password' />
						</div>
						{/* Password strength indicator */}
						{form.password && (
							<div style={{ marginBottom: 20 }}>
								<div style={{
									display: 'flex', gap: 4, marginBottom: 6,
								}}>
									{[0, 1, 2, 3].map((i) => (
										<div key={i} style={{
											flex: 1, height: 3, borderRadius: 2,
											background: passwordErrors.length <= i ? '#059669' : '#e5e5e5',
											transition: 'background .3s',
										}} />
									))}
								</div>
								{passwordErrors.length > 0 && (
									<div style={{ fontSize: 11, color: '#dc2626', lineHeight: 1.5 }}>
										{passwordErrors.map((err, i) => (
											<div key={i}>• {err}</div>
										))}
									</div>
								)}
								{passwordErrors.length === 0 && (
									<div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ Strong password</div>
								)}
							</div>
						)}

						<label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 28, cursor: 'pointer' }}>
							<input type='checkbox' checked={form.terms} onChange={handleChange('terms')} style={{ width: 18, height: 18, marginTop: 2, cursor: 'pointer' }} />
							<span style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5 }}>
								I agree to the Terms of Service and Privacy Policy
							</span>
						</label>

						<button type='submit' className='btn btn-dark' disabled={loading}
							style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '16px', opacity: loading ? 0.7 : 1 }}>
							{loading ? 'Creating Account...' : 'Create Account'}
						</button>
					</form>

					<div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>
						Already have an account?{' '}
						<Link to='/login' style={{ color: '#000', fontWeight: 600, textDecoration: 'none' }}>
							Sign in →
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
