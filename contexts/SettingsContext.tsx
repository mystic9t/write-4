"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

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
  // Use a ref to track initialization state
  const isInitialized = useRef(false);

  // Initialize state with default settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount (only once)
  useEffect(() => {
    // Skip on server-side or if already initialized
    if (typeof window === 'undefined' || isInitialized.current) return;

    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);

      if (savedSettings) {
        // Parse saved settings
        const parsedSettings = JSON.parse(savedSettings);

        // Merge defaults, saved settings, and initial settings
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          ...initialSettings
        };

        // Update state
        setSettings(mergedSettings);

        // Save the merged settings back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSettings));
      } else {
        // No saved settings, use defaults + initial settings
        const defaultValues = {
          ...defaultSettings,
          ...initialSettings
        };

        // Update state
        setSettings(defaultValues);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValues));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // On error, use defaults + initial settings
      const fallbackSettings = {
        ...defaultSettings,
        ...initialSettings
      };

      setSettings(fallbackSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackSettings));
    }

    // Mark as initialized
    isInitialized.current = true;
  }, []); // Empty dependency array - only run once on mount

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      // Create updated settings
      const updatedSettings = { ...prevSettings, ...newSettings };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      }

      return updatedSettings;
    });
  }, []); // No dependencies

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    // Create reset values
    const resetValues = {
      ...defaultSettings,
      ...initialSettings
    };

    // Update state
    setSettings(resetValues);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetValues));
    }
  }, [initialSettings]); // Only depend on initialSettings

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
