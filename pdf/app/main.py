
from fastapi import FastAPI, File, UploadFile
import os


UPLOAD_DIR = 'upload\\'
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()


@app.post('/upload')
async def upload(file: UploadFile = File(...)):
    """ Upload a PDF file to the server.
    """
    if not file.filename.endswith('.pdf'):
        return {"error": "file must be a pdf"}  # fixme make bad
    
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, 'wb') as f:
        f.write(await file.read())

    return {"success": "file uploaded"}



