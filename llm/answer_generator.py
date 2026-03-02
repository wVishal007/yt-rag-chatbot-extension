# llm/answer_generator.py

from langchain_mistralai import ChatMistralAI
from llm.prompt_templates import build_rag_prompt


class AnswerGenerator:

    def __init__(self, api_key: str):
        self.llm = ChatMistralAI(
            model="mistral-large-latest",
            mistral_api_key=api_key,
            temperature=0.2
        )

    def generate_answer(self, retrieved_docs, question: str):
        
        # Build context string
        context = ""
        sources = []

        retrieved_docs = sorted(
        retrieved_docs,
        key=lambda x: x.metadata["start"]
        )

        for doc in retrieved_docs:
            context += doc.page_content + "\n\n"
            sources.append(doc.metadata["url"])

        prompt = build_rag_prompt(context, question)

        response = self.llm.invoke(prompt)

        return {
            "answer": response.content,
            "sources": list(set(sources))
        }