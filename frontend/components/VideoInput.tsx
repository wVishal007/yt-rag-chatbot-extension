"use client";
import React, { FC, useState } from 'react';
import { ingestVideo } from '@/app/services/api';
import { toast } from 'sonner';
import Spinner from './Spinner';
import { PlusCircle } from 'lucide-react'; // Suggested icon library

const VideoInput: FC<{ onIngestSuccess?: () => void }> = ({ onIngestSuccess }) => {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    if (!videoId) return toast.error('Please enter a YouTube Video ID');
    setLoading(true);
    try {
      const res = await ingestVideo(videoId);
      toast.success(`Success! Processed ${res.chunks} segments.`);
      setVideoId('');
      onIngestSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to ingest video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow group">
          <input
            type="text"
            id="videoId"
            placeholder=" "
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="peer w-full px-4 pt-6 pb-2 rounded-2xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-transparent"
          />
          <label
            htmlFor="videoId"
            className="absolute left-4 top-4 text-gray-500 transition-all 
            peer-placeholder-shown:text-base peer-placeholder-shown:top-4 
            peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-400
            peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            YouTube Video ID (e.g., dQw4w9WgXcQ)
          </label>
        </div>

        <button
          onClick={handleIngest}
          disabled={loading || !videoId}
          className="h-[58px] px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 font-medium transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/10"
        >
          {loading ? <Spinner /> : <PlusCircle size={18} />}
          <span>{loading ? 'Processing...' : 'Ingest'}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoInput;