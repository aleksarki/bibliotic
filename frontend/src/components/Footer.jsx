/*
 * Footer with some info.
 */

import Button, { buttonColors } from "./ui/Button";
import ButtonBox from "./ui/ButtonBox";
import { themes, useTheme } from "../contexts/ThemeContext";

import './Footer.scss';

function Footer() {
    const {theme, setTheme} = useTheme();

    return (
        <div className="Footer">
            <span className="app-title">Библиотик. 2025</span>
            <a href="https://github.com/aleksarki/bibliotic" className="app-repo">Gitbub Repo</a>
            { /* temporary solution */ }
            <span>Установить тему:</span>
            <ButtonBox gap={ 10 } buttons={ [
                <Button text="Light" style={ buttonColors.GREEN } onClick={ () => setTheme(themes.LIGHT) } />,
                <Button text="Dark" style={ buttonColors.BLUE } onClick={ () => setTheme(themes.DARK) } />,
                <Button text="Skeuo" style={ buttonColors.SKEUO } onClick={ () => setTheme(themes.SKEUO) } />
            ] } />
        </div>
    );
}

export default Footer;
