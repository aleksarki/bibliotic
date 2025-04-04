/*
 * View displaying information about the folder selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import "./FolderInfoView.scss";

function FolderInfoView() {
    return (
        <div className="FolderInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFolder } />
                <span>Папка</span>
            </div>
        </div>
    );
}

export default FolderInfoView;
