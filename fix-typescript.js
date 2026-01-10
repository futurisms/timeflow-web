const fs = require('fs');

const lensPage = `'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

const philosophicalLenses = [
  { id: 'stoicism', name: 'Stoicism', icon: '🏛️', description: 'Focus on what you can control, accept what you cannot', philosopher: 'Marcus Aurelius, Epictetus' },
  { id: 'buddhism', name: 'Buddhism', icon: '☸️', description: 'Understand suffering, cultivate compassion and presence', philosopher: 'Buddha, Thich Nhat Hanh' },
  { id: 'existentialism', name: 'Existentialism', icon: '🎭', description: 'Create meaning through authentic choice and action', philosopher: 'Sartre, Camus' },
  { id: 'taoism', name: 'Taoism', icon: '☯️', description: 'Flow with nature, embrace simplicity and balance', philosopher: 'Lao Tzu, Zhuangzi' },
  { id: 'pragmatism', name: 'Pragmatism', icon: '🔧', description: 'Focus on practical consequences and real-world results', philosopher: 'William James, John Dewey' },
];

function LensSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams?.get('state') || '';
  const problem = searchParams?.get('problem') || '';
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (selectedLens) {
      setIsGenerating(true);
      setTimeout(() => {
        router.push(\`/wisdom-card?state=\${state}&problem=\${problem}&lens=\${selectedLens}\`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      <div className="max-w-3xl w-full mb-8">
        <h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center">Choose your philosophical lens</h1>
        <p className="text-lg text-[#57534e] text-center">Each tradition offers unique wisdom for your situation</p>
      </div>
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {philosophicalLenses.map((lens) => (
          <button key={lens.id} onClick={() => setSelectedLens(lens.id)} className={\`p-6 rounded-2xl text-left transition-all \${selectedLens === lens.id ? 'bg-[#292524] ring-4 ring-offset-4 ring-[#292524] scale-105' : 'bg-white hover:shadow-lg'}\`}>
            <div className="text-4xl mb-3">{lens.icon}</div>
            <h3 className={\`text-xl font-bold mb-2 \${selectedLens === lens.id ? 'text-white' : 'text-[#1c1917]'}\`}>{lens.name}</h3>
            <p className={\`text-sm mb-3 \${selectedLens === lens.id ? 'text-white/90' : 'text-[#57534e]'}\`}>{lens.description}</p>
            <p className={\`text-xs italic \${selectedLens === lens.id ? 'text-white/70' : 'text-[#78716c]'}\`}>{lens.philosopher}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={() => router.back()} disabled={isGenerating} className="px-8 py-3 rounded-full text-base font-semibold bg-white border-2 border-[#e7e5e4] text-[#57534e] hover:border-[#292524] hover:text-[#1c1917] transition-all disabled:opacity-50">← Back</button>
        <button onClick={handleGenerate} disabled={!selectedLens || isGenerating} className={\`px-12 py-3 rounded-full text-base font-semibold transition-all \${selectedLens && !isGenerating ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg' : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'}\`}>{isGenerating ? 'Generating...' : 'Generate Wisdom Card →'}</button>
      </div>
    </div>
  );
}

export default function LensSelection() {
  return <Suspense fallback={<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">Loading...</div>}><LensSelectionContent /></Suspense>;
}
`;

fs.writeFileSync('app/lens-selection/page.tsx', lensPage);
console.log('✓ Fixed TypeScript error in lens-selection');
