"use client";

import React, { FC, useState } from "react";
import { ingestVideo, generateNotesPDF, generatePPT } from "@/app/services/api";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { PlusCircle, Youtube, FileText, File } from "lucide-react";

const VideoInput: FC<{ onIngestSuccess?: () => void }> = ({
  onIngestSuccess,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [pptLoading, setPptLoading] = useState(false);
  const [ingestedVideoId, setIngestedVideoId] = useState<string | null>(null);

  // Extract clean video ID
  const getCleanVideoId = (input: string) => {
    const trimmed = input.trim();
    const match = trimmed.match(/(?:v=|\/be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : trimmed;
  };

  // ---------------------- Ingest Video ----------------------
  const handleIngest = async () => {
    const videoId = getCleanVideoId(inputValue);

    if (!videoId || videoId.length < 11) {
      return toast.error("Please enter a valid YouTube URL or Video ID");
    }

    setLoading(true);
    try {
      const res = await ingestVideo(videoId);
      toast.success(`Success! Processed ${res.chunks} segments.`);
      setIngestedVideoId(videoId); // ✅ lock Notes & PPT buttons
      onIngestSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to ingest video");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Generate Notes ----------------------
  const handleGenerateNotes = async () => {
    if (!ingestedVideoId) return toast.error("You must ingest a video first");

    try {
      setNotesLoading(true);
      const blob = await generateNotesPDF(ingestedVideoId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video-notes.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Notes downloaded!");
    } catch (err: any) {
      toast.error("Failed to generate notes");
    } finally {
      setNotesLoading(false);
    }
  };

  // ---------------------- Generate PPT ----------------------
  const handleGeneratePPT = async () => {
    if (!ingestedVideoId) return toast.error("You must ingest a video first");

    try {
      setPptLoading(true);
      const blob = await generatePPT(ingestedVideoId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video-presentation.pptx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPT downloaded!");
    } catch (err: any) {
      toast.error("Failed to generate PPT");
    } finally {
      setPptLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-blue-500 transition-colors">
            <Youtube size={18} />
          </div>
          <input
            type="text"
            id="videoId"
            placeholder=" "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleIngest()}
            className="peer w-full pl-11 pr-4 pt-6 pb-2 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-transparent"
          />
          <label
            htmlFor="videoId"
            className="absolute left-11 top-4 text-gray-500 transition-all 
            peer-placeholder-shown:text-base peer-placeholder-shown:top-4 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-400
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Paste YouTube URL or Video ID
          </label>
        </div>

        <button
          onClick={handleIngest}
          disabled={loading || !inputValue.trim()}
          className="h-[58px] px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800/50 disabled:text-gray-500 font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/10"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <PlusCircle size={18} />
              <span>Ingest</span>
            </>
          )}
        </button>

        <button
          onClick={handleGenerateNotes}
          disabled={notesLoading || !ingestedVideoId} // ✅ locked until ingest
          className="h-[58px] px-8 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500 font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-purple-500/10"
        >
          {notesLoading ? (
            <Spinner />
          ) : (
            <>
              <FileText size={18} />
              <span>Generate Notes PDF</span>
            </>
          )}
        </button>

        <button
          onClick={handleGeneratePPT}
          disabled={pptLoading || !ingestedVideoId} // ✅ locked until ingest
          className="h-[58px] px-8 rounded-2xl bg-green-600 hover:bg-green-500 disabled:bg-gray-800/50 disabled:text-gray-500 font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-green-500/10"
        >
          {pptLoading ? (
            <Spinner />
          ) : (
            <>
              <File size={18} />
              <span>Generate PPT</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-500 uppercase tracking-widest">
        Supports Links, Shorts, and Embeds
      </p>
    </div>
  );
};

export default VideoInput;