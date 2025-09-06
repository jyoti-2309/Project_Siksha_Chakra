const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  question: String,
  analogies: [String],
  answer: String,
  examples: [String],
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  messages: [messageSchema], // multiple Q&A entries
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }], // multiple quizzes per page
});

module.exports = mongoose.model('Chat', chatSchema);