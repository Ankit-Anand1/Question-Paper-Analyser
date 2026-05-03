const express = require('express');
const router = express.Router();
const axios = require('axios');

const QUICK_ANSWERS = {
  'study today': (topics) => {
    const high = topics.filter((t) => t.priority === 'high').slice(0, 4);
    if (!high.length) return "Upload your question papers first so I can analyze what to study!";
    return `📚 **Study These Today (High Priority):**\n\n${high.map((t, i) => `${i + 1}. **${t.name}** (${t.subject}) — appeared ${t.frequency}× in past papers`).join('\n')}\n\n⏱️ Spend 2–3 hours on each. These have the highest exam probability!`;
  },
  'skip': (topics) => {
    const low = topics.filter((t) => t.priority === 'low').slice(0, 4);
    if (!low.length) return "All your topics seem important! Focus on the highest priority ones first.";
    return `✂️ **Lower Priority Topics (Do Last):**\n\n${low.map((t) => `• ${t.name} (${t.subject})`).join('\n')}\n\n⚠️ Don't skip entirely — do a quick 30-min review of each.`;
  },
  'important': (topics) => {
    const top = topics.slice(0, 6);
    return `🎯 **Most Important Topics:**\n\n${top.map((t, i) => `${i + 1}. **${t.name}** — Score: ${t.priorityScore}/100 | ${t.trend === 'rising' ? '📈 Rising' : t.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}`).join('\n')}\n\nFocus most of your prep on these!`;
  },
  'predict': (topics) => {
    const rising = topics.filter((t) => t.trend === 'rising').slice(0, 4);
    const top = topics.slice(0, 3);
    return `🔮 **Exam Predictions:**\n\n**🔥 Almost Certain to Appear:**\n${top.map((t) => `• ${t.name} (${t.subject})`).join('\n')}\n\n**📈 Rising Trend (Watch Out):**\n${rising.map((t) => `• ${t.name}`).join('\n') || 'Analyzing...'}`;
  },
  'timetable': () => `📅 Go to the **Timetable** section in the sidebar!\n\n1. Set your exam date\n2. Set daily study hours\n3. Click **Generate Timetable**\n\nIt will auto-create a day-by-day plan based on topic priorities.`,
  'strategy': (topics) => {
    const high = topics.filter((t) => t.priority === 'high');
    return `🧠 **Smart Study Strategy:**\n\n**Week 1–2:** Focus on ${high.slice(0, 2).map((t) => t.name).join(', ')}\n**Week 3:** Medium priority topics\n**Last Week:** Revision + past paper practice\n\n**Rule:** 70% time on high-priority, 20% medium, 10% low priority topics.`;
  },
};

router.post('/', async (req, res) => {
  try {
    const { message, topics = [], apiKey } = req.body;
    const lower = message.toLowerCase();

    // No API key → Smart pattern-based response
    if (!apiKey) {
      for (const [keyword, fn] of Object.entries(QUICK_ANSWERS)) {
        if (lower.includes(keyword)) {
          return res.json({ response: fn(topics) });
        }
      }
      return res.json({
        response: `🤖 I can help you with:\n\n• "What should I study today?"\n• "Which topics are most important?"\n• "What can I skip?"\n• "Predict exam topics"\n• "Give me a strategy"\n• "Generate a timetable"\n\nWhat would you like to know?`,
      });
    }

    // With API key → Gemini AI response
    const topContext = topics
      .slice(0, 12)
      .map((t) => `${t.name} (${t.subject}) | Priority: ${t.priority} | Score: ${t.priorityScore} | Freq: ${t.frequency}x`)
      .join('\n');

    const systemPrompt = `You are SyllabusIQ's AI Study Assistant. You help students prepare for exams based on past paper analysis.

Top topics by priority:
${topContext}

Be concise, specific, and use bullet points. Give actionable advice.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate response.';
    res.json({ response: text });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ response: "I'm having trouble right now. Please check your API key or try again." });
  }
});

module.exports = router;
