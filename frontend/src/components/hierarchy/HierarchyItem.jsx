import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder } from '@fortawesome/free-solid-svg-icons'

import "./HierarchyItem.scss";

function HierarchyItem({ index, text, level, isFile, isSelected, clickCb }) {
    return (
        <div
            className="HierarchyItem"
            style={ isSelected ? {backgroundColor: "lemonchiffon"} : {} }
            onClick={ () => clickCb(index) }
        >
            <div className="title" style={ {marginLeft: level*20 + 'px', color: isSelected && 'black'} }>
                <FontAwesomeIcon icon={ isFile ? faFilePdf : faFolder } />
                <span style={ {fontStyle: isFile ? 'normal' : 'italic'} }>{ text }</span>
            </div>
            <div>
                { isSelected && <span className="label-selected">Выбрано</span> }
            </div>
        </div>
    );
}

export default HierarchyItem;
