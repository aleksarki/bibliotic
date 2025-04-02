import HierarchyItem from "./HierarchyItem";

import { useState } from "react";

import "./FileHierarchy.scss";

function FileHierarchy({ hierarchy, selectionCb }) {
    const [selected, setSelected] = useState(null);

    let level = 0;
    let index = 0;

    function visit(node) {
        ++level;
        const items = [];

        items.push(<HierarchyItem
            index={ index }
            text={ node.title }
            level={ level }
            isFile={ node.isFile }
            isSelected={ index == selected }
            clickCb={ (idx) => {
                setSelected(idx);
                selectionCb(idx, node);
            } }
        />);
        items.push(<div className="h-sep" />);

        ++index;

        if (node.children) {
            node.children.forEach(child => {
                items.push(...visit(child));
            });
        }

        --level;
        return items;
    }

    const tree = visit(hierarchy);
    tree.pop();


    return (
        <div className="FileHierarchy">
            { tree }
        </div>
    );
}

export default FileHierarchy;
