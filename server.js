import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Redirect root to auth page
app.get('/', (req, res) => {
  res.redirect('/auth.html');
});

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

// Simple rate limiting (10 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  const record = rateLimitMap.get(ip);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_WINDOW;
    return next();
  }
  
  if (record.count >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
  }
  
  record.count++;
  next();
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const { message, model = 'qwen2.5:0.5b', stream = false } = req.body;
    const body = { model, prompt: message, stream };
    
    const r = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/stream', rateLimit, async (req, res) => {
  try {
    const { message, model = 'qwen2.5:0.5b' } = req.body;
    const body = { model, prompt: message, stream: true };
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const r = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          res.write(`data: ${JSON.stringify(json)}\n\n`);
        } catch (e) {
          // Skip malformed JSON
        }
      }
    }
    
    res.end();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get available models endpoint
app.get('/api/models', async (req, res) => {
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags');
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);