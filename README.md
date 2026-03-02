# 🚀 YouTube Intelligence Engine  
### Conversational Hybrid RAG System for Deep Video Knowledge Retrieval

A production-grade Retrieval-Augmented Generation (RAG) system that transforms YouTube videos into a conversational AI assistant with hybrid retrieval, timestamp citation, reranking, and hallucination control.

This project demonstrates advanced GenAI system design, modular architecture, and scalable backend foundations for SaaS deployment.

---

## 🧠 Vision

Most AI systems hallucinate because they generate without grounding.

This system solves that by:

- Retrieving real transcript chunks
- Combining semantic + keyword search
- Reranking results
- Enforcing strict citation rules
- Using contextual memory for multi-turn conversations

> Result: An AI assistant that answers strictly from YouTube content.

---

# 🏗️ System Architecture

```
User Query
    ↓
Conversation Memory
    ↓
Question Rewriter (Context → Standalone)
    ↓
Hybrid Retrieval
   ├─ Embedding Search (Chroma + Mistral)
   ├─ BM25 Keyword Search
   └─ Score Fusion
    ↓
Cross-Encoder Reranker
    ↓
Top-K Context (Timestamped)
    ↓
LLM (Grounded Prompt)
    ↓
Cited Answer + Sources
```

---

# 📂 Project Structure

```
yt-intelligence-engine/
│
├── ingestion/
│   ├── youtube_loader.py
│   ├── transcript_cleaner.py
│   └── metadata_handler.py
│
├── retrieval/
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── reranker.py
│   └── hybrid_search.py
│
├── llm/
│   ├── answer_generator.py
│   ├── question_rewriter.py
│   └── prompt_templates.py
│
├── memory/
│   └── conversation_memory.py
│
├── evaluation/
│   ├── metrics.py
│   └── experiment_logs.py
│
├── backend/
│   └── api.py
│
├── frontend/ (Next.js planned)
│
└── test_retrieval.py
```

---

# 🔥 Core Capabilities

## ✅ Conversational RAG
- Multi-turn chat support
- Context-aware question rewriting
- Memory persistence per session

---

## ✅ Multi-Video Ingestion
- Single video ingestion
- Extensible to playlists & channels
- Stores structured metadata:
  - `video_id`
  - `timestamp`
  - `URL`
  - chunk start time

---

## ✅ Timestamp-Based Citation

Every answer includes:

- Clickable YouTube link
- Exact timestamp
- Unique source list

Example:

```
Sources:
https://youtube.com/watch?v=VIDEO_ID&t=234
https://youtube.com/watch?v=VIDEO_ID&t=463
```

---

## ✅ Hybrid Retrieval (Advanced RAG)

Combines:

- Semantic similarity (Mistral embeddings)
- Keyword search (BM25-ready)
- Cross-encoder reranking
- Timestamp-based sorting

This significantly improves retrieval precision and reduces hallucinations.

---

## ✅ Hallucination Control

Strict prompt rules:

- Use only provided context
- No external knowledge
- If not found → "The video does not mention this."
- Bullet-point structured output

---

## ✅ Evaluation Framework

Supports:

- Precision@K
- Recall@K
- Experiment logging
- Chunk size experimentation
- Embedding model comparison

Located in:

```
evaluation/
```

---

# ⚙️ Tech Stack

### Backend
- Python 3.10+
- LangChain
- ChromaDB
- Mistral (Embeddings + LLM)
- Sentence Transformers (Reranker)
- FastAPI (deployment-ready)

### Frontend (Planned)
- Next.js
- TailwindCSS
- Streaming responses

---

# 🚀 How To Run

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/yt-intelligence-engine.git
cd yt-intelligence-engine
```

---

## 2️⃣ Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate
```

---

## 3️⃣ Install Dependencies

```
pip install langchain langchain-chroma langchain-mistralai chromadb youtube-transcript-api python-dotenv sentence-transformers fastapi uvicorn
```

---

## 4️⃣ Add Environment Variables

Create `.env`:

```
MISTRAL_API_KEY=your_api_key_here
```

---

## 5️⃣ Run CLI Version

```
python test_retrieval.py
```

---

## 6️⃣ (Optional) Run Backend API

```
uvicorn backend.api:app --reload
```

---

# 📊 Why This Is Not a Basic RAG Demo

Most RAG demos:
- Single vector search
- No reranking
- No evaluation
- No hallucination control
- No memory
- No production structure

This system includes:

- Hybrid retrieval
- Cross-encoder reranking
- Conversation memory
- Evaluation pipeline
- Modular architecture
- Persistent vector store
- Timestamp citation
- Backend-ready structure

This makes it:

✔ Production-aligned  
✔ Research-oriented  
✔ SaaS-extensible  
✔ Resume-strong  

---

# 💰 SaaS Direction

This architecture can evolve into:

### 🔹 AI for YouTube Creators
Turn a channel into an AI assistant.

### 🔹 EdTech Knowledge Engine
Students chat with lecture playlists.

### 🔹 Research Video Indexing
Semantic search across long-form talks.

### 🔹 Enterprise Knowledge Layer
Internal video libraries searchable via AI.

Planned SaaS features:
- User authentication
- Multi-tenant indexing
- Usage-based billing
- Hosted vector storage
- Team dashboards

---

# 🔮 Future Improvements

- Real hybrid BM25 implementation
- Score normalization strategies
- Streaming LLM responses
- Redis-based memory store
- Multi-video filtering at query time
- UI for transcript preview
- Deployment on AWS/GCP

---

# 📌 Resume Description

Built a production-oriented Hybrid RAG system with conversational memory, semantic + keyword retrieval, cross-encoder reranking, timestamped citation enforcement, and evaluation metrics using LangChain, ChromaDB, and Mistral.

---

# 📸 Demo

(Add deployed link here)

---

# 👨‍💻 Author

Vishal Singh  
AI Systems & Full-Stack Developer  

---
