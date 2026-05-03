const express = require('express');
const router = express.Router();

// In-memory progress store (replace with MongoDB if needed)
let progressStore = {};

// GET /api/progress/:userId
router.get('/:userId', (req, res) => {
  const data = progressStore[req.params.userId] || { covered: [], sessions: [] };
  res.json(data);
});

// POST /api/progress/:userId/toggle
router.post('/:userId/toggle', (req, res) => {
  const { topicId } = req.body;
  const { userId } = req.params;
  if (!progressStore[userId]) progressStore[userId] = { covered: [], sessions: [] };

  const covered = progressStore[userId].covered;
  const idx = covered.indexOf(topicId);
  if (idx > -1) covered.splice(idx, 1);
  else covered.push(topicId);

  res.json({ covered: progressStore[userId].covered });
});

module.exports = router;
