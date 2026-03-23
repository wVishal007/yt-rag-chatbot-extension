import { NextRequest, NextResponse } from "next/server";
import { queryDocuments } from "@/lib/langchain/vectorStore";
import { llm } from "@/lib/langchain/llm";

export async function POST(req: NextRequest) {
  try {
    const { question, video_id } = await req.json();

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    const matches = await queryDocuments(question, video_id);

    const context = matches
      .map((m: any) => m.pageContent)
      .join("\n\n");

    // ✅ MUCH BETTER PROMPT
    const prompt = `
You are a helpful AI assistant.

Answer ONLY from the provided context.
If answer is not in context, say "I don't know".

Context:
${context}

Question: ${question}

Answer:
`;

    const response = await llm.invoke(prompt);

    return NextResponse.json({
      answer: response.content,
      sources: matches.map((m: any) => m.metadata?.source),
    });

  } catch (error: any) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}