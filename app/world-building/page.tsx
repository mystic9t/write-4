"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowLeft } from "lucide-react";

export default function WorldBuildingPage() {
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
            <Globe className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              World Building
            </h1>
          </div>

          <p className="text-xl text-dark-200 mb-8 max-w-3xl">
            Create immersive worlds with detailed settings, cultures, magic systems, and geographies.
            Our AI-powered tools help you craft consistent and engaging worlds for your stories.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Geography & Maps</h3>
              <p className="text-dark-300 mb-4">
                Design realistic landscapes, climates, and natural features for your world. Generate maps and visualize your world's geography.
              </p>
              <Link
                href="/editor?template=world-geography"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Start mapping <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Cultures & Societies</h3>
              <p className="text-dark-300 mb-4">
                Develop rich cultures with unique customs, traditions, social structures, and histories that feel authentic and lived-in.
              </p>
              <Link
                href="/editor?template=world-cultures"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Create cultures <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">Magic & Technology</h3>
              <p className="text-dark-300 mb-4">
                Design consistent magic systems or advanced technologies with clear rules, limitations, and consequences.
              </p>
              <Link
                href="/editor?template=world-magic"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Design systems <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>

            <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-primary-300">History & Timeline</h3>
              <p className="text-dark-300 mb-4">
                Create detailed historical events, eras, and timelines that shape your world and influence your story.
              </p>
              <Link
                href="/editor?template=world-history"
                className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
              >
                Build history <ArrowLeft size={16} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>

          <div className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary-300">World Building Tips</h3>
            <ul className="list-disc list-inside space-y-3 text-dark-300">
              <li>Start with the elements most relevant to your story - you don't need to detail everything at once</li>
              <li>Consider how geography affects culture, and how history shapes current societies</li>
              <li>Create consistent rules for your world's magic or technology</li>
              <li>Think about how different cultures interact with each other</li>
              <li>Don't be afraid to draw inspiration from real-world history and cultures</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Link
              href="/world-building/create"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1"
            >
              Create New World
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
