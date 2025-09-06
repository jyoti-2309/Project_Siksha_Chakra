const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(question, analogies, context = []) {
  let prompt = `User asked: "${question}"\nAnalogies: ${analogies.join(', ')}\n`;

  if (context.length) {
    prompt += `\nPrevious context:\n`;
    context.forEach((msg, i) => {
      prompt += `Q${i + 1}: ${msg.question}\nA${i + 1}: ${msg.answer}\n`;
    });
  }

  prompt += `\nGenerate a short and to-the-point answer and two examples.`;

  return prompt;
}

exports.generateAnswer = async (question, analogies, context = []) => {
  const prompt = buildPrompt(question, analogies, context);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;

  // Simple parsing logic (customize as needed)
  const [answerPart, ...exampleParts] = content.split('\n').filter(Boolean);
  const examples = exampleParts.slice(0, 2);

  return {
    answer: answerPart.trim(),
    examples: examples.map(e => e.trim()),
  };
};

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

exports.isRelated = async (newQuestion, previousQuestions) => {
  if (!previousQuestions.length) return false;

  const newEmbedding = await getEmbedding(newQuestion);
  const similarities = await Promise.all(
    previousQuestions.map(async q => {
      const prevEmbedding = await getEmbedding(q);
      return cosineSimilarity(newEmbedding, prevEmbedding);
    })
  );

  const maxSimilarity = Math.max(...similarities);
  return maxSimilarity > 0.75;
};
