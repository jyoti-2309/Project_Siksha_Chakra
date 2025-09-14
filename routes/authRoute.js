require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const badgeService = require('../services/badgeService')

// Public routes

//registration route
router.post('/register', async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    if(!name || !email || !age || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email already used' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, age, password: hash });
    const badgeType = await badgeService.generateBadge(user._id);
    await User.findOneAndUpdate(
        { _id: user._id },
        { badge: badgeType },
      )
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, age: user.age, badge: user.badge} });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while registering !!' });
  }
});

//login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jwt_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, age: user.age }});
});

module.exports = router;