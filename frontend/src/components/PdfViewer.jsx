import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

function PdfViewer({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div>
            <Document file={ pdfUrl } onLoadSuccess={ onDocumentLoadSuccess }>
                <Page pageNumber={ pageNumber } />
            </Document>
            <p>Страница { pageNumber } из { numPages }</p>
            <button
                onClick={ () => setPageNumber(prev => Math.max(prev - 1, 1)) }
                disabled={ pageNumber <= 1 }
            >
                Назад
            </button>
            <button
                onClick={ () => setPageNumber(prev => Math.min(prev + 1, numPages  || 1)) }
                disabled={ pageNumber >= (numPages || 1) }
            >
                Вперёд
            </button>
        </div>
    );
}

export default PdfViewer;
