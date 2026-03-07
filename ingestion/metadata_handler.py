# ingestion/metadata_handler.py


class MetadataHandler:

    def __init__(self, chunk_size: int = 500):
        self.chunk_size = chunk_size

    def chunk_transcript(self, transcript_data: list):
        """
        Merge transcript snippets into chunks
        while preserving first snippet timestamp.
        """
        chunks = []
        current_chunk = []
        chunk_start = None
        video_id = transcript_data[0]["video_id"]

        for snippet in transcript_data:
            if not current_chunk:
                chunk_start = snippet["start"]

            current_chunk.append(snippet["text"])

            joined_text = " ".join(current_chunk)

            if len(joined_text) >= self.chunk_size:
                chunks.append({
                    "content": joined_text,
                    "start": chunk_start,
                    "video_id": video_id,
                    "url": f"https://youtube.com/watch?v={video_id}&t={int(chunk_start)}"
                })
                current_chunk = []
                chunk_start = None

        # Add remaining chunk
        if current_chunk:
            chunks.append({
                "content": " ".join(current_chunk),
                "start": chunk_start,
                "video_id": video_id,
                "url": f"https://youtube.com/watch?v={video_id}&t={int(chunk_start)}"
            })

        return chunks