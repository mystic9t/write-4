"use client";

import React from "react";

interface SaveButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  label: string;
  loadingLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  label,
  loadingLabel = "Saving",
  icon,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-pulse">{loadingLabel}</span>
          <span className="animate-pulse animation-delay-100">.</span>
          <span className="animate-pulse animation-delay-200">.</span>
          <span className="animate-pulse animation-delay-300">.</span>
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default SaveButton;
