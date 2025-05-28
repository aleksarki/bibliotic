import { useState } from "react";

import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";
import Modal from "./Modal";

function OkCancelModal({ isOpen, isFulfilled = true, title, text, onClose, onOk, onCancel }) {
    return (
        <Modal
            isOpen={ isOpen }
            isFulfilled={ isFulfilled }
            title={ title }
            onClose={ onClose }
        >
            <div>{ text }</div>
            <ButtonBox gap={ 10 }>
                <Button
                    text="ОК"
                    style={ buttonColors.GREEN }
                    onClick={ () => {
                        onOk?.();
                        onClose?.();
                    } }
                />
                <Button
                    text="Отмена"
                    style={ buttonColors.RED }
                    onClick={ () => {
                        onCancel?.();
                        onClose?.();
                    } }
                />
            </ButtonBox>
        </Modal>
    );
}

export default OkCancelModal;

export function useOkCancelModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFulfilled, setIsFulfilled] = useState(true);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const fulfil = (state) => setIsFulfilled(state);

    const ModalComponent = ({ title, text, onOk, onCancel }) => (
        <OkCancelModal
            isOpen={ isOpen }
            isFulfilled={ isFulfilled }
            title={ title }
            text={ text }
            onClose={ close }
            onOk={ onOk }
            onCancel={ onCancel }
        />
    );

    return [ModalComponent, open, close, fulfil];
}
