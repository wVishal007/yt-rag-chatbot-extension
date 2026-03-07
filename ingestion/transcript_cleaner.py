# ingestion/transcript_cleaner.py

import re


class TranscriptCleaner:

    @staticmethod
    def clean_snippet(text: str) -> str:
        """
        Clean individual transcript snippet.
        """
        # Remove stage directions like (Laughter)
        text = re.sub(r"\(.*?\)", "", text)

        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text).strip()

        return text

    def clean_transcript(self, transcript_data: list):
        """
        Clean full transcript list.
        """
        for snippet in transcript_data:
            snippet["text"] = self.clean_snippet(snippet["text"])

        return transcript_data