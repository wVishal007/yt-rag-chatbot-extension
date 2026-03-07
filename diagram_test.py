# test_youtube_diagram.py
import os
import json
import logging
from dotenv import load_dotenv

from backend.services.diagram_service import DiagramService
from llm.answer_generator import AnswerGenerator  # Your real LLM
from ingestion.youtube_loader import YouTubeLoader
from ingestion.transcript_cleaner import TranscriptCleaner

load_dotenv()
logging.basicConfig(level=logging.INFO)

# -----------------------------
# 1️⃣ Setup LLM & DiagramService
# -----------------------------
api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise ValueError("MISTRAL_API_KEY not found in environment variables")

generator = AnswerGenerator(api_key=api_key)
diagram_service = DiagramService(generator)

# -----------------------------
# 2️⃣ Setup YouTube transcript loader
# -----------------------------
loader = YouTubeLoader()
cleaner = TranscriptCleaner()

# -----------------------------
# 3️⃣ Input: YouTube video ID or URL
# -----------------------------
video_id = "d1yfb93beSI"  # Replace with your test video

try:
    # Fetch transcript
    raw_transcript = loader.fetch_transcript(video_id)
    if not raw_transcript:
        raise Exception("No transcript available for video")

    # Clean transcript
    cleaned_transcript = cleaner.clean_transcript(raw_transcript)

    # Convert to single text
    transcript_text = " ".join([chunk["text"] for chunk in cleaned_transcript])
    logging.info(f"Transcript length: {len(transcript_text)} characters")

except Exception as e:
    raise Exception(f"Failed to fetch/clean transcript: {e}")

# -----------------------------
# 4️⃣ Generate diagram
# -----------------------------
try:
    png_bytes = diagram_service.generate_diagram(transcript_text)

    # -----------------------------
    # 5️⃣ Save diagram locally
    # -----------------------------
    output_file = "youtube_diagram.png"
    with open(output_file, "wb") as f:
        f.write(png_bytes)

    print(f"✅ Diagram generated successfully! Check file: {output_file}")

except Exception as e:
    print(f"❌ Failed to generate diagram: {e}")