"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Globe, Users, BookOpen, Plus, Loader2, Settings } from "lucide-react";

export default function DashboardPage() {
  const { worlds, characters, stories, isLoading, error } = useDatabase();
  const [activeTab, setActiveTab] = useState<"worlds" | "characters" | "stories">("worlds");

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
        <div className="flex border-b border-dark-800 mb-8">
          <button
            className={`px-6 py-3 ${activeTab === "worlds" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
            onClick={() => setActiveTab("worlds")}
          >
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              <span>Worlds ({worlds.length})</span>
            </div>
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "characters" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
            onClick={() => setActiveTab("characters")}
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Characters ({characters.length})</span>
            </div>
          </button>
          <button
            className={`px-6 py-3 ${activeTab === "stories" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
            onClick={() => setActiveTab("stories")}
          >
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Stories ({stories.length})</span>
            </div>
          </button>
        </div>

        {activeTab === "worlds" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Worlds</h2>
              <Link
                href="/world-building/create"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
              >
                <Plus size={18} className="mr-2" />
                Create New World
              </Link>
            </div>

            {worlds.length === 0 ? (
              <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 text-center">
                <Globe className="h-16 w-16 text-dark-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-300 mb-2">No Worlds Yet</h3>
                <p className="text-dark-400 mb-6">Create your first world to get started.</p>
                <Link
                  href="/world-building/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
                >
                  <Plus size={18} className="mr-2" />
                  Create World
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {worlds.map((world) => (
                  <div key={world.id} className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden hover:border-dark-700 transition-all duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{world.name}</h3>
                      <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                        {world.geography.substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-dark-400 text-xs">
                          {new Date(world.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/world-building/${world.id}`}
                          className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "characters" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Characters</h2>
              <Link
                href="/character-creation/create"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
              >
                <Plus size={18} className="mr-2" />
                Create New Character
              </Link>
            </div>

            {characters.length === 0 ? (
              <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 text-center">
                <Users className="h-16 w-16 text-dark-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-300 mb-2">No Characters Yet</h3>
                <p className="text-dark-400 mb-6">Create your first character to get started.</p>
                <Link
                  href="/character-creation/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
                >
                  <Plus size={18} className="mr-2" />
                  Create Character
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => {
                  const characterWorld = worlds.find(w => w.id === character.worldId);
                  return (
                    <div key={character.id} className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden hover:border-dark-700 transition-all duration-300">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-1">{character.name}</h3>
                        <p className="text-primary-400 text-sm mb-3">
                          {characterWorld ? characterWorld.name : "Unknown World"}
                        </p>
                        <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                          {character.profile.substring(0, 150)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400 text-xs">
                            {new Date(character.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/character-creation/${character.id}`}
                            className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "stories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Stories</h2>
              <Link
                href="/story-crafting/create"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
              >
                <Plus size={18} className="mr-2" />
                Create New Story
              </Link>
            </div>

            {stories.length === 0 ? (
              <div className="bg-dark-900 border border-dark-800 rounded-lg p-8 text-center">
                <BookOpen className="h-16 w-16 text-dark-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-300 mb-2">No Stories Yet</h3>
                <p className="text-dark-400 mb-6">Create your first story to get started.</p>
                <Link
                  href="/story-crafting/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300"
                >
                  <Plus size={18} className="mr-2" />
                  Create Story
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => {
                  const storyWorld = worlds.find(w => w.id === story.worldId);
                  return (
                    <div key={story.id} className="bg-dark-900 border border-dark-800 rounded-lg overflow-hidden hover:border-dark-700 transition-all duration-300">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-1">{story.title}</h3>
                        <p className="text-primary-400 text-sm mb-3">
                          {storyWorld ? storyWorld.name : "Unknown World"}
                        </p>
                        <p className="text-dark-300 text-sm mb-4 line-clamp-3">
                          {story.plotStructure.substring(0, 150)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400 text-xs">
                            {new Date(story.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/story-crafting/${story.id}`}
                            className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
