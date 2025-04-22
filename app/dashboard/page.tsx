"use client";

import React from "react";
import Link from "next/link";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Globe, Users, BookOpen, Plus, Loader2, Settings } from "lucide-react";

export default function DashboardPage() {
  const { worlds, characters, stories, isLoading, error } = useDatabase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
          <p className="text-dark-300">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-dark-900 rounded-xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-dark-300 mb-6">{error}</p>
          <p className="text-dark-400 text-sm">
            Your browser may not support IndexedDB, or there might be an issue with your storage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <header className="bg-dark-900 border-b border-dark-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4 flex items-center group">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-1.5 rounded-md mr-2 group-hover:from-primary-500 group-hover:to-purple-500 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-bold text-primary-400 group-hover:text-primary-300 transition-colors">Word-Forge</span>
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <Link href="/settings" className="flex items-center text-dark-300 hover:text-white transition-colors">
            <Settings size={16} className="mr-1" />
            <span>Settings</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Your Content</h2>
          <Link
            href="/editor"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Open Editor
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Worlds Summary Card */}
          <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-800 rounded-xl p-6 shadow-xl hover:shadow-primary-900/10 transition-all duration-300 hover:border-dark-700">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-primary-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Worlds</h3>
            </div>
            <p className="text-4xl font-bold mb-4">{worlds.length}</p>
            <div className="flex justify-between items-center">
              <Link href="/world-building/create" className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center">
                <Plus size={14} className="mr-1" />
                Create New
              </Link>
              <Link href="/world-building/list" className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                View All
              </Link>
            </div>
          </div>

          {/* Characters Summary Card */}
          <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-800 rounded-xl p-6 shadow-xl hover:shadow-primary-900/10 transition-all duration-300 hover:border-dark-700">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-primary-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Characters</h3>
            </div>
            <p className="text-4xl font-bold mb-4">{characters.length}</p>
            <div className="flex justify-between items-center">
              <Link href="/character-creation/create" className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center">
                <Plus size={14} className="mr-1" />
                Create New
              </Link>
              <Link href="/character-creation/list" className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                View All
              </Link>
            </div>
          </div>

          {/* Stories Summary Card */}
          <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-800 rounded-xl p-6 shadow-xl hover:shadow-primary-900/10 transition-all duration-300 hover:border-dark-700">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-primary-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Stories</h3>
            </div>
            <p className="text-4xl font-bold mb-4">{stories.length}</p>
            <div className="flex justify-between items-center">
              <Link href="/story-crafting/create" className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center">
                <Plus size={14} className="mr-1" />
                Create New
              </Link>
              <Link href="/story-crafting/list" className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-900/80 backdrop-blur-sm border border-dark-800 rounded-xl p-6 shadow-xl mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/world-building/create" className="flex items-center p-3 bg-dark-800/90 rounded-lg hover:bg-dark-700/90 transition-all duration-300">
              <Globe className="h-5 w-5 text-primary-400 mr-3" />
              <span>Create New World</span>
            </Link>
            <Link href="/character-creation/create" className="flex items-center p-3 bg-dark-800/90 rounded-lg hover:bg-dark-700/90 transition-all duration-300">
              <Users className="h-5 w-5 text-primary-400 mr-3" />
              <span>Create New Character</span>
            </Link>
            <Link href="/story-crafting/create" className="flex items-center p-3 bg-dark-800/90 rounded-lg hover:bg-dark-700/90 transition-all duration-300">
              <BookOpen className="h-5 w-5 text-primary-400 mr-3" />
              <span>Create New Story</span>
            </Link>
            <Link href="/editor" className="flex items-center p-3 bg-dark-800/90 rounded-lg hover:bg-dark-700/90 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Open Editor</span>
            </Link>
            <Link href="/settings" className="flex items-center p-3 bg-dark-800/90 rounded-lg hover:bg-dark-700/90 transition-all duration-300">
              <Settings className="h-5 w-5 text-primary-400 mr-3" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
