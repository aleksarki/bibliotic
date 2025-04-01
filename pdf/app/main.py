
from fastapi import FastAPI

app = FastAPI()

@app.get('/hello')
def hello():
    """ Test function.
    """
    return {"message": "hello there"}
