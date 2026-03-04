# test_generate_ppt_styled.py
from backend.services.notes_service import NotesService
from llm.answer_generator import AnswerGenerator  # Or your real LLM
import os

# -----------------------------
# 1️⃣ Mock LLM for testing
# -----------------------------
class MockLLM:
    def invoke(self, prompt: str):
        # Expanded mock notes with multiple sections and styling
        content = """
# Introduction
- Welcome to this lecture on Python programming.
- Python is a versatile, high-level programming language.
- Widely used in **AI, web development, and data science**.

## Why Python?
- Easy to learn syntax.
- Supports multiple paradigms: procedural, object-oriented, functional.
- Strong community and libraries (NumPy, Pandas, TensorFlow).

# Core Concepts
## Variables & Data Types
- Numbers, Strings, Lists, Tuples, Dictionaries
- Example: `x = 10`, `name = "Alice"`

## Loops & Conditionals
- `for` loops, `while` loops
- `if`, `elif`, `else` statements
- **Key Tip:** Avoid infinite loops!

## Functions
- Define with `def` keyword
- Can return values
- Example: `def add(a, b): return a + b`

## Classes & Objects
- Object-Oriented Programming in Python
- Example:
  - `class Dog:`
  - `    def __init__(self, name):`
  - `        self.name = name`

# Key Takeaways
- Python is beginner-friendly.
- Supports multiple programming styles.
- Great ecosystem for AI and data analysis.

# Summary
- Learned core syntax and structures.
- Ready to write simple Python programs.
- Next step: Hands-on exercises and projects.
"""
        return type("obj", (object,), {"content": content})()  # mimic llm.invoke response

generator = type("MockGenerator", (object,), {"llm": MockLLM()})()
notes_service = NotesService(generator)

# -----------------------------
# 2️⃣ Example transcript text
# -----------------------------
transcript_text = """
Welcome to this test lecture. Today we will discuss Python programming basics.
Python is an easy-to-learn, high-level programming language.
It supports multiple paradigms and is widely used in AI and web development.
Key topics include variables, loops, functions, and classes.
By the end of this lecture, you should be able to write simple Python programs.
"""

# -----------------------------
# 3️⃣ Generate PPT
# -----------------------------
ppt_bytes = notes_service.generate_ppt(transcript_text)

# -----------------------------
# 4️⃣ Save PPT locally
# -----------------------------
output_file = "test_output_styled.pptx"
with open(output_file, "wb") as f:
    f.write(ppt_bytes)

print(f"PPT generated successfully! Check the file: {output_file}")