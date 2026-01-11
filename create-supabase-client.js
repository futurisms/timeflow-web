const fs = require('fs');
const path = require('path');

const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

fs.writeFileSync(path.join('lib', 'supabase.ts'), supabaseClient);
console.log('✓ Created lib/supabase.ts');
