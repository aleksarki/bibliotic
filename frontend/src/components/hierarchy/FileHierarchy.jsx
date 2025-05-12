/*
 * Component for displaying folder-document hierarchy.
 */

import { useState } from "react";

import HierarchyItem from "./HierarchyItem";

import "./FileHierarchy.scss";

function FileHierarchy({ hierarchy, onItemSelectionCb }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    function toggleFolder(folderId) {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            }
            else {
                newSet.add(folderId);
            }
            return newSet;
        });
    }

    function toItems(node, level = 0, indexRef = {current: 0}) {
        const currentIndex = indexRef.current++;
        const isFile = node.item_type == "document";
        const isExpanded = expandedFolders.has(node.item_id);
        const hasChildren = node.item_children && node.item_children.length > 0;

        const items = [];

        items.push(
            <HierarchyItem
                key={ node.item_type + node.item_id }
                index={ currentIndex }
                text={ node.item_name }
                level={ level }
                isFile={ isFile }
                isSelected={ currentIndex == selectedIndex }
                onClickCb={ (idx) => {
                    setSelectedIndex(idx);
                    onItemSelectionCb(node);
                } }
                isExpanded={ isExpanded }
                onToggleExpand={ () => toggleFolder(node.item_id) }
            />
        );

        if (!isFile && isExpanded && node.item_children) {
            node.item_children?.forEach(child => {
                items.push(...toItems(child, level + 1, indexRef));
            });
        }

        return items;
    }

    return <div className="FileHierarchy">{ hierarchy ? toItems(hierarchy) : null }</div>;
}

export default FileHierarchy;
