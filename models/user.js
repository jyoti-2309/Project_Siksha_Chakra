const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: String,
  age: Number,
  imageUrl: String,
  badge: String,
});

module.exports = mongoose.model('User', userSchema);