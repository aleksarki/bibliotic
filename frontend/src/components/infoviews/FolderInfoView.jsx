/*
 * View displaying information about the folder selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faArrows, faFolder, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";

import "./FolderInfoView.scss";
import { useOkCancelModal } from "../modals/OkCancelModal";

function FolderInfoView({ folder }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal] = useOkCancelModal();

    function deleteFolder() {
        // FIX: api call
        console.log(`Deleted ${folder.item_id}`);
    }

    return <>
        <div className="FolderInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFolder } />
                <span>{ folder?.item_name ?? "Папка" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 } >
                    <Button text="Скачать" icon={ faArchive } style={ buttonColors.GREEN } />
                    <Button icon={ faPencil } style={ buttonColors.BLUE } />
                    <Button icon={ faArrows } style={ buttonColors.YELLOW } />
                    <Button icon={ faTrashAlt } onClick={ openDeleteModal } style={ buttonColors.RED } />
                </ButtonBox>
            </div>
        </div>
        <DeleteModal
            title="Подтверждение удаления папки"
            text={ `Вы действительно хотите удалить папку «${folder.item_name}» со всем её содержимым?` }
            onOk={ deleteFolder }
        />
    </>;
}

export default FolderInfoView;
