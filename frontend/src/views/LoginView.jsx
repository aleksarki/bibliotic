import { useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import CentralPanel from "../components/CentralPanel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextInput from "../components/ui/TextInput";

import "./LoginView.scss";

function LoginView() {
    // whether the user is sighing in or sighing up
    const [isSigningIn, setIsSigningIn] = useState(true);

    const panel = isSigningIn ? (
        <CentralPanel title="Вход">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput placeholder="P@assw0rd" />
            </div>
            <Button text="Зарегистрироваться" style={ buttonColors.BLUE } onClick={ () => setIsSigningIn(false) } />
            <Button text="Войти" style={ buttonColors.GREEN } />
        </CentralPanel>
    ) : (
        <CentralPanel title="Регистрация">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput placeholder="P@assw0rd" />
            </div>
            <div className="form-row">
                <span>Повтор пароля</span>
                <TextInput placeholder="P@assw0rd" />
            </div>
            <Button text="Войти" style={ buttonColors.BLUE } onClick={ () => setIsSigningIn(true) } />
            <Button text="Зарегистрироваться" style={ buttonColors.GREEN } />
        </CentralPanel>
    );

    return (
        <div className="LoginView">
            <Header hideNav={ true } />
            { panel }
            <Footer />
        </div>
    );
}

export default LoginView;
