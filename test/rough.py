from youtube_transcript_api import YouTubeTranscriptApi

video_id = "5MuIMqhT8DM"
yt_api = YouTubeTranscriptApi()
transcript = yt_api.fetch(video_id=video_id)

structured_transcript = []

for snippet in transcript.snippets:
    structured_transcript.append({
        "text": snippet.text,
        "start": snippet.start,
        "duration": snippet.duration,
        "video_id": video_id,
        "url": f"https://youtube.com/watch?v={video_id}&t={int(snippet.start)}"
    })

print(structured_transcript[0])