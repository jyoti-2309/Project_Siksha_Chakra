const express = require('express');
const router = express.Router();
const User = require('../models/user');
const admin = require('../utils/firebase');


router.post('/verify', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      user = await User.create({ uid: decoded.uid });
    }

    res.status(200).json({ message: 'Authenticated', user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;