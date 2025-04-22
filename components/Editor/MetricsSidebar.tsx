"use client";

import React, { useState } from "react";
import {
  Book, Sparkles, Settings
} from "lucide-react";
import TypographySettings from "./TypographySettings";
import SaveButton from "../ui/SaveButton";
import DocumentTypeSelector from "./DocumentTypeSelector";
import DocumentMetrics from "./DocumentMetrics";

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
  subType: string;
  setSubType: (subType: string) => void;
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
  isSaving,
  subType,
  setSubType
}) => {
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16px");
  const [theme, setTheme] = useState("dark");

  return (
    <div className="w-full h-full border-l border-dark-800 p-5 bg-dark-900 rounded-lg shadow-xl">
      <h2 className="text-lg font-medium mb-6 flex items-center text-white">
        <Settings className="mr-2 text-primary-400" size={20} />
        Document Settings
      </h2>

      {/* Document Type Settings */}
      <DocumentTypeSelector
        documentType={documentType}
        setDocumentType={setDocumentType}
        subType={subType}
        setSubType={setSubType}
      />

      {/* Font Settings */}
      <TypographySettings
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Document Metrics */}
      <DocumentMetrics
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
        documentId={documentId}
        documentType={documentType}
        documentRelations={documentRelations}
      />

      {/* Save Document */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Document
        </h3>

        <SaveButton
          onClick={onSave}
          isLoading={isSaving}
          disabled={documentType !== 'generic' && !subType}
          label={`Save as ${documentType === 'generic' ? 'Document' : documentType}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          }
          className="w-full mb-2"
        />

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

        <SaveButton
          onClick={onAnalyzeContent}
          isLoading={isAnalyzing}
          label="Analyze Content"
          loadingLabel="Analyzing"
          icon={<Book size={16} />}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default MetricsSidebar;
