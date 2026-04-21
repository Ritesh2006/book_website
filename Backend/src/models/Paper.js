const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  field: { type: String, required: true },
  year: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Paper', paperSchema);
