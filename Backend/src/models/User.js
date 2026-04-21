const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  readingProgress: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper' },
      progress: { type: Number, default: 0 },
      status: { type: String, enum: ['Reading', 'Read'], default: 'Reading' },
      lastRead: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
