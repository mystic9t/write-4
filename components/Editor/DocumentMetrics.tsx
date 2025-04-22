"use client";

import React from "react";
import { FileText, AlignLeft, Clock, Globe, Users } from "lucide-react";
import { BarChart2 } from "lucide-react";

interface DocumentRelations {
  worldId?: string;
  worldName?: string;
  characterIds?: string[];
  characterNames?: string[];
}

interface DocumentMetricsProps {
  wordCount: number;
  charCount: number;
  readingTime: number;
  documentId?: string;
  documentType: 'world' | 'character' | 'story' | 'generic';
  documentRelations?: DocumentRelations;
}

const DocumentMetrics: React.FC<DocumentMetricsProps> = ({
  wordCount,
  charCount,
  readingTime,
  documentId,
  documentType,
  documentRelations
}) => {
  return (
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
  );
};

export default DocumentMetrics;
