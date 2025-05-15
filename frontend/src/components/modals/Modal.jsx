import Modal_ from "react-modal";
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
                <Button onClick={ onClose } icon={ faX } style={ buttonColors.RED } />
            </div>
            <div className="modal-body">
                { children }
            </div>
        </Modal_>
    );
}

export default Modal;
