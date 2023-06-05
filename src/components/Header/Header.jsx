import { NavLink } from 'react-router-dom';
import style from './Header.module.css';

const Header = () => {
    return (
        <header className={style.header}>
            <ul className={style.headerNav}>
                {/* <li>
                    <NavLink className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}>OrderUp</NavLink>
                </li> */}
                <li>
                    <NavLink
                        to="/shop"
                        className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}
                    >
                        Shop
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/cart"
                        className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}
                    >
                        Shopping Cart
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/history"
                        className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}
                    >
                        History
                    </NavLink>
                </li>
            </ul>
            <ul className={style.headerAuth}>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}
                    >
                        Log In
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? `${style.active}` : `${style.headerLink}`)}
                    >
                        Sign up
                    </NavLink>
                </li>
            </ul>
        </header>
    );
};

export default Header;
