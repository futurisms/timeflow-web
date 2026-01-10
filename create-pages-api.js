const fs = require('fs');
const path = require('path');

// Create pages/api directory
const pagesApiDir = path.join('pages', 'api');
if (!fs.existsSync(pagesApiDir)) {
  fs.mkdirSync(pagesApiDir, { recursive: true });
}

// Create the API route in pages/api (Next.js Pages Router style)
const apiRoute = `export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { state, problem, lens } = req.body;
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = \`You are a wise philosophical guide. A person is experiencing a "\${state}" state and shared: "\${problem}". Provide guidance through the lens of \${lens}. Structure your response as: 1) A brief reflection (2-3 sentences), 2) Key insight (1 sentence), 3) Practical action (1 sentence). Keep total under 150 words. Be warm, clear, and actionable.\`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: \`Claude API error: \${errorData.error?.message}\` });
    }

    const data = await response.json();
    return res.status(200).json({ wisdom: data.content[0].text });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
`;

fs.writeFileSync(path.join(pagesApiDir, 'generate-wisdom.js'), apiRoute);
console.log('✓ Created pages/api/generate-wisdom.js');
console.log('✓ This uses Pages Router which is more reliable');
