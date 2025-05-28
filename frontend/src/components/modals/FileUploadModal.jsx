import { useState } from "react";

import Modal from "./Modal";
import Button, { buttonColors } from "../ui/Button";
import ButtonBox from "../ui/ButtonBox";

function FileUploadModal({ isOpen, isFulfilled = true, onClose, onOk, onCancel }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const f = event.target.files[0];
        if (f && f.type !== "application/pdf") {
            setError("Выберите файл в формате PDF");
            setSelectedFile(null);
        }
        else {
            setError("");
            setSelectedFile(f);
        }
    };

    return (
        <Modal
            isOpen={ isOpen }
            isFulfilled={ isFulfilled }
            title="Загрузка файла"
            onClose={ onClose }
        >
            <input type="file" onChange={ handleFileChange } />
            { error }
            { selectedFile && (
                <div>
                    <p>Выбран файл: { selectedFile.name }</p>
                    <p>Размер файла: { Math.round(Math.round(selectedFile.size)) / 1024 } КБ</p>
                </div>
            ) }
            <ButtonBox gap={ 10 }>
                <Button
                    text="ОК"
                    style={ buttonColors.GREEN }
                    onClick={ () => {
                        if (!selectedFile) {
                            setError("Файл не выбран");
                            return;
                        }
                        setError("");
                        onOk?.(selectedFile);
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

export default FileUploadModal;

export function useFileUploadModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFulfilled, setIsFulfilled] = useState(true);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const fulfil = (state) => setIsFulfilled(state);

    const ModalComponent = ({ onOk, onCancel }) => (
        <FileUploadModal
            isOpen={ isOpen }
            onClose={ close }
            onOk={ onOk }
            onCancel={ onCancel }
            isFulfilled={ isFulfilled }
        />
    );

    return [ModalComponent, open, close, fulfil];
}
