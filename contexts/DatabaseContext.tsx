"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  db,
  worldsDB,
  charactersDB,
  storiesDB,
  World,
  Character,
  Story
} from "@/lib/db";

/**
 * Database Context Module
 *
 * A reusable context for managing application data with IndexedDB persistence.
 * This can be customized for different projects by modifying the data interfaces
 * and database operations.
 */

/**
 * Database Context Interface
 * Defines all the operations available through the context
 */
export interface DatabaseContextType {
  // Worlds
  worlds: World[];
  getWorldById: (id: string) => Promise<World | undefined>;
  createWorld: (world: Omit<World, "id" | "createdAt">) => Promise<string>;
  updateWorld: (world: World) => Promise<string>;
  deleteWorld: (id: string) => Promise<void>;

  // Characters
  characters: Character[];
  getCharacterById: (id: string) => Promise<Character | undefined>;
  getCharactersByWorldId: (worldId: string) => Promise<Character[]>;
  createCharacter: (character: Omit<Character, "id" | "createdAt">) => Promise<string>;
  updateCharacter: (character: Character) => Promise<string>;
  deleteCharacter: (id: string) => Promise<void>;

  // Stories
  stories: Story[];
  getStoryById: (id: string) => Promise<Story | undefined>;
  getStoriesByWorldId: (worldId: string) => Promise<Story[]>;
  createStory: (story: Omit<Story, "id" | "createdAt">, characterIds?: string[]) => Promise<string>;
  updateStory: (story: Story, characterIds?: string[]) => Promise<string>;
  deleteStory: (id: string) => Promise<void>;
  getStoryCharacters: (storyId: string) => Promise<string[]>;

  // Status
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  refreshData: () => Promise<void>;
}

// Create the context
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

/**
 * Hook for using the database
 * This provides type-safe access to the database context
 */
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

// Provider component props
interface DatabaseProviderProps {
  children: ReactNode;
  // Optional prop to disable auto-migration from localStorage
  disableMigration?: boolean;
}

/**
 * Database Provider Component
 * Manages database state and operations
 */
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
  disableMigration = false
}) => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSupported = typeof window !== 'undefined';

  // Load data from Dexie database - defined with useCallback to avoid recreation
  const loadData = useCallback(async () => {
    if (!isSupported) {
      setError("Browser storage is not supported");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Load data from Dexie database
      const [worldsData, charactersData, storiesData] = await Promise.all([
        worldsDB.getAll(),
        charactersDB.getAll(),
        storiesDB.getAll()
      ]);

      setWorlds(worldsData);
      setCharacters(charactersData);
      setStories(storiesData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Using empty database.");

      // Set empty arrays to allow the app to function without database
      setWorlds([]);
      setCharacters([]);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableMigration]); // Only depend on disableMigration

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // World operations
  const getWorldById = async (id: string) => {
    try {
      return await worldsDB.getById(id);
    } catch (err) {
      console.error("Error getting world:", err);
      setError("Failed to get world");
      return undefined;
    }
  };

  const createWorld = async (worldData: Omit<World, "id" | "createdAt">) => {
    try {
      // Use the create method from our Dexie implementation
      const id = await worldsDB.create(worldData);
      await loadData(); // Refresh data
      return id;
    } catch (err) {
      console.error("Error creating world:", err);
      setError("Failed to create world");
      throw err;
    }
  };

  const updateWorld = async (world: World) => {
    try {
      await worldsDB.update(world);
      await loadData(); // Refresh data
      return world.id;
    } catch (err) {
      console.error("Error updating world:", err);
      setError("Failed to update world");
      throw err;
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      await worldsDB.delete(id);
      await loadData(); // Refresh data
    } catch (err) {
      console.error("Error deleting world:", err);
      setError("Failed to delete world");
      throw err;
    }
  };

  // Character operations
  const getCharacterById = async (id: string) => {
    try {
      return await charactersDB.getById(id);
    } catch (err) {
      console.error("Error getting character:", err);
      setError("Failed to get character");
      return undefined;
    }
  };

  const getCharactersByWorldId = async (worldId: string) => {
    try {
      return await charactersDB.getByWorldId(worldId);
    } catch (err) {
      console.error("Error getting characters by world:", err);
      setError("Failed to get characters");
      return [];
    }
  };

  const createCharacter = async (characterData: Omit<Character, "id" | "createdAt">) => {
    try {
      // Use the create method from our Dexie implementation
      const id = await charactersDB.create(characterData);
      await loadData(); // Refresh data
      return id;
    } catch (err) {
      console.error("Error creating character:", err);
      setError("Failed to create character");
      throw err;
    }
  };

  const updateCharacter = async (character: Character) => {
    try {
      await charactersDB.update(character);
      await loadData(); // Refresh data
      return character.id;
    } catch (err) {
      console.error("Error updating character:", err);
      setError("Failed to update character");
      throw err;
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      await charactersDB.delete(id);
      await loadData(); // Refresh data
    } catch (err) {
      console.error("Error deleting character:", err);
      setError("Failed to delete character");
      throw err;
    }
  };

  // Story operations
  const getStoryById = async (id: string) => {
    try {
      return await storiesDB.getById(id);
    } catch (err) {
      console.error("Error getting story:", err);
      setError("Failed to get story");
      return undefined;
    }
  };

  const getStoriesByWorldId = async (worldId: string) => {
    try {
      return await storiesDB.getByWorldId(worldId);
    } catch (err) {
      console.error("Error getting stories by world:", err);
      setError("Failed to get stories");
      return [];
    }
  };

  const createStory = async (storyData: Omit<Story, "id" | "createdAt">, characterIds: string[] = []) => {
    try {
      // Use the create method from our Dexie implementation
      const id = await storiesDB.create(storyData, characterIds);
      await loadData(); // Refresh data
      return id;
    } catch (err) {
      console.error("Error creating story:", err);
      setError("Failed to create story");
      throw err;
    }
  };

  const updateStory = async (story: Story, characterIds: string[] = []) => {
    try {
      await storiesDB.update(story, characterIds);
      await loadData(); // Refresh data
      return story.id;
    } catch (err) {
      console.error("Error updating story:", err);
      setError("Failed to update story");
      throw err;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await storiesDB.delete(id);
      await loadData(); // Refresh data
    } catch (err) {
      console.error("Error deleting story:", err);
      setError("Failed to delete story");
      throw err;
    }
  };

  const getStoryCharacters = async (storyId: string) => {
    try {
      return await storiesDB.getCharacters(storyId);
    } catch (err) {
      console.error("Error getting story characters:", err);
      setError("Failed to get story characters");
      return [];
    }
  };

  // Refresh data
  const refreshData = async () => {
    await loadData();
  };

  const value = {
    // Worlds
    worlds,
    getWorldById,
    createWorld,
    updateWorld,
    deleteWorld,

    // Characters
    characters,
    getCharacterById,
    getCharactersByWorldId,
    createCharacter,
    updateCharacter,
    deleteCharacter,

    // Stories
    stories,
    getStoryById,
    getStoriesByWorldId,
    createStory,
    updateStory,
    deleteStory,
    getStoryCharacters,

    // Status
    isLoading,
    error,
    isSupported,
    refreshData
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
