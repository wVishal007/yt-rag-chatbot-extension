# retrieval/embeddings.py
from dotenv import load_dotenv
from langchain_mistralai import MistralAIEmbeddings
load_dotenv()


class EmbeddingModel:

    def __init__(self, api_key: str):
        self.embeddings = MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=api_key
        )

    def get_model(self):
        return self.embeddings