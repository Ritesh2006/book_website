const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String }, // URL to image
    pdfUrl: { type: String }, // URL to the PDF file
    category: { type: String },
    price: { type: Number, default: 0 }, 
    rating: { type: Number, default: 4.5 },
    pages: { type: Number },
    publishedDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
