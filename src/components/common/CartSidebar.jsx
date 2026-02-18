export const CartSidebar = ({ cart, onClose, onRemove, setPage }) => {
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
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					width: 420,
					background: '#fff',
					zIndex: 9001,
					display: 'flex',
					flexDirection: 'column',
					boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
					animation: 'slideUp .4s cubic-bezier(0.22, 1, 0.36, 1)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '28px 36px',
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

				<div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
					{cart.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '80px 0' }}>
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
									gap: 18,
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
									<div
										style={{
											fontSize: 12,
											color: 'rgba(0,0,0,0.35)',
											marginBottom: 10,
										}}
									>
										Qty {item.qty || 1}
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
									}}
								>
									Remove
								</button>
							</div>
						))
					)}
				</div>

				<div style={{ padding: '24px 36px', borderTop: '1px solid #ebebeb' }}>
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
								fontSize: 36,
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
							setPage('checkout');
						}}
						style={{ fontSize: 14 }}
					>
						Checkout →
					</button>
					<button
						data-clickable
						onClick={() => {
							onClose();
							setPage('products');
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
