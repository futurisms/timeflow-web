'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const stateInfo = {
  rising: { emoji: '📈', color: 'emerald', gradient: 'from-emerald-400 to-emerald-600' },
  falling: { emoji: '📉', color: 'red', gradient: 'from-red-400 to-red-600' },
  turbulent: { emoji: '🌪️', color: 'amber', gradient: 'from-amber-400 to-amber-600' },
  stuck: { emoji: '🔒', color: 'slate', gradient: 'from-slate-400 to-slate-600' },
  grounded: { emoji: '⚓', color: 'blue', gradient: 'from-blue-400 to-blue-600' },
};

function ProblemInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams?.get('state') || '';
  
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stateData = stateInfo[state as keyof typeof stateInfo];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        router.push(`/lens-selection?state=${state}&problem=${encodeURIComponent(problem)}`);
      }, 300);
    }
  };

  if (!state || !stateData) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-8">
        <div className="text-center">
          <p className="text-[#57534e] text-lg">Invalid state. Please start again.</p>
          <button
            onClick={() => router.push('/state-selection')}
            className="mt-4 bg-[#292524] text-white px-6 py-3 rounded-full"
          >
            Back to State Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-8 py-16">
        {/* State Badge */}
        <div 
          className="flex items-center justify-center gap-3 mb-8"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          <span className="text-4xl">{stateData.emoji}</span>
          <div className={`px-6 py-2 bg-gradient-to-r ${stateData.gradient} text-white rounded-full font-semibold capitalize`}>
            State: {state}
          </div>
        </div>

        {/* Title */}
        <div 
          className="text-center mb-12"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
        >
          <h2 
            className="text-5xl font-bold text-stone-900 mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            What's your situation?
          </h2>
          <p className="text-xl text-stone-600">
            Describe what you're experiencing right now
          </p>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit}
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <label className="block text-sm font-medium text-stone-900 mb-3">
              Tell us about your situation
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., I feel stuck in my career and unsure about my next step..."
              className="w-full h-40 px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 resize-none transition-all"
              required
              disabled={isSubmitting}
            />
            <p className="text-sm text-stone-500 mt-2">
              Be as specific as you like. This helps us provide more relevant guidance.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/state-selection')}
              disabled={isSubmitting}
              className="flex-1 bg-white border-2 border-stone-200 text-stone-900 py-4 rounded-full font-semibold hover:bg-stone-50 transition-all disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !problem.trim()}
              className="flex-1 bg-[#292524] text-white py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Continue...' : 'Continue'}
            </button>
          </div>
        </form>

        {/* Info Card */}
        <div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 text-center mt-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          <p className="text-stone-700">
            💡 Next, you'll choose a philosophical lens to guide your wisdom
          </p>
        </div>
      </main>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function ProblemInputPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#57534e]">Loading...</p>
        </div>
      </div>
    }>
      <ProblemInputContent />
    </Suspense>
  );
}
