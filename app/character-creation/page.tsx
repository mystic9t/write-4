"use client";

import React from "react";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

export default function CharacterCreationPage() {
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
          <Link href="/" className="flex items-center text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Users className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Character Creation
            </h1>
          </div>

          <p className="text-xl text-dark-200 mb-8 max-w-3xl">
            Develop compelling characters with AI assistance for backstories, motivations, and personalities.
            Create characters that feel real, with depth and complexity that drives your narrative forward.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Character Profiles</h3>
              <p className="text-dark-300 mb-4">
                Create detailed character profiles with physical descriptions, personality traits, strengths, flaws, and more.
              </p>
              <Link
                href="/editor?template=character-profile"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Create profile <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Backstories</h3>
              <p className="text-dark-300 mb-4">
                Develop rich backstories that explain your character's motivations, fears, and goals in a compelling way.
              </p>
              <Link
                href="/editor?template=character-backstory"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Write backstory <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Relationships</h3>
              <p className="text-dark-300 mb-4">
                Map out character relationships, conflicts, and dynamics that create tension and drive your story forward.
              </p>
              <Link
                href="/editor?template=character-relationships"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Map relationships <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Character Arcs</h3>
              <p className="text-dark-300 mb-4">
                Plan meaningful character development and transformation throughout your story.
              </p>
              <Link
                href="/editor?template=character-arc"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Design arc <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>

          <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary-300">Character Creation Tips</h3>
            <ul className="list-disc list-inside space-y-3 text-dark-300">
              <li>Give your characters flaws and weaknesses that make them relatable</li>
              <li>Ensure your character's motivations drive their actions throughout the story</li>
              <li>Create characters with distinct voices, mannerisms, and perspectives</li>
              <li>Consider how your character's background shapes their worldview</li>
              <li>Allow room for characters to grow and change throughout your narrative</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Link
              href="/character-creation/create"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1"
            >
              Create New Character
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
