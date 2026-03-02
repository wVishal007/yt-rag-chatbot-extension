# backend/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.services.rag_service import RAGService
import logging

# -----------------------------
# Configure Logging
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

# -----------------------------
# Initialize FastAPI + RAGService
# -----------------------------
app = FastAPI(title="RAG Video Assistant")
rag_service = RAGService()

# -----------------------------
# Request Models
# -----------------------------
class IngestRequest(BaseModel):
    video_id: str

class ChatRequest(BaseModel):
    session_id: str
    question: str

# =====================================================
# 📥 Ingest Video
# =====================================================
@app.post("/ingest")
def ingest_video(req: IngestRequest):
    result = rag_service.ingest_video(req.video_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

# =====================================================
# 🤖 Chat
# =====================================================
@app.post("/chat")
def chat(req: ChatRequest):
    result = rag_service.chat(req.session_id, req.question)
    if "answer" not in result:
        raise HTTPException(status_code=500, detail="Failed to generate answer")
    return result

# =====================================================
# Health Check
# =====================================================
@app.get("/health")
def health():
    return {"status": "ok"}