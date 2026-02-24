import { useLocation } from 'react-router-dom';

/* ============================
   Skeleton Primitives
   ============================ */
const shimmerStyle = {
	background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
	backgroundSize: '400% 100%',
	animation: 'shimmer 1.5s ease-in-out infinite',
	borderRadius: 4,
};

const Box = ({ w = '100%', h = 20, r = 4, mb = 0, style = {} }) => (
	<div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, ...shimmerStyle, ...style }} />
);

const Circle = ({ size = 40, mb = 0, style = {} }) => (
	<div style={{ width: size, height: size, borderRadius: '50%', marginBottom: mb, ...shimmerStyle, ...style }} />
);

/* ============================
   Home Page Skeleton
   ============================ */
const HomeSkeleton = () => (
	<div style={{ minHeight: '100vh' }}>
		{/* Hero section */}
		<div style={{ background: '#0a0a0a', padding: 'clamp(60px, 12vw, 120px) clamp(16px, 5vw, 52px)', minHeight: '100vh' }}>
			<Box w={180} h={14} mb={40} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="60%" h={60} mb={16} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="50%" h={60} mb={16} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="40%" h={50} mb={30} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="70%" h={16} mb={12} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)', backgroundSize: '400% 100%' }} />
			<Box w="50%" h={16} mb={40} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)', backgroundSize: '400% 100%' }} />
			<Box w={260} h={52} mb={12} r={0} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #444 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w={260} h={52} r={0} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #444 50%, #222 75%)', backgroundSize: '400% 100%' }} />
		</div>
		{/* Marquee */}
		<Box w="100%" h={60} mb={0} r={0} style={{ background: '#111' }} />
		{/* Products section */}
		<div style={{ padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)' }}>
			<Box w={120} h={12} mb={16} />
			<Box w="40%" h={44} mb={12} />
			<Box w="60%" h={16} mb={50} />
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
				{[1, 2, 3].map(i => (
					<div key={i}>
						<Box h={300} mb={16} />
						<Box w="70%" h={16} mb={8} />
						<Box w="30%" h={14} />
					</div>
				))}
			</div>
		</div>
	</div>
);

/* ============================
   Products Page Skeleton
   ============================ */
const ProductsSkeleton = () => (
	<div style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)', maxWidth: 1400, margin: '0 auto' }}>
		<Box w={80} h={12} mb={30} />
		<Box w="35%" h={44} mb={12} />
		<Box w="60%" h={16} mb={40} />
		{/* Search bar */}
		<Box w="100%" h={52} mb={30} style={{ maxWidth: 500 }} />
		{/* Category filters */}
		<div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
			{[70, 100, 90, 80, 60, 80].map((w, i) => (
				<Box key={i} w={w} h={38} r={2} />
			))}
		</div>
		{/* Product grid */}
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
			{[1, 2, 3, 4, 5].map(i => (
				<div key={i}>
					<Box h={320} mb={16} r={4} />
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flex: 1 }}>
							<Box w="80%" h={16} mb={8} />
							<Box w="40%" h={14} />
						</div>
						<Circle size={32} />
					</div>
				</div>
			))}
		</div>
	</div>
);

/* ============================
   Product Detail Skeleton
   ============================ */
const ProductDetailSkeleton = () => (
	<div style={{ padding: 'clamp(40px, 8vw, 60px) clamp(16px, 5vw, 52px)', maxWidth: 1400, margin: '0 auto' }}>
		<Box w={100} h={12} mb={30} />
		<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="grid-col-2">
			{/* Image gallery */}
			<div>
				<Box h={500} mb={12} r={4} />
				<div style={{ display: 'flex', gap: 8 }}>
					{[1, 2, 3, 4].map(i => <Box key={i} w={72} h={72} r={4} />)}
				</div>
			</div>
			{/* Product info */}
			<div>
				<Box w="80%" h={36} mb={12} />
				<Box w={120} h={16} mb={8} />
				<Box w={100} h={14} mb={20} />
				<Box w={80} h={32} mb={30} />
				{/* Variants */}
				<Box w={80} h={12} mb={12} />
				<div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
					{[1, 2, 3].map(i => <Box key={i} w={120} h={40} r={4} />)}
				</div>
				{/* Quantity + buttons */}
				<Box w={120} h={44} mb={12} />
				<Box w="100%" h={52} mb={8} r={0} />
				<Box w="100%" h={52} r={0} style={{ ...shimmerStyle, background: 'linear-gradient(90deg, #d4f5d4 25%, #b8e8b8 50%, #d4f5d4 75%)', backgroundSize: '400% 100%' }} />
			</div>
		</div>
	</div>
);

/* ============================
   Generic Page Skeleton (About, Contact, Studio, etc.)
   ============================ */
const GenericSkeleton = () => (
	<div>
		{/* Hero banner */}
		<div style={{ background: '#111', padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 52px)', textAlign: 'center' }}>
			<Box w={120} h={36} mb={16} style={{ margin: '0 auto', ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="50%" h={44} mb={16} style={{ margin: '0 auto', ...shimmerStyle, background: 'linear-gradient(90deg, #222 25%, #333 50%, #222 75%)', backgroundSize: '400% 100%' }} />
			<Box w="60%" h={16} style={{ margin: '0 auto', ...shimmerStyle, background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)', backgroundSize: '400% 100%' }} />
		</div>
		{/* Content */}
		<div style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 52px)', maxWidth: 900, margin: '0 auto' }}>
			<Box w="100%" h={16} mb={12} />
			<Box w="90%" h={16} mb={12} />
			<Box w="80%" h={16} mb={30} />
			<Box w="100%" h={200} mb={30} r={8} />
			<Box w="100%" h={16} mb={12} />
			<Box w="70%" h={16} mb={12} />
			<Box w="85%" h={16} mb={30} />
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
				<Box h={150} r={8} />
				<Box h={150} r={8} />
			</div>
		</div>
	</div>
);

/* ============================
   Auth Skeleton (Login/Register)
   ============================ */
const AuthSkeleton = () => (
	<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
		<div style={{ width: '100%', maxWidth: 400, padding: 40 }}>
			<Box w={200} h={32} mb={8} style={{ margin: '0 auto' }} />
			<Box w={160} h={14} mb={40} style={{ margin: '0 auto' }} />
			<Box w="100%" h={52} mb={16} />
			<Box w="100%" h={52} mb={16} />
			<Box w="100%" h={52} mb={24} />
			<Box w="100%" h={48} mb={16} r={0} />
			<Box w={140} h={14} style={{ margin: '0 auto' }} />
		</div>
	</div>
);

/* ============================
   Skeleton Router — picks the right skeleton based on pathname
   ============================ */
export const PageSkeleton = () => {
	const { pathname } = useLocation();

	if (pathname === '/') return <HomeSkeleton />;
	if (pathname === '/products') return <ProductsSkeleton />;
	if (pathname.startsWith('/products/')) return <ProductDetailSkeleton />;
	if (pathname === '/login' || pathname === '/register') return <AuthSkeleton />;
	return <GenericSkeleton />;
};
