import { useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import PdfViewer from "../components/PdfViewer";

import "./ReaderView.scss";

export async function pdfUrlLoader({ params }) {
    const pdfUrl = params.pdfUrl;
    return {pdfUrl};
}

function ReaderView() {
    const {pdfUrl} = useLoaderData();

    return (
        <div className="ReaderView">
            <Header pageTitle="Просмотр" />
                <div className="panel">
                    <PdfViewer pdfUrl={ `http://localhost:3000/upload/${pdfUrl}` } />
                </div>
        </div>
    );
}

export default ReaderView;
