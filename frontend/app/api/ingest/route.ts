import { NextRequest, NextResponse } from "next/server";
import { getTranscript } from "@/lib/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { upsertDocuments } from "@/lib/langchain/vectorStore";

export async function POST(req: NextRequest) {
  try {
    const { video_id } = await req.json();

    if (!video_id) {
      return NextResponse.json(
        { success: false, error: "video_id is required" },
        { status: 400 }
      );
    }

    const transcript = await getTranscript(video_id);
    console.log(transcript);
    


    if (!transcript) {
      return NextResponse.json(
        { success: false, error: "Transcript not found" },
        { status: 404 }
      );
    }

    
    if (!transcript || transcript.trim().length < 20) {
  return NextResponse.json(
    { success: false, error: "Transcript is empty or too short" },
    { status: 400 }
  );
}

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const docs = await splitter.createDocuments(
      [transcript],
      [
        {
          source: `https://youtube.com/watch?v=${video_id}`,
          video_id,
        },
      ]
    );

    await upsertDocuments(docs, video_id);

    return NextResponse.json({
      success: true,
      message: "Video ingested successfully",
    });

  } catch (error: any) {
    console.error("INGEST ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}