"use client";

import React from "react";
import { Type } from "lucide-react";
import DarkSelect from "../ui/DarkSelect";
import ThemeSelector from "./ThemeSelector";

interface TypographySettingsProps {
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const TypographySettings: React.FC<TypographySettingsProps> = ({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  theme,
  setTheme
}) => {
  const fontOptions = [
    "Inter", "Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"
  ];

  const fontSizeOptions = [
    "12px", "14px", "16px", "18px", "20px", "24px"
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
        <Type className="mr-2 text-primary-400" size={16} />
        Typography
      </h3>

      <div className="mb-4 bg-dark-800 p-4 rounded-lg border border-dark-700">
        <DarkSelect
          label="Font Family"
          options={fontOptions}
          value={fontFamily}
          onChange={setFontFamily}
          className="mb-4"
        />

        <DarkSelect
          label="Font Size"
          options={fontSizeOptions}
          value={fontSize}
          onChange={setFontSize}
        />

        <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
      </div>
    </div>
  );
};

export default TypographySettings;
