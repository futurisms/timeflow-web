'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const timeflowStates = [
  {
    id: 'rising',
    name: 'Rising',
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    description: 'Energy increasing, momentum building',
  },
  {
    id: 'falling',
    name: 'Falling',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    description: 'Energy decreasing, feeling depleted',
  },
  {
    id: 'turbulent',
    name: 'Turbulent',
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    description: 'Chaotic, unsettled, reactive',
  },
  {
    id: 'stuck',
    name: 'Stuck',
    color: 'bg-slate-500',
    hoverColor: 'hover:bg-slate-600',
    description: 'Trapped, unable to move forward',
  },
  {
    id: 'grounded',
    name: 'Grounded',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    description: 'Centered, stable, present',
  },
];

export default function StateSelection() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedState) {
      router.push(`/problem-statement?state=${selectedState}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      {/* Header */}
      <div className="max-w-2xl w-full mb-12">
        <h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center">
          How are you feeling right now?
        </h1>
        <p className="text-lg text-[#57534e] text-center">
          Choose the state that best describes your current inner experience
        </p>
      </div>

      {/* State Cards */}
      <div className="max-w-2xl w-full space-y-4 mb-12">
        {timeflowStates.map((state) => (
          <button
            key={state.id}
            onClick={() => setSelectedState(state.id)}
            className={`w-full p-6 rounded-2xl transition-all ${
              selectedState === state.id
                ? `${state.color} ring-4 ring-offset-4 ring-[#292524] scale-105`
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    selectedState === state.id ? 'text-white' : 'text-[#1c1917]'
                  }`}
                >
                  {state.name}
                </h3>
                <p
                  className={`text-base ${
                    selectedState === state.id ? 'text-white/90' : 'text-[#57534e]'
                  }`}
                >
                  {state.description}
                </p>
              </div>
              {selectedState === state.id && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#292524]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedState}
        className={`px-12 py-4 rounded-full text-lg font-semibold transition-all ${
          selectedState
            ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg'
            : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'
        }`}
      >
        Continue
      </button>

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="mt-6 text-[#57534e] hover:text-[#1c1917] transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  );
}