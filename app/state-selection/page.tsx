'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const states = [
  {
    id: 'rising',
    name: 'Rising',
    emoji: '📈',
    description: 'Moving toward clarity and purpose',
    gradient: 'from-emerald-400 to-emerald-600',
    color: 'emerald',
  },
  {
    id: 'falling',
    name: 'Falling',
    emoji: '📉',
    description: 'Experiencing decline or loss',
    gradient: 'from-red-400 to-red-600',
    color: 'red',
  },
  {
    id: 'turbulent',
    name: 'Turbulent',
    emoji: '🌪️',
    description: 'Caught in chaos and uncertainty',
    gradient: 'from-amber-400 to-amber-600',
    color: 'amber',
  },
  {
    id: 'stuck',
    name: 'Stuck',
    emoji: '🔒',
    description: 'Trapped in patterns or inertia',
    gradient: 'from-slate-400 to-slate-600',
    color: 'slate',
  },
  {
    id: 'grounded',
    name: 'Grounded',
    emoji: '⚓',
    description: 'Centered and at peace',
    gradient: 'from-blue-400 to-blue-600',
    color: 'blue',
  },
];

export default function StateSelectionAnimated() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId);
    // Add a small delay for animation before navigating
    setTimeout(() => {
      router.push(`/problem-input?state=${stateId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold text-stone-900">Timeflow</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Title Section with Animation */}
        <div 
          className="text-center mb-16"
          style={{
            animation: 'fadeInUp 0.8s ease-out',
          }}
        >
          <h2 
            className="text-5xl font-bold text-stone-900 mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Where are you right now?
          </h2>
          <p className="text-xl text-stone-600">
            Select the state that best describes your current energy
          </p>
        </div>

        {/* State Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {states.map((state, index) => (
            <button
              key={state.id}
              onClick={() => handleStateSelect(state.id)}
              onMouseEnter={() => setHoveredState(state.id)}
              onMouseLeave={() => setHoveredState(null)}
              disabled={selectedState !== null}
              className={`
                group relative bg-white rounded-3xl p-8 
                border-2 transition-all duration-300
                ${selectedState === state.id 
                  ? 'border-stone-900 shadow-2xl scale-105' 
                  : selectedState 
                    ? 'opacity-50 cursor-not-allowed'
                    : 'border-stone-200 hover:border-stone-900 hover:shadow-xl hover:scale-105'
                }
              `}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Gradient Background on Hover */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl bg-gradient-to-br ${state.gradient}
                  opacity-0 transition-opacity duration-300
                  ${hoveredState === state.id ? 'opacity-10' : ''}
                `}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Emoji with Animation */}
                <div 
                  className={`
                    text-6xl mb-4 transition-transform duration-300
                    ${hoveredState === state.id ? 'scale-110 rotate-6' : ''}
                  `}
                >
                  {state.emoji}
                </div>

                {/* State Name */}
                <h3 className="text-2xl font-bold text-stone-900 mb-2">
                  {state.name}
                </h3>

                {/* Description */}
                <p className="text-stone-600">
                  {state.description}
                </p>

                {/* Selection Indicator */}
                {selectedState === state.id && (
                  <div 
                    className="absolute top-4 right-4"
                    style={{ animation: 'scaleIn 0.3s ease-out' }}
                  >
                    <svg 
                      className="w-8 h-8 text-emerald-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Animated Border on Hover */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl border-2 border-transparent
                  transition-all duration-300
                  ${hoveredState === state.id ? `border-${state.color}-500` : ''}
                `}
              />
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.6s both',
          }}
        >
          <p className="text-stone-700 text-lg">
            💡 <strong>Not sure?</strong> Choose the state that resonates most with how you feel right now. 
            There's no wrong answer.
          </p>
        </div>
      </main>

      {/* Keyframe Animations */}
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Add subtle floating animation on hover */
        button:hover .emoji {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
