const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, minlength: [1, 'Title cannot be empty'] },
  description: { type: String, default: '', trim: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Todo', todoSchema);
