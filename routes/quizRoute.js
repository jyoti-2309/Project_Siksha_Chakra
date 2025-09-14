const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const Chat = require('../models/chat');
const quizService = require('../services/quizService');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, async (req, res) => {
  const { chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const quizData = await quizService.generateQuiz(chat.messages);
  const quiz = await Quiz.create({ chatId, questions: quizData });

  chat.quizzes.push(quiz._id);
  await chat.save();

  res.json(quiz);
});

module.exports = router;