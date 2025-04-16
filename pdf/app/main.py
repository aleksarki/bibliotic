
from pdf2image import convert_from_path
import pytesseract
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/hello')
def hello():
    """ Test function.
    """
    return {"message": "hello there"}

@app.post('/pdf/extract-text')
async def extractText(path: str = Query(...)):
    """ Request for recognition of text in a pdf file.
    """
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
        text = pytesseract.image_to_string(image, lang='rus+eng')
        full_text += f'{text}\n'
        print(f"[Recognized image №{i}]")

    print(f"[Recognition done, text of {len(full_text)} characters]")

    return JSONResponse(
        status_code=200,
        content={
            "file": path,
            "text": full_text
        }
    )
