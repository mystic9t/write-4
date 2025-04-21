"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { InputModal, ConfirmModal } from "@/components/ui/Modal";

/**
 * Modal Context Module
 *
 * A reusable context for managing modals throughout the application.
 * This can be used in any project that needs modals for input or confirmation.
 */

/**
 * Input Modal Options Interface
 */
export interface InputModalOptions {
  title: string;
  placeholder?: string;
  initialValue?: string;
  onSubmit: (value: string) => void;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Confirm Modal Options Interface
 */
export interface ConfirmModalOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Modal Context Interface
 */
export interface ModalContextType {
  showInputModal: (options: InputModalOptions) => void;
  showConfirmModal: (options: ConfirmModalOptions) => void;
  closeModals: () => void;
}

// Create the context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Hook for using modals
 * This provides type-safe access to the modal context
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

// Provider component props
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Modal Provider Component
 * Manages modal state and provides methods to show/hide modals
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // Default values for modals
  const defaultInputOptions: InputModalOptions = {
    title: "",
    placeholder: "",
    initialValue: "",
    onSubmit: (value: string) => {},
    submitLabel: "OK",
    cancelLabel: "Cancel",
  };

  const defaultConfirmOptions: ConfirmModalOptions = {
    title: "",
    message: "",
    onConfirm: () => {},
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
  };

  // Input modal state
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [inputModalOptions, setInputModalOptions] = useState<InputModalOptions>(defaultInputOptions);

  // Confirm modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalOptions, setConfirmModalOptions] = useState<ConfirmModalOptions>(defaultConfirmOptions);

  /**
   * Show an input modal with the provided options
   */
  const showInputModal = (options: InputModalOptions) => {
    setInputModalOptions({
      ...defaultInputOptions,
      ...options,
    });
    setInputModalOpen(true);
  };

  /**
   * Show a confirmation modal with the provided options
   */
  const showConfirmModal = (options: ConfirmModalOptions) => {
    setConfirmModalOptions({
      ...defaultConfirmOptions,
      ...options,
    });
    setConfirmModalOpen(true);
  };

  /**
   * Close all modals
   */
  const closeModals = () => {
    setInputModalOpen(false);
    setConfirmModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        showInputModal,
        showConfirmModal,
        closeModals,
      }}
    >
      {children}

      {/* Input Modal */}
      <InputModal
        isOpen={inputModalOpen}
        onClose={() => setInputModalOpen(false)}
        title={inputModalOptions.title}
        placeholder={inputModalOptions.placeholder}
        initialValue={inputModalOptions.initialValue}
        onSubmit={inputModalOptions.onSubmit}
        submitLabel={inputModalOptions.submitLabel}
        cancelLabel={inputModalOptions.cancelLabel}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmModalOptions.title}
        message={confirmModalOptions.message}
        onConfirm={confirmModalOptions.onConfirm}
        confirmLabel={confirmModalOptions.confirmLabel}
        cancelLabel={confirmModalOptions.cancelLabel}
      />
    </ModalContext.Provider>
  );
};
