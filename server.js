require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const db = require('./db');

app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/chat', require('./routes/chatRoute'));
app.use('/api/quiz', require('./routes/quizRoute'));

const PORT = process.env.PORT;

app.listen(PORT || 5000, () => {
  console.log(`Server running on port ${PORT}`);
});