import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import Button, { buttonColors } from "../components/ui/Button";
import CentralPanel from "../components/CentralPanel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextInput, { textInputTypes as tiTypes } from "../components/ui/TextInput";

import "./LoginView.scss";

// Validate that input field has been filled
function validateInputFilled(inputId) {
    const input = document.getElementById(inputId);
    return input.value !== "";
}

// Validate that two input fields have the same value
function validatePswrdMatch(inputId1, inputId2) {
    const input1 = document.getElementById(inputId1);
    const input2 = document.getElementById(inputId2);
    return input1.value === input2.value;
}

// Panel for signing in
function LoginPanel({ switcher }) {
    const {login} = useAuth();
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const EMAIL_INPUT = "email_input";
    const PSWRD_INPUT = "pswrd_input";

    const doLogin = async () => {
        const errs = [];
        if (!validateInputFilled(EMAIL_INPUT)) {
            errs.push("Поле «Электронная почта» не заполнено.");
        }
        if (!validateInputFilled(PSWRD_INPUT)) {
            errs.push("Поле «Пароль» не заполнено.");
        }
        if (errs.length > 0) {
            setErrors(errs);
            return;
        }
        const result = await login(
            document.getElementById(EMAIL_INPUT).value,
            document.getElementById(PSWRD_INPUT).value
        );
        if (result.success) {
            setErrors([]);
            navigate("/catalogue");
        }
        else {
            setErrors(["Неверные почта или пароль"]);
        }
    };

    return (
        <CentralPanel title="Вход">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput id={ EMAIL_INPUT } type={ tiTypes.EMAIL } placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput id={ PSWRD_INPUT } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            { errors.map((value) => <span className="error">{ value }</span>) }
            <Button text="Войти" style={ buttonColors.GREEN } onClick={ doLogin } />
            <Button text="Регистрация" style={ buttonColors.BLUE } onClick={ switcher } />
        </CentralPanel>
    );
}

// Panel for signing up
function RegisterPanel({ switcher }) {
    const [errors, setErrors] = useState([]);

    const EMAIL_INPUT = "email_input";
    const PSWRD_1_INPUT = "pswrd_1_input";
    const PSWRD_2_INPUT = "pswrd_2_input";

    const doRegister = async () => {
        const errs = [];
        if (!validateInputFilled(EMAIL_INPUT)) {
            errs.push("Поле «Электронная почта» не заполнено.");
        }
        if (!validateInputFilled(PSWRD_1_INPUT)) {
            errs.push("Поле «Пароль» не заполнено.");
        }
        if (!validateInputFilled(PSWRD_2_INPUT)) {
            errs.push("Поле «Повтор пароля» не заполнено.");
        }
        if (!validatePswrdMatch(PSWRD_1_INPUT, PSWRD_2_INPUT)) {
            errs.push("Значения полей «Пароль» и «Повтор пароля» не совпадают.");
        }
    };

    return (
        <CentralPanel title="Регистрация">
            <div className="form-row">
                <span>Электронная почта</span>
                <TextInput id={ EMAIL_INPUT } type={ tiTypes.EMAIL } placeholder="example@domain.com" />
            </div>
            <div className="form-row">
                <span>Пароль</span>
                <TextInput id={ PSWRD_1_INPUT } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            <div className="form-row">
                <span>Повтор пароля</span>
                <TextInput id={ PSWRD_2_INPUT } type={ tiTypes.PASSWORD } placeholder="P@assw0rd" />
            </div>
            { errors.map((value) => <span className="error">{ value }</span>) }
            <Button text="Зарегистрироваться" style={ buttonColors.GREEN } onClick={ doRegister } />
            <Button text="Вход" style={ buttonColors.BLUE } onClick={ switcher } />
        </CentralPanel>
    );
}

function LoginView() {
    // whether the user is sighing in or sighing up (registering)
    const [isSigningIn, setIsSigningIn] = useState(true);

    const switchPage = () => {
        setIsSigningIn(!isSigningIn);
    };

    return (
        <div className="LoginView">
            <Header hideNav={ true } />
            { isSigningIn ? <LoginPanel switcher={ switchPage } /> : <RegisterPanel switcher={ switchPage }/> }
            <Footer />
        </div>
    );
}

export default LoginView;
