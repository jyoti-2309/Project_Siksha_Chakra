require('dotenv').config();
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.uid = decoded.id;
    next();
  } catch {
    console.log('Received token:', req.headers.authorization);
    res.status(401).json({ message: 'Invalid token' });
  }
};