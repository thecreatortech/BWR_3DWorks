import { useNavigate } from 'react-router-dom';

export const CartSidebar = ({ cart, onClose, onRemove, onUpdateQty }) => {
	const navigate = useNavigate();
	const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
	return (
		<>
			<div
				onClick={onClose}
				style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(0,0,0,0.5)',
					zIndex: 9000,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn .3s',
				}}
			/>
			<div
				className='cart-sidebar'
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					width: 420,
					maxWidth: '100%',
					background: '#fff',
					zIndex: 9001,
					display: 'flex',
					flexDirection: 'column',
					boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
					animation: 'slideInRight .4s cubic-bezier(0.22, 1, 0.36, 1)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: 'clamp(20px, 4vw, 28px) clamp(20px, 5vw, 36px)',
						borderBottom: '1px solid #ebebeb',
					}}
				>
					<h2
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 24,
							fontWeight: 400,
							color: '#000',
						}}
					>
						Cart
					</h2>
					<button
						data-clickable
						onClick={onClose}
						style={{
							width: 38,
							height: 38,
							background: '#ebebeb',
							border: 'none',
							borderRadius: '50%',
							cursor: 'pointer',
							fontSize: 18,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#000',
							transition: 'background .2s',
						}}
					>
						×
					</button>
				</div>

				<div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px, 4vw, 28px) clamp(20px, 5vw, 36px)' }}>
					{cart.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '80px 0' }}>
							<div style={{ fontSize: 48, marginBottom: 16, opacity: 0.15 }}>🛒</div>
							<p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.35)' }}>
								Your cart is empty
							</p>
						</div>
					) : (
						cart.map((item, i) => (
							<div
								key={i}
								style={{
									display: 'flex',
									gap: 16,
									padding: '20px 0',
									borderBottom: '1px solid #ebebeb',
									animation: 'csIn .35s',
								}}
							>
								<div style={{ flex: 1 }}>
									<div
										style={{
											fontSize: 14,
											fontWeight: 500,
											color: '#000',
											marginBottom: 4,
										}}
									>
										{item.name}
									</div>
									{/* Quantity controls */}
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 0,
											marginBottom: 10,
											marginTop: 8,
										}}
									>
										<button
											data-clickable
											onClick={() => onUpdateQty(i, (item.qty || 1) - 1)}
											style={{
												width: 32,
												height: 32,
												background: '#f5f5f5',
												border: '1px solid #ebebeb',
												borderRadius: '4px 0 0 4px',
												cursor: 'pointer',
												fontSize: 16,
												fontWeight: 400,
												color: '#000',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												transition: 'background .2s',
											}}
										>
											−
										</button>
										<div
											style={{
												width: 40,
												height: 32,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												background: '#fff',
												border: '1px solid #ebebeb',
												borderLeft: 'none',
												borderRight: 'none',
												fontSize: 13,
												fontWeight: 600,
												color: '#000',
											}}
										>
											{item.qty || 1}
										</div>
										<button
											data-clickable
											onClick={() => onUpdateQty(i, (item.qty || 1) + 1)}
											style={{
												width: 32,
												height: 32,
												background: '#f5f5f5',
												border: '1px solid #ebebeb',
												borderRadius: '0 4px 4px 0',
												cursor: 'pointer',
												fontSize: 16,
												fontWeight: 400,
												color: '#000',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												transition: 'background .2s',
											}}
										>
											+
										</button>
									</div>
									<div style={{ fontSize: 18, fontWeight: 300, color: '#000' }}>
										${item.price * (item.qty || 1)}
									</div>
								</div>
								<button
									data-clickable
									onClick={() => onRemove(i)}
									style={{
										background: 'none',
										border: 'none',
										fontSize: 10,
										fontWeight: 700,
										color: 'rgba(0,0,0,0.25)',
										cursor: 'pointer',
										fontFamily: 'var(--font-sans)',
										alignSelf: 'flex-start',
										padding: '4px 0',
									}}
								>
									Remove
								</button>
							</div>
						))
					)}
				</div>

				<div style={{ padding: 'clamp(16px, 4vw, 24px) clamp(20px, 5vw, 36px)', borderTop: '1px solid #ebebeb' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'baseline',
							marginBottom: 20,
						}}
					>
						<span
							style={{
								fontSize: 11,
								fontWeight: 700,
								letterSpacing: '.12em',
								textTransform: 'uppercase',
							}}
						>
							Total
						</span>
						<span
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 'clamp(28px, 6vw, 36px)',
								fontWeight: 400,
								letterSpacing: '-0.02em',
							}}
						>
							${total}
						</span>
					</div>
					<button
						data-clickable
						className='btn btn-dark btn-full'
						onClick={() => {
							onClose();
							navigate('/checkout');
						}}
						style={{ fontSize: 14 }}
					>
						Checkout →
					</button>
					<button
						data-clickable
						onClick={() => {
							onClose();
							navigate('/products');
						}}
						style={{
							width: '100%',
							background: 'none',
							border: 'none',
							fontSize: 13,
							color: 'rgba(0,0,0,0.4)',
							cursor: 'pointer',
							marginTop: 12,
							padding: '8px 0',
							fontFamily: 'var(--font-sans)',
						}}
					>
						Continue Shopping
					</button>
				</div>
			</div>
		</>
	);
};
