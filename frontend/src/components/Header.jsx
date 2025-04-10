/*
 * Header with navigation links.
 */

import { NavLink } from 'react-router-dom';

import biblio from '../images/biblio.png';
import './Header.scss';
import Button, { buttonColors } from './ui/Button';
import ButtonBox from './ui/ButtonBox';

function Header({ pageTitle, pageIndex, hideNav }) {
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
    ];

    const buttons = links.map((link, index) => (
        <Button style={ buttonColors.SKEUO } >
            <NavLink
                key={ index }
                to={ link.path }
                className={ ({ isActive }) => isActive ? "link current" : "link" }
            >
                { link.title }
            </NavLink>
        </Button>
    ));

    return (
        <div className="Header">
            <div className="title-block">
                <img src={ biblio } className="app-logo" alt="logo" />
                <span className="app-title">Библиотик</span>
                <span className="view-title">{ pageTitle }</span>
            </div>
            { hideNav ? null : <div className="nav-block"><ButtonBox buttons={ buttons } gap={ 15 } /></div> }
        </div>
    );
}

export default Header;
