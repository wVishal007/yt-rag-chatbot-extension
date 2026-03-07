def build_rag_prompt(context: str, question: str) -> str:
    return f"""
You are an expert assistant answering questions about a YouTube video.

Rules:
- Only use information from the provided context.
- Do not add external knowledge.
- If answer not found, say: "The video does not mention this."
- Provide concise bullet-point answers.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""