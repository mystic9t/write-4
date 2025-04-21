const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to handle errors
function handleError(res, error) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'An error occurred' });
}

// World routes
app.get('/api/worlds', (req, res) => {
  try {
    const worlds = db.worlds.getAll();
    res.json(worlds);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/worlds/:id', (req, res) => {
  try {
    const world = db.worlds.getById(req.params.id);
    if (!world) {
      return res.status(404).json({ error: 'World not found' });
    }
    res.json(world);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/worlds', (req, res) => {
  try {
    const world = req.body;
    db.worlds.create(world);
    res.status(201).json(world);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/worlds/:id', (req, res) => {
  try {
    const world = { ...req.body, id: req.params.id };
    db.worlds.update(world);
    res.json(world);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/worlds/:id', (req, res) => {
  try {
    db.worlds.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    handleError(res, error);
  }
});

// Character routes
app.get('/api/characters', (req, res) => {
  try {
    const { worldId } = req.query;
    const characters = worldId 
      ? db.characters.getByWorldId(worldId)
      : db.characters.getAll();
    res.json(characters);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/characters/:id', (req, res) => {
  try {
    const character = db.characters.getById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/characters', (req, res) => {
  try {
    const character = req.body;
    db.characters.create(character);
    res.status(201).json(character);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/characters/:id', (req, res) => {
  try {
    const character = { ...req.body, id: req.params.id };
    db.characters.update(character);
    res.json(character);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/characters/:id', (req, res) => {
  try {
    db.characters.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    handleError(res, error);
  }
});

// Story routes
app.get('/api/stories', (req, res) => {
  try {
    const { worldId } = req.query;
    const stories = worldId 
      ? db.stories.getByWorldId(worldId)
      : db.stories.getAll();
    res.json(stories);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/stories/:id', (req, res) => {
  try {
    const story = db.stories.getById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Get characters associated with this story
    const characters = db.stories.getCharacters(req.params.id);
    
    res.json({ ...story, characters });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/stories', (req, res) => {
  try {
    const { characterIds, ...story } = req.body;
    db.stories.create(story, characterIds);
    res.status(201).json(story);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/stories/:id', (req, res) => {
  try {
    const { characterIds, ...storyData } = req.body;
    const story = { ...storyData, id: req.params.id };
    db.stories.update(story, characterIds);
    res.json(story);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/stories/:id', (req, res) => {
  try {
    db.stories.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    handleError(res, error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
