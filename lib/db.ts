/**
 * Client-side database service using IndexedDB
 */

// Database version - increment when schema changes
const DB_VERSION = 1;
const DB_NAME = 'word-forge-db';

// Database schema
const STORES = {
  WORLDS: 'worlds',
  CHARACTERS: 'characters',
  STORIES: 'stories',
  STORY_CHARACTERS: 'story_characters'
};

// Initialize the database
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening database:', event);
      reject(new Error('Could not open database'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.WORLDS)) {
        const worldStore = db.createObjectStore(STORES.WORLDS, { keyPath: 'id' });
        worldStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
        const characterStore = db.createObjectStore(STORES.CHARACTERS, { keyPath: 'id' });
        characterStore.createIndex('worldId', 'worldId', { unique: false });
        characterStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.STORIES)) {
        const storyStore = db.createObjectStore(STORES.STORIES, { keyPath: 'id' });
        storyStore.createIndex('worldId', 'worldId', { unique: false });
        storyStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.STORY_CHARACTERS)) {
        const storyCharacterStore = db.createObjectStore(STORES.STORY_CHARACTERS, { keyPath: ['storyId', 'characterId'] });
        storyCharacterStore.createIndex('storyId', 'storyId', { unique: false });
        storyCharacterStore.createIndex('characterId', 'characterId', { unique: false });
      }
    };
  });
}

