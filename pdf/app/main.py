
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/hello')
def hello():
    """ Test function.
    """
    return {"message": "hello there"}

@app.post('/pdf/extract-text')
async def extractText(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Not a pdf file.")
    
    # todo: implement logics

    # Заметка1: Нужно скачать и установить сам tesseract + установить poppler, так как без него PDF файлы не конвертируются в изображения
    # Заметка2: Данный код просто выводит текст, который он распознал. Скорее всего в будущем нужно будет придумать логику для вычленения автора, аннортаций и др.
    
    # Установка бибилиотек, необходимых для работы системы 
    pip install pytesseract pdf2image Pillow

    # Импортируем pdf2image для преобразования pdf файлов в изображения и tesseract для чтения файлов
    from pdf2image import convert_from_path
    import pytesseract

    # Преобразовываем страницы документа в изображения
    pdf_file = 'name_of_file'
    images = convert_from_path(pdf_file)

    # Считываем каждую страницу, в будущем нужно будет оптимизировать данный процесс
    for i, image in enumerate(images):
        text = pytesseract.image_to_string(image, lang='rus+eng' )
        print(f'Page {i + 1}:\n{text}\n')

    return JSONResponse(
        status_code=200,
        content={
            "file": file.filename,
            "text": "stub text"
        }
    )
