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