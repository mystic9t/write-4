"use client";

import React from "react";
import { FileText } from "lucide-react";

interface DocumentTypeOption {
  value: string;
  label: string;
}

interface SubTypeOption {
  value: string;
  label: string;
}

interface DocumentTypeSelectorProps {
  documentType: 'world' | 'character' | 'story' | 'generic';
  setDocumentType: (type: 'world' | 'character' | 'story' | 'generic') => void;
  subType: string;
  setSubType: (subType: string) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentType,
  setDocumentType,
  subType,
  setSubType
}) => {
  const documentTypeOptions: DocumentTypeOption[] = [
    { value: 'generic', label: 'Generic Document' },
    { value: 'world', label: 'World' },
    { value: 'character', label: 'Character' },
    { value: 'story', label: 'Story' }
  ];

  // Get sub-type options based on document type
  const getSubTypeOptions = (): SubTypeOption[] => {
    switch(documentType) {
      case 'world':
        return [
          { value: 'geography', label: 'Geography & Maps' },
          { value: 'cultures', label: 'Cultures & Societies' },
          { value: 'magic', label: 'Magic & Technology' },
          { value: 'history', label: 'History & Timeline' }
        ];
      case 'character':
        return [
          { value: 'profile', label: 'Character Profile' },
          { value: 'backstory', label: 'Backstory' },
          { value: 'relationships', label: 'Relationships' },
          { value: 'arc', label: 'Character Arc' }
        ];
      case 'story':
        return [
          { value: 'plot', label: 'Plot Structure' },
          { value: 'scenes', label: 'Scenes' },
          { value: 'dialogue', label: 'Dialogue' },
          { value: 'themes', label: 'Themes' }
        ];
      default:
        return [];
    }
  };

  return (
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
            className="w-full bg-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark-select"
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
              className="w-full bg-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark-select"
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
  );
};

export default DocumentTypeSelector;
