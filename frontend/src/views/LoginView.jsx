import { useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import CentralPanel from "../components/CentralPanel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextInput, { textInputTypes as tiTypes } from "../components/ui/TextInput";

import "./LoginView.scss";

function LoginView() {
    // whether the user is sighing in or sighing up
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [errors, setErrors] = useState([]);

    function validateInputFilled(inputId) {
        const input = document.getElementById(inputId);
        return input.value !== "";
    }

    function validatePswrdMatch(inputId1, inputId2) {
        const input1 = document.getElementById(inputId1);
        const input2 = document.getElementById(inputId2);
        return input1.value === input2.value;
    }

    const SIGN_IN_EMAIL = "si_email";
    const SIGN_IN_PSWRD = "si_pswrd";
    const SIGN_UP_EMAIL = "su_email";
    const SIGN_UP_PSWRD_1 = "su_pswrd_1";
    const SIGN_UP_PSWRD_2 = "su_pswrd_2";

    const validateSignIn = () => {
        const errs = [];
        if (!validateInputFilled(SIGN_IN_EMAIL)) {
            errs.push("Поле «Электронная почта» не заполнено.");
        }
        if (!validateInputFilled(SIGN_IN_PSWRD)) {
            errs.push("Поле «Пароль» не заполнено.");
        }
        // todo: empty the password input
        setErrors(errs);
    }

    const validateSignUp = () => {
        const errs = [];
        if (!validateInputFilled(SIGN_UP_EMAIL)) {
            errs.push("Поле «Электронная почта» не заполнено.");
        }
        if (!validateInputFilled(SIGN_UP_PSWRD_1)) {
            errs.push("Поле «Пароль» не заполнено.");
        }
        if (!validateInputFilled(SIGN_UP_PSWRD_2)) {
            errs.push("Поле «Повтор пароля» не заполнено.");
        }
        if (!validatePswrdMatch(SIGN_UP_PSWRD_1, SIGN_UP_PSWRD_2)) {
            errs.push("Значения полей «Пароль» и «Повтор пароля» не совпадают.");
        }
        // todo: empty the password inputs
        setErrors(errs);
    }

    const switchPage = () => {
        setIsSigningIn(!isSigningIn);
        setErrors([]);
    }

    const panel = isSigningIn ? (
        <CentralPanel title="Вход">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput id={ SIGN_IN_EMAIL } type={ tiTypes.EMAIL } placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput id={ SIGN_IN_PSWRD } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            { errors.map((value) => <span className="error">{ value }</span>) }
            <Button text="Войти" style={ buttonColors.GREEN } onClick={ validateSignIn } />
            <Button text="Зарегистрироваться" style={ buttonColors.BLUE } onClick={ switchPage } />
        </CentralPanel>
    ) : (  // sign up
        <CentralPanel title="Регистрация">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput id={ SIGN_UP_EMAIL } type={ tiTypes.EMAIL } placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput id={ SIGN_UP_PSWRD_1 } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            <div className="form-row">
                <span>Повтор пароля</span>
                <TextInput id={ SIGN_UP_PSWRD_2 } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            { errors.map((value) => <span className="error">{ value }</span>) }
            <Button text="Зарегистрироваться" style={ buttonColors.GREEN } onClick={ validateSignUp } />
            <Button text="Войти" style={ buttonColors.BLUE } onClick={ switchPage } />
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
