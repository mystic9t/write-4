"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MetricsSidebar from "@/components/Editor/MetricsSidebar";
import Link from "next/link";

// Dynamically import the TextEditor to avoid SSR issues with TipTap
const TextEditor = dynamic(
  () => import("@/components/Editor/TextEditor"),
  { ssr: false }
);

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update metrics when content changes
  useEffect(() => {
    // Count words
    const words = content.replace(/<[^>]*>/g, "") // Remove HTML tags
      .split(/\s+/)
      .filter(word => word.length > 0);
    setWordCount(words.length);

    // Count characters
    const chars = content.replace(/<[^>]*>/g, "").length;
    setCharCount(chars);

    // Calculate reading time (average reading speed: 200 words per minute)
    setReadingTime(Math.max(1, Math.ceil(words.length / 200)));
  }, [content]);

  const handleSave = (newContent: string) => {
    setContent(newContent);
    // Save to localStorage for persistence
    localStorage.setItem('editorContent', newContent);

    // Show saving indicator
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Save to localStorage for persistence
    localStorage.setItem('editorTitle', newTitle);
  };

  // Load content from localStorage on initial render - only runs once
  useEffect(() => {
    // Use a ref to track if this is the first render
    const isFirstRender = { current: true };

    if (typeof window !== 'undefined' && isFirstRender.current) {
      isFirstRender.current = false;
      const savedContent = localStorage.getItem('editorContent');
      const savedTitle = localStorage.getItem('editorTitle');

      if (savedContent) setContent(savedContent);
      if (savedTitle) setTitle(savedTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const handleAnalyzeContent = () => {
    setIsAnalyzing(true);

    // AI analysis would go here
    // For now just simulate a delay
    setTimeout(() => {
      alert("Content analysis: This text appears to be well-structured and engaging.");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <header className="bg-dark-900 border-b border-dark-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <Link href="/" className="mr-4 flex items-center group">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-1.5 rounded-md mr-2 group-hover:from-primary-500 group-hover:to-purple-500 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-bold text-primary-400 group-hover:text-primary-300 transition-colors">Word-Forge</span>
            </Link>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-medium focus:outline-none border-b border-transparent focus:border-primary-500 pb-1 w-full bg-transparent text-white"
              placeholder="Document Title"
            />
          </div>
          <div className="flex items-center">
            {isSaving ? (
              <span className="text-sm text-dark-400 animate-pulse">Saving...</span>
            ) : (
              <span className="text-sm text-dark-400">Saved</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <TextEditor
              initialContent={content}
              onSave={handleSave}
            />
          </div>

          <div className="w-full md:w-80 sticky top-24 self-start">
            <MetricsSidebar
              wordCount={wordCount}
              charCount={charCount}
              readingTime={readingTime}
              onAnalyzeContent={handleAnalyzeContent}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
