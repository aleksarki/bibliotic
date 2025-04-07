
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
    
    return JSONResponse(
        status_code=200,
        content={
            "file": file.filename,
            "text": "stub text"
        }
    )
