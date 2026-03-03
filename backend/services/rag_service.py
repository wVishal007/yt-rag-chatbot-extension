# backend/services/rag_service.py

import os
import logging
from dotenv import load_dotenv
from typing import Dict

from ingestion.youtube_loader import YouTubeLoader
from ingestion.transcript_cleaner import TranscriptCleaner
from ingestion.metadata_handler import MetadataHandler

from retrieval.embeddings import EmbeddingModel
from retrieval.vector_store import VectorStoreManager
from retrieval.reranker import Reranker

from llm.answer_generator import AnswerGenerator
from llm.question_rewriter import QuestionRewriter

from memory.conversation_memory import ConversationMemoryManager

# -----------------------------
# Configure Logging
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

class RAGService:
    """
    Phase-1 production-ready RAGService:
    - Video ingestion
    - Hybrid retrieval
    - Reranking
    - LLM answer generation
    - Session memory handling
    """

    def __init__(self):
        load_dotenv()

        api_key = os.getenv("MISTRAL_API_KEY")
        if not api_key:
            raise ValueError("MISTRAL_API_KEY not found in environment.")

        # -----------------------------
        # Core Components
        # -----------------------------
        self.loader = YouTubeLoader()
        self.cleaner = TranscriptCleaner()
        self.chunker = MetadataHandler(chunk_size=500)

        self.embedding_model = EmbeddingModel(api_key=api_key).get_model()
        self.vector_manager = VectorStoreManager(self.embedding_model)

        self.reranker = Reranker()
        self.generator = AnswerGenerator(api_key=api_key)
        self.rewriter = QuestionRewriter(api_key=api_key)

        # -----------------------------
        # Session Memory Store
        # -----------------------------
        self.sessions: Dict[str, ConversationMemoryManager] = {}

    # =====================================================
    # 📥 Ingest Video
    # =====================================================
    def ingest_video(self, video_id: str) -> dict:
        """
        Fetch transcript, clean, chunk and store in vector DB.
        """
        try:
            raw_transcript = self.loader.fetch_transcript(video_id)
            if not raw_transcript:
                return {"status": "error", "error": "Transcript is empty."}

            cleaned = self.cleaner.clean_transcript(raw_transcript)
            chunks = self.chunker.chunk_transcript(cleaned)

            if not chunks:
                return {"status": "error", "error": "No chunks generated from transcript."}

            # Avoid duplicates
            existing_urls = {doc.metadata["url"] for doc, _ in self.vector_manager.similarity_search(" ", k=1000)}
            new_chunks = [c for c in chunks if c["url"] not in existing_urls]

            self.vector_manager.create_vector_store(new_chunks)

            # logging.info(f"Ingested {len(new_chunks)} chunks for video {video_id}")
            logging.info(f"video {video_id} ingested successfully now you can chat")

            return {
                "status": "indexed",
                "video_id": video_id,
                "chunks": len(new_chunks)
            }

        except Exception as e:
            logging.error(f"Error ingesting video {video_id}: {e}")
            return {"status": "error", "error": str(e)}

    # =====================================================
    # 🤖 Chat
    # =====================================================
    def chat(self, session_id: str, question: str) -> dict:
        """
        Main conversational RAG flow.
        """
        if session_id not in self.sessions:
            self.sessions[session_id] = ConversationMemoryManager()

        memory = self.sessions[session_id]

        # Limit chat history to last 50 messages
        if len(memory.chat_history) > 50:
            memory.chat_history = memory.chat_history[-50:]

        # -------------------------
        # Get Conversation History
        # -------------------------
        history = memory.get_history()

        # -------------------------
        # Rewrite Question
        # -------------------------
        standalone_question = self.rewriter.rewrite(history, question)

        # -------------------------
        # Retrieve Top-K
        # -------------------------
        try:
            results = self.vector_manager.similarity_search(
                standalone_question,
                k=8
            )
        except Exception as e:
            logging.error(f"Vector search error: {e}")
            return {"answer": "Error retrieving information.", "sources": []}

        if not results:
            return {"answer": "The video does not mention this.", "sources": []}

        # Extract documents
        retrieved_docs = [doc for doc, _ in results]

        # -------------------------
        # Rerank
        # -------------------------
        reranked_docs = self.reranker.rerank(
            standalone_question,
            retrieved_docs,
            top_k=5
        )

        # Sort by timestamp
        reranked_docs = sorted(
            reranked_docs,
            key=lambda x: x.metadata.get("start", 0)
        )

        # -------------------------
        # Generate Answer
        # -------------------------
        try:
            result = self.generator.generate_answer(
                reranked_docs,
                standalone_question
            )
        except Exception as e:
            logging.error(f"LLM generation error: {e}")
            return {"answer": "Error generating answer.", "sources": []}

        # -------------------------
        # Save Memory
        # -------------------------
        memory.add_user_message(question)
        memory.add_ai_message(result["answer"])

        return {
            "answer": result["answer"],
            "sources": result.get("sources", [])
        }