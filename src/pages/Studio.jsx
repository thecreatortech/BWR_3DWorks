import React from 'react';
import { StudioPage } from '../components/StudioPage';

export default function Studio({ addToCart }) {
	// ...use StudioPage as is, refactor setPage to use navigation if needed
	return <StudioPage addToCart={addToCart} />;
}
