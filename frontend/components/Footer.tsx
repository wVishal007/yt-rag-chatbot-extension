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