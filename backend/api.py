
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from backend.services.rag_service import RAGService
import logging
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:3000",
]


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
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # <-- important
    allow_credentials=True,
    allow_methods=["*"],          # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],          # allow Content-Type, Authorization, etc.
)

# -----------------------------
# Request Models
# -----------------------------
class IngestRequest(BaseModel):
    video_id: str

class ChatRequest(BaseModel):
    session_id: str
    question: str

class NotesRequest(BaseModel):
    video_id: str    

# =====================================================
# 📥 Ingest Video
# =====================================================
@app.post("/ingest")
def ingest_video(req: IngestRequest):
    print(req)
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


@app.post("/generate-notes")
def generate_notes(req: NotesRequest):
    try:
        pdf_bytes = rag_service.generate_notes(req.video_id)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=video-notes.pdf"},
        )
    except Exception as e:
        print("❌ Error in /generate-notes:", str(e))   # <-- log full error
        return Response(
            content=f"Error generating PDF:\n{str(e)}",
            media_type="text/plain",
            status_code=500
        )
@app.post("/generate-ppt")
def generate_ppt(req: NotesRequest):
    try:
        ppt_bytes = rag_service.generate_ppt(req.video_id)
        return Response(
            content=ppt_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename=video-notes.pptx"},
        )
    except Exception as e:
        logging.error(f"❌ Error in /generate-ppt: {e}")
        return Response(
            content=f"Error generating PPT:\n{str(e)}",
            media_type="text/plain",
            status_code=500
        )    