// Generic function to perform a database operation
async function dbOperation<T>(
  storeName: string, 
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    
    const request = operation(store);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error in ${storeName} operation:`, event);
      reject(new Error(`Database operation failed`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// World types and operations
export interface World {
  id: string;
  name: string;
  geography: string;
  cultures: string;
  magicSystems: string;
  history: string;
  createdAt: string;
}

export const worldsDB = {
  async getAll(): Promise<World[]> {
    return dbOperation<World[]>(STORES.WORLDS, 'readonly', (store) => {
      const index = store.index('createdAt');
      return index.getAll();
    });
  },
  
  async getById(id: string): Promise<World | undefined> {
    return dbOperation<World | undefined>(STORES.WORLDS, 'readonly', (store) => {
      return store.get(id);
    });
  },
  
  async create(world: World): Promise<string> {
    return dbOperation<IDBValidKey>(STORES.WORLDS, 'readwrite', (store) => {
      return store.add(world);
    }) as Promise<string>;
  },
  
  async update(world: World): Promise<string> {
    return dbOperation<IDBValidKey>(STORES.WORLDS, 'readwrite', (store) => {
      return store.put(world);
    }) as Promise<string>;
  },
  
  async delete(id: string): Promise<void> {
    return dbOperation<undefined>(STORES.WORLDS, 'readwrite', (store) => {
      return store.delete(id);
    });
  }
};

// Character types and operations
export interface Character {
  id: string;
  name: string;
  worldId: string;
  profile: string;
  backstory: string;
  relationships: string;
  characterArc: string;
  createdAt: string;
}

export const charactersDB = {
  async getAll(): Promise<Character[]> {
    return dbOperation<Character[]>(STORES.CHARACTERS, 'readonly', (store) => {
      const index = store.index('createdAt');
      return index.getAll();
    });
  },
  
  async getById(id: string): Promise<Character | undefined> {
    return dbOperation<Character | undefined>(STORES.CHARACTERS, 'readonly', (store) => {
      return store.get(id);
    });
  },
  
  async getByWorldId(worldId: string): Promise<Character[]> {
    return dbOperation<Character[]>(STORES.CHARACTERS, 'readonly', (store) => {
      const index = store.index('worldId');
      return index.getAll(worldId);
    });
  },
  
  async create(character: Character): Promise<string> {
    return dbOperation<IDBValidKey>(STORES.CHARACTERS, 'readwrite', (store) => {
      return store.add(character);
    }) as Promise<string>;
  },
  
  async update(character: Character): Promise<string> {
    return dbOperation<IDBValidKey>(STORES.CHARACTERS, 'readwrite', (store) => {
      return store.put(character);
    }) as Promise<string>;
  },
  
  async delete(id: string): Promise<void> {
    return dbOperation<undefined>(STORES.CHARACTERS, 'readwrite', (store) => {
      return store.delete(id);
    });
  }
};

// Story types and operations
export interface Story {
  id: string;
  title: string;
  worldId: string;
  plotStructure: string;
  scenes: string;
  dialogue: string;
  themes: string;
  createdAt: string;
}

export interface StoryCharacter {
  storyId: string;
  characterId: string;
}

export const storiesDB = {
  async getAll(): Promise<Story[]> {
    return dbOperation<Story[]>(STORES.STORIES, 'readonly', (store) => {
      const index = store.index('createdAt');
      return index.getAll();
    });
  },
  
  async getById(id: string): Promise<Story | undefined> {
    return dbOperation<Story | undefined>(STORES.STORIES, 'readonly', (store) => {
      return store.get(id);
    });
  },
  
  async getByWorldId(worldId: string): Promise<Story[]> {
    return dbOperation<Story[]>(STORES.STORIES, 'readonly', (store) => {
      const index = store.index('worldId');
      return index.getAll(worldId);
    });
  },
  
  async create(story: Story, characterIds: string[] = []): Promise<string> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.STORIES, STORES.STORY_CHARACTERS], 'readwrite');
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
        reject(new Error('Failed to create story'));
      };
      
      const storyStore = transaction.objectStore(STORES.STORIES);
      const storyRequest = storyStore.add(story);
      
      storyRequest.onsuccess = () => {
        const storyId = storyRequest.result as string;
        
        // If there are characters to associate
        if (characterIds.length > 0) {
          const storyCharacterStore = transaction.objectStore(STORES.STORY_CHARACTERS);
          
          // Add each character association
          for (const characterId of characterIds) {
            storyCharacterStore.add({ storyId, characterId });
          }
        }
        
        resolve(storyId);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  },
  
  async update(story: Story, characterIds: string[] = []): Promise<string> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.STORIES, STORES.STORY_CHARACTERS], 'readwrite');
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
        reject(new Error('Failed to update story'));
      };
      
      const storyStore = transaction.objectStore(STORES.STORIES);
      const storyRequest = storyStore.put(story);
      
      storyRequest.onsuccess = () => {
        const storyId = story.id;
        const storyCharacterStore = transaction.objectStore(STORES.STORY_CHARACTERS);
        
        // Delete existing character associations
        const index = storyCharacterStore.index('storyId');
        const cursorRequest = index.openCursor(IDBKeyRange.only(storyId));
        
        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
          if (cursor) {
            storyCharacterStore.delete(cursor.primaryKey);
            cursor.continue();
          } else {
            // After deleting all existing associations, add the new ones
            for (const characterId of characterIds) {
              storyCharacterStore.add({ storyId, characterId });
            }
          }
        };
        
        resolve(storyId);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  },
  
  async delete(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.STORIES, STORES.STORY_CHARACTERS], 'readwrite');
      
      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
        reject(new Error('Failed to delete story'));
      };
      
      // Delete the story
      const storyStore = transaction.objectStore(STORES.STORIES);
      storyStore.delete(id);
      
      // Delete character associations
      const storyCharacterStore = transaction.objectStore(STORES.STORY_CHARACTERS);
      const index = storyCharacterStore.index('storyId');
      const cursorRequest = index.openCursor(IDBKeyRange.only(id));
      
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          storyCharacterStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    });
  },
  
  async getCharacters(storyId: string): Promise<string[]> {
    return dbOperation<StoryCharacter[]>(STORES.STORY_CHARACTERS, 'readonly', (store) => {
      const index = store.index('storyId');
      return index.getAll(storyId);
    }).then(storyCharacters => storyCharacters.map(sc => sc.characterId));
  }
};

// Export a function to check if IndexedDB is supported
export function isIndexedDBSupported(): boolean {
  return !!window.indexedDB;
}

// Function to migrate data from localStorage to IndexedDB (if needed)
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    // Check if we've already migrated
    const migrated = localStorage.getItem('indexeddb-migration-complete');
    if (migrated) return;
    
    // Migrate worlds
    const worldsJSON = localStorage.getItem('worlds');
    if (worldsJSON) {
      const worlds = JSON.parse(worldsJSON);
      for (const world of worlds) {
        await worldsDB.create(world);
      }
    }
    
    // Migrate characters
    const charactersJSON = localStorage.getItem('characters');
    if (charactersJSON) {
      const characters = JSON.parse(charactersJSON);
      for (const character of characters) {
        await charactersDB.create(character);
      }
    }
    
    // Migrate stories
    const storiesJSON = localStorage.getItem('stories');
    if (storiesJSON) {
      const stories = JSON.parse(storiesJSON);
      for (const story of stories) {
        const { characterIds, ...storyData } = story;
        await storiesDB.create(storyData, characterIds || []);
      }
    }
    
    // Mark migration as complete
    localStorage.setItem('indexeddb-migration-complete', 'true');
    
    console.log('Migration from localStorage to IndexedDB complete');
  } catch (error) {
    console.error('Error migrating data from localStorage:', error);
  }
}
