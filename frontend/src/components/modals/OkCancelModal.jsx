import { useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";

import "./OkCancelModal.scss";

function OkCancelModal({ isOpen, title, text, onClose, onOk, onCancel }) {
    return (
        <Modal
            className="modal-content"
            overlayClassName="modal-overlay"
            isOpen={ isOpen }
            onRequestClose={ onClose }
        >
            <div className="modal-bar">
                <span className="modal-title">{ title }</span>
                <Button onClick={ onClose } style={ buttonColors.RED }><FontAwesomeIcon icon={ faX } /></Button>
            </div>
            <div className="modal-body">
                <div>{ text }</div>
                <ButtonBox gap={ 10 } buttons={ [
                    <Button
                        text="ОК"
                        style={ buttonColors.GREEN }
                        onClick={ () => {
                            onOk?.();
                            onClose?.();
                        } }
                    />,
                    <Button
                        text="Отмена"
                        style={ buttonColors.RED }
                        onClick={ () => {
                            onCancel?.();
                            onClose?.();
                        } }
                    />
                ] } />
            </div>
        </Modal>
    );
}

export default OkCancelModal;

export function useOkCancelModal() {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const ModalComponent = ({ title, text, onOk, onCancel }) => (
        <OkCancelModal
            isOpen={ isOpen }
            title={ title }
            text={ text }
            onClose={ close }
            onOk={ onOk }
            onCancel={ onCancel }
        />
    );

    return [ModalComponent, open, close];
}
