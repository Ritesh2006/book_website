const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// @route GET /api/books
router.get('/', bookController.getBooks);

// @route GET /api/books/:id
router.get('/:id', bookController.getBookById);

// @route GET /api/books/search
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const category = req.query.category || 'All';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        let filter = {};
        
        if (query) {
            filter.$and = [
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { author: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } }
                    ]
                }
            ];
        }

        if (category !== 'All') {
            if (!filter.$and) filter.$and = [];
            filter.$and.push({ category: category });
        }

        const total = await require('../models/Book').countDocuments(filter);
        const books = await require('../models/Book').find(filter).skip(skip).limit(limit);

        res.json({
            books,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/books
router.post('/', bookController.addBook);

// @route PUT /api/books/:id
router.put('/:id', bookController.updateBook);

// @route DELETE /api/books/:id
router.delete('/:id', bookController.deleteBook);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// @route POST /api/books/upload
router.post('/upload', upload.single('pdf'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload file' });
    }
});

// @route POST /api/books/chat (AI Chatbot)
router.post('/chat', (req, res) => {
    const { message } = req.body;
    let reply = "That sounds fascinating! As an AI, I can recommend the 'Dune' series or 'Atomic Habits' based on your interest.";
    
    const lower = message.toLowerCase();
    if (lower.includes('hi') || lower.includes('hello')) reply = "Hello there! I am Ellama 3, your AI library assistant. Need a book recommendation?";
    else if (lower.includes('sci-fi') || lower.includes('science fiction')) reply = "For Sci-Fi, 'Project Hail Mary' by Andy Weir or 'Dune' by Frank Herbert are absolute must-reads right now!";
    else if (lower.includes('free')) reply = "Yes! Every single book on BookHaven is 100% free forever.";
    
    // Simulate thinking delay for Llama 3 API effect
    setTimeout(() => {
        res.json({ reply });
    }, 1500);
});

module.exports = router;
