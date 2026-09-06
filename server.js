require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const OWN_API_KEY = (process.env.G_ONE_AI_API_KEY || '').trim();
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

function requireOwnApiKey(req, res, next) {
  if (!OWN_API_KEY) return next();
  const provided = String(req.get('x-api-key') || '').trim();
  if (!provided || provided !== OWN_API_KEY) {
    return res.status(401).json({ success: false, error: 'Invalid or missing API key.' });
  }
  next();
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'G ONE AI' }));

function cleanMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .map(m => ({
      role: m?.role === 'assistant' || m?.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m?.content ?? m?.text ?? '') }]
    }))
    .filter(m => m.parts[0].text.trim());
}

async function geminiGenerate(contents, extra = {}) {
  if (!GEMINI_API_KEY) {
    const err = new Error('GEMINI_API_KEY is missing. Add your Gemini API key to .env and restart the server.');
    err.status = 503;
    throw err;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({ contents, ...extra })
  });

  let data = {};
  try { data = await response.json(); } catch (_) {}

  if (!response.ok) {
    const apiMessage = data?.error?.message || `Gemini API request failed (${response.status})`;
    const err = new Error(apiMessage);
    err.status = response.status;
    throw err;
  }

  const text = (data?.candidates || [])
    .flatMap(c => c?.content?.parts || [])
    .map(p => p?.text || '')
    .join('')
    .trim();

  if (!text) {
    const err = new Error('Gemini returned an empty response.');
    err.status = 502;
    throw err;
  }
  return text;
}

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    provider: 'Google Gemini',
    apiConfigured: Boolean(GEMINI_API_KEY),
    model: GEMINI_MODEL
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const messages = cleanMessages(req.body?.messages);
    if (!messages.length) return res.status(400).json({ error: 'Message is required.' });

    const reply = await geminiGenerate(messages, {
      systemInstruction: {
        parts: [{ text:
          'You are G ONE AI, a helpful advanced general AI assistant. ' +
          'Reply naturally in Hindi, Hinglish, or English according to the user. ' +
          'Give useful, accurate, clear answers. Use simple language when appropriate. ' +
          'Do not claim to have tools, browsing, or abilities you do not actually have.'
        }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    });

    res.json({ success: true, reply, provider: 'gemini', model: GEMINI_MODEL });
  } catch (error) {
    console.error('Gemini chat error:', error.message);
    const status = Number(error.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      error: error.message || 'Gemini request failed.'
    });
  }
});

app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Query is required.' });
  if (!process.env.BRAVE_SEARCH_API_KEY) {
    return res.status(503).json({ error: 'Live web search is not configured. Gemini chat still works normally.' });
  }
  try {
    const response = await fetch(
      'https://api.search.brave.com/res/v1/web/search?q=' + encodeURIComponent(q),
      { headers: { Accept: 'application/json', 'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY } }
    );
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Web search failed.' });
    res.json({
      results: (data.web?.results || []).map(x => ({
        title: x.title,
        snippet: x.description || '',
        url: x.url
      }))
    });
  } catch (_) {
    res.status(500).json({ error: 'Web search failed.' });
  }
});

app.post('/api/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = '';

    if (['.txt', '.md', '.csv', '.json'].includes(ext)) {
      text = fs.readFileSync(req.file.path, 'utf8');
    } else if (ext === '.pdf') {
      const pdfParse = require('pdf-parse');
      text = (await pdfParse(fs.readFileSync(req.file.path))).text;
    } else {
      return res.status(400).json({ error: 'Supported files: TXT, MD, PDF, CSV, JSON.' });
    }

    res.json({ name: req.file.originalname, text: text.slice(0, 100000) });
  } catch (error) {
    res.status(500).json({ error: 'File processing failed.' });
  } finally {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) {}
  }
});

app.post('/api/vision', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
    const mime = req.file.mimetype;
    const b64 = fs.readFileSync(req.file.path).toString('base64');
    const reply = await geminiGenerate([{
      role: 'user',
      parts: [
        { text: 'Analyze this image clearly. Describe important objects, visible text, layout, and notable details.' },
        { inlineData: { mimeType: mime, data: b64 } }
      ]
    }], { generationConfig: { temperature: 0.4, maxOutputTokens: 2048 } });
    res.json({ success: true, reply, provider: 'gemini', model: GEMINI_MODEL });
  } catch (error) {
    console.error('Vision error:', error.message);
    const status = Number(error.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: error.message || 'Image analysis failed.' });
  } finally {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) {}
  }
});


// First-party G ONE AI API
app.get('/api/g-one-ai', (_req, res) => {
  res.json({
    name: 'G ONE AI API',
    version: '1.1.0',
    status: 'online',
    provider: 'Google Gemini',
    endpoint: '/api/g-one-ai/chat',
    method: 'POST',
    auth: OWN_API_KEY ? 'x-api-key header' : 'none'
  });
});

app.post('/api/g-one-ai/chat', apiLimiter, requireOwnApiKey, async (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) return res.status(400).json({ success: false, error: 'Message is required.' });

  try {
    const reply = await geminiGenerate([{
      role: 'user',
      parts: [{ text: message }]
    }], {
      systemInstruction: {
        parts: [{ text: 'You are G ONE AI, a helpful general AI assistant. Reply naturally in Hindi, Hinglish, or English according to the user.' }]
      },
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    });
    res.json({ success: true, provider: 'gemini', model: GEMINI_MODEL, reply });
  } catch (error) {
    console.error('Own API error:', error.message);
    const status = Number(error.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ success: false, error: error.message || 'AI request failed.' });
  }
});

// SPA fallback must come after all API routes.
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`G ONE AI running at http://${HOST}:${PORT}`);
  console.log(`Gemini model: ${GEMINI_MODEL}`);
  console.log(`Gemini key: ${GEMINI_API_KEY ? 'FOUND' : 'MISSING'}`);
  console.log(`Own API auth: ${OWN_API_KEY ? 'ENABLED' : 'DISABLED'}`);
});
