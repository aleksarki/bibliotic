import { useLoaderData } from "react-router-dom";
import Footer from "../components/Footer";
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
            <PdfViewer pdfUrl={ `http://localhost:3000/upload/${pdfUrl}` } />
            <Footer />
        </div>
    );
}

export default ReaderView;
