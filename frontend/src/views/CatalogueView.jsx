/*
 * View for displaying the catalogue of user documents.
 * User adds, manages and views their documents here.
 */

import { useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import ButtonBox from "../components/ui/ButtonBox";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";

import "./CatalogueView.scss";

function CatalogueView() {
    // dummy hierarchy
    const hierarchy = {title: "root", isfile: false, children: [
        {title: "папка", isFile: false, children: [
            {title: "файл1", isFile: true}
        ]},
        {title: "файл2", isFile: true},
        {title: "файл3", isFile: true}
    ]};

    // item (folder or document) that is selected by user
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="CatalogueView">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels
                left={
                    <div className="left-panel-content">
                        <div className="hierarchy-head">
                            <Button text="Сортировка" style={ buttonColors.BLUE } />
                            <div className="hierarchy-head-right-box">
                                <ButtonBox gap={ 10 } buttons={ [
                                    <Button text="Создать папку" style={ buttonColors.GREEN } />,
                                    <Button text="Добавить файл" style={ buttonColors.GREEN } />
                                ] } />
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

export default CatalogueView;
