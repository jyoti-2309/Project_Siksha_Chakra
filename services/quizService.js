const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildQuizPrompt(messages) {
  let prompt = `Based on the following chat history, generate a quiz with 3 questions. Each question should have 4 options and indicate the correct answer.\n\n`;

  messages.forEach((msg, i) => {
    prompt += `Q${i + 1}: ${msg.question}\nA${i + 1}: ${msg.answer}\nExamples: ${msg.examples.join(', ')}\n\n`;
  });

  prompt += `Format:\n1. Question\nOptions: A, B, C, D\nCorrect Answer: X`;

  return prompt;
}

exports.generateQuiz = async (messages) => {
  const prompt = buildQuizPrompt(messages);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  // Basic parsing (you can refine this)
  const quizItems = content.split(/\n(?=\d+\.\s)/).map(block => {
    const lines = block.trim().split('\n');
    const question = lines[0].replace(/^\d+\.\s/, '');
    const options = lines[1].replace('Options:', '').split(',').map(opt => opt.trim());
    const correctAnswer = lines[2].replace('Correct Answer:', '').trim();

    return { question, options, correctAnswer };
  });

  return quizItems;
};