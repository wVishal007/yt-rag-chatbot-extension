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