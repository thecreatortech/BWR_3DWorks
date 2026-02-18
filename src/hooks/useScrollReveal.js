import { useEffect } from 'react';

export const useScrollReveal = () => {
	useEffect(() => {
		const reveal = () => {
			document.querySelectorAll('.reveal').forEach((el, i) => {
				const r = el.getBoundingClientRect();
				if (r.top < window.innerHeight - 50) {
					setTimeout(() => el.classList.add('in'), i * 40);
				}
			});
		};
		reveal();
		window.addEventListener('scroll', reveal, { passive: true });
		return () => window.removeEventListener('scroll', reveal);
	});
};
