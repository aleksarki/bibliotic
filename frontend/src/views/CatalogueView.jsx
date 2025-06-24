/*
 * View for displaying the catalogue of user documents.
 * User adds, manages and views their documents here.
 */

import { useEffect, useState } from "react";

import Button, { buttonColors } from "../components/ui/Button";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";
import { getDocumentCatalogue, sortBy } from "../util/api";


import "./CatalogueView.scss";

function buildItemTree(itemArray, sorting) {
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

    Object.values(folderMap).forEach(folder => {
        if (folder.item_children) {
            folder.item_children.sort((a, b) => {
                switch (sorting) {
                case sortBy.NAME:
                    return a.item_name.localeCompare(b.item_name);
                case sortBy.NAME_REVERSE:
                    return b.item_name.localeCompare(a.item_name);
                case sortBy.DATE:
                    return new Date(a.item_added) - new Date(b.item_added);
                case sortBy.DATE_REVERSE: 
                    return new Date(b.item_added) - new Date(a.item_added);
                }
            });
        }
    });

    return rootNodes[0];
}

function CatalogueView() {
    const [isLoading, setIsLoading] = useState(true);
    const [itemArray, setItemArray] = useState(null);
    const [itemTree, setItemTree] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sorting, setSorting] = useState(sortBy.NAME);

    useEffect(() => {
        getDocumentCatalogue(setItemArray);
    }, []);

    useEffect(() => {
        if (itemArray) {
            setItemTree(buildItemTree(itemArray, sorting));
        }
    }, [itemArray, sorting]);
    
    const updateCatalogue = () => {
        getDocumentCatalogue(setItemArray);
    };

    const resort = event => {
        setSorting(event.target.value);
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
                            <select onChange={ resort }>
                                <option value={ sortBy.NAME }>Название (А-Я)</option>
                                <option value={ sortBy.NAME_REVERSE }>Название (Я-А)</option>
                                <option value={ sortBy.DATE }>Дата загрузки (сначала старые)</option>
                                <option value={ sortBy.DATE_REVERSE }>Дата загрузки (сначала новые)</option>
                            </select>
                            { /*<div className="hierarchy-head-right-box" />*/ }
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
