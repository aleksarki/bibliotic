import { themes, useTheme } from '../contexts/ThemeContext';
import './Footer.scss';
import Button, { buttonColors } from './ui/Button';

function Footer() {
    const {theme, setTheme} = useTheme();

    return (
        <div className="Footer">
            <span className="biblio">Библиотик. 2025</span>
            <a href="https://github.com/aleksarki/bibliotic" className="repo">Gitbub Repo</a>
            { /* temporary solution */ }
            <Button text="Light" color={ buttonColors.blue } onClick={ () => setTheme(themes.light) } />
            <Button text="Dark" color={ buttonColors.blue } onClick={ () => setTheme(themes.dark) } />
        </div>
    );
}

export default Footer;
