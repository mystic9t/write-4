"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Wand2, Save } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ConfirmModal } from "@/components/ui/Modal";
import { Header } from "@/components/ui/Header";

export default function CreateWorldPage() {
  const { showInputModal, showConfirmModal } = useModal();
  const { createWorld } = useDatabase();
  const { settings } = useSettings();
  const router = useRouter();

  const [worldName, setWorldName] = useState("");
  const [geography, setGeography] = useState("");
  const [cultures, setCultures] = useState("");
  const [magicSystems, setMagicSystems] = useState("");
  const [history, setHistory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("geography");

  // Custom success modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // AI assistance for each section
  const generateWithAI = async (section: string, prompt: string) => {
    if (!prompt || prompt.trim() === "") {
      showConfirmModal({
        title: "Empty Prompt",
        message: "Please provide a description for the AI to work with.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
          instruction: `Generate detailed ${section} for a fictional world`,
          provider: settings.aiProvider,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const processedText = data?.processedText || "";

      // Update the appropriate section
      switch (section) {
        case "geography":
          setGeography(processedText);
          break;
        case "cultures":
          setCultures(processedText);
          break;
        case "magic systems":
          setMagicSystems(processedText);
          break;
        case "history":
          setHistory(processedText);
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

  // Auto-generate entire world
  const autoGenerateWorld = async (prompt: string) => {
    if (!prompt || prompt.trim() === "") {
      showConfirmModal({
        title: "Empty Prompt",
        message: "Please provide a description for the AI to work with.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Call the AI endpoint with settings
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
          instruction: "Generate a complete fictional world with geography, cultures, magic systems, and history",
          provider: settings.aiProvider,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate world");
      }

      const data = await response.json();

      // Parse the generated world data
      // This is a simplified example - in a real implementation,
      // you would parse the AI response into separate sections
      const worldData = data?.processedText || "";
      const sections = worldData.split("---");

      if (sections.length >= 4) {
        setGeography(sections[0].trim());
        setCultures(sections[1].trim());
        setMagicSystems(sections[2].trim());
        setHistory(sections[3].trim());
      } else {
        // Fallback if the AI doesn't format correctly
        setGeography(worldData);
      }
    } catch (error) {
      console.error("Error generating world:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to generate world. Please try again.",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save the world
  const saveWorld = async () => {
    if (!worldName) {
      showConfirmModal({
        title: "Missing Information",
        message: "Please enter a world name",
        onConfirm: () => {},
        confirmLabel: "OK",
        cancelLabel: ""
      });
      return;
    }

    setIsSaving(true);
    try {
      // Save to IndexedDB using our database context
      await createWorld({
        name: worldName,
        geography,
        cultures,
        magicSystems,
        history
      });

      // Show success modal and redirect after closing
      setSuccessModalOpen(true);

    } catch (error) {
      console.error("Error saving world:", error);
      showConfirmModal({
        title: "Error",
        message: "Failed to save world. Please try again.",
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
          href: "/world-building",
          label: "Back to Worlds"
        }}
      />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Globe className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Create New World
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label htmlFor="worldName" className="block text-dark-300 mb-2">World Name</label>
                <input
                  type="text"
                  id="worldName"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter world name..."
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    showInputModal({
                      title: "Describe the world you want to create",
                      placeholder: "A medieval fantasy world with magic and diverse cultures...",
                      onSubmit: (value) => {
                        if (value.trim()) autoGenerateWorld(value);
                      }
                    });
                  }}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 size={18} className="mr-2" />
                  {isGenerating ? "Generating..." : "Auto-Generate World"}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex border-b border-dark-800">
                <button
                  className={`px-4 py-2 ${activeTab === "geography" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("geography")}
                >
                  Geography & Maps
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "cultures" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("cultures")}
                >
                  Cultures & Societies
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "magic" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("magic")}
                >
                  Magic & Technology
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "history" ? "border-b-2 border-primary-500 text-primary-400" : "text-dark-300"}`}
                  onClick={() => setActiveTab("history")}
                >
                  History & Timeline
                </button>
              </div>

              <div className="mt-4">
                {activeTab === "geography" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Geography & Maps</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the geography of your world",
                            placeholder: "Mountains, rivers, forests, climate...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("geography", value);
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
                      value={geography}
                      onChange={(e) => setGeography(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the geography, climate, and natural features of your world..."
                    />
                  </div>
                )}

                {activeTab === "cultures" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Cultures & Societies</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the cultures and societies of your world",
                            placeholder: "Social structures, traditions, customs...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("cultures", value);
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
                      value={cultures}
                      onChange={(e) => setCultures(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the cultures, societies, customs, and social structures of your world..."
                    />
                  </div>
                )}

                {activeTab === "magic" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">Magic & Technology</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the magic systems or technology of your world",
                            placeholder: "Magic sources, limitations, technological advancements...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("magic systems", value);
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
                      value={magicSystems}
                      onChange={(e) => setMagicSystems(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the magic systems, technologies, and their rules and limitations in your world..."
                    />
                  </div>
                )}

                {activeTab === "history" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-primary-300">History & Timeline</h3>
                      <button
                        onClick={() => {
                          showInputModal({
                            title: "Describe the history and timeline of your world",
                            placeholder: "Major events, eras, conflicts, important figures...",
                            onSubmit: (value) => {
                              if (value.trim()) generateWithAI("history", value);
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
                      value={history}
                      onChange={(e) => setHistory(e.target.value)}
                      className="w-full h-64 bg-dark-900 border border-dark-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the history, major events, and timeline of your world..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveWorld}
                disabled={isSaving || !worldName}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 shadow-lg hover:shadow-primary-600/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" />
                {isSaving ? "Saving..." : "Save World"}
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
          router.push("/world-building");
        }}
        onConfirm={() => {
          setSuccessModalOpen(false);
          router.push("/world-building");
        }}
        title="Success"
        message="World saved successfully!"
        confirmLabel="Continue"
        cancelLabel=""
      />
    </div>
  );
}
