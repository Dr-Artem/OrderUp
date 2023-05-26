import { Route, Routes } from 'react-router';

import CartPage from 'pages/CartPage/CartPage';
import Homepage from 'pages/Homepage/Homepage';
import Layout from 'pages/Layout/Layout';
import ShopPage from 'pages/ShopPage/ShopPage';

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="cart" element={<CartPage />} />
                </Route>
            </Routes>
        </>
    );
};
