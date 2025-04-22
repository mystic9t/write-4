"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Book, Globe, Users } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";

interface DocumentSelectorProps {
  documentType: 'world' | 'character' | 'story' | 'generic';
  onSelect: (id: string, type: 'world' | 'character' | 'story') => void;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  documentType,
  onSelect
}) => {
  const { worlds, characters, stories } = useDatabase();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'world' | 'character' | 'story'>(documentType === 'generic' ? 'story' : documentType);

  // Get documents based on selected type
  const getDocuments = () => {
    switch (selectedType) {
      case 'world':
        return worlds;
      case 'character':
        return characters;
      case 'story':
        return stories;
      default:
        return [];
    }
  };

  // Get document name based on type
  const getDocumentName = (doc: any) => {
    if (selectedType === 'story') {
      return doc.title;
    }
    return doc.name;
  };

  // Get icon based on document type
  const getIcon = (type: 'world' | 'character' | 'story') => {
    switch (type) {
      case 'world':
        return <Globe size={16} className="mr-2 text-primary-400" />;
      case 'character':
        return <Users size={16} className="mr-2 text-primary-400" />;
      case 'story':
        return <Book size={16} className="mr-2 text-primary-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300"
      >
        <span className="flex items-center">
          <span className="mr-2">Expand Previous</span>
          {getIcon(selectedType)}
          <span>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</span>
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
          <div className="flex border-b border-dark-700">
            <button
              onClick={() => setSelectedType('world')}
              className={`flex-1 px-3 py-2 text-sm ${selectedType === 'world' ? 'bg-dark-700 text-primary-400' : 'text-dark-300'}`}
            >
              Worlds
            </button>
            <button
              onClick={() => setSelectedType('character')}
              className={`flex-1 px-3 py-2 text-sm ${selectedType === 'character' ? 'bg-dark-700 text-primary-400' : 'text-dark-300'}`}
            >
              Characters
            </button>
            <button
              onClick={() => setSelectedType('story')}
              className={`flex-1 px-3 py-2 text-sm ${selectedType === 'story' ? 'bg-dark-700 text-primary-400' : 'text-dark-300'}`}
            >
              Stories
            </button>
          </div>

          <div className="p-2">
            {getDocuments().length === 0 ? (
              <div className="text-center py-4 text-dark-400 text-sm">
                No {selectedType}s found
              </div>
            ) : (
              getDocuments().map((doc: any) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelect(doc.id, selectedType);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-dark-700/90 rounded-md transition-colors flex items-center text-white"
                >
                  {getIcon(selectedType)}
                  <span className="truncate">{getDocumentName(doc)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSelector;
