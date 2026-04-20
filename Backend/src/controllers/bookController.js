const Book = require('../models/Book');

// Get all books with pagination and category filtering
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const category = req.query.category || 'All';
        const skip = (page - 1) * limit;

        const filter = category && category !== 'All' ? { category } : {};

        const total = await Book.countDocuments(filter);
        const books = await Book.find(filter).skip(skip).limit(limit);

        res.json({
            books,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single book
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a book (for initial data population)
exports.addBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
