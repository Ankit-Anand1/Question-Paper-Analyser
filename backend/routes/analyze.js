const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// ─── Topic-subject map for pattern matching ───────────────────────────────────
const SUBJECT_KEYWORDS = {
  'Operating Systems': ['os', 'operating system', 'process', 'deadlock', 'scheduling', 'semaphore', 'memory', 'paging', 'thread'],
  'DBMS': ['database', 'sql', 'dbms', 'normalization', 'transaction', 'acid', 'relational', 'er diagram', 'indexing'],
  'Computer Networks': ['network', 'tcp', 'ip', 'osi', 'protocol', 'routing', 'dns', 'http', 'subnet', 'firewall'],
  'Data Structures': ['data structure', 'array', 'linked list', 'tree', 'graph', 'stack', 'queue', 'heap', 'hash', 'sorting'],
  'Algorithms': ['algorithm', 'complexity', 'dynamic programming', 'greedy', 'divide', 'recursion', 'big o', 'searching'],
  'Mathematics': ['calculus', 'integral', 'derivative', 'matrix', 'algebra', 'probability', 'statistics', 'differential'],
  'Physics': ['mechanics', 'thermodynamics', 'wave', 'optics', 'electric', 'magnetic', 'newton', 'force'],
};

const TOPIC_KEYWORDS = {
  'Deadlock': ['deadlock', 'detection', 'prevention', 'avoidance'],
  'Process Scheduling': ['scheduling', 'fcfs', 'sjf', 'priority queue', 'round robin'],
  'Virtual Memory': ['virtual memory', 'paging', 'page fault', 'segmentation'],
  'SQL Queries': ['sql', 'query', 'join', 'select', 'where', 'group by'],
  'Normalization': ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'boyce'],
  'Transactions': ['transaction', 'acid', 'commit', 'rollback', 'serializability'],
  'TCP/IP': ['tcp', 'udp', 'ip address', 'three-way handshake'],
  'OSI Model': ['osi', 'seven layer', 'presentation layer', 'session layer'],
  'Binary Trees': ['binary tree', 'bst', 'avl', 'inorder', 'preorder', 'postorder'],
  'Dynamic Programming': ['dynamic programming', 'dp', 'memoization', 'tabulation', 'knapsack'],
  'Sorting': ['bubble sort', 'merge sort', 'quick sort', 'insertion sort', 'heap sort'],
  'Graph Algorithms': ['dijkstra', 'bfs', 'dfs', 'minimum spanning', 'prim', 'kruskal'],
};

function detectSubject(text, filename) {
  const lower = (text + ' ' + filename).toLowerCase();
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return subject;
  }
  return 'General';
}

function detectTopic(line) {
  const lower = line.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return topic;
  }
  return 'General';
}

function extractYearFromText(text, filename) {
  const match = (filename + ' ' + text).match(/20(1[5-9]|2[0-9])/);
  return match ? parseInt(match[0]) : 2024;
}

function parseQuestionsFromText(text, filename) {
  const year = extractYearFromText(text, filename);
  const subject = detectSubject(text, filename);
  const questions = [];

  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 15);

  const questionRegex = /^(?:Q\.?\d+[\s.)]*|(?:\d+[\s.)])|(?:[a-z][\s.)])|(?:•|-|\*))\s*(?:define|explain|describe|discuss|prove|find|solve|write|what|how|why|differentiate|compare|list|state|derive|calculate|show)/i;

  lines.forEach((line, i) => {
    if (questionRegex.test(line) && questions.length < 60) {
      questions.push({
        year,
        subject,
        topic: detectTopic(line),
        question: line.replace(/^[Q]?\.?\d+[\s.)]*/, '').trim().substring(0, 150),
        difficulty: line.match(/\b(10|12|15)\s*marks?\b/i) ? 'hard'
          : line.match(/\b(5|6|8)\s*marks?\b/i) ? 'medium' : 'easy',
        marks: parseInt(line.match(/(\d+)\s*marks?/i)?.[1] || '5'),
        source: filename,
      });
    }
  });

  return questions;
}

// ─── Generate Sample Data ─────────────────────────────────────────────────────
function generateSampleQuestions() {
  const data = [
    { subject: 'Operating Systems', topics: ['Deadlock', 'Process Scheduling', 'Virtual Memory', 'Semaphores', 'File Systems'] },
    { subject: 'DBMS', topics: ['SQL Queries', 'Normalization', 'Transactions', 'Indexing', 'ER Diagrams'] },
    { subject: 'Computer Networks', topics: ['TCP/IP', 'OSI Model', 'DNS', 'Routing Protocols', 'Subnetting'] },
    { subject: 'Data Structures', topics: ['Binary Trees', 'Graph Algorithms', 'Sorting', 'Hashing', 'Linked Lists'] },
    { subject: 'Algorithms', topics: ['Dynamic Programming', 'Greedy Algorithms', 'Sorting', 'Graph Algorithms', 'Complexity'] },
  ];

  const questions = [];
  let id = 0;

  for (let year = 2018; year <= 2024; year++) {
    data.forEach(({ subject, topics }) => {
      const count = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const diffs = ['easy', 'medium', 'hard'];
        questions.push({
          _id: `sample-${id++}`,
          year,
          subject,
          topic,
          question: `Explain ${topic} in ${subject} with examples.`,
          difficulty: diffs[Math.floor(Math.random() * 3)],
          marks: [2, 5, 10][Math.floor(Math.random() * 3)],
          source: `sample_${year}.pdf`,
        });
      }
    });
  }

  // Boost high-frequency topics
  [2021, 2022, 2023, 2024].forEach((year) => {
    questions.push({ _id: `boost-${year}-1`, year, subject: 'Operating Systems', topic: 'Deadlock', question: 'Describe deadlock detection and prevention.', difficulty: 'hard', marks: 10, source: `paper_${year}.pdf` });
    questions.push({ _id: `boost-${year}-2`, year, subject: 'DBMS', topic: 'SQL Queries', question: 'Write complex SQL queries using joins.', difficulty: 'medium', marks: 5, source: `paper_${year}.pdf` });
    questions.push({ _id: `boost-${year}-3`, year, subject: 'Computer Networks', topic: 'TCP/IP', question: 'Explain TCP three-way handshake.', difficulty: 'medium', marks: 5, source: `paper_${year}.pdf` });
  });

  return questions;
}

