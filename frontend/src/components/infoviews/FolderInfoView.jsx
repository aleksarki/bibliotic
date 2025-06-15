/*
 * View displaying information about the folder selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faArrows, faFileUpload, faFolder, faFolderPlus, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import { useOkCancelModal } from "../modals/OkCancelModal";
import { useFileUploadModal } from "../modals/FileUploadModal";
import { postDocumentUpload, patchFolderRename, postFolderCreate, deleteFolderDelete, postDocumentPreview, patchDocumentPreview } from "../../util/api";

import "./FolderInfoView.scss";
import { useTextInputModal } from "../modals/TextInputModal";

function FolderInfoView({ folder, updateCatalogue }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal, fulfilDeleteModal] = useOkCancelModal();
    const [FileUploadModal, openFileUploadModal, closeFileUploadModal, fulfilFileUploadModal] = useFileUploadModal();
    const [RenameModal, openRenameModal, closeRenameModal, fulfilRenameModal] = useTextInputModal();
    const [CreateModal, openCreateModal, closeCreateModal, fulfilCreateModal] = useTextInputModal();

    function handleDeleteFolder() {
        fulfilDeleteModal(false);
        deleteFolderDelete(folder.item_id, () => {
            fulfilDeleteModal(true);
            updateCatalogue?.();
        });
        console.log(`Deleted ${folder.item_id}`);
    }

    function handleUploadDocument(selectedFile) {
        fulfilFileUploadModal(false);
        postDocumentUpload(selectedFile, folder.item_id, selectedFile.name, (responce) => {
            fulfilFileUploadModal(true);
            postDocumentPreview(responce.data.doc_filename, (responce1) => {
                patchDocumentPreview(responce.data.doc_id, responce1.data.previewName, () => {});
            });
            updateCatalogue?.();
        });        
    }

    function renameFolder(newName) {
        fulfilRenameModal(false);
        patchFolderRename(folder.item_id, newName, () => {
            fulfilRenameModal(true);
            updateCatalogue?.();
            folder.item_name = newName;
        })
    }

    function createFolder(name) {
        fulfilCreateModal(false);
        postFolderCreate(folder.item_id, name, () => {
            fulfilCreateModal(true);
            updateCatalogue?.();
        })
    }

    return <>
        <div className="FolderInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFolder } />
                <span>{ folder?.item_name ?? "Папка" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 }>
                    <Button text="Создать папку" icon={ faFolderPlus } onClick={ openCreateModal } style={ buttonColors.GREEN } />
                    <Button text="Загрузить файл" icon={ faFileUpload } onClick={ openFileUploadModal } style={ buttonColors.GREEN } />
                </ButtonBox>
                <ButtonBox gap={ 10 } >
                    <Button text="Скачать" icon={ faArchive } style={ buttonColors.GREEN } />
                    <Button icon={ faPencil } onClick={ openRenameModal } style={ buttonColors.BLUE } />
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
        <RenameModal
            title="Переименование папки"
            text={ `Введите новое имя для папки «${folder.item_name}»` }
            initialValue={ folder.item_name }
            onOk={ renameFolder }
        />
        <CreateModal
            title="Создание новой папки"
            text="Введите имя для создаваемой папки:"
            initialValue=""
            onOk={ createFolder }
        />
    </>;
}

export default FolderInfoView;
