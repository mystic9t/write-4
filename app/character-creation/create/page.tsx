"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Wand2, Save, Globe } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ConfirmModal } from "@/components/ui/Modal";
import { Header } from "@/components/ui/Header";

export default function CreateCharacterPage() {
  const { showInputModal, showConfirmModal } = useModal();
  const { worlds, createCharacter } = useDatabase();
  const { settings } = useSettings();
  const router = useRouter();

  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [showWorldPrompt, setShowWorldPrompt] = useState(false);

  const [characterName, setCharacterName] = useState("");
  const [profile, setProfile] = useState("");
  const [backstory, setBackstory] = useState("");
  const [relationships, setRelationships] = useState("");
  const [characterArc, setCharacterArc] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Custom success modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Check if worlds exist on component mount - only runs once when worlds data is loaded
  useEffect(() => {
    // Show world prompt if no worlds exist
    if (worlds.length === 0) {
      setShowWorldPrompt(true);
    } else if (worlds.length === 1) {
      // Auto-select the only world
      setSelectedWorldId(worlds[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // AI assistance for each section
  const generateWithAI = async (section: string, prompt: string) => {
    if (!selectedWorldId) {
      showConfirmModal({
        title: "World Required",
        message: "Please select a world first",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get the selected world data to provide context
      const selectedWorld = worlds.find(world => world.id === selectedWorldId);

      if (!selectedWorld) {
        throw new Error("Selected world not found");
      }

      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `World Context: ${selectedWorld.name} is a world with ${selectedWorld.geography.substring(0, 100)}...
                 Character Prompt: ${prompt}`,
          instruction: `Generate detailed ${section} for a character that fits in this world`,
          provider: settings.aiProvider,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      // Update the appropriate section
      switch (section) {
        case "profile":
          setProfile(data.processedText);
          break;
        case "backstory":
          setBackstory(data.processedText);
          break;
        case "relationships":
          setRelationships(data.processedText);
          break;
        case "character arc":
          setCharacterArc(data.processedText);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error generating content:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to generate content. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate entire character
  const autoGenerateCharacter = async (prompt: string) => {
    if (!selectedWorldId) {
      showConfirmModal({
        title: "World Required",
        message: "Please select a world first",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get the selected world data to provide context
      const selectedWorld = worlds.find(world => world.id === selectedWorldId);

      if (!selectedWorld) {
        throw new Error("Selected world not found");
      }

      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `World Context: ${selectedWorld.name} is a world with ${selectedWorld.geography.substring(0, 100)}...
                 Character Prompt: ${prompt}`,
          instruction: "Generate a complete character with profile, backstory, relationships, and character arc that fits in this world",
          provider: settings.aiProvider,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate character");
      }

      const data = await response.json();

      // Parse the generated character data
      // This is a simplified example - in a real implementation,
      // you would parse the AI response into separate sections
      const characterData = data.processedText;
      const sections = characterData.split("---");

      if (sections.length >= 4) {
        setProfile(sections[0].trim());
        setBackstory(sections[1].trim());
        setRelationships(sections[2].trim());
        setCharacterArc(sections[3].trim());
      } else {
        // Fallback if the AI doesn't format correctly
        setProfile(characterData);
      }
    } catch (error) {
      console.error("Error generating character:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to generate character. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save the character
  const saveCharacter = async () => {
    if (!characterName) {
      showConfirmModal({
        title: "Missing Information",
        message: "Please enter a character name",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    if (!selectedWorldId) {
      showConfirmModal({
        title: "Missing Information",
        message: "Please select a world",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsSaving(true);
    try {
      // Save to IndexedDB using our database context
      await createCharacter({
        name: characterName,
        worldId: selectedWorldId,
        profile,
        backstory,
        relationships,
        characterArc
      });

      // Show success modal and redirect after closing
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error saving character:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to save character. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle world creation choice
  const handleWorldCreationChoice = (choice: 'auto' | 'manual') => {
    if (choice === 'auto') {
      showInputModal({
        title: "Describe the world you want to create",
        placeholder: "A medieval fantasy world with magic and diverse cultures...",
        onSubmit: (value) => {
          if (value.trim()) {
            // In a real implementation, this would call your World Building Agent
            // For now, we'll just redirect to the world creation page
            window.location.href = `/world-building/create?prompt=${encodeURIComponent(value)}`;
          }
        }
      });
    } else {
      // Redirect to manual world creation
      window.location.href = "/world-building/create";
    }
  };

  // If no worlds exist, show the world creation prompt
  if (showWorldPrompt) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-dark-900 rounded-xl shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-12 w-12 text-primary-400 mr-4" />
            <h2 className="text-2xl font-bold text-white">Create a World First</h2>
          </div>

          <p className="text-dark-300 mb-8 text-center">
            Characters need a world to exist in. Please create a world first.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => handleWorldCreationChoice('auto')}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 flex items-center justify-center"
            >
              <Wand2 className="mr-2" size={18} />
              Auto-Generate World
            </button>

            <button
              onClick={() => handleWorldCreationChoice('manual')}
              className="w-full py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center justify-center"
            >
              <Globe className="mr-2" size={18} />
              Create World Manually
            </button>

            <div className="pt-4 text-center">
              <Link href="/character-creation" className="text-primary-400 hover:text-primary-300 transition-colors">
                Cancel and go back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Header
        backLink={{
          href: "/character-creation",
          label: "Back to Characters"
        }}
      />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Users className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Create New Character
            </h1>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="characterName" className="block text-dark-300 mb-2">Character Name</label>
                <input
                  type="text"
                  id="characterName"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter character name..."
                />
              </div>

              <div>
                <label htmlFor="worldSelect" className="block text-dark-300 mb-2">World</label>
                <div className="flex gap-2">
                  <select
                    id="worldSelect"
                    value={selectedWorldId || ""}
                    onChange={(e) => setSelectedWorldId(e.target.value)}
                    className="bg-dark-900 border border-dark-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark-select"
                  >
                    <option value="">Select a world...</option>
                    {worlds.map(world => (
                      <option key={world.id} value={world.id}>{world.name}</option>
                    ))}
                  </select>

                  <Link
                    href="/world-building/create"
                    className="px-3 py-2 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 flex items-center"
                  >
                    <Globe size={18} className="mr-1" />
                    New
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                showInputModal({
                  title: "Describe the character you want to create",
                  placeholder: "A mysterious rogue with a troubled past...",
                  onSubmit: (value) => {
                    if (value.trim()) autoGenerateCharacter(value);
                  }
                });
              }}
                disabled={isGenerating || !selectedWorldId}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 size={18} className="mr-2" />
                {isGenerating ? "Generating..." : "Auto-Generate Character"}
              </button>
            </div>

            <div className="mb-6">
              <div className="flex border-b border-dark-800">
                <button
                  className={`px-4 py-2 ${activeTab === "profile" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Character Profile
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "backstory" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("backstory")}
                >
                  Backstory
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "relationships" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("relationships")}
                >
                  Relationships
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "arc" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("arc")}
                >
                  Character Arc
                </button>
              </div>

              <div className="mt-4">
                {activeTab === "profile" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Character Profile</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the character's appearance and personality",
                            placeholder: "Physical traits, personality, strengths, flaws...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("profile", value);
                            }
                          });
                        }}
                        disabled={isGenerating || !selectedWorldId}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the character's physical appearance, personality traits, strengths, flaws, etc..."
                    />
                  </div>
                )}

                {activeTab === "backstory" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Backstory</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the character's backstory",
                            placeholder: "Origin, formative experiences, key life events...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("backstory", value);
                            }
                          });
                        }}
                        disabled={isGenerating || !selectedWorldId}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={backstory}
                      onChange={(e) => setBackstory(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the character's history, formative experiences, and how they came to be who they are..."
                    />
                  </div>
                )}

                {activeTab === "relationships" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Relationships</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the character's relationships",
                            placeholder: "Family, friends, allies, enemies, mentors...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("relationships", value);
                            }
                          });
                        }}
                        disabled={isGenerating || !selectedWorldId}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={relationships}
                      onChange={(e) => setRelationships(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the character's relationships with other characters, allies, enemies, family, etc..."
                    />
                  </div>
                )}

                {activeTab === "arc" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Character Arc</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the character's development arc",
                            placeholder: "How the character changes throughout the story...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("character arc", value);
                            }
                          });
                        }}
                        disabled={isGenerating || !selectedWorldId}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={characterArc}
                      onChange={(e) => setCharacterArc(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe how the character changes and develops throughout the story..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveCharacter}
                disabled={isSaving || !characterName || !selectedWorldId}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" />
                {isSaving ? "Saving..." : "Save Character"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <ConfirmModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          router.push("/character-creation");
        }}
        onConfirm={() => {
          setSuccessModalOpen(false);
          router.push("/character-creation");
        }}
        title="Success"
        message="Character saved successfully!"
        confirmLabel="Continue"
        cancelLabel=""
      />
    </div>
  );
}
