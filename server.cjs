const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(cors({
  origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Serve static files from the dist directory (built frontend)
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: isProduction ? '1y' : 0,
  etag: true
}));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const config = { responseMimeType: 'text/plain' };
const model = 'gemini-2.0-flash';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/ask-brat-ai', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });
  
  // Rate limiting (basic)
  if (req.headers['x-rate-limit']) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  if (/your name|who are you|what is your name|name\?/i.test(message)) {
    return res.json({ text: 'Brat' });
  }
  if (/repo|repository|project|together cli|together api|what can you do|what is this|about you|about this|what are you|who made you|who built you|github|source code|cli tool|languages supported|how to use|usage|setup|license|how does it work|explain|describe|tell me about/i.test(message)) {
    return res.json({ text: `You can learn more about this project at https://github.com/bniladridas/togethercli\n\nTogether API CLI Tools: Effortlessly interact with the Together API using the nvidia/Llama-3.1-Nemotron-70B-Instruct-HF model. This repository offers sleek, powerful CLI tools crafted in multiple languages.\n\nLanguages:\n- Rust: Fast, reliable prompt-to-response interaction.\n- R: Seamless API integration for data-driven workflows.\n- Scala: Elegant, scalable command-line prompting.\n- Fortran: Robust API calls via curl system integration.\n\nSetup: Create a .env file in the root or language-specific folder with TOGETHER_API_KEY=your_api_key_here. Ensure a .env file is present in the following project folders: typescript-cli, go-cli, javascript-cli, java-cli, scala-cli, ruby-cli.\n\nUsage: Each CLI takes a prompt as a command-line argument and delivers the API's response with precision.\n- Rust: cd rust-cli && cargo run -- "Your prompt here"\n- R: Rscript r-cli/cli.R "Your prompt here"\n- Scala: cd scala-cli && sbt run "Your prompt here"\n- Fortran: gfortran fortran-cli/main.f90 -o fortran-cli/together_cli && ./fortran-cli/together_cli "Your prompt here"\n\nNotes: Ensure your .env file contains a valid API key. Fortran uses curl for HTTP requests. Special characters in prompts are escaped for reliable JSON payloads.\n\nLicense: Provided as-is, without warranty.` });
  }
  
  try {
    const contents = [
      { role: 'user', parts: [{ text: `Respond in a few words only. ${message}` }] },
    ];
    const response = await ai.models.generateContentStream({ model, config, contents });
    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }
    // Remove asterisks and hash characters from the response
    result = result.replace(/[\*#]/g, '');
    // Remove extra whitespace, line breaks, and repeated punctuation
    result = result.replace(/\s+/g, ' ').replace(/([.!?])\1+/g, '$1').trim();
    // Remove trailing punctuation
    result = result.replace(/[.!?]+$/, '');
    res.json({ text: result });
  } catch (err) {
    console.error('AI API Error:', err.message);
    res.status(500).json({ error: isProduction ? 'Internal server error' : err.message });
  }
});

// Serve the React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: isProduction ? 'Internal server error' : err.message });
});

app.listen(port, () => {
  console.log(`BratUI server listening at http://localhost:${port}`);
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
}); 