import { useState } from "react";

import Modal from "./Modal";
import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";

function TextInputModal({ isOpen, isFulfilled = true, title, text, initialValue, onClose, onOk, onCancel }) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState("");

    const handleTextChange = event => {
        const val = event.target.value;
        if (val == "") {
            setError("Введите значение");
            setValue("");
        }
        else {
            setError("");
            setValue(val);
        }
    };

    return (
        <Modal
            isOpen={ isOpen }
            isFulfilled={ isFulfilled }
            title={ title }
            onClose={ onClose }
        >
            { text }
            <input onChange={ handleTextChange } value={ value } />
            { error }
            <ButtonBox gap={ 10 }>
                <Button
                    text="ОК"
                    style={ buttonColors.GREEN }
                    onClick={ () => {
                        if (value == null || value == "") {
                            setError("Введите значение");
                            return;
                        }
                        setError("");
                        onOk?.(value);
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

export default TextInputModal;

export function useTextInputModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFulfilled, setIsFulfilled] = useState(true);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const fulfil = (state) => setIsFulfilled(state);

    const ModalComponent = ({ title, text, initialValue, onOk, onCancel }) => (
        <TextInputModal
            isOpen={ isOpen }
            isFulfilled={ isFulfilled }
            title={ title }
            text={ text }
            initialValue={ initialValue }
            onClose={ close }
            onOk={ onOk }
            onCancel={ onCancel }
        />
    );

    return [ModalComponent, open, close, fulfil];
}
