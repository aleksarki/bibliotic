/*
 * View displaying information about the document selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrows, faBook, faDownload, faFilePdf, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import { useOkCancelModal } from "../modals/OkCancelModal";
import { deleteDocumentDelete, patchDocumentRename } from "../../util/api";

import "./DocumentInfoView.scss";
import { useTextInputModal } from "../modals/TextInputModal";

function DocumentInfoView({ document, updateCatalogue }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal, fulfilDeleteModal] = useOkCancelModal();
    const [RenameModal, openRenameModal, closeRenameModal, fulfilRenameModal] = useTextInputModal();

    function deleteDocument() {
        fulfilDeleteModal(false);
        deleteDocumentDelete(document.item_id, () => {
            fulfilDeleteModal(true);
            updateCatalogue?.();
        });
    }

    function renameDocument(newName) {
        fulfilRenameModal(false);
        patchDocumentRename(document.item_id, newName, () => {
            fulfilRenameModal(true);
            updateCatalogue?.();
            document.item_name = newName;
        })
    }

    return <>
        <div className="DocumentInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFilePdf } />
                <span>{ document.item_name ?? "Документ" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 }>
                    <Button text="Просмотр" icon={ faBook } style={ buttonColors.GREEN } />
                    <Button icon={ faDownload } style={ buttonColors.GREEN } />
                </ButtonBox>
                <ButtonBox gap={ 10 }>
                    <Button icon={ faPencil } onClick={ openRenameModal } style={ buttonColors.BLUE } />
                    <Button icon={ faArrows } style={ buttonColors.YELLOW } />
                    <Button icon={ faTrashAlt } onClick={ openDeleteModal } style={ buttonColors.RED } />
                </ButtonBox>
            </div>
            <div>Добавлено: { document?.item_added }</div>
            <div>!add picture here ...!</div>
        </div>
        <DeleteModal
            title="Подтверждение удаления документа"
            text={ `Вы действительно хотите удалить документ «${document.item_name}»?` }
            onOk={ deleteDocument }
        />
        <RenameModal
            title="Переименование документа"
            text={ `Введите новое имя для документа «${document.item_name}»` }
            initialValue={ document.item_name }
            onOk={ renameDocument }
        />
    </>;
}

export default DocumentInfoView;
