import React from 'react';

/**
 * Error Boundary — catches rendering errors and shows a fallback UI
 * instead of crashing the entire app (white screen).
 */
export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('ErrorBoundary caught:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{
					minHeight: '100vh', display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center', padding: 40,
					background: '#fff', textAlign: 'center',
				}}>
					<div style={{ fontSize: 64, marginBottom: 24 }}>⚠️</div>
					<h1 style={{
						fontFamily: 'var(--font-display)', fontSize: 36,
						fontWeight: 400, marginBottom: 12, color: '#000',
					}}>
						Something went wrong
					</h1>
					<p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
						We encountered an unexpected error. Please try refreshing the page.
					</p>
					<button
						onClick={() => window.location.reload()}
						className='btn btn-dark'
						style={{ fontSize: 14, padding: '14px 32px' }}
					>
						Refresh Page
					</button>
					{process.env.NODE_ENV === 'development' && this.state.error && (
						<pre style={{
							marginTop: 32, padding: 16, background: '#f5f5f5',
							fontSize: 12, maxWidth: '80vw', overflow: 'auto',
							textAlign: 'left', borderRadius: 4,
						}}>
							{this.state.error.toString()}
						</pre>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}
