import './Header.scss';
import biblio from '../images/biblio.png';

function Header({ pageTitle, pageIndex }) {
    const pages = ["Каталог", "Поиск", "Настройки"];

    return (
        <div className="Header">
            <div className="title-block">
                <img src={ biblio } className="logo" alt="logo" />
                <span className="biblio">Библиотик</span>
                <span className="title">{ pageTitle }</span>
            </div>
            <div className="nav-block">{
                pages.map((page, index) => (
                    <span className={ index == pageIndex && "current" }>{ page }</span>
                ))
            }</div>
        </div>
    );
}

export default Header;
