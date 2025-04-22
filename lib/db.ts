/**
 * Client-side database service using Dexie (IndexedDB wrapper)
 */
import Dexie, { Table } from 'dexie';

/**
 * Database schema and types
 */
export interface World {
  id?: string;
  name: string;
  geography: string;
  cultures: string;
  magicSystems: string;
  history: string;
  createdAt: string;
}

export interface Character {
  id?: string;
  name: string;
  worldId: string;
  profile: string;
  backstory: string;
  relationships: string;
  characterArc: string;
  createdAt: string;
}

export interface Story {
  id?: string;
  title: string;
  worldId: string;
  plotStructure: string;
  scenes: string;
  dialogue: string;
  themes: string;
  createdAt: string;
}

export interface StoryCharacter {
  id?: number;
  storyId: string;
  characterId: string;
}

/**
 * WordForgeDatabase class
 * Extends Dexie to provide typed access to our database tables
 */
class WordForgeDatabase extends Dexie {
  worlds!: Table<World, string>;
  characters!: Table<Character, string>;
  stories!: Table<Story, string>;
  storyCharacters!: Table<StoryCharacter, number>;

  constructor() {
    super('WordForgeDB');

    // Define tables and indexes
    this.version(1).stores({
      worlds: 'id, createdAt',
      characters: 'id, worldId, createdAt',
      stories: 'id, worldId, createdAt',
      storyCharacters: '++id, storyId, characterId'
    });
  }

