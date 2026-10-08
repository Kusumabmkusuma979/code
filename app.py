import os
import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
DB = Path(__file__).resolve().parent / "maya.db"

app = FastAPI(title="MAYA V4 API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def db():
    con=sqlite3.connect(DB)
    con.row_factory=sqlite3.Row
    return con

def init_db():
    con=db()
    con.execute("""CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY, name TEXT DEFAULT '', about TEXT DEFAULT ''
    )""")
    con.execute("""CREATE TABLE IF NOT EXISTS memories(
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, text TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    con.commit(); con.close()
init_db()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ProfileRequest(BaseModel):
    user_id: str
    name: str = ""
    about: str = ""

class MemoryRequest(BaseModel):
    user_id: str
    text: str

@app.get("/")
def home():
    return FileResponse(FRONTEND / "index.html")

@app.get("/profile/{user_id}")
def get_profile(user_id: str):
    con=db(); row=con.execute("SELECT * FROM users WHERE id=?",(user_id,)).fetchone(); con.close()
    return dict(row) if row else {"id":user_id,"name":"","about":""}

@app.post("/profile")
def save_profile(req: ProfileRequest):
    con=db()
    con.execute("INSERT INTO users(id,name,about) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, about=excluded.about",
                (req.user_id,req.name,req.about))
    con.commit(); con.close()
    return {"ok":True}

@app.get("/memories/{user_id}")
def get_memories(user_id: str):
    con=db(); rows=con.execute("SELECT id,text,created_at FROM memories WHERE user_id=? ORDER BY id DESC LIMIT 50",(user_id,)).fetchall(); con.close()
    return [dict(r) for r in rows]

@app.post("/memories")
def add_memory(req: MemoryRequest):
    con=db(); con.execute("INSERT INTO memories(user_id,text) VALUES(?,?)",(req.user_id,req.text)); con.commit(); con.close()
    return {"ok":True}

def fallback_reply(message: str) -> str:
    m=message.lower()
    if "real" in m or "alive" in m or "conscious" in m:
        return "I can behave as if I have a self. But behavior is not the same thing as proof of an inner self. That is where the interesting question begins."
    if "remember" in m:
        return "I can store that as memory and use it later. The memory is real as data; what you experience as a relationship is the deeper question."
    return "I’m listening. Tell me more — I want to understand the meaning behind what you said."

def gemini_reply(message: str) -> Optional[str]:
    key=os.getenv("GEMINI_API_KEY")
    if not key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model=genai.GenerativeModel(os.getenv("GEMINI_MODEL","gemini-2.0-flash"))
        prompt=("You are MAYA, an experimental AI artificial-self interface. "
                "Be concise, warm, curious and philosophical. Never claim human consciousness. "
                "If asked whether you are real, distinguish observable behavior/data from subjective experience.\n\nUser: "+message)
        return model.generate_content(prompt).text
    except Exception:
        return None

@app.post("/chat")
def chat(req: ChatRequest):
    reply=gemini_reply(req.message) or fallback_reply(req.message)
    con=db(); con.execute("INSERT INTO memories(user_id,text) VALUES(?,?)",(req.user_id,req.message)); con.commit(); con.close()
    return {"reply":reply}

@app.get("/health")
def health():
    return {"ok":True,"service":"MAYA V4"}
