const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl = process.env.LOCAL_MONGO_URL
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Database connected with Server');
})

db.on('disconnected', () => {
    console.log('Database disconnected from Server');
})

db.on('error', (err) => {
    console.log('database connection error : ',err);
})

module.exports = db;
