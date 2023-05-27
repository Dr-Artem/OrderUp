import { NavLink } from 'react-router-dom';
import style from './Header.module.css';

const Header = () => {
    return (
        <header className={style.header}>
            <ul className={style.headerNav}>
                {/* <li>
                    <NavLink className={style.headerLink}>OrderUp</NavLink>
                </li> */}
                <li>
                    <NavLink to="/shop" className={style.headerLink}>
                        Shop
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/cart" className={style.headerLink}>
                        Shopping Cart
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" className={style.headerLink}>
                        History
                    </NavLink>
                </li>
            </ul>
            <ul className={style.headerAuth}>
                <li>
                    <NavLink className={style.headerLink}>Log In</NavLink>
                </li>
                <li>
                    <NavLink className={style.headerLink}>Sign up</NavLink>
                </li>
            </ul>
        </header>
    );
};

export default Header;
