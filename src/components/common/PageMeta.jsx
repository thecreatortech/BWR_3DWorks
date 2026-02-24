import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO component — sets page title, meta description, and JSON-LD per route.
 * Drop into any page to update document head.
 */
export default function PageMeta({ title, description, jsonLd }) {
	const location = useLocation();

	useEffect(() => {
		// Update title
		document.title = title
			? `${title} — BWR 3D Works`
			: 'BWR 3D Works — Where Rebellion Meets Precision';

		// Update meta description
		const metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc && description) {
			metaDesc.setAttribute('content', description);
		}

		// Update OG tags
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) ogTitle.setAttribute('content', title || 'BWR 3D Works');

		const ogDesc = document.querySelector('meta[property="og:description"]');
		if (ogDesc && description) ogDesc.setAttribute('content', description);

		// Inject JSON-LD structured data
		let scriptEl = document.querySelector('script[data-page-jsonld]');
		if (jsonLd) {
			if (!scriptEl) {
				scriptEl = document.createElement('script');
				scriptEl.type = 'application/ld+json';
				scriptEl.setAttribute('data-page-jsonld', 'true');
				document.head.appendChild(scriptEl);
			}
			scriptEl.textContent = JSON.stringify(jsonLd);
		} else if (scriptEl) {
			scriptEl.remove();
		}

		return () => {
			// Cleanup JSON-LD on unmount
			const el = document.querySelector('script[data-page-jsonld]');
			if (el) el.remove();
		};
	}, [title, description, jsonLd, location.pathname]);

	return null;
}

/**
 * Common JSON-LD generators
 */
export const productJsonLd = (product) => ({
	'@context': 'https://schema.org',
	'@type': 'Product',
	name: product.name,
	description: product.desc,
	image: product.image,
	brand: { '@type': 'Brand', name: 'BWR 3D Works' },
	offers: {
		'@type': 'Offer',
		price: product.price,
		priceCurrency: 'INR',
		availability: (product.stock || 0) > 0
			? 'https://schema.org/InStock'
			: 'https://schema.org/OutOfStock',
		seller: { '@type': 'Organization', name: 'BWR 3D Works' },
	},
});

export const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: 'BWR 3D Works',
	description: 'Premium 3D printed objects — nameplates, sculptures, gifts. Bengaluru, India.',
	url: 'https://bwr3dworks.com',
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Bengaluru',
		addressCountry: 'IN',
	},
};
