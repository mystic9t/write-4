import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
            Word-Forge
          </h1>
          <p className="text-2xl text-white mb-3">
            AI-Powered World Building & Story Creation
          </p>
          <p className="text-lg text-dark-300 mb-12 max-w-2xl">
            Create immersive worlds, compelling characters, and engaging stories with the help of AI.
            Get real-time suggestions, formatting options, and document analytics.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row animate-slide-up">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1"
          >
            Dashboard
          </Link>

          <Link
            href="/world-building/create"
            className="px-6 py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all duration-300 shadow-lg hover:shadow-dark-800/20 hover:-translate-y-1 border border-dark-700"
          >
            Create New World
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Link href="/world-building" className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-dark-800/50 cursor-pointer">
            <div className="flex items-center mb-4 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold">World Building</h3>
            </div>
            <p className="text-dark-300">
              Create immersive worlds with detailed settings, cultures, magic systems, and geographies.
            </p>
          </Link>

          <Link href="/character-creation" className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-dark-800/50 cursor-pointer">
            <div className="flex items-center mb-4 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold">Character Creation</h3>
            </div>
            <p className="text-dark-300">
              Develop compelling characters with AI assistance for backstories, motivations, and personalities.
            </p>
          </Link>

          <Link href="/story-crafting" className="p-6 border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-dark-800/50 cursor-pointer">
            <div className="flex items-center mb-4 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h3 className="text-xl font-semibold">Story Crafting</h3>
            </div>
            <p className="text-dark-300">
              Craft engaging narratives with AI-powered plot development, dialogue enhancement, and scene descriptions.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
