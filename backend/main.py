from fastapi import FastAPI

from app.core.config import load_config

app = FastAPI()
config = load_config()


@app.get("/")
def read_root():
    return {"message": "Hello, world"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
