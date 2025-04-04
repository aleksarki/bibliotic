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
            <Button text="Light" color={ buttonColors.blue } onClick={ () => setTheme(themes.light) } />
            <Button text="Dark" color={ buttonColors.blue } onClick={ () => setTheme(themes.dark) } />
        </div>
    );
}

export default Footer;
