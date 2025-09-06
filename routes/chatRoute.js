const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const llmService = require('../services/llmService');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/new', async (req, res) => {
  const chat = await Chat.create({ userId: req.user._id, messages: [] });
  res.json(chat);
});

router.post('/message', async (req, res) => {
  const { chatId, question, analogies } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const previousQuestions = chat.messages.map(m => m.question);
  const related = await llmService.isRelated(question, previousQuestions);

  const context = related ? chat.messages.map(m => ({ question: m.question, answer: m.answer })) : [];
  const response = await llmService.generateAnswer(question, analogies, context);

  chat.messages.push({
    question,
    analogies,
    answer: response.answer,
    examples: response.examples,
  });

  await chat.save();
  res.json(chat);
});

router.get('/:id', async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate('quiz');
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json(chat);
});

module.exports = router;