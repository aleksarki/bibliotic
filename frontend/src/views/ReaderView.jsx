import { useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import PdfViewer from "../components/PdfViewer";
import { useEffect, useState } from "react";
import { getDocumentFile } from "../util/api";

import "./ReaderView.scss";

export async function pdfUrlLoader({ params }) {
    const pdfId = params.pdfId;
    return {pdfId};
}

function ReaderView() {
    const {pdfId} = useLoaderData();
    const [pdfName, setPdfName] = useState(null);

    useEffect(() => {
        getDocumentFile(pdfId, request => {
            const url = request.data.document;
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            setPdfName(fileName);
        });
    });

    return (
        <div className="ReaderView">
            <div className="panel">
                <PdfViewer pdfUrl={ `http://localhost:3000/upload/${pdfName}` } pdfId={ pdfId } />
            </div>
        </div>
    );
}

export default ReaderView;
