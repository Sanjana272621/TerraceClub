const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// GET /api/plants - Get all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/plants/:id - Get a single plant
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/plants - Create a new plant
router.post('/', async (req, res) => {
  try {
    const { name, species, careNotes } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const plant = new Plant({
      name,
      species: species || '',
      careNotes: careNotes || ''
    });

    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/plants/:id - Update a plant
router.put('/:id', async (req, res) => {
  try {
    const { name, species, careNotes } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      {
        name,
        species: species || '',
        careNotes: careNotes || ''
      },
      { new: true, runValidators: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/plants/:id - Delete a plant
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

