"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
  title?: string;
  backLink?: {
    href: string;
    label: string;
  };
  showSettings?: boolean;
}

/**
 * Consistent header component for use across the application
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  backLink,
  showSettings = true,
}) => {
  return (
    <header className="bg-dark-900 border-b border-dark-800 p-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center group">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-1.5 rounded-md mr-2 group-hover:from-primary-500 group-hover:to-purple-500 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="font-bold text-white group-hover:text-primary-300 transition-colors">
              Word-Forge
            </span>
          </Link>
          {title && <h1 className="text-xl font-semibold text-white ml-4">{title}</h1>}
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/editor"
            className="flex items-center text-dark-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editor</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center text-dark-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>
          {showSettings && (
            <Link
              href="/settings"
              className="flex items-center text-dark-300 hover:text-white transition-colors"
            >
              <Settings size={16} className="mr-1" />
              <span>Settings</span>
            </Link>
          )}
          {backLink && (
            <Link
              href={backLink.href}
              className="flex items-center text-dark-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>{backLink.label}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
