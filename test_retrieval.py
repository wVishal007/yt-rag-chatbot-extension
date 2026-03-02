# test_retrieval.py

import os
from dotenv import load_dotenv

from ingestion.youtube_loader import YouTubeLoader
from ingestion.transcript_cleaner import TranscriptCleaner
from ingestion.metadata_handler import MetadataHandler

from retrieval.embeddings import EmbeddingModel
from retrieval.vector_store import VectorStoreManager

from llm.answer_generator import AnswerGenerator
from llm.question_rewriter import QuestionRewriter

from memory.conversation_memory import ConversationMemoryManager


# ==============================
# 🔐 Load API Key
# ==============================
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

if not api_key:
    raise ValueError("❌ MISTRAL_API_KEY not found in .env file")

video_id = "5MuIMqhT8DM"


# ==============================
# 📥 INGESTION (Only First Time)
# ==============================
loader = YouTubeLoader()
cleaner = TranscriptCleaner()
chunker = MetadataHandler(chunk_size=500)

embedding_model = EmbeddingModel(api_key=api_key).get_model()
vector_manager = VectorStoreManager(embedding_model)

if vector_manager.vectorstore._collection.count() == 0:
    print("📦 Creating vector database...")

    raw = loader.fetch_transcript(video_id)
    cleaned = cleaner.clean_transcript(raw)
    chunks = chunker.chunk_transcript(cleaned)

    vector_manager.create_vector_store(chunks)
    print("✅ Vector database created.\n")
else:
    print("✅ Loaded existing vector database.\n")


# ==============================
# 🤖 LLM + Memory Setup
# ==============================
generator = AnswerGenerator(api_key=api_key)
rewriter = QuestionRewriter(api_key=api_key)
memory = ConversationMemoryManager()

print("🎥 Chat with YouTube Video (type 'exit' to stop)\n")


# ==============================
# 🔁 CHAT LOOP
# ==============================
while True:
    user_question = input("You: ").strip()

    if user_question.lower() == "exit":
        print("\n👋 Exiting chat.")
        break

    if not user_question:
        continue

    # ------------------------------
    # 🧠 Get Conversation History
    # ------------------------------
    history = memory.get_history()

    # ------------------------------
    # 🔄 Rewrite Question (Context-aware)
    # ------------------------------
    standalone_question = rewriter.rewrite(history, user_question)

    print("\n🔎 Standalone Question:")
    print(standalone_question)

    # ------------------------------
    # 🔍 Retrieve Top-K
    # ------------------------------
    results = vector_manager.similarity_search(
        standalone_question,
        k=5
    )

    print("\nRAW RETRIEVAL RESULTS:")
    for doc, score in results:
        print("Score:", score)
        print("Preview:", doc.page_content[:150])
        print("------")

    if not results:
        print("\nAssistant: The video does not mention this.\n")
        continue

    # ------------------------------
    # 🚨 Safety Check (avoid hallucination)
    # ------------------------------
    # best_score = results[0][1]  # lower = better (Chroma distance)

    # if best_score > 1.2:
    #     print("\nAssistant: This question may not be clearly covered in the video.\n")
    #     continue

    # ------------------------------
    # 🧪 DEBUG: Show Retrieved Chunks
    # ------------------------------
    print("\nDEBUG: Retrieved Chunks\n")

    for doc, score in results:
        print("Score:", score)
        print("Content:", doc.page_content[:200])
        print("URL:", doc.metadata.get("url", "N/A"))
        print("------")

    # ------------------------------
    # 📚 Extract Documents Only
    # ------------------------------
    retrieved_docs = [doc for doc, _ in results]

    # Sort by timestamp if available
    retrieved_docs = sorted(
        retrieved_docs,
        key=lambda x: x.metadata.get("start", 0)
    )

    # ------------------------------
    # 🤖 Generate Answer
    # ------------------------------
    result = generator.generate_answer(
        retrieved_docs,
        standalone_question
    )

    print("\nAssistant:\n")
    print(result["answer"])

    # ------------------------------
    # 📎 Show Sources
    # ------------------------------
    print("\nSources:")
    for s in result.get("sources", []):
        print(s)

    # ------------------------------
    # 🧠 Save Conversation Memory
    # ------------------------------
    memory.add_user_message(user_question)
    memory.add_ai_message(result["answer"])

    print("\n" + "-" * 60 + "\n")