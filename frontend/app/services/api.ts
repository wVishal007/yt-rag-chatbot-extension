import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL; // FastAPI URL

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in your environment variables");
}


export const ingestVideo = async (videoId: string) => {
  const res = await axios.post(`${API_BASE}/ingest`, { video_id: videoId });
  return res.data;
};

export const chatWithAI = async (sessionId: string, question: string) => {
  const res = await axios.post(`${API_BASE}/chat`, { session_id: sessionId, question });
  return res.data;
};