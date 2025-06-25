/*
 * View for search of user documents.
 */

import { useEffect, useState } from "react";

import TextInput from "../components/ui/TextInput"
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";
import { getDocumentSearchName, sortBy } from "../util/api";

import "./SearchView.scss";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";

function buildItemPlane(itemArray) {
    const documentMap = {};
    
    itemArray.forEach(item => {
        documentMap[item.item_id] = {
            ...item,
            item_children: null
        };
    });

    const rootNodes = [];
    itemArray.forEach(item => rootNodes.push(documentMap[item.item_id]));

    return {
        item_id: null,
        item_type: "folder",
        item_parent: null,
        item_added: null,
        item_children: rootNodes
    }
}

function SearchView() {
    const [itemArray, setItemArray] = useState(null);
    const [itemTree, setItemTree] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const searchChange = searchValue => {
        getDocumentSearchName(searchValue, req => {
            setItemArray(req.data);
        });
    };

    useEffect(() => {
        getDocumentSearchName("", req => {
            setItemArray(req.data);
        });
    }, []);

    useEffect(() => {
        if (itemArray) {
            setItemTree(buildItemPlane(itemArray, sortBy.NAME, true));
        }
    }, [itemArray]);

    return (
        <div className="SearchView">
            <Header pageTitle="Поиск" pageIndex="1" />
            <TwoPanels 
                left={
                    <div className="left-panel-content">
                        <div className="hierarchy-head">
                            { /*<Button text="Сортировка" style={ buttonColors.BLUE } />*/ }
                            <div className="hierarchy-head-right-box">
                                <TextInput placeholder="Запрос" onChange={searchChange}/>
                            </div>
                        </div>
                        <div className="hierarchy-body">
                            <FileHierarchy
                                hierarchy={ itemTree }
                                onItemSelectionCb={ node => setSelectedItem(node) }
                                showRoot={ false }
                            />
                        </div>
                    </div>
                }
                right={ selectedItem == null ? <StubInfoView /> : <DocumentInfoView document={ selectedItem } /> }
            />
            <Footer />
        </div>
    );
}

export default SearchView;
