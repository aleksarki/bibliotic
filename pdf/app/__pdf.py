
from pdfminer.converter import PDFPageAggregator
from pdfminer.layout import LAParams, LTItem, LTContainer, LTPage, LTChar
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser


class PdfMiner:
    """ Wrapper for PDFminer library.
    """

    @staticmethod
    def getPages(file):
        """ Get pages of a PDF file.
        """
        parser = PDFParser(file)
        document = PDFDocument(parser)
        parser.set_document(document)
        return PDFPage.create_pages(document)

    @staticmethod
    def getLayout(page):
        """ Get layout of a PDF file page.
        """
        manager = PDFResourceManager()
        device = PDFPageAggregator(manager, laparams=LAParams())
        interpreter = PDFPageInterpreter(manager, device)
        interpreter.process_page(page)
        return device.get_result()
    
    @staticmethod
    def printLayout(layout_item: LTItem, indent: str = '') -> None:
        line_start = indent + " "
        if hasattr(layout_item, "get_text"):
            line_start += f"\"{layout_item.get_text().rstrip()}\" "
        print(f"{line_start}{layout_item}")
        if isinstance(layout_item, LTContainer):
            for child in layout_item:
                if type(child) != LTChar:
                    PdfMiner.printLayout(child, indent + "--")
