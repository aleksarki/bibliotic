/*
 * View displaying information about the folder selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faArrows, faFileUpload, faFolder, faFolderPlus, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import { useOkCancelModal } from "../modals/OkCancelModal";
import { useFileUploadModal } from "../modals/FileUploadModal";
import { postDocumentUpload } from "../../util/api";

import "./FolderInfoView.scss";

function FolderInfoView({ folder, updateCatalogue }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal] = useOkCancelModal();
    const [FileUploadModal, openFileUploadModal, closeFileUploadModal, fulfilFileUploadModal] = useFileUploadModal();

    function handleDeleteFolder() {
        // FIX: api call
        console.log(`Deleted ${folder.item_id}`);
    }

    function handleUploadDocument(selectedFile) {
        fulfilFileUploadModal(false);
        postDocumentUpload(selectedFile, folder.item_id, selectedFile.name, () => {
            fulfilFileUploadModal(true);
            updateCatalogue?.();
        });        
    }

    return <>
        <div className="FolderInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFolder } />
                <span>{ folder?.item_name ?? "Папка" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 }>
                    <Button text="Создать папку" icon={ faFolderPlus } style={ buttonColors.GREEN } />
                    <Button text="Загрузить файл" icon={ faFileUpload } onClick={ openFileUploadModal } style={ buttonColors.GREEN } />
                </ButtonBox>
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
            onOk={ handleDeleteFolder }
        />
        <FileUploadModal onOk={ handleUploadDocument } />
    </>;
}

export default FolderInfoView;
