import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

export default function Contact() {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		projectType: 'Prototype Development',
		message: '',
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setTimeout(() => setSubmitted(true), 800);
	};

	return (
		<div style={{ paddingTop: 68, minHeight: '100vh', background: '#fff' }}>
			{/* Hero Section */}
			<section
				style={{
					background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
					padding: 'clamp(60px, 12vw, 100px) clamp(16px, 5vw, 52px)',
					textAlign: 'center',
					color: '#fff',
				}}
			>
				<div style={{ maxWidth: 900, margin: '0 auto' }}>
					<button
						data-clickable
						onClick={() => navigate('/')}
						style={{
							background: 'rgba(255,255,255,0.1)',
							border: '1px solid rgba(255,255,255,0.3)',
							fontSize: 'clamp(11px, 1.5vw, 12px)',
							color: 'rgba(255,255,255,0.7)',
							cursor: 'pointer',
							padding: '8px 16px',
							fontWeight: 400,
							letterSpacing: '.05em',
							textTransform: 'uppercase',
							marginBottom: '32px',
							borderRadius: '4px',
							transition: 'all 0.3s ease',
						}}
						onMouseEnter={(e) => {
							e.target.style.background = 'rgba(255,255,255,0.15)';
							e.target.style.color = '#fff';
						}}
						onMouseLeave={(e) => {
							e.target.style.background = 'rgba(255,255,255,0.1)';
							e.target.style.color = 'rgba(255,255,255,0.7)';
						}}
					>
						← Back Home
					</button>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(40px, 8vw, 72px)',
							fontWeight: 400,
							marginBottom: 'clamp(16px, 3vw, 24px)',
							color: '#fff',
							letterSpacing: '-0.02em',
						}}
					>
						Let's Work Together
					</h1>
					<p
						style={{
							fontSize: 'clamp(13px, 2vw, 18px)',
							color: 'rgba(255,255,255,0.8)',
							lineHeight: 1.6,
							fontWeight: 300,
							maxWidth: 600,
							margin: '0 auto',
						}}
					>
						From concept to reality. We transform your ideas into precision-engineered
						3D solutions.
					</p>
				</div>
			</section>
			{/* Two Column Layout - Info & Form */}
			<section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 52px)' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 'clamp(40px, 8vw, 80px)',
						}}
						className='grid-col-2'
					>
						{/* Contact Information */}
						<div>
							<h2
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 'clamp(24px, 4vw, 36px)',
									fontWeight: 400,
									marginBottom: 'clamp(32px, 6vw, 48px)',
									color: '#000',
									letterSpacing: '-0.01em',
								}}
							>
								Get in touch
							</h2>
							{/* Contact Items */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 'clamp(28px, 5vw, 40px)',
									marginBottom: 'clamp(40px, 8vw, 60px)',
								}}
							>
								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Address
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										Bangalore, India
										<br />
										Design District
									</p>
								</div>
								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Phone
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										+91 (080) 4141-7722
									</p>
								</div>
								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Email
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										hello@bwr3dworks.com
									</p>
								</div>
								<div style={{ borderLeft: '3px solid #000', paddingLeft: 24 }}>
									<p
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											color: 'rgba(0,0,0,0.5)',
											textTransform: 'uppercase',
											letterSpacing: '.08em',
											fontWeight: 500,
											marginBottom: 8,
										}}
									>
										Business Hours
									</p>
									<p
										style={{
											fontSize: 'clamp(14px, 2vw, 16px)',
											color: '#000',
											lineHeight: 1.7,
											fontWeight: 300,
										}}
									>
										Mon - Sat: 9 AM - 6 PM
										<br />
										Sunday: By appointment
									</p>
								</div>
							</div>
							{/* Info Box */}
							<div
								style={{
									background: '#f5f5f5',
									padding: 'clamp(20px, 3vw, 28px)',
									borderRadius: '8px',
									borderLeft: '3px solid #000',
								}}
							>
								<h4
									style={{
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										color: '#000',
										fontWeight: 500,
										marginBottom: 8,
										textTransform: 'uppercase',
										letterSpacing: '.06em',
									}}
								>
									Response Time
								</h4>
								<p
									style={{
										fontSize: 'clamp(12px, 1.5vw, 14px)',
										color: 'rgba(0,0,0,0.7)',
										lineHeight: 1.6,
										fontWeight: 300,
									}}
								>
									We typically respond to all inquiries within 24 hours during
									business days.
								</p>
							</div>
						</div>
						{/* Contact Form */}
						<div>
							{!submitted ? (
								<form onSubmit={handleSubmit}>
									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Full Name
										</label>
										<input
											type='text'
											name='name'
											value={formData.name}
											onChange={handleChange}
											required
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>
									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Email Address
										</label>
										<input
											type='email'
											name='email'
											value={formData.email}
											onChange={handleChange}
											required
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>
									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Phone (Optional)
										</label>
										<input
											type='tel'
											name='phone'
											value={formData.phone}
											onChange={handleChange}
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>
									<div style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Project Type
										</label>
										<select
											name='projectType'
											value={formData.projectType}
											onChange={handleChange}
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												borderRadius: '4px',
												cursor: 'pointer',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										>
											<option>Prototype Development</option>
											<option>Production Manufacturing</option>
											<option>Design Consultation</option>
											<option>Quality Testing</option>
											<option>Other</option>
										</select>
									</div>
									<div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
										<label
											style={{
												display: 'block',
												fontSize: 'clamp(10px, 1.5vw, 11px)',
												color: 'rgba(0,0,0,0.6)',
												textTransform: 'uppercase',
												letterSpacing: '.04em',
												fontWeight: 500,
												marginBottom: 8,
											}}
										>
											Project Details
										</label>
										<textarea
											name='message'
											value={formData.message}
											onChange={handleChange}
											required
											rows={6}
											placeholder='Tell us about your project, requirements, and timeline...'
											style={{
												width: '100%',
												padding: 'clamp(12px, 1.5vw, 16px)',
												border: '2px solid #ddd',
												fontSize: 'clamp(13px, 1.5vw, 15px)',
												fontFamily: 'inherit',
												backgroundColor: '#fff',
												transition: 'all 0.2s ease',
												outline: 'none',
												boxSizing: 'border-box',
												resize: 'vertical',
												minHeight: '140px',
												borderRadius: '4px',
											}}
											onFocus={(e) => {
												e.target.style.borderColor = '#000';
												e.target.style.backgroundColor = '#fff';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = '#ddd';
											}}
										/>
									</div>
									<button
										type='submit'
										className='btn btn-dark'
										style={{
											width: '100%',
											fontSize: 'clamp(11px, 1.5vw, 14px)',
											padding: 'clamp(14px, 1.5vw, 18px) clamp(24px, 3vw, 40px)',
											fontWeight: 500,
											letterSpacing: '.04em',
										}}
									>
										Send Message →
									</button>
								</form>
							) : (
								<div style={{ textAlign: 'center', padding: '80px 40px' }}>
									<div
										style={{
											fontSize: 'clamp(48px, 12vw, 64px)',
											marginBottom: 24,
											lineHeight: 1,
										}}
									>
										✓
									</div>
									<h3
										style={{
											fontFamily: 'var(--font-display)',
											fontSize: 'clamp(24px, 4vw, 36px)',
											fontWeight: 400,
											color: '#000',
											marginBottom: 16,
											letterSpacing: '-0.01em',
										}}
									>
										Message Received
									</h3>
									<p
										style={{
											fontSize: 'clamp(13px, 1.5vw, 15px)',
											fontWeight: 300,
											color: 'rgba(0,0,0,0.6)',
											lineHeight: 1.7,
											marginBottom: 32,
										}}
									>
										Thank you for reaching out. We'll review your message and
										get back to you within 24 hours.
									</p>
									<button
										data-clickable
										onClick={() => navigate('/')}
										className='btn btn-ghost'
										style={{
											fontSize: 'clamp(11px, 1.5vw, 12px)',
											padding: '12px 28px',
										}}
									>
										← Back to Home
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
