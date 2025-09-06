const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  createdAt: { type: Date, default: Date.now },
  questions: [questionSchema],
});

module.exports = mongoose.model('Quiz', quizSchema);