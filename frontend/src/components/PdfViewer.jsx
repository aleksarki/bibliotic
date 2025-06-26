import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import Modal from "react-modal";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import "./PdfViewer.scss";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

function PdfViewer({ pdfUrl, pdfId }) {
    const [numPages, setNumPages] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);
    const pagesRef = useRef([]);

    const [notes, setNotes] = useState([]);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [currentNotePosition, setCurrentNotePosition] = useState({ page: 1, x: 0, y: 0 });

    // fetching notes
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/note/get?document=${pdfId}`);
                setNotes(response.data);
            } catch (error) {
                console.error("Ошибка загрузки заметок:", error);
            }
        };
        
        fetchNotes();
    }, [pdfId]);

    // width adaptation
    useEffect(() => {
        const updateWidth = () => {
        if (containerRef.current) {
                const newWidth = containerRef.current.offsetWidth - 60;
                setContainerWidth(newWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // adding note
    function handlePageClick(e, pageNumber) {
        if (!e.ctrlKey && !e.metaKey) return;

        const pageElement = pagesRef.current[pageNumber - 1];
        if (!pageElement) return;

        const rect = pageElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentNotePosition({
            page: pageNumber,
            x,
            y
        });
        setIsNoteModalOpen(true);
    }

    // saving note
    async function handleSaveNote() {
        try {
            const newNote = {
                document: pdfId,
                page: currentNotePosition.page,
                text: newNoteContent,
                x: currentNotePosition.x,
                y: currentNotePosition.y
            };
            await axios.post("http://localhost:3000/note/create", newNote);
            setNotes([...notes, {
                note_document: pdfId,
                note_page:  currentNotePosition.page,
                note_text: newNoteContent,
                note_x: currentNotePosition.x,
                note_y: currentNotePosition.y
            }]);
            setIsNoteModalOpen(false);
            setNewNoteContent("");
        }
        catch (error) {
            console.error("Ошибка сохранения заметки:", error);
        }
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="PdfViewer" ref={ containerRef }>
            <Document file={ pdfUrl } onLoadSuccess={ onDocumentLoadSuccess }>{
                Array.from(new Array(numPages), (el, index) => {
                    const pageNumber = index + 1;
                    const pageNotes = notes.filter(note => note.note_page === pageNumber);
                    
                    return (
                        <div
                        key={ `page_${pageNumber}` }
                        ref={ el => pagesRef.current[index] = el }
                        className="pdf-page-container"
                        onClick={ e => handlePageClick(e, pageNumber) }
                        >
                            <Page
                                pageNumber={ pageNumber }
                                width={ containerWidth }
                                loading={ <div className="page-loading">Загрузка страницы { pageNumber }...</div> }
                            />
                            {
                                pageNotes.length > 0 &&
                                <div className="note-area">{
                                    pageNotes.map(note => (
                                        <div
                                            key={ note.note_id }
                                            className="pdf-note"
                                            onClick={ e => {
                                                e.stopPropagation();
                                                alert(`Заметка: ${note.note_text}`);
                                            } }
                                        >
                                            { note.note_text }
                                        </div>
                                    ))
                                }</div>
                            }
                        </div>
                    );
                })
            }</Document>

            <Modal
                isOpen={ isNoteModalOpen }
                onRequestClose={ () => setIsNoteModalOpen(false) }
                className="note-modal"
                overlayClassName="note-modal-overlay"
            >
                <h3>Добавить заметку (Страница { currentNotePosition.page })</h3>
                <textarea
                    value={ newNoteContent }
                    onChange={ e => setNewNoteContent(e.target.value) }
                    placeholder="Введите текст заметки..."
                    rows={ 4 }
                    className="note-textarea"
                />
                <div className="note-modal-buttons">
                    <button
                        onClick={ () => setIsNoteModalOpen(false) }
                        className="cancel-button"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={ handleSaveNote }
                        className="save-button"
                        disabled={ !newNoteContent.trim() }
                    >
                        Сохранить
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default PdfViewer;
