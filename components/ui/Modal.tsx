"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

/**
 * Modal Component Module
 *
 * A reusable set of modal components that can be used in any project.
 * Includes base Modal, InputModal, and ConfirmModal components.
 */

/**
 * Base Modal Props Interface
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  // Optional animation duration in ms
  animationDuration?: number;
}

/**
 * Base Modal Component
 * A flexible modal component that can be used as a foundation for other modal types
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md:max-w-md",
  animationDuration = 200
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle closing the modal
  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, animationDuration);
  }

  // Handle events and body overflow
  useEffect(() => {
    // Skip if modal is not open
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }

    // Add event listeners
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Set body overflow
    document.body.style.overflow = "hidden";

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only depend on isOpen to avoid infinite re-renders

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`w-full ${maxWidth} bg-dark-900 border border-dark-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ transitionDuration: `${animationDuration}ms` }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-dark-800">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-dark-800 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-dark-300" />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

/**
 * Input Modal Props Interface
 */
export interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  minHeight?: string;
}

/**
 * Input Modal Component
 * A modal with a text input field and submit/cancel buttons
 */
export const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder = "",
  initialValue = "",
  submitLabel = "OK",
  cancelLabel = "Cancel",
  maxWidth = "md:max-w-md",
  minHeight = "h-24"
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle modal open state and initialization
  useEffect(() => {
    if (isOpen) {
      // Reset the input value when modal opens
      setValue(initialValue);

      // Focus the input field when the modal opens
      // Use setTimeout to ensure the modal is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only depend on isOpen to prevent re-renders

  const handleSubmit = () => {
    onSubmit(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      <div className="space-y-4">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${minHeight} bg-dark-950 border border-dark-700 rounded-md p-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          aria-label={title}
        />
        <div className="flex justify-end space-x-3">
          {cancelLabel && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Confirm Modal Props Interface
 */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  // Optional danger mode for destructive actions
  isDanger?: boolean;
}

/**
 * Confirm Modal Component
 * A modal with a message and confirm/cancel buttons
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  maxWidth = "md:max-w-md",
  isDanger = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      <div className="space-y-4">
        <p className="text-dark-200">{message}</p>
        <div className="flex justify-end space-x-3">
          {cancelLabel && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md ${isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-primary-600 hover:bg-primary-500'} text-white transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
