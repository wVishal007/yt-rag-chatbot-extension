from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

class YouTubeLoader:
    def __init__(self):
        self.api = YouTubeTranscriptApi()

    def fetch_transcript(self, video_id: str):
        try:
            # Try English first, fallback to any available auto-generated
            try:
                transcript = self.api.fetch(video_id=video_id, languages=['en'])
            except NoTranscriptFound:
                transcript = self.api.fetch(video_id=video_id)  # fallback auto-generated
        except TranscriptsDisabled:
            raise ValueError(f"Transcripts are disabled for video {video_id}")
        except NoTranscriptFound:
            raise ValueError(f"No transcripts found for video {video_id}")

        structured_data = []
        for snippet in transcript:
            structured_data.append({
                "text": snippet.text,
                "start": snippet.start,
                "duration": getattr(snippet, "duration", 0),
                "video_id": video_id,
                "url": f"https://youtube.com/watch?v={video_id}&t={int(snippet.start)}"
            })
        return structured_data