const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const { videoUpload } = require('../utils/cloudinaryConfig');

// @route   GET /api/settings/:key
router.get('/:key', settingsController.getSetting);

// @route   POST /api/settings
router.post('/', verifyToken, adminOnly, settingsController.updateSetting);

// @route   POST /api/settings/upload-video
router.post('/upload-video', verifyToken, adminOnly, videoUpload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload video to Cloudinary' });
    }
});

// @route   POST /api/settings/repopulate-books
router.post('/repopulate-books', verifyToken, adminOnly, async (req, res) => {
    try {
        const Book = require('../models/Book');
        const axios = require('axios');
        
        console.log("Starting bulk repopulation...");
        
        // Clear current books
        await Book.deleteMany({});
        
        // Fetch from Internet Archive
        const query = 'mediatype:texts AND (subject:"Classic Literature" OR subject:"Philosophy" OR subject:"Science")';
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=subject&fl[]=date&rows=100&sort[]=downloads+desc&output=json`;
        
        const response = await axios.get(url);
        const docs = response.data.response.docs;
        
        const books = docs.map(doc => {
            const identifier = doc.identifier;
            return {
                title: doc.title || 'Untitled Knowledge',
                author: doc.creator || 'Unknown Expert',
                description: doc.description ? doc.description.substring(0, 500).replace(/<[^>]*>?/gm, '') : 'Deep dive into essential knowledge.',
                coverImage: `https://archive.org/services/img/${identifier}`,
                pdfUrl: `https://archive.org/download/${identifier}/${identifier}.pdf`,
                category: doc.subject ? (doc.subject.toString().includes('Science') ? 'Science' : 'Classic') : 'Knowledge',
                price: 0,
                rating: 4.8,
                pages: 250,
                publishedDate: doc.date ? doc.date.substring(0, 4) : 'N/A'
            };
        });
        
        await Book.insertMany(books);
        res.json({ message: `Successfully added ${books.length} books!` });
    } catch (err) {
        console.error("Repopulate error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
