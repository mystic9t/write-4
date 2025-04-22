"use client";

import React from "react";
import { Palette } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange
}) => {
  const themes = [
    { id: "dark", color: "#0f172a", name: "Dark" },
    { id: "light", color: "#ffffff", name: "Light" },
    { id: "midnight", color: "#1a1c2e", name: "Midnight" },
    { id: "indigo", color: "#2a2d3e", name: "Indigo" }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-dark-700">
      <label className="block text-xs text-dark-300 mb-2">Theme</label>
      <div className="flex gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedTheme === theme.id 
                ? "border-2 border-primary-500 scale-110" 
                : "border border-dark-700 hover:scale-105"
            }`}
            style={{ backgroundColor: theme.color }}
            title={theme.name}
          >
            {selectedTheme === theme.id && theme.id === "dark" && (
              <Palette size={14} className="text-primary-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
