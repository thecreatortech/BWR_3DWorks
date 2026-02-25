import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const PageTransition = ({ children }) => {
	const location = useLocation();
	const [key, setKey] = useState(location.key);

	useEffect(() => {
		setKey(location.key);
	}, [location.key]);

	return (
		<div key={key} className="page-enter">
			{children}
		</div>
	);
};
