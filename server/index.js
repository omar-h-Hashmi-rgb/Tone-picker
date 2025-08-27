import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths for .env file
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), '.env'),
  '.env'
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Loading .env from: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('No .env file found. Trying to load from process.env...');
}

console.log('Environment check:');
console.log('- Current directory:', __dirname);
console.log('- Process CWD:', process.cwd());
console.log('- Checked paths:', envPaths);
console.log('- MISTRAL_API_KEY exists:', !!process.env.MISTRAL_API_KEY);
console.log('- MISTRAL_API_KEY length:', process.env.MISTRAL_API_KEY ? process.env.MISTRAL_API_KEY.length : 0);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache for tone conversions (optional enhancement)
const toneCache = new Map();

// Rate limiting (simple implementation)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

// Helper function to generate tone prompts
function generateTonePrompt(text, toneConfig) {
  const { formality, detail } = toneConfig;
  
  let prompt = `Rewrite the following text to be ${formality} and ${detail}:\n\n"${text}"\n\n`;
  
  if (formality === 'casual' && detail === 'concise') {
    prompt += 'Make it conversational, friendly, and brief. Use simple language and get straight to the point.';
  } else if (formality === 'casual' && detail === 'detailed') {
    prompt += 'Make it conversational and friendly but comprehensive. Use examples and explanations to elaborate on points.';
  } else if (formality === 'formal' && detail === 'concise') {
    prompt += 'Make it professional and succinct. Use proper business language while keeping it brief and direct.';
  } else if (formality === 'formal' && detail === 'detailed') {
    prompt += 'Make it professional and comprehensive. Use formal language with thorough explanations and proper structure.';
  }
  
  prompt += '\n\nRespond only with the rewritten text, no additional commentary.';
  
  return prompt;
}

// Tone adjustment endpoint
app.post('/api/adjust-tone', async (req, res) => {
  try {
    const { text, toneConfig } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Input validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'Text is required and must be a non-empty string.' 
      });
    }

    if (!toneConfig || !toneConfig.formality || !toneConfig.detail) {
      return res.status(400).json({ 
        error: 'Invalid tone configuration', 
        message: 'Tone configuration with formality and detail is required.' 
      });
    }

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Check cache first
    const cacheKey = `${text.substring(0, 100)}-${toneConfig.formality}-${toneConfig.detail}`;
    if (toneCache.has(cacheKey)) {
      console.log('Cache hit for tone adjustment');
      return res.json({ adjustedText: toneCache.get(cacheKey) });
    }

    // Check if Mistral API key is configured
    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured', 
        message: 'Mistral API key is not set up. Please check server configuration.' 
      });
    }

    const prompt = generateTonePrompt(text, toneConfig);

    console.log('Making request to Mistral AI...');
    
    const mistralResponse = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!mistralResponse.data || !mistralResponse.data.choices || !mistralResponse.data.choices[0]) {
      throw new Error('Invalid response format from Mistral AI');
    }

    const adjustedText = mistralResponse.data.choices[0].message.content.trim();
    
    // Cache the result
    toneCache.set(cacheKey, adjustedText);
    
    // Limit cache size (simple LRU-like behavior)
    if (toneCache.size > 1000) {
      const firstKey = toneCache.keys().next().value;
      toneCache.delete(firstKey);
    }

    res.json({ adjustedText });
    
  } catch (error) {
    console.error('Error adjusting tone:', error);

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: 'Request timeout', 
        message: 'The request took too long to process. Please try again.' 
      });
    }

    if (error.response) {
      // Mistral API error
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown API error';
      
      if (status === 401) {
        return res.status(500).json({ 
          error: 'Authentication failed', 
          message: 'Invalid API key configuration.' 
        });
      } else if (status === 429) {
        return res.status(429).json({ 
          error: 'API rate limit exceeded', 
          message: 'Too many requests to the AI service. Please try again in a few minutes.' 
        });
      } else {
        return res.status(500).json({ 
          error: 'AI service error', 
          message: `AI service returned error: ${message}` 
        });
      }
    }

    // Network or other errors
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'An unexpected error occurred. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mistralApiConfigured: !!process.env.MISTRAL_API_KEY
  });
});

// Cache statistics endpoint (for debugging)
app.get('/api/cache-stats', (req, res) => {
  res.json({
    cacheSize: toneCache.size,
    requestCounts: Object.fromEntries(requestCounts.entries())
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Mistral API key configured: ${!!process.env.MISTRAL_API_KEY}`);
});