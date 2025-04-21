"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold, Italic, List, ListOrdered,
  Heading1, Heading2, Image as ImageIcon,
  Code, Quote, Undo, Redo, Type,
  Wand2, Sparkles, Zap, Lightbulb
} from "lucide-react";
import { computeLineDiff, TextDiff } from "@/lib/diffUtils";

interface TextEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = "",
  onSave
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedText, setSelectedText] = useState("");
  const [processingAI, setProcessingAI] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffResults, setDiffResults] = useState<TextDiff[][]>([]);
  const [aiSuggestion, setAiSuggestion] = useState("");

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Begin crafting your world, characters, and stories...",
      }),
      Image,
      Typography,
      Highlight,
      TextStyle,
      FontFamily,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      if (onSave) {
        onSave(html);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      if (!selection.empty) {
        const selectedContent = editor.state.doc.textBetween(
          selection.from,
          selection.to,
          " "
        );
        setSelectedText(selectedContent);
      } else {
        setSelectedText("");
      }
    },
  });

  const handleProcessWithAI = useCallback(async (instruction: string) => {
    if (!selectedText || processingAI) return;

    setProcessingAI(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedText,
          instruction,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process with AI");
      }

      const data = await response.json();
      setAiSuggestion(data.processedText);

      // Compute diff between original and AI suggestion
      const lineDiffs = computeLineDiff(selectedText, data.processedText);
      setDiffResults(lineDiffs);
      setShowDiff(true);
    } catch (error) {
      console.error("Error processing with AI:", error);
    } finally {
      setProcessingAI(false);
    }
  }, [selectedText, processingAI]);

  const applyAiSuggestion = useCallback(() => {
    if (!editor || !aiSuggestion) return;

    const { state, dispatch } = editor.view;
    const { from, to } = state.selection;

    // Replace selected text with AI suggestion
    const transaction = state.tr.replaceWith(
      from,
      to,
      state.schema.text(aiSuggestion)
    );

    dispatch(transaction);
    setShowDiff(false);
    setAiSuggestion("");
  }, [editor, aiSuggestion]);

  const cancelAiSuggestion = useCallback(() => {
    setShowDiff(false);
    setAiSuggestion("");
  }, []);

  const renderToolbar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-2 p-3 border-b border-dark-800 bg-dark-900 rounded-t-md">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("bold") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("italic") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <div className="h-6 w-px bg-dark-700 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("bulletList") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("orderedList") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="h-6 w-px bg-dark-700 mx-1"></div>

        {/* Code and Quote */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("codeBlock") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Code Block"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-dark-800 transition-colors ${
            editor.isActive("blockquote") ? "bg-dark-800 text-primary-400" : "text-white"
          }`}
          title="Quote"
        >
          <Quote size={18} />
        </button>

        <div className="h-6 w-px bg-dark-700 mx-1"></div>

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-dark-800 transition-colors text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-dark-800 transition-colors text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo size={18} />
        </button>

        <div className="h-6 w-px bg-dark-700 mx-1"></div>

        {/* AI options - Only show when text is selected */}
        {selectedText ? (
          <div className="flex gap-1">
            <button
              onClick={() => handleProcessWithAI("enhance this world description with more vivid details")}
              disabled={processingAI}
              className="p-2 rounded hover:bg-primary-700 bg-primary-800 text-white flex items-center gap-1 transition-colors"
              title="Enhance World"
            >
              <Wand2 size={18} /> {processingAI ? "Processing..." : "Enhance World"}
            </button>
            <button
              onClick={() => handleProcessWithAI("develop this character with more depth and personality")}
              disabled={processingAI}
              className="p-2 rounded hover:bg-primary-700 bg-primary-800 text-white flex items-center gap-1 transition-colors"
              title="Develop Character"
            >
              <Zap size={18} />
            </button>
            <button
              onClick={() => handleProcessWithAI("expand this plot point into a more engaging scene")}
              disabled={processingAI}
              className="p-2 rounded hover:bg-primary-700 bg-primary-800 text-white flex items-center gap-1 transition-colors"
              title="Expand Scene"
            >
              <Lightbulb size={18} />
            </button>
          </div>
        ) : (
          <div className="p-2 text-dark-400 text-sm italic">
            Select text for AI options
          </div>
        )}

        {/* Markdown toggle */}
        <button
          onClick={() => {
            // Toggle between Markdown view and rich text
            const html = editor.getHTML();
            editor.commands.setContent(html);
          }}
          className="p-2 rounded hover:bg-dark-800 transition-colors text-white ml-auto"
          title="Toggle Markdown"
        >
          <Type size={18} />
        </button>
      </div>
    );
  };

  const renderDiff = () => {
    if (!showDiff || !diffResults.length) return null;

    return (
      <div className="mt-4 border border-dark-800 rounded-lg p-4 bg-dark-900 shadow-lg animate-fade-in">
        <h3 className="font-medium mb-2 text-primary-400 flex items-center">
          <Sparkles className="mr-2" size={18} />
          Word-Forge AI Suggestion
        </h3>
        <div className="mb-4 bg-dark-800 p-3 rounded-md">
          {diffResults.map((line, lineIndex) => (
            <div key={lineIndex} className="py-1">
              {line.map((part, partIndex) => (
                <span
                  key={partIndex}
                  className={`${
                    part.added
                      ? "bg-green-900/30 text-green-400"
                      : part.removed
                      ? "bg-red-900/30 text-red-400 line-through"
                      : "text-white"
                  }`}
                >
                  {part.text}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyAiSuggestion}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors shadow-md hover:shadow-primary-600/20"
          >
            Apply Changes
          </button>
          <button
            onClick={cancelAiSuggestion}
            className="px-4 py-2 bg-dark-800 text-white rounded-md hover:bg-dark-700 transition-colors shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (!editor) {
    return (
      <div className="border border-dark-800 rounded-md bg-dark-900 p-8 flex items-center justify-center">
        <div className="animate-pulse flex items-center">
          <div className="h-4 w-4 bg-primary-600 rounded-full mr-2"></div>
          <div className="h-4 w-4 bg-primary-600 rounded-full mr-2 animation-delay-200"></div>
          <div className="h-4 w-4 bg-primary-600 rounded-full animation-delay-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-dark-800 rounded-md bg-dark-900 shadow-xl overflow-hidden">
      {renderToolbar()}
      <EditorContent
        editor={editor}
        className="p-5 min-h-[400px] prose prose-invert max-w-none focus:outline-none"
      />
      {renderDiff()}
    </div>
  );
};

export default TextEditor;
