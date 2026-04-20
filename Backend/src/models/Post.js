const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: String, required: true },
  avatar: { type: String },
  content: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  likes: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
