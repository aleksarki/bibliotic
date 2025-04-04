/*
 * Header with navigation links.
 */

import { NavLink } from 'react-router-dom';

import biblio from '../images/biblio.png';
import './Header.scss';

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
                <img src={ biblio } className="app-logo" alt="logo" />
                <span className="app-title">Библиотик</span>
                <span className="view-title">{ pageTitle }</span>
            </div>
            <div className="nav-block">{
                links.map((link, index) => (
                    <NavLink
                        key={ index }
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
