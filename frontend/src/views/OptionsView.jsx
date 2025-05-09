/*
 * View for managing the apllication options.
 */

import Button, { buttonColors } from "../components/ui/Button";
import ButtonBox from "../components/ui/ButtonBox";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";
import { themes, useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

import "./OptionsView.scss";

function OptionsView() {
    const {theme, setTheme} = useTheme();
    const {logout} = useAuth();

    return (
        <div className="OptionsView">
            <Header pageTitle="Настройки" pageIndex="2" />
            <TwoPanels left={
                <div className="left-panel">
                    <div className="option-row">
                        <span>Тема оформления</span>
                        <ButtonBox gap={ 10 } buttons={ [
                            <Button text="Светлая" style={ buttonColors.GREEN } onClick={ () => setTheme(themes.LIGHT) } />,
                            <Button text="Тёмная" style={ buttonColors.BLUE } onClick={ () => setTheme(themes.DARK) } />,
                            <Button text="Скевоморф" style={ buttonColors.SKEUO } onClick={ () => setTheme(themes.SKEUO) } />
                        ] } />
                    </div>
                    <div className="option-row">
                        <span>Аккаунт</span>
                        <ButtonBox gap={ 10 } buttons={ [
                            <Button text="Сменить пароль" style={ buttonColors.YELLOW } />,
                            <Button text="Выйти" style={ buttonColors.RED } onClick={ logout } />
                        ] } />
                    </div>
                </div>
            } />
            <Footer />
        </div>
    );
}

export default OptionsView;
