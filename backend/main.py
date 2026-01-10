from dotenv import load_dotenv
import os

# Explicitly load .env (important)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from qa import ask_gemini

app = FastAPI()

# CORS (Vite + local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLInput(BaseModel):
    url: str

class ChatInput(BaseModel):
    question: str
    context: str

@app.get("/")
async def root():
    return {"message": "Webpage Chatbot Backend running 🚀"}

@app.post("/extract")
async def extract_webpage_text(url_input: URLInput):
    try:
        response = requests.get(
            url_input.url,
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "noscript"]):
            tag.extract()

        text = soup.get_text(separator="\n")
        clean_text = "\n".join(
            line.strip() for line in text.splitlines() if line.strip()
        )

        return {"extracted_text": clean_text}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ask")
async def ask(chat_input: ChatInput):
    try:
        answer = ask_gemini(
            chat_input.question,
            chat_input.context
        )
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
