const express = require('express');
const router = express.Router();
const User = require('../models/user');
const badge = require('../services/badgeService')
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/', async (req, res) => {
  const user = await User.findOne({ uid: req.uid });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/', async (req, res) => {
  const { name, age, imageUrl } = req.body;
  const badgeType = await badgeService.generateBadge(req.uid);
  const user = await User.findOneAndUpdate(
    { uid: req.uid ,badge: badgeType},
    { name, age, imageUrl },
    { new: true }
  );
  res.json(user);
});

module.exports = router;