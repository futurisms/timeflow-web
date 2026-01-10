const fs = require('fs');

const content = fs.readFileSync('app/wisdom-card/page.tsx', 'utf8');
const fixed = content.replace(
  'const [error, setError] = useState(null);',
  'const [error, setError] = useState<string | null>(null);'
);

fs.writeFileSync('app/wisdom-card/page.tsx', fixed);
console.log('✓ Fixed TypeScript error in wisdom-card');
