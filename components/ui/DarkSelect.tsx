"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface DarkSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

const DarkSelect: React.FC<DarkSelectProps> = ({
  options,
  value,
  onChange,
  className = "",
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Handle mounting for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position when dropdown is opened
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-xs text-dark-300 mb-2">{label}</label>
      )}
      <div
        className={`w-full p-2 border border-dark-700 rounded-md bg-dark-950 text-white focus:border-primary-500 cursor-pointer flex justify-between items-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <ChevronDown
          size={16}
          className={`text-dark-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>

      {isOpen && mounted && createPortal(
        <div
          className="fixed z-[9999] bg-dark-900/95 backdrop-blur-sm border border-dark-700 rounded-md shadow-xl max-h-60 overflow-auto dark-dropdown-menu"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`p-2 hover:bg-dark-800/90 cursor-pointer dark-dropdown-item ${
                option === value ? 'bg-primary-800 text-white' : 'text-white'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DarkSelect;
