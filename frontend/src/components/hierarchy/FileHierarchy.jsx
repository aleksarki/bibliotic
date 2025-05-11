/*
 * Component for displaying folder-document hierarchy.
 */

import { useState } from "react";

import HierarchyItem from "./HierarchyItem";

import "./FileHierarchy.scss";

function FileHierarchy({ hierarchy, onItemSelectionCb }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    function toItems(node, level = 0, indexRef = {current: 0}) {
        const currentIndex = indexRef.current++;
        const items = [];

        items.push(
            <HierarchyItem
                key={ node.item_type + node.item_id }
                index={ currentIndex }
                text={ node.item_name }
                level={ level }
                isFile={ node.item_type == "document" }
                isSelected={ currentIndex == selectedIndex }
                onClickCb={ (idx) => {
                    setSelectedIndex(idx);
                    onItemSelectionCb(idx);
                } }
            />
        );

        node.item_children?.forEach(child => {
            items.push(...toItems(child, level + 1, indexRef));
        });

        return items;
    }

    return <div className="FileHierarchy">{ hierarchy ? toItems(hierarchy) : null }</div>;
}

export default FileHierarchy;
