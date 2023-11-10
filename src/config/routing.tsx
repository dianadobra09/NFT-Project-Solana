import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import HowToBuy from '../pages/HowToBuy';
import Gumdrop from '../pages/Gumdrop';
import Rarities from '../pages/Rarities';

export const ROUTES = {
	HOME: '/',
	HOW_TO_BUY: '/how-to-buy',
	MINTING: '/minting',
	WHITELIST: '/whitelist/claim',
	RARITY: '/rarity',
};

const Routing: React.FC<any> = () => {
	const renderContent = (): JSX.Element => {
		return (
			<Routes>
				<Route path={ROUTES.HOME} element={<Home />} />
				<Route path={ROUTES.HOW_TO_BUY} element={<HowToBuy />} />
				<Route path={ROUTES.WHITELIST} element={<Gumdrop />} />
				<Route path={ROUTES.RARITY} element={<Rarities />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		);
	};
	return renderContent();
};

export default Routing;
