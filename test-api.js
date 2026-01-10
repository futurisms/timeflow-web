// Test Claude API directly
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.ANTHROPIC_API_KEY;

console.log('API Key exists:', !!apiKey);
console.log('API Key length:', apiKey?.length);
console.log('API Key starts with sk-ant:', apiKey?.startsWith('sk-ant'));
console.log('First 20 chars:', apiKey?.substring(0, 20));

async function test() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say hello in 5 words' }]
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('SUCCESS! Claude responded:', data.content[0].text);
    } else {
      console.log('ERROR from Claude:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('FETCH ERROR:', error.message);
  }
}

test();
