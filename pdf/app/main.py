
from pdf2image import convert_from_path
import pytesseract
import os
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile

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
    
    # Сохраняем загруженный файл во временной директории
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    # Преобразовываем страницы документа в изображения
    images = convert_from_path(temp_file_path)

    # Инициализируем переменную для хранения текста
    full_text = ""

    # Считываем каждую страницу и добавляем текст
    for i, image in enumerate(images):
        text = pytesseract.image_to_string(image, lang='rus+eng')
        full_text += f'{text}\n'

    # Удаляем временный файл после обработки
    os.remove(temp_file_path)

    return JSONResponse(
        status_code=200,
        content={
            "file": file.filename,
            "text": full_text
        }
    )
