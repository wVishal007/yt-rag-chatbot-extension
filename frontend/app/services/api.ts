// app/services/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL is not defined");

export const ingestVideo = async (video_id: string) => {
  console.log("working");
  console.log(video_id);
  const res = await axios.post(`${API_BASE}/ingest`, { video_id });
  return res.data;
};

// ✅ Support sessionId for persistent chat
export const chatWithAI = async (session_id: string, question: string) => {
  const res = await axios.post(`${API_BASE}/chat`, { session_id, question });
  return res.data;
};

export const generateNotes = async (video_id: string) => {
  const res = await axios.post(`${API_BASE}/generate-notes`, { video_id }, { responseType: "blob" });
  return res.data;
};

export const generatePPT = async (video_id: string) => {
  const res = await axios.post(`${API_BASE}/generate-ppt`, { video_id }, { responseType: "blob" });
  return res.data;
};