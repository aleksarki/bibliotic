/*
 * Item of folder-document hierarchy.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder } from "@fortawesome/free-solid-svg-icons";

import "./HierarchyItem.scss";

function HierarchyItem({ index, text, level, isFile, isSelected, onClickCb }) {
    // todo: redo this, currently looks like s
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
                    <FontAwesomeIcon icon={ isFile ? faFilePdf : faFolder } />
                    <span style={ {fontStyle: isFile ? 'normal' : 'italic'} }>{ text }</span>
                </div>
                <div>{ isSelected && <span className="item-selection-label">Выбрано</span> }</div>
            </div>
        </div>
    );
}

export default HierarchyItem;
