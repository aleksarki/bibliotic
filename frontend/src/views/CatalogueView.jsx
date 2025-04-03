import Button, { buttonColors } from "../components/ui/Button";
import DocumentInfoView from "../components/infoviews/DocumentInfoView";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import FolderInfoView from "../components/infoviews/FolderInfoView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StubInfoView from "../components/infoviews/StubInfoView";
import TwoPanels from "../components/TwoPanels";

import { useState } from "react";

import "./CatalogueView.scss";
import { ThemeContext, themes } from "../contexts/ThemeContext";

function CatalogueView() {
    const hierarchy = {title: "root", isfile: false, children: [
        {title: "папка", isFile: false, children: [
            {title: "файл1", isFile: true, children: []}
        ]},
        {title: "файл2", isFile: true, children: []},
        {title: "файл3", isFile: true, children: []}
    ]};

    const [selected, setSelected] = useState(null);

    const a = <ThemeContext.Consumer>{ ({ theme, setTheme}) => <>{setTheme(themes.light)}{theme}</> }</ThemeContext.Consumer>

    return (
        <div className="CatalogueView">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels
                left={ <div className="doc-list">
                    <div className="list-head">
                        <Button text="Сортировка" color={ buttonColors.blue }></Button>
                        <div className="list-header-right-side">
                            <Button text="Создать папку" color={ buttonColors.green } />
                            <Button text="Добавить файл" color={ buttonColors.green } />
                        </div>
                    </div>
                    <div className="list-body">
                        <FileHierarchy
                            hierarchy={ hierarchy }
                            selectionCb={ (idx, node) => {
                                setSelected(node);
                            } }
                        />
                    </div>
                </div> }
                right={ selected == null ? <StubInfoView /> : selected.isFile ? <DocumentInfoView /> : <FolderInfoView /> }
            />
            <Footer />
        </div>
    );
}

export default CatalogueView;