// ─── Build Topics from Questions ──────────────────────────────────────────────
function buildTopics(questions) {
  const map = new Map();

  questions.forEach((q) => {
    const key = `${q.subject}::${q.topic}`;
    if (!map.has(key)) {
      map.set(key, { subject: q.subject, topic: q.topic, years: [], difficulties: [] });
    }
    map.get(key).years.push(q.year);
    map.get(key).difficulties.push(q.difficulty);
  });

  const allYears = questions.map((q) => q.year);
  const maxYear = Math.max(...allYears);

  return Array.from(map.entries())
    .map(([, data], idx) => {
      const freq = data.years.length;
      const recency = data.years
        .reduce((acc, y) => acc + Math.max(0, 10 - (maxYear - y) * 2), 0);
      const trendArr = [...new Set(data.years)].sort();
      const recent3 = trendArr.filter((y) => y >= maxYear - 2).length;
      const older = trendArr.filter((y) => y < maxYear - 2).length;
      const trend = recent3 > older ? 'rising' : older > recent3 ? 'declining' : 'stable';
      const trendBoost = trend === 'rising' ? 15 : 0;
      const score = Math.min(Math.round(freq * 8 + recency + trendBoost), 100);

      return {
        id: `topic-${idx}`,
        name: data.topic,
        subject: data.subject,
        frequency: freq,
        years: [...new Set(data.years)].sort(),
        priorityScore: score,
        priority: score >= 60 ? 'high' : score >= 35 ? 'medium' : 'low',
        trend,
        covered: false,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

// ─── Build Trend Data ─────────────────────────────────────────────────────────
function buildTrends(questions) {
  const yearSubjectMap = {};
  const subjects = new Set();

  questions.forEach((q) => {
    subjects.add(q.subject);
    if (!yearSubjectMap[q.year]) yearSubjectMap[q.year] = {};
    yearSubjectMap[q.year][q.subject] = (yearSubjectMap[q.year][q.subject] || 0) + 1;
  });

  return Object.keys(yearSubjectMap)
    .sort()
    .map((year) => ({ year: parseInt(year), ...yearSubjectMap[year] }));
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// POST /api/analyze — Upload & analyze files
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { useSample, apiKey } = req.body;

    // Load Sample Data
    if (useSample === 'true') {
      const questions = generateSampleQuestions();
      return res.json({
        success: true,
        questions,
        topics: buildTopics(questions),
        trendData: buildTrends(questions),
        message: `Loaded ${questions.length} sample questions across 5 subjects (2018–2024)`,
      });
    }

    // Real file analysis
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    let allQuestions = [];

    for (const file of req.files) {
      const filePath = file.path;

      // Try PDF parse
      let text = '';
      if (file.originalname.toLowerCase().endsWith('.pdf')) {
        try {
          const pdfParse = require('pdf-parse');
          const buffer = require('fs').readFileSync(filePath);
          const data = await pdfParse(buffer);
          text = data.text;
        } catch {
          text = '';
        }
      } else {
        // Plain text
        text = require('fs').readFileSync(filePath, 'utf-8');
      }

      // Try Gemini AI if API key provided
      if (apiKey && text.length > 50) {
        try {
          const aiQuestions = await analyzeWithGemini(text, file.originalname, apiKey);
          allQuestions.push(...aiQuestions);
        } catch {
          const parsed = parseQuestionsFromText(text, file.originalname);
          allQuestions.push(...parsed);
        }
      } else if (text.length > 50) {
        const parsed = parseQuestionsFromText(text, file.originalname);
        allQuestions.push(...parsed);
      }

      // Clean up uploaded file
      try { require('fs').unlinkSync(filePath); } catch {}
    }

    // Fallback to sample if nothing extracted
    if (allQuestions.length < 5) {
      const sample = generateSampleQuestions();
      return res.json({
        success: true,
        questions: sample,
        topics: buildTopics(sample),
        trendData: buildTrends(sample),
        message: `Could not extract questions from files — showing demo data instead.`,
      });
    }

    return res.json({
      success: true,
      questions: allQuestions,
      topics: buildTopics(allQuestions),
      trendData: buildTrends(allQuestions),
      message: `Analyzed ${req.files.length} file(s) — found ${allQuestions.length} questions`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

async function analyzeWithGemini(text, filename, apiKey) {
  const axios = require('axios');
  const prompt = `Analyze this exam paper and extract all questions as JSON array.
Each item: { "year": number, "subject": string, "topic": string, "question": string (max 120 chars), "difficulty": "easy"|"medium"|"hard", "marks": number }
Filename: ${filename}
Text: ${text.substring(0, 5000)}
Return ONLY valid JSON array, nothing else.`;

  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }
  );

  const content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  return JSON.parse(jsonMatch[0]).map((q, i) => ({ ...q, _id: `ai-${Date.now()}-${i}`, source: filename }));
}

module.exports = router;
