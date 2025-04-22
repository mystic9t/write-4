"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Wand2, Save, Globe, Users } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ConfirmModal } from "@/components/ui/Modal";
import { Header } from "@/components/ui/Header";

export default function CreateStoryPage() {
  const { showInputModal, showConfirmModal } = useModal();
  const { worlds, characters, createStory, getCharactersByWorldId } = useDatabase();
  const { settings } = useSettings();
  const router = useRouter();

  const [filteredCharacters, setFilteredCharacters] = useState<any[]>([]);

  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  const [storyTitle, setStoryTitle] = useState("");
  const [plotStructure, setPlotStructure] = useState("");
  const [scenes, setScenes] = useState("");
  const [dialogue, setDialogue] = useState("");
  const [themes, setThemes] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("plot");

  // Custom success modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Auto-select the world if there's only one
  useEffect(() => {
    if (worlds.length === 1) {
      // Auto-select the only world
      setSelectedWorldId(worlds[0].id);
    }
  }, [worlds]); // worlds comes from context and doesn't need setters in deps

  // Filter characters when world is selected
  useEffect(() => {
    // Skip if no world is selected
    if (!selectedWorldId) {
      setFilteredCharacters([]);
      setSelectedCharacterIds([]);
      return;
    }

    // Load characters for the selected world
    let isMounted = true;
    const loadCharacters = async () => {
      try {
        const worldCharacters = await getCharactersByWorldId(selectedWorldId);
        // Only update state if component is still mounted
        if (isMounted) {
          setFilteredCharacters(worldCharacters);
          setSelectedCharacterIds([]);
        }
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    };

    loadCharacters();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorldId]); // Only depend on selectedWorldId

  // Toggle character selection
  const toggleCharacterSelection = (characterId: string) => {
    if (selectedCharacterIds.includes(characterId)) {
      setSelectedCharacterIds(selectedCharacterIds.filter(id => id !== characterId));
    } else {
      setSelectedCharacterIds([...selectedCharacterIds, characterId]);
    }
  };

  // AI assistance for each section
  const generateWithAI = async (section: string, prompt: string) => {
    setIsGenerating(true);
    try {
      // Prepare context based on whether a world is selected
      let context = "";
      let instruction = "";

      if (selectedWorldId) {
        // Get the selected world data to provide context
        const selectedWorld = worlds.find(world => world.id === selectedWorldId);
        const selectedChars = characters.filter(char => selectedCharacterIds.includes(char.id));

        if (selectedWorld) {
          context = `World: ${selectedWorld.name} - ${selectedWorld.geography.substring(0, 100)}...\n`;

          if (selectedChars.length > 0) {
            context += "Characters:\n";
            selectedChars.forEach(char => {
              context += `- ${char.name}: ${char.profile.substring(0, 50)}...\n`;
            });
          }

          instruction = `Generate detailed ${section} for a story set in this world${selectedChars.length > 0 ? ' with these characters' : ''}`;
        }
      } else {
        instruction = `Generate detailed ${section} for a story`;
      }

      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `${context}\nStory Prompt: ${prompt}`,
          instruction: instruction,
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
        case "plot structure":
          setPlotStructure(data.processedText);
          break;
        case "scenes":
          setScenes(data.processedText);
          break;
        case "dialogue":
          setDialogue(data.processedText);
          break;
        case "themes":
          setThemes(data.processedText);
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

  // Auto-generate entire story
  const autoGenerateStory = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Prepare context based on whether a world is selected
      let context = "";
      let instruction = "";

      if (selectedWorldId) {
        // Get the selected world data to provide context
        const selectedWorld = worlds.find(world => world.id === selectedWorldId);
        const selectedChars = characters.filter(char => selectedCharacterIds.includes(char.id));

        if (selectedWorld) {
          context = `World: ${selectedWorld.name} - ${selectedWorld.geography.substring(0, 100)}...\n`;

          if (selectedChars.length > 0) {
            context += "Characters:\n";
            selectedChars.forEach(char => {
              context += `- ${char.name}: ${char.profile.substring(0, 50)}...\n`;
            });
          }

          instruction = `Generate a complete story with plot structure, scenes, dialogue, and themes that fits in this world${selectedChars.length > 0 ? ' with these characters' : ''}`;
        }
      } else {
        instruction = "Generate a complete story with plot structure, scenes, dialogue, and themes";
      }

      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `${context}\nStory Prompt: ${prompt}`,
          instruction: instruction,
          provider: settings.aiProvider,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();

      // Parse the generated story data
      // This is a simplified example - in a real implementation,
      // you would parse the AI response into separate sections
      const storyData = data.processedText;
      const sections = storyData.split("---");

      if (sections.length >= 4) {
        setPlotStructure(sections[0].trim());
        setScenes(sections[1].trim());
        setDialogue(sections[2].trim());
        setThemes(sections[3].trim());
      } else {
        // Fallback if the AI doesn't format correctly
        setPlotStructure(storyData);
      }
    } catch (error) {
      console.error("Error generating story:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to generate story. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save the story
  const saveStory = async () => {
    if (!storyTitle) {
      showConfirmModal({
        title: "Missing Information",
        message: "Please enter a story title",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsSaving(true);
    try {
      // Save to IndexedDB using our database context
      await createStory({
        title: storyTitle,
        worldId: selectedWorldId,
        plotStructure,
        scenes,
        dialogue,
        themes
      }, selectedCharacterIds);

      // Show success modal and redirect after closing
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error saving story:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to save story. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Header
        backLink={{
          href: "/story-crafting",
          label: "Back to Stories"
        }}
      />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <BookOpen className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Create New Story
            </h1>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="storyTitle" className="block text-dark-300 mb-2">Story Title</label>
                <input
                  type="text"
                  id="storyTitle"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter story title..."
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

            {selectedWorldId && (
              <div className="mb-6">
                <label className="block text-dark-300 mb-2">Characters</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filteredCharacters.length > 0 ? (
                    filteredCharacters.map(character => (
                      <button
                        key={character.id}
                        onClick={() => toggleCharacterSelection(character.id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedCharacterIds.includes(character.id)
                            ? "bg-primary-600 text-white"
                            : "bg-dark-800 text-dark-300"
                        } transition-colors`}
                      >
                        {character.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-dark-400 text-sm italic">No characters found for this world.</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/character-creation/create`}
                    className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center"
                  >
                    <Users size={14} className="mr-1" />
                    Create new character
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                showInputModal({
                  title: "Describe the story you want to create",
                  placeholder: "An epic adventure about a hero's journey...",
                  onSubmit: (value) => {
                    if (value.trim()) autoGenerateStory(value);
                  }
                });
              }}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 size={18} className="mr-2" />
                {isGenerating ? "Generating..." : "Auto-Generate Story"}
              </button>
            </div>

            <div className="mb-6">
              <div className="flex border-b border-dark-800">
                <button
                  className={`px-4 py-2 ${activeTab === "plot" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("plot")}
                >
                  Plot Structure
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "scenes" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("scenes")}
                >
                  Scenes
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "dialogue" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("dialogue")}
                >
                  Dialogue
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "themes" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("themes")}
                >
                  Themes
                </button>
              </div>

              <div className="mt-4">
                {activeTab === "plot" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Plot Structure</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the plot structure",
                            placeholder: "Setup, conflict, resolution...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("plot structure", value);
                            }
                          });
                        }}
                        disabled={isGenerating}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={plotStructure}
                      onChange={(e) => setPlotStructure(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Outline the plot structure, including the setup, conflict, rising action, climax, and resolution..."
                    />
                  </div>
                )}

                {activeTab === "scenes" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Scenes</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the scenes you want to create",
                            placeholder: "Setting details, character actions, sensory elements...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("scenes", value);
                            }
                          });
                        }}
                        disabled={isGenerating}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={scenes}
                      onChange={(e) => setScenes(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe key scenes in your story, including setting details, character actions, and sensory elements..."
                    />
                  </div>
                )}

                {activeTab === "dialogue" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Dialogue</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the dialogue you want to create",
                            placeholder: "Character conversations, speech patterns...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("dialogue", value);
                            }
                          });
                        }}
                        disabled={isGenerating}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={dialogue}
                      onChange={(e) => setDialogue(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Write sample dialogue between characters, showing their distinct voices and advancing the plot..."
                    />
                  </div>
                )}

                {activeTab === "themes" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Themes</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the themes you want to explore",
                            placeholder: "Identity, power, love, sacrifice...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("themes", value);
                            }
                          });
                        }}
                        disabled={isGenerating}
                        className="flex items-center px-3 py-1 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Wand2 size={14} className="mr-1" />
                        {isGenerating ? "Generating..." : "AI Assist"}
                      </button>
                    </div>
                    <textarea
                      value={themes}
                      onChange={(e) => setThemes(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Explore the themes and deeper meanings in your story, such as identity, power, love, sacrifice, etc..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveStory}
                disabled={isSaving || !storyTitle}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" />
                {isSaving ? "Saving..." : "Save Story"}
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
          router.push("/story-crafting");
        }}
        onConfirm={() => {
          setSuccessModalOpen(false);
          router.push("/story-crafting");
        }}
        title="Success"
        message="Story saved successfully!"
        confirmLabel="Continue"
        cancelLabel=""
      />
    </div>
  );
}
