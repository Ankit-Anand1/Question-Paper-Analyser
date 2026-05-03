const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  marks: { type: Number, default: 5 },
  source: { type: String, default: '' }, // filename
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
