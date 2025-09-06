const Chat = require('../models/chat');

function detectTopic(question) {
  const lower = question.toLowerCase();
  if (lower.includes('integral') || lower.includes('equation') || lower.includes('algebra')) return 'Math';
  if (lower.includes('gravity') || lower.includes('atom') || lower.includes('photosynthesis')) return 'Science';
  if (lower.includes('war') || lower.includes('king') || lower.includes('revolution')) return 'History';
  if (lower.includes('code') || lower.includes('algorithm') || lower.includes('runtime')) return 'Programming';
  return 'General';
}

function summarizeTopics(chats) {
  const topicCount = {};
  chats.forEach(chat => {
    chat.messages.forEach(msg => {
      const topic = detectTopic(msg.question);
      topicCount[topic] = (topicCount[topic] || 0) + 1;
    });
  });

  const sorted = Object.entries(topicCount).sort((a, b) => b[1] - a[1]);
  return sorted.length ? sorted[0][0] : 'General';
}

exports.generateBadge = async (userId) => {
  const chats = await Chat.find({ userId });
  if (!chats.length) return 'Curious Beginner';

  const topTopic = summarizeTopics(chats);

  const badgeMap = {
    Math: 'Math Master',
    Science: 'Science Explorer',
    History: 'History Buff',
    Programming: 'Code Commander',
    General: 'Knowledge Seeker',
  };

  return badgeMap[topTopic] || 'Curious Beginner';
};