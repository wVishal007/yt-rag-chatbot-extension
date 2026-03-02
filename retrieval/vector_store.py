# retrieval/vector_store.py

from langchain_chroma import Chroma
from langchain_core.documents import Document


class VectorStoreManager:

    def __init__(self, embedding_model, persist_directory="vector_db"):
        self.embedding_model = embedding_model
        self.persist_directory = persist_directory

        self.vectorstore = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embedding_model
        )

    def create_vector_store(self, chunks: list):
        documents = []

        for chunk in chunks:
            documents.append(
                Document(
                    page_content=chunk["content"],
                    metadata={
                        "start": chunk["start"],
                        "video_id": chunk["video_id"],
                        "url": chunk["url"]
                    }
                )
            )

        self.vectorstore.add_documents(documents)

    def similarity_search(self, query: str, k: int = 5):
        return self.vectorstore.similarity_search_with_score(query, k=k)