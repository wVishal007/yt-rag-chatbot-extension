import axios from "axios";

// Since backend is inside Next.js, no need for external base URL

export const ingestVideo = async (video_id: string) => {
  const res = await axios.post("/api/ingest", { video_id });
  return res.data;
};

export const chatWithAI = async (video_id: string, question: string) => {
  const res = await axios.post("/api/chat", { video_id, question });
  return res.data;
};

export const generateNotes = async (video_id: string) => {
  const res = await axios.post("/api/generate-notes", { video_id }, {
    responseType: "blob",
  });
  return res.data;
};

export const generatePPT = async (video_id: string) => {
  const res = await axios.post("/api/generate-ppt", { video_id }, {
    responseType: "blob",
  });
  return res.data;
};