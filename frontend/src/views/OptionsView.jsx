/*
 * View for managing the apllication options.
 */

import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";

import "./OptionsView.scss";

function OptionsView() {
    return (
        <div className="OptionsView">
            <Header pageTitle="Настройки" pageIndex="2" />
            <TwoPanels />
            <Footer />
        </div>
    );
}

export default OptionsView;
