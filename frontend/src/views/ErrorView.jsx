/*
 * View displayed at a wrong address.
 */

import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";

import "./ErrorView.scss";

function ErrorView() {
    return (
        <div className="ErrorView">
            <Header pageTitle="Ошибка" />
            <TwoPanels left={
                <div className="message-block">
                    <div>Не найдено</div>
                    <div>Вернитесь на главную.</div>
                </div>
            } />
            <Footer />
        </div>
    );
}

export default ErrorView;
