/*
 * View displayed at a wrong address.
 */

import CentralPanel from "../components/CentralPanel";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "./ErrorView.scss";

function ErrorView() {
    return (
        <div className="ErrorView">
            <Header pageTitle="Ошибка" />
            <CentralPanel title="Не найдено"><span>Вернитесь на главную.</span></CentralPanel>
            <Footer />
        </div>
    );
}

export default ErrorView;
