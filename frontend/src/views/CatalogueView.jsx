/*
 * View for displaying the catalogue of user documents.
 * User adds, manages and views their documents here.
 */

import { useEffect, useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import ButtonBox from "../components/ui/ButtonBox";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";
import { useFileUploadModal } from "../components/modals/FileUploadModal";
import { getDocumentCatalogue } from "../util/api";


import "./CatalogueView.scss";

function buildItemTree(itemArray) {
    const folderMap = {};
    const documentMap = {};
    
    itemArray.forEach(item => {
        if (item.item_type == "folder") {
            folderMap[item.item_id] = {
                ...item,
                item_children: []
            };
        }
        else {
            documentMap[item.item_id] = {
                ...item,
                item_children: null
            };
        }
    });

    const rootNodes = [];
    itemArray.forEach(item => {
        const map = item.item_type == "folder" ? folderMap : documentMap;
        const node = map[item.item_id];
        if (item.item_parent == null || !folderMap[item.item_parent]) {
            rootNodes.push(node);
        }
        else {
            folderMap[item.item_parent].item_children.push(node);
        }
    });

    return rootNodes[0];
}

function CatalogueView() {
    const [isLoading, setIsLoading] = useState(true);
    const [itemArray, setItemArray] = useState(null);
    const [itemTree, setItemTree] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    //const [FileUploadModal, openFileUploModal, closeFileUploadModal] = useFileUploadModal();

    useEffect(() => {
        getDocumentCatalogue(setItemArray);
    }, []);

    useEffect(() => {
        if (itemArray) {
            setItemTree(buildItemTree(itemArray));
        }
    }, [itemArray]);
    
    const updateCatalogue = () => {
        getDocumentCatalogue(setItemArray);
    };

    let infoView;
    if (!selectedItem) {
        infoView = <StubInfoView />;
    }
    else if (selectedItem.item_type == "document") {
         infoView = <DocumentInfoView document={ selectedItem } updateCatalogue={ updateCatalogue } />;
    }
    else {
        infoView = <FolderInfoView folder={ selectedItem } updateCatalogue={ updateCatalogue } />;
    }

    return <>
        <div className="CatalogueView">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels
                left={
                    <div className="left-panel-content">
                        <div className="hierarchy-head">
                            <Button text="Сортировка" style={ buttonColors.BLUE } />
                            <div className="hierarchy-head-right-box">
                                { /*<ButtonBox gap={ 10 }>
                                    <Button text="Создать папку" style={ buttonColors.GREEN } />
                                    <Button text="Загрузить файл" style={ buttonColors.GREEN } />
                                </ButtonBox>*/ }
                            </div>
                        </div>
                        <div className="hierarchy-body">
                            <FileHierarchy
                                hierarchy={ itemTree }
                                onItemSelectionCb={ (node) => setSelectedItem(node) }
                            />
                        </div>
                    </div>
                }
                right={ infoView }
            />
            <Footer />
        </div>
        { /*<FileUploadModal />*/ }
    </>;
}

export default CatalogueView;
