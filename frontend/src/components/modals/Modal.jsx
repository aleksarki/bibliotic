import Modal_ from "react-modal";
import { faX } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";

import "./Modal.scss";

function Modal({ isOpen, isFulfilled = true, title, onClose, children }) {
    return (
        <Modal_
            overlayClassName="modal-overlay"
            className="modal-content"
            isOpen={ isOpen || !isFulfilled }
            onRequestClose={ onClose }
        >
            <div className="modal-bar">
                <span className="modal-title">{ title }</span>
                { isFulfilled ? <Button onClick={ onClose } icon={ faX } style={ buttonColors.RED } /> : null }
            </div>
            <div className="modal-body">
                { isFulfilled ? children : <span>Обработка...</span> }
            </div>
        </Modal_>
    );
}

export default Modal;
