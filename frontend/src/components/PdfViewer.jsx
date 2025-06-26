import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import "./PdfViewer.scss";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

function PdfViewer({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
        if (containerRef.current) {
                const newWidth = containerRef.current.offsetWidth - 40;
                setContainerWidth(newWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="PdfViewer" ref={ containerRef }>
            <Document file={ pdfUrl } onLoadSuccess={ onDocumentLoadSuccess }>
                { Array.from(new Array(numPages), (el, index) => (
                    <div className="page-div" key={ `page_${index + 1}` }>
                        <Page 
                            pageNumber={ index + 1 }
                            width={ containerWidth }
                            loading={ <div>Загрузка страницы { index + 1 }...</div> }
                        />
                    </div>
                )) }
            </Document>
        </div>
    );
}

export default PdfViewer;
