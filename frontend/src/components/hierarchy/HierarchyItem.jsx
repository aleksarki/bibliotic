/*
 * Item of folder-document hierarchy.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolderClosed, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

import "./HierarchyItem.scss";

function HierarchyItem({
    index, text, level, isFile, isSelected, onClickCb,
    isExpanded, onToggleExpand
}) {
    // todo: redo this?
    return (
        <div
            className={ `HierarchyItem ${isSelected ? " selected-item" : ""}`}
            onClick={ () => onClickCb(index) }
        >
            <div className="item-box">
                <div
                    className="item-title"
                    style={ {marginLeft: level*20 + 'px', color: isSelected ? "black" : "inherit"} }
                >
                    { !isFile && (
                        <button
                            className="expand-button"
                            onClick={ e => {
                                e.stopPropagation();
                                onToggleExpand();
                            } }
                        >
                            <FontAwesomeIcon icon={ isExpanded ? faFolderOpen : faFolderClosed } />
                        </button>
                    ) }
                    { isFile && <FontAwesomeIcon className="file-icon" icon={ faFilePdf } /> }
                    <span style={ {fontStyle: isFile ? 'normal' : 'italic'} }>{ text }</span>
                </div>
                <div>{ isSelected && <span className="item-selection-label">Выбрано</span> }</div>
            </div>
        </div>
    );
}

export default HierarchyItem;
