'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function ProblemStatementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const [problem, setProblem] = useState('');

  const stateColors: { [key: string]: string } = {
    rising: 'bg-emerald-500',
    falling: 'bg-red-500',
    turbulent: 'bg-amber-500',
    stuck: 'bg-slate-500',
    grounded: 'bg-blue-500',
  };

  const handleContinue = () => {
    if (problem.trim()) {
      router.push(`/lens-selection?state=${state}&problem=${encodeURIComponent(problem)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      <div className="max-w-2xl w-full mb-8">
        {state && (
          <div className="flex justify-center mb-6">
            <div className={`${stateColors[state]} text-white px-6 py-2 rounded-full text-sm font-semibold`}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </div>
          </div>
        )}
        <h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center">
          What's on your mind?
        </h1>
        <p className="text-lg text-[#57534e] text-center">
          Describe the situation, challenge, or question you're facing
        </p>
      </div>
      <div className="max-w-2xl w-full mb-8">
        <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="I'm struggling with..." className="w-full h-48 p-6 rounded-2xl bg-white border-2 border-[#e7e5e4] focus:border-[#292524] focus:outline-none resize-none text-lg text-[#1c1917] placeholder-[#a8a29e]" autoFocus />
        <p className="text-sm text-[#78716c] mt-2 text-right">{problem.length} characters</p>
      </div>
      <div className="flex gap-4">
        <button onClick={() => router.back()} className="px-8 py-3 rounded-full text-base font-semibold bg-white border-2 border-[#e7e5e4] text-[#57534e] hover:border-[#292524] hover:text-[#1c1917] transition-all">← Back</button>
        <button onClick={handleContinue} disabled={!problem.trim()} className={`px-12 py-3 rounded-full text-base font-semibold transition-all ${problem.trim() ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg' : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'}`}>Continue →</button>
      </div>
    </div>
  );
}

export default function ProblemStatement() {
  return (<Suspense fallback={<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">Loading...</div>}><ProblemStatementContent /></Suspense>);
}
