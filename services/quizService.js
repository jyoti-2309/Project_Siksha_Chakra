const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;

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