

// ===== File: .next\dev\types\cache-life.d.ts =====

// Type definitions for Next.js cacheLife configs

declare module 'next/cache' {
  export { unstable_cache } from 'next/dist/server/web/spec-extension/unstable-cache'
  export {
    updateTag,
    revalidateTag,
    revalidatePath,
    refresh,
  } from 'next/dist/server/web/spec-extension/revalidate'
  export { unstable_noStore } from 'next/dist/server/web/spec-extension/unstable-no-store'

  
    /**
     * Cache this `"use cache"` for a timespan defined by the `"default"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 900 seconds (15 minutes)
     *   expire:     never
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 15 minutes, start revalidating new values in the background.
     * It lives for the maximum age of the server cache. If this entry has no traffic for a while, it may serve an old value the next request.
     */
    export function cacheLife(profile: "default"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"seconds"` profile.
     * ```
     *   stale:      30 seconds
     *   revalidate: 1 seconds
     *   expire:     60 seconds (1 minute)
     * ```
     * 
     * This cache may be stale on clients for 30 seconds before checking with the server.
     * If the server receives a new request after 1 seconds, start revalidating new values in the background.
     * If this entry has no traffic for 1 minute it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "seconds"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"minutes"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 60 seconds (1 minute)
     *   expire:     3600 seconds (1 hour)
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 1 minute, start revalidating new values in the background.
     * If this entry has no traffic for 1 hour it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "minutes"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"hours"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 3600 seconds (1 hour)
     *   expire:     86400 seconds (1 day)
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 1 hour, start revalidating new values in the background.
     * If this entry has no traffic for 1 day it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "hours"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"days"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 86400 seconds (1 day)
     *   expire:     604800 seconds (1 week)
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 1 day, start revalidating new values in the background.
     * If this entry has no traffic for 1 week it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "days"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"weeks"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 604800 seconds (1 week)
     *   expire:     2592000 seconds (1 month)
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 1 week, start revalidating new values in the background.
     * If this entry has no traffic for 1 month it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "weeks"): void
    
    /**
     * Cache this `"use cache"` for a timespan defined by the `"max"` profile.
     * ```
     *   stale:      300 seconds (5 minutes)
     *   revalidate: 2592000 seconds (1 month)
     *   expire:     31536000 seconds (365 days)
     * ```
     * 
     * This cache may be stale on clients for 5 minutes before checking with the server.
     * If the server receives a new request after 1 month, start revalidating new values in the background.
     * If this entry has no traffic for 365 days it will expire. The next request will recompute it.
     */
    export function cacheLife(profile: "max"): void
    
    /**
     * Cache this `"use cache"` using a custom timespan.
     * ```
     *   stale: ... // seconds
     *   revalidate: ... // seconds
     *   expire: ... // seconds
     * ```
     *
     * This is similar to Cache-Control: max-age=`stale`,s-max-age=`revalidate`,stale-while-revalidate=`expire-revalidate`
     *
     * If a value is left out, the lowest of other cacheLife() calls or the default, is used instead.
     */
    export function cacheLife(profile: {
      /**
       * This cache may be stale on clients for ... seconds before checking with the server.
       */
      stale?: number,
      /**
       * If the server receives a new request after ... seconds, start revalidating new values in the background.
       */
      revalidate?: number,
      /**
       * If this entry has no traffic for ... seconds it will expire. The next request will recompute it.
       */
      expire?: number
    }): void
  

  import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
  export { cacheTag }

  export const unstable_cacheTag: typeof cacheTag
  export const unstable_cacheLife: typeof cacheLife
}


// ===== File: .next\dev\types\routes.d.ts =====

// This file is generated automatically by Next.js
// Do not edit this file manually

type AppRoutes = "/"
type PageRoutes = never
type LayoutRoutes = "/"
type RedirectRoutes = never
type RewriteRoutes = never
type Routes = AppRoutes | PageRoutes | LayoutRoutes | RedirectRoutes | RewriteRoutes


interface ParamMap {
  "/": {}
}


export type ParamsOf<Route extends Routes> = ParamMap[Route]

interface LayoutSlotMap {
  "/": never
}


export type { AppRoutes, PageRoutes, LayoutRoutes, RedirectRoutes, RewriteRoutes, ParamMap }

declare global {
  /**
   * Props for Next.js App Router page components
   * @example
   * ```tsx
   * export default function Page(props: PageProps<'/blog/[slug]'>) {
   *   const { slug } = await props.params
   *   return <div>Blog post: {slug}</div>
   * }
   * ```
   */
  interface PageProps<AppRoute extends AppRoutes> {
    params: Promise<ParamMap[AppRoute]>
    searchParams: Promise<Record<string, string | string[] | undefined>>
  }

  /**
   * Props for Next.js App Router layout components
   * @example
   * ```tsx
   * export default function Layout(props: LayoutProps<'/dashboard'>) {
   *   return <div>{props.children}</div>
   * }
   * ```
   */
  type LayoutProps<LayoutRoute extends LayoutRoutes> = {
    params: Promise<ParamMap[LayoutRoute]>
    children: React.ReactNode
  } & {
    [K in LayoutSlotMap[LayoutRoute]]: React.ReactNode
  }
}


// ===== File: .next\dev\types\validator.ts =====

// This file is generated automatically by Next.js
// Do not edit this file manually
// This file validates that all pages and layouts export the correct types

import type { AppRoutes, LayoutRoutes, ParamMap } from "./routes.js"
import type { ResolvingMetadata, ResolvingViewport } from "next/types.js"

type AppPageConfig<Route extends AppRoutes = AppRoutes> = {
  default: React.ComponentType<{ params: Promise<ParamMap[Route]> } & any> | ((props: { params: Promise<ParamMap[Route]> } & any) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>)
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[]
  generateMetadata?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingMetadata
  ) => Promise<any> | any
  generateViewport?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingViewport
  ) => Promise<any> | any
  metadata?: any
  viewport?: any
}

type LayoutConfig<Route extends LayoutRoutes = LayoutRoutes> = {
  default: React.ComponentType<LayoutProps<Route>> | ((props: LayoutProps<Route>) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>)
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[]
  generateMetadata?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingMetadata
  ) => Promise<any> | any
  generateViewport?: (
    props: { params: Promise<ParamMap[Route]> } & any,
    parent: ResolvingViewport
  ) => Promise<any> | any
  metadata?: any
  viewport?: any
}


// Validate ../../../app/page.tsx
{
  type __IsExpected<Specific extends AppPageConfig<"/">> = Specific
  const handler = {} as typeof import("../../../app/page.js")
  type __Check = __IsExpected<typeof handler>
  // @ts-ignore
  type __Unused = __Check
}







// Validate ../../../app/layout.tsx
{
  type __IsExpected<Specific extends LayoutConfig<"/">> = Specific
  const handler = {} as typeof import("../../../app/layout.js")
  type __Check = __IsExpected<typeof handler>
  // @ts-ignore
  type __Unused = __Check
}


// ===== File: app\layout.tsx =====

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YT-RAG-CHATBOT",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster/>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}


// ===== File: app\page.tsx =====

import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import VideoInput from "@/components/VideoInput";

export default function Home() {
  return (
    // Replaced harsh conic with a subtle dark theme depth
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Video Intelligence
          </h1>
          <p className="text-gray-400">Ingest YouTube content and chat with the transcript instantly.</p>
        </header>
        
        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-1 backdrop-blur-sm shadow-2xl">
          <div className="bg-[#0f0f0f] rounded-[22px] p-6 lg:p-8">
            <VideoInput />
            <div className="my-8 border-t border-white/5" />
            <ChatBox />
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== File: app\services\api.ts =====

import axios from "axios";

// 🔥 Everything runs inside Next.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL; // ✅ Use the public env

if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL is not defined");

export const ingestVideo = async (videoId: string) => {
  const res = await axios.post(`${API_BASE}/ingest`, { videoId:videoId });
  return res.data;
};

export const chatWithAI = async (question: string) => {
  const res = await axios.post(`${API_BASE}/chat`, { question });
  return res.data;
};

export const generateNotes = async (transcript: string) => {
  const res = await axios.post(`${API_BASE}/generate-notes`, { transcript }, { responseType: "blob" });
  return res.data;
};

export const generatePPT = async (transcript: string) => {
  const res = await axios.post(`${API_BASE}/generate-ppt`, { transcript }, { responseType: "blob" });
  return res.data;
};

// ===== File: components\ChatBox.tsx =====

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

// ===== File: components\Footer.tsx =====

"use client";
import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0a0a0a] py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-gray-300 font-medium">RAG Video Assistant</span>. 
            Built with Next.js & AI.
          </p>
        </div>
        
        <div className="flex gap-6 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-500 transition-colors">API Docs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// ===== File: components\Navbar.tsx =====

"use client";
import React, { FC } from 'react';
import { FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";
import { Globe } from "lucide-react";

const Navbar: FC = () => {
  const navLinks = [
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/vishal-singh-188013324/", label: "LinkedIn" },
    { icon: <FaGithub />, href: "https://github.com/wVishal007", label: "GitHub" },
    { icon: <Globe size={18} />, href: "https://vishal4u.vercel.app/", label: "Portfolio" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-red-500/10 p-2 rounded-lg">
            <FaYoutube className="text-red-500 text-2xl" />
          </div>
          <h1 className="font-bold text-lg md:text-xl text-white tracking-tight">
            RAG<span className="text-red-500">Video</span>
          </h1>
        </div>

        {/* Links Section */}
        <div className="flex items-center gap-2 sm:gap-6">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              title={link.label}
            >
              <span className="text-xl sm:text-lg">{link.icon}</span>
              <span className="hidden sm:inline text-sm font-medium">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// ===== File: components\Spinner.tsx =====

import React, { FC } from 'react';

const Spinner: FC = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default Spinner;

// ===== File: components\VideoInput.tsx =====

"use client";

import React, { FC, useState } from "react";
import { ingestVideo, generateNotes, generatePPT } from "@/app/services/api";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { PlusCircle, Youtube, FileText, File, CheckCircle2, RefreshCcw } from "lucide-react";

const VideoInput: FC<{ onIngestSuccess?: () => void }> = ({ onIngestSuccess }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [pptLoading, setPptLoading] = useState(false);
  const [ingestedVideoId, setIngestedVideoId] = useState<string | null>(null);

  const getCleanVideoId = (input: string) => {
    const trimmed = input.trim();
    const match = trimmed.match(/(?:v=|\/be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : trimmed;
  };

  const handleIngest = async () => {
    const videoId = getCleanVideoId(inputValue);
    if (!videoId || videoId.length < 11) {
      return toast.error("Please enter a valid YouTube URL or Video ID");
    }

    setLoading(true);
    try {
      const res = await ingestVideo(videoId);
      toast.success(`Video processed successfully!`);
      setIngestedVideoId(videoId);
      onIngestSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to ingest video");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (
    apiCall: (id: string) => Promise<Blob>,
    setLoader: (loading: boolean) => void,
    fileName: string
  ) => {
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
      {/* Input Section */}
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

      {/* Action Section (Only visible after Ingest) */}
      {ingestedVideoId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="col-span-full flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            <CheckCircle2 size={16} />
            <span>Ready to process: <strong>{ingestedVideoId}</strong></span>
            <button 
              onClick={() => {setIngestedVideoId(null); setInputValue("");}}
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

// ===== File: next-env.d.ts =====

/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.


// ===== File: next.config.ts =====

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
