/*
 * View for search of user documents.
 */

import { useEffect, useState } from "react";
import TextInput from "../components/ui/TextInput";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";
import { getDocumentSearchName, getDocumentSearchKeywords } from "../util/api";
import "./SearchView.scss";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";

function SearchView() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchType, setSearchType] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        if (!query.trim()) {
            setItems([]);
            return;
        }

        const handleResponse = (response) => {
            // Проверяем, что response существует и содержит data
            if (response && response.data) {
                setItems(response.data);
            } else {
                console.error('Invalid response format:', response);
                setItems([]);
            }
        };

        if (searchType === 'name') {
            getDocumentSearchName(query, handleResponse);
        } else {
            getDocumentSearchKeywords(query, handleResponse);
        }
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        handleSearch(value);
    };


    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
        }
    };

    return (
        <div className="SearchView">
            <Header pageTitle="Поиск" pageIndex="1" />
            <TwoPanels 
                left={
                    <div className="left-panel-content">
                        <div className="hierarchy-head">
                            <div className="hierarchy-head-right-box">
                                <select
                                    value={searchType}
                                    onChange={handleSearchTypeChange}
                                    className="search-type-select"
                                >
                                    <option value="name">По названию</option>
                                    <option value="keywords">По ключевым словам</option>
                                </select>
                                <TextInput
                                    placeholder={searchType === 'name' 
                                        ? "Поиск по названию" 
                                        : "Поиск по ключевым словам"}
                                    onChange={handleSearchChange}
                                    value={searchQuery}
                                />
                            </div>
                        </div>
                        <div className="hierarchy-body">
                            <FileHierarchy
                                hierarchy={{
                                    item_id: null,
                                    item_type: "folder",
                                    item_parent: null,
                                    item_added: null,
                                    item_children: items.map(item => ({
                                        ...item,
                                        item_children: null
                                    }))
                                }}
                                onItemSelectionCb={setSelectedItem}
                                showRoot={false}
                            />
                        </div>
                    </div>
                }
                right={
                    selectedItem ? (
                        selectedItem.item_type === 'document' ? (
                            <DocumentInfoView document={selectedItem} />
                        ) : (
                            <StubInfoView />
                        )
                    ) : (
                        <StubInfoView />
                    )
                }
            />
            <Footer />
        </div>
    );
}

export default SearchView;