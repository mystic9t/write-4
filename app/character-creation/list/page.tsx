"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, ArrowLeft, Edit } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Header } from "@/components/ui/Header";

export default function CharactersListPage() {
  const { characters, worlds } = useDatabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState(characters);

  // Filter characters based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(character => 
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchTerm, characters]);

  // Get world name for a character
  const getWorldName = (worldId: string) => {
    if (!worldId) return "No World";
    const world = worlds.find(w => w.id === worldId);
    return world ? world.name : "Unknown World";
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Header
        title="Your Characters"
        backLink={{
          href: "/character-creation",
          label: "Back to Character Creation"
        }}
        showSettings={true}
      />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Users className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Your Characters
            </h1>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-300 mb-4">No characters found</p>
              <Link
                href="/character-creation/create"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 inline-block"
              >
                Create Your First Character
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCharacters.map((character) => (
                <div key={character.id} className="border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{character.name}</h3>
                    <p className="text-dark-300 mb-2 line-clamp-3">
                      {character.profile.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-dark-400 mb-4">
                      World: {getWorldName(character.worldId)}
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/editor?type=character&id=${character.id}`}
                        className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Expand Character
                      </Link>
                      <span className="text-xs text-dark-400">
                        {/* Add creation date if available */}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
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
