import { NavLink } from 'react-router-dom';

import './Header.scss';
import biblio from '../images/biblio.png';

function Header({ pageTitle, pageIndex }) {
    const links = [
        {
            title: 'Каталог',
            path: '/catalogue'
        },
        {
            title: 'Поиск',
            path: '/search'
        },
        {
            title: 'Настройки',
            path: '/options'
        }
    ]

    return (
        <div className="Header">
            <div className="title-block">
                <img src={ biblio } className="logo" alt="logo" />
                <span className="biblio">Библиотик</span>
                <span className="title">{ pageTitle }</span>
            </div>
            <div className="nav-block">{
                links.map((link, index) => (
                    <NavLink
                        to={ link.path }
                        className={ ({ isActive }) => isActive ? "link current" : "link" }
                    >
                        { link.title }
                    </NavLink>
                ))
            }</div>
        </div>
    );
}

export default Header;
