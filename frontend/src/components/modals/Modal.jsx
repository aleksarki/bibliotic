import Modal_ from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import Button, { buttonColors } from "../ui/Button";

import "./Modal.scss";

function Modal({ isOpen, title, onClose, children }) {
    return (
        <Modal_
            overlayClassName="modal-overlay"
            className="modal-content"
            isOpen={ isOpen }
            onRequestClose={ onClose }
        >
            <div className="modal-bar">
                <span className="modal-title">{ title }</span>
                <Button onClick={ onClose } style={ buttonColors.RED }><FontAwesomeIcon icon={ faX } /></Button>
            </div>
            <div className="modal-body">
                { children }
            </div>
        </Modal_>
    );
}

export default Modal;
