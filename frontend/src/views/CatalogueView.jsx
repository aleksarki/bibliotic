import Button from "../components/ui/Button";
import FileHierarchy from "../components/hierarchy/FileHierarchy";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TwoPanels from "../components/TwoPanels";

import "./CatalogueView.scss";

function CatalogueView() {
    const hierarchy = {title: "root", isfile: false, children: [
        {title: "папка", isFile: false, children: [
            {title: "файл1", isFile: true, children: []}
        ]},
        {title: "файл2", isFile: true, children: []},
        {title: "файл3", isFile: true, children: []}
    ]};

    return (
        <div className="CatalogueView">
            <Header pageTitle="Каталог" pageIndex="0" />
            <TwoPanels left={ <div className="doc-list">
                <div className="list-head">
                    <Button text="Сортировка" fgcolor="white" bgcolor="blue"></Button>
                    <div className="list-header-right-side">
                        <Button text="Создать папку" fgcolor="white" bgcolor="green" />
                        <Button text="Добавить файл" fgcolor="white" bgcolor="green" />
                    </div>
                </div>
                <div className="list-body">
                    <FileHierarchy hierarchy={ hierarchy } />
                </div>
            </div> } />
            <Footer />
        </div>
    );
}

export default CatalogueView;
