# llm/question_rewriter.py

from langchain_mistralai import ChatMistralAI


class QuestionRewriter:

    def __init__(self, api_key: str):
        self.llm = ChatMistralAI(
            model="mistral-large-latest",
            mistral_api_key=api_key,
            temperature=0
        )

    def rewrite(self, chat_history: str, question: str):

        prompt = f"""
Given the conversation history and a follow-up question,
rewrite the question into a standalone question.

Conversation History:
{chat_history}

Follow-up Question:
{question}

Standalone Question:
"""

        response = self.llm.invoke(prompt)
        return response.content.strip()