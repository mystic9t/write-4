"use client";

import React, { useState } from "react";
import {
  FileText, Clock, AlignLeft,
  Type, Wand2, PanelRight, Book,
  BarChart2, Sparkles, Settings, Palette
} from "lucide-react";
import DarkSelect from "../ui/DarkSelect";

interface MetricsSidebarProps {
  wordCount: number;
  charCount: number;
  readingTime: number;
  onAnalyzeContent: () => void;
  isAnalyzing: boolean;
}

const MetricsSidebar: React.FC<MetricsSidebarProps> = ({
  wordCount,
  charCount,
  readingTime,
  onAnalyzeContent,
  isAnalyzing
}) => {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16px");

  const fontOptions = [
    "Inter", "Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"
  ];

  const fontSizeOptions = [
    "12px", "14px", "16px", "18px", "20px", "24px"
  ];

  return (
    <div className="w-full h-full border-l border-dark-800 p-5 bg-dark-900 rounded-lg shadow-xl">
      <h2 className="text-lg font-medium mb-6 flex items-center text-white">
        <Settings className="mr-2 text-primary-400" size={20} />
        Document Settings
      </h2>

      {/* Font Settings */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <Type className="mr-2 text-primary-400" size={16} />
          Typography
        </h3>

        <div className="mb-4 bg-dark-800 p-4 rounded-lg border border-dark-700">
          <DarkSelect
            label="Font Family"
            options={fontOptions}
            value={fontFamily}
            onChange={setFontFamily}
            className="mb-4"
          />

          <DarkSelect
            label="Font Size"
            options={fontSizeOptions}
            value={fontSize}
            onChange={setFontSize}
          />

          <div className="mt-4 pt-4 border-t border-dark-700">
            <label className="block text-xs text-dark-300 mb-2">Theme</label>
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-dark-950 rounded-full border-2 border-primary-500 flex items-center justify-center">
                <Palette size={14} className="text-primary-400" />
              </button>
              <button className="w-8 h-8 bg-white rounded-full border border-dark-700"></button>
              <button className="w-8 h-8 bg-[#2a2d3e] rounded-full border border-dark-700"></button>
              <button className="w-8 h-8 bg-[#1a1c2e] rounded-full border border-dark-700"></button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Metrics */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <BarChart2 className="mr-2 text-primary-400" size={16} />
          Document Metrics
        </h3>

        <div className="space-y-3 text-sm bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="flex justify-between items-center">
            <span className="text-dark-300 flex items-center">
              <FileText className="mr-1" size={14} /> Words
            </span>
            <span className="font-medium text-white bg-dark-700 px-3 py-1 rounded-md">{wordCount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-dark-300 flex items-center">
              <AlignLeft className="mr-1" size={14} /> Characters
            </span>
            <span className="font-medium text-white bg-dark-700 px-3 py-1 rounded-md">{charCount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-dark-300 flex items-center">
              <Clock className="mr-1" size={14} /> Reading Time
            </span>
            <span className="font-medium text-white bg-dark-700 px-3 py-1 rounded-md">{readingTime} min</span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <Sparkles className="mr-2 text-primary-400" size={16} />
          AI Analysis
        </h3>

        <button
          onClick={onAnalyzeContent}
          disabled={isAnalyzing}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <Book className="mr-2" size={16} />
          {isAnalyzing ? (
            <span className="flex items-center">
              <span className="animate-pulse">Analyzing</span>
              <span className="animate-pulse animation-delay-100">.</span>
              <span className="animate-pulse animation-delay-200">.</span>
              <span className="animate-pulse animation-delay-300">.</span>
            </span>
          ) : (
            "Analyze Content"
          )}
        </button>
      </div>
    </div>
  );
};

export default MetricsSidebar;
