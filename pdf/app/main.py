import os
import pytesseract
import yake
from pdf2image import convert_from_path
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/hello')
def hello():
    """ Test function. """
    return {"message": "hello there"}

@app.post('/pdf/extract-text')
async def extractText(path: str = Query(...)):
    """ Request for recognition of text in a pdf file. """
    if not os.path.exists(path):
        print("[Got non-existent file]")
        raise HTTPException(status_code=400, detail="File does not exist.")
    
    if not path.endswith(".pdf"):
        print("[Got file of wrong format]")
        raise HTTPException(status_code=400, detail="Not a pdf file.")
    
    print(f"[Received file '{path}']")

    images = convert_from_path(path)
    print(f"[Converted file to images]")

    full_text = ""
    for i, image in enumerate(images):
        # Используем оба языка (русский и английский) в Tesseract
        text = pytesseract.image_to_string(image, lang='rus+eng')
        full_text += f'{text}\n'
        print(f"[Recognized image №{i}]")

    print(f"[Recognition done, text of {len(full_text)} characters]")

    # --- Extract keywords using YAKE ---
    # Определяем язык автоматически по наличию кириллических символов
    language = 'ru' if any('\u0400' <= c <= '\u04FF' for c in full_text) else 'en'
    
    kw_extractor = yake.KeywordExtractor(lan=language, n=1, top=10)
    keywords = kw_extractor.extract_keywords(full_text)
    
    # Преобразуем ключевые слова в нижний регистр и убираем дубликаты
    keyword_list = list(set([kw.lower() for kw, score in keywords]))

    print(f"[Extracted keywords: {keyword_list}]")

    return JSONResponse(
        status_code=200,
        content={
            "file": path,
            "text": full_text,
            "keywords": keyword_list,
            "detected_language": language
        }
    )