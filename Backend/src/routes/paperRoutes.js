const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');

// @route GET /api/papers
router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find().sort({ createdAt: -1 });
        res.json(papers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/papers
router.post('/', async (req, res) => {
    try {
        const newPaper = new Paper(req.body);
        const savedPaper = await newPaper.save();
        res.status(201).json(savedPaper);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route PUT /api/papers/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedPaper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPaper);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route DELETE /api/papers/:id
router.delete('/:id', async (req, res) => {
    try {
        await Paper.findByIdAndDelete(req.params.id);
        res.json({ message: 'Paper deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
