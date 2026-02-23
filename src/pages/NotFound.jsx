import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

export default function NotFound() {
	return (
		<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			<section
				data-dark
				style={{
					flex: 1,
					background: 'linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					padding: '120px 24px 80px',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Decorative circles */}
				{[700, 420].map((s) => (
					<div
						key={s}
						style={{
							position: 'absolute',
							width: s,
							height: s,
							border: `1px solid rgba(255,255,255,${s === 700 ? 0.03 : 0.06})`,
							borderRadius: '50%',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-50%)',
							pointerEvents: 'none',
						}}
					/>
				))}
				<div style={{ position: 'relative', zIndex: 2 }}>
					<div
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(100px, 20vw, 200px)',
							fontWeight: 400,
							color: 'rgba(255,255,255,0.06)',
							lineHeight: 1,
							marginBottom: -20,
							letterSpacing: '-0.04em',
						}}
					>
						404
					</div>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(32px, 5vw, 56px)',
							fontWeight: 400,
							color: '#fff',
							marginBottom: 20,
							letterSpacing: '-0.02em',
						}}
					>
						Page Not Found
					</h1>
					<p
						style={{
							fontSize: 'clamp(14px, 2vw, 17px)',
							fontWeight: 300,
							color: 'rgba(255,255,255,0.45)',
							lineHeight: 1.7,
							maxWidth: 440,
							margin: '0 auto 40px',
						}}
					>
						The page you're looking for doesn't exist or has been moved. Let's get you
						back on track.
					</p>
					<div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
						<Link to='/' className='btn btn-white' data-clickable>
							Back to Home
						</Link>
						<Link to='/products' className='btn btn-ghost' data-clickable>
							Browse Products
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
