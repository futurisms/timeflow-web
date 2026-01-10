const fs = require('fs');

const apiRoute = `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { state, problem, lens } = await request.json();
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
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
      return NextResponse.json({ error: \`Claude API error: \${errorData.error?.message}\` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ wisdom: data.content[0].text });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
`;

fs.writeFileSync('app/api/generate-wisdom/route.ts', apiRoute);
console.log('✓ Fixed model name to claude-3-5-sonnet-20241022');
