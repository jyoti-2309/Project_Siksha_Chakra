const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  password: String,
  badge: {type: String, default: 'Chakra Enthusiast'}
});

module.exports = mongoose.model('User', userSchema);