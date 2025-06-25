/*
 * Component for displaying folder-document hierarchy.
 */

import { useEffect, useState } from "react";

import HierarchyItem from "./HierarchyItem";

import "./FileHierarchy.scss";

function FileHierarchy({ hierarchy, onItemSelectionCb, showRoot = true }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    // automatically expand root
    useEffect(() => {
        if (!hierarchy) return;

        const newExpanded = new Set();
        
        if (showRoot) {
            newExpanded.add(hierarchy.item_id);
        } else if (hierarchy.item_children) {
            // if don't show root - expand its 1st level children
            hierarchy.item_children.forEach(child => {
                if (child.item_type === "folder") {
                    newExpanded.add(child.item_id);
                }
            });
        }
        
        setExpandedFolders(newExpanded);
    }, [hierarchy, showRoot]);

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
        const isFile = node.item_type === "document";
        const isExpanded = expandedFolders.has(node.item_id);
        const hasChildren = node.item_children && node.item_children.length > 0;

        const items = [];

        if (showRoot || level > 0) {
            items.push(
                <HierarchyItem
                    key={ node.item_type + node.item_id }
                    index={ currentIndex }
                    text={ node.item_name }
                    level={ showRoot ? level : level - 1 }
                    isFile={ isFile }
                    isSelected={ currentIndex === selectedIndex }
                    onClickCb={ (idx) => {
                        setSelectedIndex(idx);
                        onItemSelectionCb(node);
                    } }
                    isExpanded={ isExpanded }
                    onToggleExpand={ () => toggleFolder(node.item_id) }
                />
            );
        }

        if (!isFile && isExpanded && node.item_children) {
            node.item_children.forEach(child => {
                items.push(...toItems(child, level + 1, indexRef));
            });
        }

        return items;
    }

    if (!showRoot && hierarchy) {
        const indexRef = { current: 0 };
        const items = [];
        
        if (hierarchy.item_children) {
            hierarchy.item_children.forEach(child => {
                items.push(...toItems(child, 1, indexRef));  // starting with level=1
            });
        }
        
        return <div className="FileHierarchy">{ items }</div>;
    }

    return <div className="FileHierarchy">{ hierarchy ? toItems(hierarchy) : null }</div>;
}

export default FileHierarchy;
