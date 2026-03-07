"use client";

import React, { FC, useState } from "react";
import { ingestVideo, generateNotes, generatePPT } from "@/app/services/api";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { PlusCircle, Youtube, FileText, File, CheckCircle2, RefreshCcw } from "lucide-react";

const VideoInput: FC<{ onIngestSuccess?: (videoId: string) => void }> = ({ onIngestSuccess }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [pptLoading, setPptLoading] = useState(false);
  const [ingestedVideoId, setIngestedVideoId] = useState<string | null>(null);

  // ✅ More robust YouTube ID parser
 const getCleanVideoId = (input: string) => {
  const trimmed = input.trim();

  // Match normal URL: ?v=VIDEOID
  let match = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Match youtu.be short links, /embed/, /shorts/
  match = trimmed.match(/(?:youtu\.be\/|\/(embed|shorts|v)\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[2];

  // If user just entered ID, return it
  if (trimmed.length === 11) return trimmed;

  return null; // invalid input
};

  const handleIngest = async () => {
    const videoId = getCleanVideoId(inputValue);
    if (!videoId || videoId.length < 11) {
      return toast.error("Please enter a valid YouTube URL or Video ID");
    }

    setLoading(true);
    try {
      await ingestVideo(videoId);
      toast.success("Video processed successfully!");
      setIngestedVideoId(videoId);
      onIngestSuccess?.(videoId);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to ingest video");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (apiCall: (id: string) => Promise<Blob>, setLoader: (b: boolean) => void, fileName: string) => {
    if (!ingestedVideoId) return;
    try {
      setLoader(true);
      const blob = await apiCall(ingestedVideoId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${fileName} downloaded!`);
    } catch (err) {
      toast.error(`Failed to generate ${fileName}`);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input */}
      <div className="relative group">
        <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm focus-within:border-blue-500/50 transition-all duration-300">
          <div className="relative flex-grow flex items-center">
            <Youtube className="absolute left-4 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Paste YouTube Link or Video ID..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleIngest()}
              className="w-full bg-transparent pl-12 pr-4 py-4 text-white focus:outline-none placeholder:text-gray-600"
            />
          </div>

          <button
            onClick={handleIngest}
            disabled={loading || !inputValue.trim()}
            className="md:w-40 h-[52px] rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            {loading ? <Spinner /> : <><PlusCircle size={18} /> Ingest</>}
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          Supports Links, Shorts, and Embeds
        </p>
      </div>

      {/* Actions */}
      {ingestedVideoId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="col-span-full flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            <CheckCircle2 size={16} />
            <span>Ready to process: <strong>{ingestedVideoId}</strong></span>
            <button
              onClick={() => { setIngestedVideoId(null); setInputValue(""); }}
              className="ml-auto text-xs flex items-center gap-1 hover:underline opacity-70"
            >
              <RefreshCcw size={12} /> Reset
            </button>
          </div>

          <button
            onClick={() => downloadFile(generateNotes, setNotesLoading, "video-notes.pdf")}
            disabled={notesLoading}
            className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/40 border border-purple-500/30 hover:border-purple-500 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Detailed Notes</h3>
                <p className="text-purple-300/60 text-sm">AI-generated PDF summary</p>
              </div>
            </div>
            {notesLoading && <Spinner />}
          </button>

          <button
            onClick={() => downloadFile(generatePPT, setPptLoading, "presentation.pptx")}
            disabled={pptLoading}
            className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/40 border border-emerald-500/30 hover:border-emerald-500 transition-all group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <File size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Presentation</h3>
                <p className="text-emerald-300/60 text-sm">PowerPoint slide deck</p>
              </div>
            </div>
            {pptLoading && <Spinner />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoInput;