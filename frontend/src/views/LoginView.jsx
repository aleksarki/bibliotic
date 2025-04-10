import { useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextInput from "../components/ui/TextInput";

import "./LoginView.scss";

function LoginView() {
    // whether the user is sighing in or sighing up
    const [isSigningIn, setIsSigningIn] = useState(true);

    const form = isSigningIn ? (
        <>
            <span className="form-title">Вход</span>
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
        </>
    ) : (
        <>
            <span className="form-title">Регистрация</span>
            <span>Электронная почта</span>
            <TextInput placeholder="example@domain.com" />
            <span>Пароль</span>
            <TextInput placeholder="P@assw0rd" />
            <span>Повтор пароля</span>
            <TextInput placeholder="P@assw0rd" />
            <Button text="Войти" style={ buttonColors.BLUE } onClick={ () => setIsSigningIn(true) } />
            <Button text="Зарегистрироваться" style={ buttonColors.GREEN } />
        </>
    );

    return (
        <div className="LoginView">
            <Header hideNav={ true } />
            <div className="main">
                <div className="central-form">{ form }</div>
            </div>
            <Footer />
        </div>
    );
}

export default LoginView;
