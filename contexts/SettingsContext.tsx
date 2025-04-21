"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

/**
 * Settings Context Module
 *
 * A reusable context for managing application settings with localStorage persistence.
 * This can be customized for different projects by modifying the Settings interface
 * and defaultSettings object.
 */

// Define available AI providers
export type AIProvider = "gemini" | "openai" | "anthropic" | "local";

// Define settings interface - customize for different projects
export interface Settings {
  aiProvider: AIProvider;
  temperature: number;
  maxTokens: number;
  // Add any other settings your application needs
}

// Define context interface
export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default settings - customize for different projects
export const defaultSettings: Settings = {
  aiProvider: "gemini", // Default to Gemini
  temperature: 0.7,
  maxTokens: 1500,
};

// Storage key - customize for different projects
const STORAGE_KEY = "word-forge-settings";

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Hook for using settings
 * This provides type-safe access to the settings context
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Provider component props
interface SettingsProviderProps {
  children: ReactNode;
  // Optional prop to override the default settings
  initialSettings?: Partial<Settings>;
}

/**
 * Settings Provider Component
 * Manages settings state and persistence
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  initialSettings = {}
}) => {
  // Initialize state with default settings merged with any provided initialSettings
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    ...initialSettings
  });

  // Helper function to save settings to localStorage - no dependencies needed
  const saveSettings = useCallback((settingsToSave: Settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    // Define this function inside useEffect to avoid dependency issues
    const loadSettings = () => {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({
            ...defaultSettings, // Always include defaults for new settings
            ...parsedSettings,  // Override with saved settings
            ...initialSettings // Override with any initial settings passed as props
          });
        } catch (error) {
          console.error("Failed to parse settings:", error);
          // If parsing fails, reset to defaults
          saveSettings({
            ...defaultSettings,
            ...initialSettings
          });
        }
      } else {
        // If no settings exist, save defaults
        saveSettings({
          ...defaultSettings,
          ...initialSettings
        });
      }
    };

    loadSettings();
    // Only depend on initialSettings since saveSettings never changes
  }, [initialSettings, saveSettings]);

  // Update settings - using function form of setState to avoid dependency on settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, [saveSettings]); // Only depend on saveSettings

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    const resetValues = {
      ...defaultSettings,
      ...initialSettings
    };
    setSettings(resetValues);
    saveSettings(resetValues);
  }, [initialSettings, saveSettings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
