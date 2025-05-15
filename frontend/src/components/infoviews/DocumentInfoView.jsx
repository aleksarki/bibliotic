/*
 * View displaying information about the document selected.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrows, faBook, faDownload, faFilePdf, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import { useOkCancelModal } from "../modals/OkCancelModal";

import "./DocumentInfoView.scss";

function DocumentInfoView({ document }) {
    const [DeleteModal, openDeleteModal, closeDeleteModal] = useOkCancelModal();

    function deleteDocument() {
        // FIX: api call
        console.log(`Deleted ${document.item_id}`);
    }

    return <>
        <div className="DocumentInfoView">
            <div className="view-title">
                <FontAwesomeIcon icon={ faFilePdf } />
                <span>{ document.item_name ?? "Документ" }</span>
            </div>
            <div className="button-area">
                <ButtonBox gap={ 10 } buttons={ [
                    <Button text="Просмотр" style={ buttonColors.GREEN } ><FontAwesomeIcon icon={ faBook } /></Button>,
                    <Button style={ buttonColors.GREEN }><FontAwesomeIcon icon={ faDownload } /></Button>
                ] } />
                <ButtonBox gap={ 10 } buttons={ [
                    <Button style={ buttonColors.BLUE }><FontAwesomeIcon icon={ faPencil } /></Button>,
                    <Button style={ buttonColors.YELLOW }><FontAwesomeIcon icon={ faArrows } /></Button>,
                    <Button style={ buttonColors.RED } onClick={ openDeleteModal }><FontAwesomeIcon icon={ faTrashAlt } /></Button>
                ] } />
            </div>
            <div>Добавлено: { document?.item_added }</div>
        </div>
        <DeleteModal
            title="Подтверждение удаления документа"
            text={ `Вы действительно хотите удалить документ «${document.item_name}»?` }
            onOk={ deleteDocument }
        />
    </>;
}

export default DocumentInfoView;
