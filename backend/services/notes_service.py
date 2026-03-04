from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from .ppt_service import PPTService
from io import BytesIO
import re
import html

class NotesService:

    def __init__(self, generator):
        self.generator = generator
        self.ppt_service = PPTService()   # reuse your AnswerGenerator

    def generate_notes_markdown(self, transcript: str) -> str:
        prompt = f"""
        You are an expert educator.
        
        Generate high-quality structured study notes from this transcript.
        
        Requirements:
        1. Create clear section headings based on topic shifts.
        2. Add subheadings if needed.
        3. Use bullet points for explanations.
        4. Highlight definitions clearly.
        5. Add:
           - Key Takeaways
           - Important Concepts
           - Final Summary
        
        Transcript:
        {transcript}
        """

        result = self.generator.llm.invoke(prompt)
        return result.content

    def markdown_to_pdf(self, markdown_text: str) -> bytes:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []

        # Base styles
        styles = getSampleStyleSheet()
        normal = styles["Normal"]
        heading1 = styles["Heading1"]
        heading2 = styles["Heading2"]

        # Custom bullet style
        bullet_style = ParagraphStyle(
            "Bullet", parent=normal, leftIndent=15, bulletIndent=10
        )

        for line in markdown_text.split("\n"):
            line = line.strip()
            if not line or line.startswith("---"):
                continue

            # Escape special HTML characters
            line = html.escape(line)

            # ✅ Convert **bold** to <b>bold</b>
            line = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", line)

            # Headings
            if line.startswith("# "):
                elements.append(Paragraph(line[2:], heading1))
                elements.append(Spacer(1, 0.3 * inch))
            elif line.startswith("## "):
                elements.append(Paragraph(line[3:], heading2))
                elements.append(Spacer(1, 0.25 * inch))
            # Bullet points
            elif line.startswith("- "):
                elements.append(Paragraph(line[2:], bullet_style, bulletText="•"))
                elements.append(Spacer(1, 0.1 * inch))
            else:
                elements.append(Paragraph(line, normal))
                elements.append(Spacer(1, 0.2 * inch))

        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
    
    def generate_ppt(self, transcript_text: str) -> bytes:
        """
        Convert transcript -> notes -> PPT bytes
        """
        markdown = self.generate_notes_markdown(transcript_text)
        ppt_bytes = self.ppt_service.markdown_to_ppt(markdown)
        return ppt_bytes
