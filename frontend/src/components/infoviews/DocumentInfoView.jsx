/*
 * View displaying information about the document selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

import "./DocumentInfoView.scss";

function DocumentInfoView() {
    return (
        <div className="DocumentInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFilePdf } />
                <span>Документ</span>
            </div>
        </div>
    );
}

export default DocumentInfoView;
