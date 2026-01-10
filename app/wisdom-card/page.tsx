'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function WisdomCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wisdom, setWisdom] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const stateColors = {
    rising: 'from-emerald-500 to-emerald-600',
    falling: 'from-red-500 to-red-600',
    turbulent: 'from-amber-500 to-amber-600',
    stuck: 'from-slate-500 to-slate-600',
    grounded: 'from-blue-500 to-blue-600'
  };

  const lensIcons = { stoicism: '🏛️', buddhism: '☸️', existentialism: '🎭', taoism: '☯️', pragmatism: '🔧' };

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch('/api/generate-wisdom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: searchParams.get('state'),
            problem: searchParams.get('problem'),
            lens: searchParams.get('lens')
          })
        });
        const data = await res.json();
        data.error ? setError(data.error) : setWisdom(data.wisdom);
      } catch (e) {
        setError('Failed to generate');
      } finally {
        setIsLoading(false);
      }
    }
    generate();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <div className="w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-[#57534e]">Generating your wisdom card...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => router.back()} className="px-6 py-3 bg-[#292524] text-white rounded-full">Go Back</button>
    </div>
  );

  const state = searchParams.get('state');
  const lens = searchParams.get('lens');

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      <div className="max-w-2xl w-full">
        <div className={`bg-gradient-to-br ${stateColors[state]} rounded-3xl p-8 shadow-2xl text-white mb-8`}>
          <div className="flex justify-between items-start mb-6">
            <div className="text-5xl">{lensIcons[lens]}</div>
            <div className="text-right">
              <div className="text-sm opacity-80 capitalize">{state}</div>
              <div className="text-xs opacity-60 capitalize">{lens}</div>
            </div>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{wisdom}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/')} className="px-8 py-3 bg-white border-2 border-[#e7e5e4] text-[#57534e] rounded-full hover:border-[#292524]">Create Another</button>
          <button onClick={() => alert('Save feature coming soon!')} className="px-8 py-3 bg-[#292524] text-white rounded-full hover:bg-[#1c1917]">Save Card</button>
        </div>
      </div>
    </div>
  );
}

export default function WisdomCard() {
  return <Suspense><WisdomCardContent /></Suspense>;
}
