# memory/conversation_memory.py

class ConversationMemoryManager:

    def __init__(self):
        self.chat_history = []

    def add_user_message(self, message: str):
        self.chat_history.append({"role": "user", "content": message})

    def add_ai_message(self, message: str):
        self.chat_history.append({"role": "assistant", "content": message})

    def get_history(self):
        """
        Returns formatted chat history as plain text.
        """
        history_text = ""

        for msg in self.chat_history:
            if msg["role"] == "user":
                history_text += f"User: {msg['content']}\n"
            else:
                history_text += f"Assistant: {msg['content']}\n"

        return history_text

    def clear(self):
        self.chat_history = []