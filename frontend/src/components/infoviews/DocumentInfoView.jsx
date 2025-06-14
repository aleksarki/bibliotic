/*
 * View displaying information about the document selected.
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrows, faBook, faDownload, faFilePdf, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import { useOkCancelModal } from "../modals/OkCancelModal";
import { deleteDocumentDelete, getDocumentFile, getDocumentPreview, patchDocumentRename, getFile } from "../../util/api";
import { useTextInputModal } from "../modals/TextInputModal";

import "./DocumentInfoView.scss";

function DocumentInfoView({ document, updateCatalogue }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal, fulfilDeleteModal] = useOkCancelModal();
    const [RenameModal, openRenameModal, closeRenameModal, fulfilRenameModal] = useTextInputModal();
    const navigate = useNavigate();

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
        });
    }

    function showDocument() {
        getDocumentFile(document.item_id, request => {
            window.open(request.data.document, '_blank').focus();
        });
    }

    const downloadLinkRef = useRef(null);
    async function downloadFile() {
        getDocumentFile(document.item_id, request => {
        const link = downloadLinkRef.current;
        console.log(link)
        if (link) {
            link.href = request.data.document;
            link.download = document.item_name;
            link.target = "_blank";
            link.click();
        }
        });
    }

    const [previewPath, setPreviewPath] = useState('');

    useEffect(() => {
        const fetchPreview = async () => {
            const previewData = await getDocumentPreview(document);
            setPreviewPath(previewData.image);
        };

        fetchPreview();
    }, [document]);
    
    return <>
        <div className="DocumentInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFilePdf } />
                <span>{ document.item_name ?? "Документ" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 }>
                    <Button text="Просмотр" icon={ faBook } onClick={ showDocument } style={ buttonColors.GREEN } />
                    <Button text="Загрузить" icon={ faDownload } onClick={ downloadFile } style={ buttonColors.GREEN } />
                    <a ref={downloadLinkRef} style={{ display: 'none' }}> Hidden download link </a>
                </ButtonBox>
                <ButtonBox gap={ 10 }>
                    <Button icon={ faPencil } onClick={ openRenameModal } style={ buttonColors.BLUE } />
                    <Button icon={ faArrows } style={ buttonColors.YELLOW } />
                    <Button icon={ faTrashAlt } onClick={ openDeleteModal } style={ buttonColors.RED } />
                </ButtonBox>
            </div>
            <div>Добавлено: { document?.item_added }</div>
            <div>
                {previewPath && <img class="doc-preview" src={previewPath} alt="" />}
            </div>
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
