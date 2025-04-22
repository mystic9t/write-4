"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Search, ArrowLeft, Edit } from "lucide-react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Header } from "@/components/ui/Header";

export default function WorldsListPage() {
  const { worlds } = useDatabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorlds, setFilteredWorlds] = useState(worlds);

  // Filter worlds based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredWorlds(worlds);
    } else {
      const filtered = worlds.filter(world => 
        world.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorlds(filtered);
    }
  }, [searchTerm, worlds]);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Header
        title="Your Worlds"
        backLink={{
          href: "/world-building",
          label: "Back to World Building"
        }}
        showSettings={true}
      />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Globe className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Your Worlds
            </h1>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
              <input
                type="text"
                placeholder="Search worlds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredWorlds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-300 mb-4">No worlds found</p>
              <Link
                href="/world-building/create"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 inline-block"
              >
                Create Your First World
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorlds.map((world) => (
                <div key={world.id} className="border border-dark-800 rounded-xl bg-dark-900/50 backdrop-blur-sm shadow-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{world.name}</h3>
                    <p className="text-dark-300 mb-4 line-clamp-3">
                      {world.geography.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/editor?type=world&id=${world.id}`}
                        className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Expand World
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
