const fs = require('fs');

let content = fs.readFileSync('pages/api/generate-wisdom.js', 'utf8');
content = content.replace(/claude-3-5-sonnet-\d+/g, 'claude-sonnet-4-5-20250929');
fs.writeFileSync('pages/api/generate-wisdom.js', content);

console.log('✓ Updated to correct model: claude-sonnet-4-5-20250929');
