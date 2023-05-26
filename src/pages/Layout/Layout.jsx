import Header from 'components/Header/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Header />
            <div className="main">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
