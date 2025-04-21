const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const db = new Database(path.join(dataDir, 'word-forge.db'));

// Create tables if they don't exist
function initializeDatabase() {
  // Create worlds table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS worlds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      geography TEXT,
      cultures TEXT,
      magicSystems TEXT,
      history TEXT,
      createdAt TEXT NOT NULL
    )
  `).run();

  // Create characters table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      worldId TEXT NOT NULL,
      profile TEXT,
      backstory TEXT,
      relationships TEXT,
      characterArc TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (worldId) REFERENCES worlds(id)
    )
  `).run();

  // Create stories table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      worldId TEXT NOT NULL,
      plotStructure TEXT,
      scenes TEXT,
      dialogue TEXT,
      themes TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (worldId) REFERENCES worlds(id)
    )
  `).run();

  // Create story_characters junction table for many-to-many relationship
  db.prepare(`
    CREATE TABLE IF NOT EXISTS story_characters (
      storyId TEXT NOT NULL,
      characterId TEXT NOT NULL,
      PRIMARY KEY (storyId, characterId),
      FOREIGN KEY (storyId) REFERENCES stories(id),
      FOREIGN KEY (characterId) REFERENCES characters(id)
    )
  `).run();

  console.log('Database initialized successfully');
}

// Initialize the database
initializeDatabase();

// Prepare statements for worlds
const worldStatements = {
  getAll: db.prepare('SELECT * FROM worlds ORDER BY createdAt DESC'),
  getById: db.prepare('SELECT * FROM worlds WHERE id = ?'),
  create: db.prepare('INSERT INTO worlds (id, name, geography, cultures, magicSystems, history, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'),
  update: db.prepare('UPDATE worlds SET name = ?, geography = ?, cultures = ?, magicSystems = ?, history = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM worlds WHERE id = ?')
};

// Prepare statements for characters
const characterStatements = {
  getAll: db.prepare('SELECT * FROM characters ORDER BY createdAt DESC'),
  getById: db.prepare('SELECT * FROM characters WHERE id = ?'),
  getByWorldId: db.prepare('SELECT * FROM characters WHERE worldId = ? ORDER BY createdAt DESC'),
  create: db.prepare('INSERT INTO characters (id, name, worldId, profile, backstory, relationships, characterArc, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'),
  update: db.prepare('UPDATE characters SET name = ?, worldId = ?, profile = ?, backstory = ?, relationships = ?, characterArc = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM characters WHERE id = ?')
};

// Prepare statements for stories
const storyStatements = {
  getAll: db.prepare('SELECT * FROM stories ORDER BY createdAt DESC'),
  getById: db.prepare('SELECT * FROM stories WHERE id = ?'),
  getByWorldId: db.prepare('SELECT * FROM stories WHERE worldId = ? ORDER BY createdAt DESC'),
  create: db.prepare('INSERT INTO stories (id, title, worldId, plotStructure, scenes, dialogue, themes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'),
  update: db.prepare('UPDATE stories SET title = ?, worldId = ?, plotStructure = ?, scenes = ?, dialogue = ?, themes = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM stories WHERE id = ?')
};

// Prepare statements for story_characters
const storyCharacterStatements = {
  getByStoryId: db.prepare('SELECT c.* FROM characters c JOIN story_characters sc ON c.id = sc.characterId WHERE sc.storyId = ?'),
  create: db.prepare('INSERT INTO story_characters (storyId, characterId) VALUES (?, ?)'),
  deleteByStoryId: db.prepare('DELETE FROM story_characters WHERE storyId = ?')
};

module.exports = {
  worlds: {
    getAll: () => worldStatements.getAll.all(),
    getById: (id) => worldStatements.getById.get(id),
    create: (world) => {
      const { id, name, geography, cultures, magicSystems, history, createdAt } = world;
      return worldStatements.create.run(id, name, geography, cultures, magicSystems, history, createdAt);
    },
    update: (world) => {
      const { id, name, geography, cultures, magicSystems, history } = world;
      return worldStatements.update.run(name, geography, cultures, magicSystems, history, id);
    },
    delete: (id) => worldStatements.delete.run(id)
  },
  characters: {
    getAll: () => characterStatements.getAll.all(),
    getById: (id) => characterStatements.getById.get(id),
    getByWorldId: (worldId) => characterStatements.getByWorldId.all(worldId),
    create: (character) => {
      const { id, name, worldId, profile, backstory, relationships, characterArc, createdAt } = character;
      return characterStatements.create.run(id, name, worldId, profile, backstory, relationships, characterArc, createdAt);
    },
    update: (character) => {
      const { id, name, worldId, profile, backstory, relationships, characterArc } = character;
      return characterStatements.update.run(name, worldId, profile, backstory, relationships, characterArc, id);
    },
    delete: (id) => characterStatements.delete.run(id)
  },
  stories: {
    getAll: () => storyStatements.getAll.all(),
    getById: (id) => storyStatements.getById.get(id),
    getByWorldId: (worldId) => storyStatements.getByWorldId.all(worldId),
    create: (story, characterIds = []) => {
      const { id, title, worldId, plotStructure, scenes, dialogue, themes, createdAt } = story;
      
      // Use a transaction to ensure all operations succeed or fail together
      const createStory = db.transaction(() => {
        storyStatements.create.run(id, title, worldId, plotStructure, scenes, dialogue, themes, createdAt);
        
        // Add character associations
        for (const characterId of characterIds) {
          storyCharacterStatements.create.run(id, characterId);
        }
      });
      
      return createStory();
    },
    update: (story, characterIds = []) => {
      const { id, title, worldId, plotStructure, scenes, dialogue, themes } = story;
      
      // Use a transaction to ensure all operations succeed or fail together
      const updateStory = db.transaction(() => {
        storyStatements.update.run(title, worldId, plotStructure, scenes, dialogue, themes, id);
        
        // Remove existing character associations
        storyCharacterStatements.deleteByStoryId.run(id);
        
        // Add new character associations
        for (const characterId of characterIds) {
          storyCharacterStatements.create.run(id, characterId);
        }
      });
      
      return updateStory();
    },
    delete: (id) => {
      // Use a transaction to ensure all operations succeed or fail together
      const deleteStory = db.transaction(() => {
        // Remove character associations first
        storyCharacterStatements.deleteByStoryId.run(id);
        
        // Then delete the story
        storyStatements.delete.run(id);
      });
      
      return deleteStory();
    },
    getCharacters: (storyId) => storyCharacterStatements.getByStoryId.all(storyId)
  }
};
