/*
 * View displaying information about the folder selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faArrows, faFolder, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";

import "./FolderInfoView.scss";

function FolderInfoView({ folder }) {
    return (
        <div className="FolderInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFolder } />
                <span>{ folder?.item_name ?? "Папка" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 } buttons={ [
                    <Button text="Скачать" style={ buttonColors.GREEN } ><FontAwesomeIcon icon={ faArchive } /></Button>,
                    <Button style={ buttonColors.BLUE }><FontAwesomeIcon icon={ faPencil } /></Button>,
                    <Button style={ buttonColors.YELLOW }><FontAwesomeIcon icon={ faArrows } /></Button>,
                    <Button style={ buttonColors.RED }><FontAwesomeIcon icon={ faTrashAlt } /></Button>
                ] } />
            </div>
        </div>
    );
}

export default FolderInfoView;