  /**
   * Initialize the database and migrate data from localStorage if needed
   */
  async initialize(): Promise<void> {
    // Skip initialization on server-side
    if (typeof window === 'undefined') return;

    try {
      // Check if we've already migrated from localStorage
      const migrated = localStorage.getItem('indexeddb-migration-complete');
      if (migrated) return;

      // Check if there's data in localStorage to migrate
      const worldsJSON = localStorage.getItem('worlds');
      const charactersJSON = localStorage.getItem('characters');
      const storiesJSON = localStorage.getItem('stories');
      const storyCharactersJSON = localStorage.getItem('story_characters');

      // Start a transaction for all migrations
      await this.transaction('rw',
        [this.worlds, this.characters, this.stories, this.storyCharacters],
        async () => {
          // Migrate worlds
          if (worldsJSON) {
            const worlds = JSON.parse(worldsJSON);
            for (const world of worlds) {
              await this.worlds.put(world);
            }
          }

          // Migrate characters
          if (charactersJSON) {
            const characters = JSON.parse(charactersJSON);
            for (const character of characters) {
              await this.characters.put(character);
            }
          }

          // Migrate stories
          if (storiesJSON) {
            const stories = JSON.parse(storiesJSON);
            for (const story of stories) {
              await this.stories.put(story);
            }
          }

          // Migrate story characters
          if (storyCharactersJSON) {
            const storyCharacters = JSON.parse(storyCharactersJSON);
            for (const sc of storyCharacters) {
              await this.storyCharacters.put(sc);
            }
          }
        }
      );

      // Mark migration as complete
      localStorage.setItem('indexeddb-migration-complete', 'true');
      console.log('Migration from localStorage to IndexedDB complete');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  /**
   * Export all data to JSON for backup
   */
  async exportData(): Promise<string> {
    // Skip on server-side
    if (typeof window === 'undefined') return '{}';

    const worlds = await this.worlds.toArray();
    const characters = await this.characters.toArray();
    const stories = await this.stories.toArray();
    const storyCharacters = await this.storyCharacters.toArray();

    const data = {
      worlds,
      characters,
      stories,
      storyCharacters
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON backup
   */
  async importData(jsonData: string): Promise<void> {
    // Skip on server-side
    if (typeof window === 'undefined') return;

    try {
      const data = JSON.parse(jsonData);

      await this.transaction('rw',
        [this.worlds, this.characters, this.stories, this.storyCharacters],
        async () => {
          // Clear existing data
          await this.worlds.clear();
          await this.characters.clear();
          await this.stories.clear();
          await this.storyCharacters.clear();

          // Import new data
          if (data.worlds) {
            await this.worlds.bulkPut(data.worlds);
          }

          if (data.characters) {
            await this.characters.bulkPut(data.characters);
          }

          if (data.stories) {
            await this.stories.bulkPut(data.stories);
          }

          if (data.storyCharacters) {
            await this.storyCharacters.bulkPut(data.storyCharacters);
          }
        }
      );

      console.log('Data import complete');
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }
}

// Create and export a single instance of the database
export const db = new WordForgeDatabase();

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString();
}

// Helper function to get current date in ISO format
export function getCurrentDate(): string {
  return new Date().toISOString();
}

// World operations
export const worldsDB = {
  async getAll(): Promise<World[]> {
    return await db.worlds.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<World | undefined> {
    return await db.worlds.get(id);
  },

  async create(worldData: Omit<World, 'id' | 'createdAt'>): Promise<string> {
    const id = generateId();
    const world: World = {
      ...worldData,
      id,
      createdAt: getCurrentDate()
    };

    await db.worlds.add(world);
    return id;
  },

  async update(world: World): Promise<string> {
    if (!world.id) throw new Error('World ID is required');
    await db.worlds.put(world);
    return world.id;
  },

  async delete(id: string): Promise<void> {
    // Delete the world
    await db.worlds.delete(id);

    // Delete related characters
    await db.characters.where('worldId').equals(id).delete();

    // Delete related stories
    const storiesToDelete = await db.stories.where('worldId').equals(id).toArray();
    for (const story of storiesToDelete) {
      if (story.id) {
        // Delete story character relationships
        await db.storyCharacters.where('storyId').equals(story.id).delete();
        // Delete the story
        await db.stories.delete(story.id);
      }
    }
  }
};

// Character operations
export const charactersDB = {
  async getAll(): Promise<Character[]> {
    return await db.characters.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<Character | undefined> {
    return await db.characters.get(id);
  },

  async getByWorldId(worldId: string): Promise<Character[]> {
    return await db.characters.where('worldId').equals(worldId).toArray();
  },

  async create(characterData: Omit<Character, 'id' | 'createdAt'>): Promise<string> {
    const id = generateId();
    const character: Character = {
      ...characterData,
      id,
      createdAt: getCurrentDate()
    };

    await db.characters.add(character);
    return id;
  },

  async update(character: Character): Promise<string> {
    if (!character.id) throw new Error('Character ID is required');
    await db.characters.put(character);
    return character.id;
  },

  async delete(id: string): Promise<void> {
    // Delete the character
    await db.characters.delete(id);

    // Delete character from story relationships
    await db.storyCharacters.where('characterId').equals(id).delete();
  }
};

// Story operations
export const storiesDB = {
  async getAll(): Promise<Story[]> {
    return await db.stories.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<Story | undefined> {
    return await db.stories.get(id);
  },

  async getByWorldId(worldId: string): Promise<Story[]> {
    return await db.stories.where('worldId').equals(worldId).toArray();
  },

  async create(storyData: Omit<Story, 'id' | 'createdAt'>, characterIds: string[] = []): Promise<string> {
    const id = generateId();
    const story: Story = {
      ...storyData,
      id,
      createdAt: getCurrentDate()
    };

    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction('rw', [db.stories, db.storyCharacters], async () => {
      // Add the story
      await db.stories.add(story);

      // Add character relationships
      for (const characterId of characterIds) {
        await db.storyCharacters.add({
          storyId: id,
          characterId
        });
      }
    });

    return id;
  },

  async update(story: Story, characterIds: string[] = []): Promise<string> {
    if (!story.id) throw new Error('Story ID is required');

    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction('rw', [db.stories, db.storyCharacters], async () => {
      // Update the story
      await db.stories.put(story);

      // Remove existing character relationships
      await db.storyCharacters.where('storyId').equals(story.id).delete();

      // Add new character relationships
      for (const characterId of characterIds) {
        await db.storyCharacters.add({
          storyId: story.id,
          characterId
        });
      }
    });

    return story.id;
  },

  async delete(id: string): Promise<void> {
    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction('rw', [db.stories, db.storyCharacters], async () => {
      // Delete story character relationships
      await db.storyCharacters.where('storyId').equals(id).delete();

      // Delete the story
      await db.stories.delete(id);
    });
  },

  async getCharacters(storyId: string): Promise<string[]> {
    const relationships = await db.storyCharacters
      .where('storyId')
      .equals(storyId)
      .toArray();

    return relationships.map(r => r.characterId);
  }
};

// Initialize the database
db.initialize().catch(error => {
  console.error('Failed to initialize database:', error);
});
