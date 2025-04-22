"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useSettings, AIProvider } from "@/contexts/SettingsContext";
import { useModal } from "@/contexts/ModalContext";
import { Header } from "@/components/ui/Header";

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { showConfirmModal } = useModal();

  // Local state for form
  const [aiProvider, setAiProvider] = useState<AIProvider>(settings.aiProvider);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens);
  const [isSaving, setIsSaving] = useState(false);

  // API key states
  const [openaiKey, setOpenaiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_API_KEY || "");
  const [geminiKey, setGeminiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
  const [anthropicKey, setAnthropicKey] = useState(process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "");

  // Handle save
  const handleSave = () => {
    setIsSaving(true);

    // Update settings
    updateSettings({
      aiProvider,
      temperature,
      maxTokens
    });

    // Save API keys to localStorage (in a real app, you'd handle this more securely)
    if (openaiKey) localStorage.setItem("openai-api-key", openaiKey);
    if (geminiKey) localStorage.setItem("gemini-api-key", geminiKey);
    if (anthropicKey) localStorage.setItem("anthropic-api-key", anthropicKey);

    // Show success message
    showConfirmModal({
      title: "Settings Saved",
      message: "Your settings have been saved successfully.",
      onConfirm: () => {},
      confirmLabel: "OK",
      cancelLabel: ""
    });

    setIsSaving(false);
  };

  // Handle reset
  const handleReset = () => {
    showConfirmModal({
      title: "Reset Settings",
      message: "Are you sure you want to reset all settings to default values?",
      onConfirm: () => {
        resetSettings();
        setAiProvider("gemini");
        setTemperature(0.7);
        setMaxTokens(1500);
      },
      confirmLabel: "Reset",
      cancelLabel: "Cancel"
    });
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Header
        title="Settings"
        backLink={{
          href: "/dashboard",
          label: "Back to Dashboard"
        }}
        showSettings={false}
      />

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="animate-fade-in">
          <div className="flex items-center mb-8">
            <Settings className="h-10 w-10 mr-4 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
              Settings
            </h1>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">AI Provider Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-dark-300 mb-2">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                  className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark-select"
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="local">Local (Mock Responses)</option>
                </select>
                <p className="text-dark-400 text-sm mt-1">
                  Select which AI provider to use for generating content
                </p>
              </div>

              {aiProvider === "openai" && (
                <div>
                  <label className="block text-dark-300 mb-2">OpenAI API Key</label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="sk-..."
                  />
                  <p className="text-dark-400 text-sm mt-1">
                    Your OpenAI API key will be stored locally in your browser
                  </p>
                </div>
              )}

              {aiProvider === "gemini" && (
                <div>
                  <label className="block text-dark-300 mb-2">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="AIza..."
                  />
                  <p className="text-dark-400 text-sm mt-1">
                    Your Gemini API key will be stored locally in your browser
                  </p>
                </div>
              )}

              {aiProvider === "anthropic" && (
                <div>
                  <label className="block text-dark-300 mb-2">Anthropic API Key</label>
                  <input
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    className="w-full bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="sk-ant-..."
                  />
                  <p className="text-dark-400 text-sm mt-1">
                    Your Anthropic API key will be stored locally in your browser
                  </p>
                </div>
              )}

              <div>
                <label className="block text-dark-300 mb-2">Temperature: {temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-dark-400 text-sm">
                  <span>More Focused</span>
                  <span>More Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-dark-300 mb-2">Max Tokens: {maxTokens}</label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-dark-400 text-sm">
                  <span>Shorter</span>
                  <span>Longer</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-all duration-300"
            >
              <RotateCcw size={18} className="mr-2" />
              Reset to Defaults
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
