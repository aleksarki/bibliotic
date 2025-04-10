/*
 * View for search of user documents.
 */

import { useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import TextInput from "../components/ui/TextInput"
import DocumentInfoView from "../components/infoviews/DocumentInfoView";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";

import "./SearchView.scss";

function SearchView() {

    const searchChange = (searchValue) => {
        // search logic
    };

    // dummy hierarchy
    const hierarchy = {title: "root", isfile: false, children: [
        {title: "файл1", isFile: true, children: []},
        {title: "файл2", isFile: true, children: []},
        {title: "файл3", isFile: true, children: []}
    ]};

    // item (folder or document) that is selected by user
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="SearchView">
            <Header pageTitle="Поиск" pageIndex="1" />
            <TwoPanels 
                left={
                    <div className="left-panel-content">
                        <div className="hierarchy-head">
                            <Button text="Сортировка" style={ buttonColors.BLUE } />
                            <div className="hierarchy-head-right-box">
                                <TextInput placeholder="Запрос" onChange={searchChange}/>
                            </div>
                        </div>
                        <div className="hierarchy-body">
                            <FileHierarchy
                                hierarchy={ hierarchy }
                                onItemSelectionCb={ (node) => setSelectedItem(node) }
                            />
                        </div>
                    </div>
                }
                right={ selectedItem == null ? <StubInfoView /> : selectedItem.isFile ? <DocumentInfoView /> : <FolderInfoView /> }
            />
            <Footer />
        </div>
    );
}

export default SearchView;
