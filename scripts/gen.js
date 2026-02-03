const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration - supports both proxy and direct API
const CONFIG = {
  // Option 1: Direct Google AI API (if GEMINI_API_KEY is set)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_API_URL: 'generativelanguage.googleapis.com',

  // Option 2: Local proxy (antigravity-claude-proxy)
  PROXY_HOST: process.env.PROXY_HOST || 'localhost',
  PROXY_PORT: process.env.PROXY_PORT || 8080,

  // Model - gemini-3-pro-image is Google's latest image generation model (2026)
  MODEL: process.env.GEMINI_MODEL || 'gemini-3-pro-image'
};

// Parse arguments
const args = process.argv.slice(2);
let prompt = args.join(' ');
let outputDir = process.cwd();

// Handle flags
if (args[0] === '--output' || args[0] === '-o') {
  outputDir = args[1];
  prompt = args.slice(2).join(' ');
}

if (!prompt) {
  console.error('Usage: node gen.js [--output DIR] "Your image prompt"');
  console.error('');
  console.error('Environment variables:');
  console.error('  GEMINI_API_KEY   - Your Google AI Studio API key (for direct API)');
  console.error('  PROXY_HOST       - Proxy hostname (default: localhost)');
  console.error('  PROXY_PORT       - Proxy port (default: 8080)');
  console.error('  GEMINI_MODEL     - Model to use (default: gemini-2.0-flash-exp)');
  process.exit(1);
}

// Generate filename from prompt
const filename = prompt
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .substring(0, 40)
  .replace(/-+$/, '');

// Determine which mode to use
const useDirectAPI = !!CONFIG.GEMINI_API_KEY;

console.log('🎨 Generating image...');
console.log(`📝 Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
console.log(`🔧 Mode: ${useDirectAPI ? 'Direct Google AI API' : 'Proxy at ' + CONFIG.PROXY_HOST + ':' + CONFIG.PROXY_PORT}`);

if (useDirectAPI) {
  // Direct Google AI API call
  generateWithDirectAPI(prompt);
} else {
  // Proxy mode (Anthropic format)
  generateWithProxy(prompt);
}

// ============ Direct Google AI API ============
function generateWithDirectAPI(prompt) {
  const requestBody = JSON.stringify({
    contents: [{
      parts: [{ text: `Generate an image: ${prompt}` }]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  });

  const options = {
    hostname: CONFIG.GEMINI_API_URL,
    port: 443,
    path: `/v1beta/models/${CONFIG.MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => handleGoogleResponse(body));
  });

  req.on('error', handleError);
  req.write(requestBody);
  req.end();
}

function handleGoogleResponse(body) {
  try {
    const response = JSON.parse(body);

    if (response.error) {
      console.error('❌ API Error:', response.error.message);
      process.exit(1);
    }

    // Extract image from Google's response format
    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const ext = part.inlineData.mimeType.includes('png') ? 'png' : 'jpg';
          const filepath = path.join(outputDir, `${filename}.${ext}`);
          fs.writeFileSync(filepath, Buffer.from(part.inlineData.data, 'base64'));

          const sizeKB = Math.round(part.inlineData.data.length * 0.75 / 1024);
          console.log(`✅ Saved: ${filepath} (${sizeKB}KB)`);

          console.log(JSON.stringify({ success: true, file: filepath, prompt }, null, 2));
          return;
        }
      }
    }

    console.error('❌ No image in response');
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    process.exit(1);

  } catch (e) {
    console.error('❌ Parse error:', e.message);
    process.exit(1);
  }
}

// ============ Proxy Mode (Anthropic Format) ============
function generateWithProxy(prompt) {
  const data = JSON.stringify({
    model: CONFIG.MODEL,
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `Generate an image: ${prompt}`
    }]
  });

  const options = {
    hostname: CONFIG.PROXY_HOST,
    port: CONFIG.PROXY_PORT,
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'test',
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => handleProxyResponse(body));
  });

  req.on('error', handleError);
  req.write(data);
  req.end();
}

function handleProxyResponse(body) {
  try {
    const response = JSON.parse(body);

    if (response.error) {
      console.error('❌ API Error:', response.error.message || response.error);
      process.exit(1);
    }

    for (const block of response.content || []) {
      if (block.type === 'image' && block.source?.data) {
        const ext = block.source.media_type?.includes('png') ? 'png' : 'jpg';
        const filepath = path.join(outputDir, `${filename}.${ext}`);
        fs.writeFileSync(filepath, Buffer.from(block.source.data, 'base64'));

        const sizeKB = Math.round(block.source.data.length * 0.75 / 1024);
        console.log(`✅ Saved: ${filepath} (${sizeKB}KB)`);

        console.log(JSON.stringify({ success: true, file: filepath, prompt }, null, 2));
        return;
      }
    }

    console.error('❌ No image in response');
    if (response.content?.[0]?.text) {
      console.log('Response text:', response.content[0].text);
    }
    process.exit(1);

  } catch (e) {
    console.error('❌ Parse error:', e.message);
    console.error('Raw response:', body.substring(0, 500));
    process.exit(1);
  }
}

// ============ Error Handler ============
function handleError(e) {
  console.error('❌ Connection error:', e.message);

  if (useDirectAPI) {
    console.error('Check your GEMINI_API_KEY is valid');
  } else {
    console.error('Is the proxy running at ' + CONFIG.PROXY_HOST + ':' + CONFIG.PROXY_PORT + '?');
    console.error('');
    console.error('Options:');
    console.error('1. Start the proxy: cd antigravity-claude-proxy && npm start');
    console.error('2. Use direct API: export GEMINI_API_KEY=your_key_here');
  }
  process.exit(1);
}
