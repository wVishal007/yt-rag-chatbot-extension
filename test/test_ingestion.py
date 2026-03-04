from ingestion.youtube_loader import YouTubeLoader
from ingestion.transcript_cleaner import TranscriptCleaner
from ingestion.metadata_handler import MetadataHandler

video_id = "5MuIMqhT8DM"

loader = YouTubeLoader()
cleaner = TranscriptCleaner()
chunker = MetadataHandler(chunk_size=500)

raw_transcript = loader.fetch_transcript(video_id)
clean_transcript = cleaner.clean_transcript(raw_transcript)
chunks = chunker.chunk_transcript(clean_transcript)

print(chunks[0])