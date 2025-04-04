/*
 * View for search of user documents.
 */

import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";

import "./SearchView.scss";

function SearchView() {
    return (
        <div className="SearchView">
            <Header pageTitle="Поиск" pageIndex="1" />
            <TwoPanels />
            <Footer />
        </div>
    );
}

export default SearchView;
