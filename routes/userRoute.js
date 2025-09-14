const express = require('express');
const router = express.Router();
const User = require('../models/user');
const badgeService = require('../services/badgeService')
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findOne({ _id: req.uid });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/', authMiddleware, async (req, res) => {
  const { name, email, age,  } = req.body;
  const badgeType = await badgeService.generateBadge(req.uid);
  const user = await User.findOneAndUpdate(
    { _id: req.uid },
    { name, email, age, badge: badgeType},
    { new: true }
  );
  res.json(user);
});

module.exports = router;