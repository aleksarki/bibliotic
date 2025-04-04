/*
 * Component for displaying folder-document hierarchy.
 */

import { useState } from "react";

import HierarchyItem from "./HierarchyItem";

import "./FileHierarchy.scss";

function treeVisitor(selectedIndex, setSelectedIndex, onItemSelectionCb) {
    let level = 0;
    let index = 0;

    function visit(node) {
        ++level;
        const items = [];

        items.push(
            <HierarchyItem
                index={ index }
                text={ node.title }
                level={ level }
                isFile={ node.isFile }
                isSelected={ index == selectedIndex }
                onClickCb={ (idx) => {
                    setSelectedIndex(idx);
                    onItemSelectionCb(node);
                } }
            />
        );
        items.push(<div className="item-separator" />);
        ++index;

        node.children?.forEach(child => {
            items.push(...visit(child));
        });

        --level;
        return items;
    }

    return function(node) {
        const list = visit(node);
        list.pop();
        return list;
    };
}

function FileHierarchy({ hierarchy, onItemSelectionCb }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const toItemsAndSeparators = treeVisitor(selectedIndex, setSelectedIndex, onItemSelectionCb);

    return <div className="FileHierarchy">{ toItemsAndSeparators(hierarchy) }</div>;
}

export default FileHierarchy;
