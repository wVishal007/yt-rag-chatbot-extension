"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import { chatWithAI } from "@/app/services/api";
import { toast } from "sonner";
import Spinner from "./Spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SendHorizonal, Terminal } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const ChatBox: FC = () => {
  const [sessionId] = useState(() => `sess-${Date.now()}`);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await chatWithAI(sessionId, question);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: res.answer,
        sources: res.sources || [],
      }]);
    } catch (err: any) {
      toast.error("AI connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
            <Terminal size={40} strokeWidth={1} />
            <p>Ready for your questions...</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10 shadow-lg" 
                : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
            }`}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer" 
                         className="text-[11px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors truncate max-w-[150px]">
                        {src.split('v=')[1] || 'Reference'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none animate-pulse">
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-6 relative">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about the video..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 transition-all"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;