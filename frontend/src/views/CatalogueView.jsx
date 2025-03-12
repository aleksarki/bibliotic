import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";

import "./CatalogueView.scss";

function CatalogueView() {
    return (
        <div className="CatalogueView">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels />
            <Footer />
        </div>
    );
}

export default CatalogueView;
