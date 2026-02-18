/**
 * Responsive utility for mobile-first design
 * Desktop styles are applied at all breakpoints by default (max-width)
 * Mobile overrides use max-width media queries
 */

export const getResponsiveStyle = (baseStyle, mobileStyle = {}, tabletStyle = {}) => {
	// Base style is for desktop (unchanged)
	// Mobile style overrides for screens <= 768px
	// Tablet style overrides for screens 481px-768px
	return { ...baseStyle };
};

// Pre-built responsive padding values
export const RESPONSIVE_PADDING = {
	// Mobile-first padding
	mobile: { padding: '20px 16px' },
	tablet: { padding: '40px 24px' },
	desktop: { padding: '52px' },

	// Large padding for sections
	sectionMobile: { padding: '60px 16px' },
	sectionTablet: { padding: '80px 24px' },
	sectionDesktop: { padding: '120px 52px' },

	// Large padding for featured sections
	featuredMobile: { padding: '40px 16px' },
	featuredTablet: { padding: '80px 24px' },
	featuredDesktop: { padding: '140px 52px' },

	// CTA padding
	ctaMobile: { padding: '100px 16px' },
	ctaTablet: { padding: '140px 24px' },
	ctaDesktop: { padding: '180px 52px' },
};

// Media query helper for CSS
export const mobileQuery = '@media (max-width: 768px)';
export const tabletQuery = '@media (min-width: 481px) and (max-width: 768px)';
export const desktopQuery = '@media (min-width: 769px)';

// Helper to create responsive values with media queries
export const responsiveValue = (mobileVal, tabletVal, desktopVal) => ({
	mobile: mobileVal,
	tablet: tabletVal,
	desktop: desktopVal,
});

// Grid responsive helpers
export const gridResponsive = {
	col2Mobile: { gridTemplateColumns: '1fr' },
	col2Tablet: { gridTemplateColumns: '1fr' },
	col2Desktop: { gridTemplateColumns: '1fr 1fr' },

	col3Mobile: { gridTemplateColumns: '1fr' },
	col3Tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
	col3Desktop: { gridTemplateColumns: 'repeat(3, 1fr)' },
};

// Font size responsive helpers
export const fontResponsive = {
	h1: 'clamp(28px, 7vw, 110px)',
	h2: 'clamp(24px, 4.5vw, 68px)',
	h3: 'clamp(20px, 3.5vw, 48px)',
	body: 'clamp(14px, 2vw, 16px)',
};

/**
 * Helper to build responsive inline styles using CSS variables
 * Usage: Apply through style prop with media queries in global styles
 */
export const createResponsiveStyle = (baseStyle) => {
	// If you need to apply data attributes or classes, do it here
	return baseStyle;
};

// Example responsive styles for common components
export const RESPONSIVE_STYLES = {
	heroSection: {
		mobile: {
			paddingLeft: '16px',
			paddingRight: '16px',
			paddingTop: '68px',
			minHeight: '600px',
		},
		desktop: {
			paddingLeft: '52px',
			paddingRight: '52px',
			paddingTop: '68px',
			minHeight: '700px',
		},
	},

	gridColumn2: {
		mobile: { display: 'grid', gridTemplateColumns: '1fr', gap: '24px' },
		tablet: { display: 'grid', gridTemplateColumns: '1fr', gap: '40px' },
		desktop: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' },
	},

	gridColumn3: {
		mobile: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
		tablet: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' },
		desktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' },
	},

	maxWidth: {
		mobile: { maxWidth: '100%', paddingLeft: '16px', paddingRight: '16px' },
		tablet: { maxWidth: '100%', paddingLeft: '24px', paddingRight: '24px' },
		desktop: { maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' },
	},
};
