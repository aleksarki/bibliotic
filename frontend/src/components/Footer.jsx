/*
 * Footer with some info.
 */

import Button, { buttonColors } from './ui/Button';
import { themes, useTheme } from '../contexts/ThemeContext';

import './Footer.scss';

function Footer() {
    const {theme, setTheme} = useTheme();

    return (
        <div className="Footer">
            <span className="app-title">Библиотик. 2025</span>
            <a href="https://github.com/aleksarki/bibliotic" className="app-repo">Gitbub Repo</a>
            { /* temporary solution */ }
            <Button text="Light" style={ buttonColors.BLUE } onClick={ () => setTheme(themes.LIGHT) } />
            <Button text="Dark" style={ buttonColors.BLUE } onClick={ () => setTheme(themes.DARK) } />
            <Button text="Skeuo" style={ buttonColors.BLUE } onClick={ () => setTheme(themes.SKEUO) } />
        </div>
    );
}

export default Footer;
