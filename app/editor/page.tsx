"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import MetricsSidebar from "@/components/Editor/MetricsSidebar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatabase } from "@/contexts/DatabaseContext";
import { ArrowLeft, Save } from "lucide-react";

// Dynamically import the TextEditor to avoid SSR issues with TipTap
const TextEditor = dynamic(
  () => import("@/components/Editor/TextEditor"),
  { ssr: false }
);

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { worlds, characters, stories, createWorld, createCharacter, createStory, updateWorld, updateCharacter, updateStory } = useDatabase();

  // Get parameters from URL
  const type = searchParams.get('type') || 'generic';
  const id = searchParams.get('id') || '';
  const referrer = searchParams.get('referrer') || '/';

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documentType, setDocumentType] = useState<'world' | 'character' | 'story' | 'generic'>(type as any || 'generic');
  const [documentId, setDocumentId] = useState<string>(id);
  const [documentRelations, setDocumentRelations] = useState<{
    worldId?: string;
    worldName?: string;
    characterIds?: string[];
    characterNames?: string[];
  }>({});

  // Update metrics when content changes
  useEffect(() => {
    // Count words
    const words = content.replace(/<[^>]*>/g, "") // Remove HTML tags
      .split(/\s+/)
      .filter(word => word.length > 0);
    setWordCount(words.length);

    // Count characters
    const chars = content.replace(/<[^>]*>/g, "").length;
    setCharCount(chars);

    // Calculate reading time (average reading speed: 200 words per minute)
    setReadingTime(Math.max(1, Math.ceil(words.length / 200)));
  }, [content]);

  const handleSave = (newContent: string) => {
    setContent(newContent);
    // Save to localStorage for persistence
    localStorage.setItem('editorContent', newContent);

    // Show saving indicator
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Save document to database based on type
  const saveDocument = useCallback(async () => {
    setIsSaving(true);

    try {
      // For generic documents, just save to localStorage
      if (documentType === 'generic') {
        localStorage.setItem('editorContent', content);
        localStorage.setItem('editorTitle', title);
        setTimeout(() => setIsSaving(false), 1000);
        return;
      }

      // Parse content to extract sections
      const sections = parseContentSections(content);

      // Save based on document type
      let savedId = '';

      switch (documentType) {
        case 'world':
          const worldData = {
            name: title,
            geography: sections.Geography || '',
            cultures: sections.Cultures || '',
            magicSystems: sections['Magic Systems'] || '',
            history: sections.History || ''
          };

          if (documentId) {
            // Update existing world
            savedId = await updateWorld({ ...worldData, id: documentId });
          } else {
            // Create new world
            savedId = await createWorld(worldData);
            setDocumentId(savedId);
          }
          break;

        case 'character':
          const characterData = {
            name: title,
            worldId: documentRelations?.worldId || '',
            profile: sections.Profile || '',
            backstory: sections.Backstory || '',
            relationships: sections.Relationships || '',
            characterArc: sections['Character Arc'] || ''
          };

          if (documentId) {
            // Update existing character
            savedId = await updateCharacter({ ...characterData, id: documentId });
          } else {
            // Create new character
            savedId = await createCharacter(characterData);
            setDocumentId(savedId);
          }
          break;

        case 'story':
          const storyData = {
            title: title,
            worldId: documentRelations?.worldId || '',
            plotStructure: sections['Plot Structure'] || '',
            scenes: sections.Scenes || '',
            dialogue: sections.Dialogue || '',
            themes: sections.Themes || ''
          };

          const characterIds = documentRelations?.characterIds || [];

          if (documentId) {
            // Update existing story
            savedId = await updateStory({ ...storyData, id: documentId }, characterIds);
          } else {
            // Create new story
            savedId = await createStory(storyData, characterIds);
            setDocumentId(savedId);
          }
          break;
      }

      // Update URL with the document ID if it was created
      if (savedId && !documentId) {
        router.replace(`/editor?type=${documentType}&id=${savedId}`);
      }

    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  }, [content, title, documentType, documentId, documentRelations, createWorld, updateWorld, createCharacter, updateCharacter, createStory, updateStory, router]);

  // Helper function to parse content into sections
  const parseContentSections = (htmlContent: string): Record<string, string> => {
    const sections: Record<string, string> = {};

    // Simple regex-based parsing - in a real app, you might want to use a proper HTML parser
    const h2Regex = /<h2>(.*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g;
    let match;

    while ((match = h2Regex.exec(htmlContent)) !== null) {
      const sectionTitle = match[1].trim();
      const sectionContent = match[2].trim();
      sections[sectionTitle] = sectionContent;
    }

    return sections;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Save to localStorage for persistence
    localStorage.setItem('editorTitle', newTitle);
  };

  // Load document data based on type and id
  useEffect(() => {
    const loadDocumentData = async () => {
      if (!id) {
        // No ID provided, load from localStorage
        if (typeof window !== 'undefined') {
          const savedContent = localStorage.getItem('editorContent');
          const savedTitle = localStorage.getItem('editorTitle');

          if (savedContent) setContent(savedContent);
          if (savedTitle) setTitle(savedTitle);
        }
        return;
      }

      // Load based on document type
      try {
        switch (documentType) {
          case 'world':
            const world = worlds.find(w => w.id === id);
            if (world) {
              setTitle(world.name);
              // Combine world data into a single document
              const worldContent = `<h1>${world.name}</h1>
<h2>Geography</h2>
${world.geography}

<h2>Cultures</h2>
${world.cultures}

<h2>Magic Systems</h2>
${world.magicSystems}

<h2>History</h2>
${world.history}`;
              setContent(worldContent);
            }
            break;

          case 'character':
            const character = characters.find(c => c.id === id);
            if (character) {
              setTitle(character.name);
              // Combine character data into a single document
              const characterContent = `<h1>${character.name}</h1>
<h2>Profile</h2>
${character.profile}

<h2>Backstory</h2>
${character.backstory}

<h2>Relationships</h2>
${character.relationships}

<h2>Character Arc</h2>
${character.characterArc}`;
              setContent(characterContent);

              // Set relations
              if (character.worldId) {
                const relatedWorld = worlds.find(w => w.id === character.worldId);
                setDocumentRelations({
                  worldId: character.worldId,
                  worldName: relatedWorld?.name
                });
              }
            }
            break;

          case 'story':
            const story = stories.find(s => s.id === id);
            if (story) {
              setTitle(story.title);
              // Combine story data into a single document
              const storyContent = `<h1>${story.title}</h1>
<h2>Plot Structure</h2>
${story.plotStructure}

<h2>Scenes</h2>
${story.scenes}

<h2>Dialogue</h2>
${story.dialogue}

<h2>Themes</h2>
${story.themes}`;
              setContent(storyContent);

              // Set relations
              const relations: any = {};
              if (story.worldId) {
                const relatedWorld = worlds.find(w => w.id === story.worldId);
                relations.worldId = story.worldId;
                relations.worldName = relatedWorld?.name;
              }

              // Get character relationships
              const storyCharacters = await getStoryCharacters(story.id);
              if (storyCharacters && storyCharacters.length > 0) {
                const characterIds = storyCharacters;
                const characterNames = characterIds.map(charId => {
                  const char = characters.find(c => c.id === charId);
                  return char ? char.name : charId;
                });
                relations.characterIds = characterIds;
                relations.characterNames = characterNames;
              }

              setDocumentRelations(relations);
            }
            break;
        }
      } catch (error) {
        console.error('Error loading document data:', error);
      }
    };

    loadDocumentData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, documentType, worlds, characters, stories]); // Reload when these dependencies change

  // Helper function to get characters for a story
  const getStoryCharacters = async (storyId: string): Promise<string[]> => {
    try {
      // This would normally call your database service
      // For now, we'll just return an empty array
      return [];
    } catch (error) {
      console.error('Error getting story characters:', error);
      return [];
    }
  };

  const handleAnalyzeContent = () => {
    setIsAnalyzing(true);

    // AI analysis would go here
    // For now just simulate a delay
    setTimeout(() => {
      alert("Content analysis: This text appears to be well-structured and engaging.");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <header className="bg-dark-900 border-b border-dark-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <Link href={referrer || '/'} className="mr-4 flex items-center group">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-1.5 rounded-md mr-2 group-hover:from-primary-500 group-hover:to-purple-500 transition-all duration-300">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-primary-400 group-hover:text-primary-300 transition-colors">Back</span>
            </Link>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-medium focus:outline-none border-b border-transparent focus:border-primary-500 pb-1 w-full bg-transparent text-white"
              placeholder="Document Title"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={saveDocument}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-all duration-300 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <div>
              {isSaving ? (
                <span className="text-sm text-dark-400 animate-pulse">Saving...</span>
              ) : (
                <span className="text-sm text-dark-400">Saved</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <TextEditor
              initialContent={content}
              onSave={handleSave}
              documentType={documentType}
              documentId={documentId}
              documentRelations={documentRelations}
              referrer={referrer}
            />
          </div>

          <div className="w-full md:w-80 sticky top-24 self-start">
            <MetricsSidebar
              wordCount={wordCount}
              charCount={charCount}
              readingTime={readingTime}
              onAnalyzeContent={handleAnalyzeContent}
              isAnalyzing={isAnalyzing}
              documentType={documentType}
              setDocumentType={setDocumentType}
              documentId={documentId}
              documentRelations={documentRelations}
              onSave={saveDocument}
              isSaving={isSaving}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
