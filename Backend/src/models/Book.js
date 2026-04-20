const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String }, // URL to image
    category: { type: String },
    price: { type: Number, default: 0 }, // All set to 0 as per user request
    rating: { type: Number, default: 0 },
    pages: { type: Number },
    publishedDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
