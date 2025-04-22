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
  documentType: 'world' | 'character' | 'story' | 'generic';
  setDocumentType: (type: 'world' | 'character' | 'story' | 'generic') => void;
  documentId?: string;
  documentRelations?: {
    worldId?: string;
    worldName?: string;
    characterIds?: string[];
    characterNames?: string[];
  };
  onSave: () => void;
  isSaving: boolean;
}

const MetricsSidebar: React.FC<MetricsSidebarProps> = ({
  wordCount,
  charCount,
  readingTime,
  onAnalyzeContent,
  isAnalyzing,
  documentType,
  setDocumentType,
  documentId,
  documentRelations,
  onSave,
  isSaving
}) => {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16px");
  const [subType, setSubType] = useState("");

  const fontOptions = [
    "Inter", "Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"
  ];

  const fontSizeOptions = [
    "12px", "14px", "16px", "18px", "20px", "24px"
  ];

  const documentTypeOptions = [
    { value: 'generic', label: 'Generic Document' },
    { value: 'world', label: 'World' },
    { value: 'character', label: 'Character' },
    { value: 'story', label: 'Story' }
  ];

  // Get sub-type options based on document type
  const getSubTypeOptions = () => {
    switch(documentType) {
      case 'world':
        return [
          { value: 'fantasy', label: 'Fantasy' },
          { value: 'scifi', label: 'Science Fiction' },
          { value: 'historical', label: 'Historical' },
          { value: 'modern', label: 'Modern' },
          { value: 'other', label: 'Other' }
        ];
      case 'character':
        return [
          { value: 'protagonist', label: 'Protagonist' },
          { value: 'antagonist', label: 'Antagonist' },
          { value: 'supporting', label: 'Supporting' },
          { value: 'other', label: 'Other' }
        ];
      case 'story':
        return [
          { value: 'novel', label: 'Novel' },
          { value: 'short_story', label: 'Short Story' },
          { value: 'script', label: 'Script' },
          { value: 'other', label: 'Other' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-full h-full border-l border-dark-800 p-5 bg-dark-900 rounded-lg shadow-xl">
      <h2 className="text-lg font-medium mb-6 flex items-center text-white">
        <Settings className="mr-2 text-primary-400" size={20} />
        Document Settings
      </h2>

      {/* Document Type Settings */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <FileText className="mr-2 text-primary-400" size={16} />
          Document Type
        </h3>

        <div className="mb-4 bg-dark-800 p-4 rounded-lg border border-dark-700">
          <div className="mb-4">
            <label className="block text-sm text-dark-300 mb-2">Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as any)}
              className="w-full bg-dark-900 border border-dark-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark-select"
            >
              {documentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {documentType !== 'generic' && getSubTypeOptions().length > 0 && (
            <div>
              <label className="block text-sm text-dark-300 mb-2">Sub-Type</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark-select"
              >
                <option value="">Select a sub-type...</option>
                {getSubTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

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

          {documentId && (
            <div className="pt-3 mt-3 border-t border-dark-700">
              <div className="text-dark-300 mb-2">Document ID:</div>
              <div className="font-mono text-xs bg-dark-900 p-2 rounded overflow-x-auto">
                {documentId}
              </div>
            </div>
          )}

          {documentRelations && documentType !== 'generic' && (
            <div className="pt-3 mt-3 border-t border-dark-700">
              <div className="text-dark-300 mb-2">Relationships:</div>

              {documentType === 'character' && documentRelations.worldId && (
                <div className="flex items-center text-xs mb-2">
                  <Globe size={12} className="mr-1 text-primary-400" />
                  <span>World: {documentRelations.worldName || documentRelations.worldId}</span>
                </div>
              )}

              {documentType === 'story' && (
                <>
                  {documentRelations.worldId && (
                    <div className="flex items-center text-xs mb-2">
                      <Globe size={12} className="mr-1 text-primary-400" />
                      <span>World: {documentRelations.worldName || documentRelations.worldId}</span>
                    </div>
                  )}

                  {documentRelations.characterIds && documentRelations.characterIds.length > 0 && (
                    <div className="flex items-start text-xs">
                      <Users size={12} className="mr-1 mt-0.5 text-primary-400" />
                      <div>
                        <span>Characters:</span>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          {documentRelations.characterNames ?
                            documentRelations.characterNames.map((name, i) => (
                              <li key={i}>{name}</li>
                            )) :
                            documentRelations.characterIds.map((id, i) => (
                              <li key={i}>{id}</li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Document */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Document
        </h3>

        <button
          onClick={onSave}
          disabled={isSaving || (documentType !== 'generic' && !subType)}
          className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {isSaving ? (
            <span className="flex items-center">
              <span className="animate-pulse">Saving</span>
              <span className="animate-pulse animation-delay-100">.</span>
              <span className="animate-pulse animation-delay-200">.</span>
              <span className="animate-pulse animation-delay-300">.</span>
            </span>
          ) : (
            `Save as ${documentType === 'generic' ? 'Document' : documentType}`
          )}
        </button>

        {documentType !== 'generic' && !subType && (
          <div className="text-xs text-amber-400 mt-1 text-center">
            Please select a sub-type to save
          </div>
        )}
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
