'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STATES = [
  { id: 'rising', name: 'Rising', emoji: '⬆️', gradient: 'from-green-400 to-emerald-500', description: 'Energized, growing, expanding' },
  { id: 'falling', name: 'Falling', emoji: '⬇️', gradient: 'from-red-400 to-rose-500', description: 'Declining, contracting, diminishing' },
  { id: 'turbulent', name: 'Turbulent', emoji: '🌪️', gradient: 'from-orange-400 to-amber-500', description: 'Chaotic, unstable, unpredictable' },
  { id: 'stuck', name: 'Stuck', emoji: '⏸️', gradient: 'from-gray-400 to-slate-500', description: 'Stagnant, blocked, immobile' },
  { id: 'grounded', name: 'Grounded', emoji: '🏔️', gradient: 'from-blue-400 to-indigo-500', description: 'Stable, centered, balanced' },
];

const MAX_CARDS = 5;

export default function StateSelectionPage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cardsCreated, setCardsCreated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndCards();
  }, []);

  const checkUserAndCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in - allow creation but they'll need to login to save
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Check how many cards they've created
      const { data: stats } = await supabase
        .from('user_stats')
        .select('cards_created')
        .eq('user_id', user.id)
        .single();

      const created = stats?.cards_created || 0;
      setCardsCreated(created);

      // If they've hit the limit, redirect to waitlist
      if (created >= MAX_CARDS) {
        router.push('/mobile-waitlist');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking cards:', error);
      setLoading(false);
    }
  };

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId);
    // Auto-advance after selection
    setTimeout(() => {
      router.push(`/problem-input?state=${stateId}`);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const remainingCards = userId ? MAX_CARDS - cardsCreated : MAX_CARDS;

  return (
    <div className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Card Limit */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#292524] mb-4">
            How does your energy feel?
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choose the state that best describes your current flow
          </p>
          
          {/* Card Limit Badge */}
          {userId ? (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              remainingCards <= 2 ? 'bg-red-100 text-red-800' : 
              remainingCards <= 3 ? 'bg-orange-100 text-orange-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              <span className="font-semibold">{cardsCreated}/{MAX_CARDS} cards created</span>
              {remainingCards > 0 && (
                <span className="text-sm">• {remainingCards} remaining</span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800">
              <span className="text-sm">💡 Free tier: Create up to {MAX_CARDS} cards</span>
            </div>
          )}

          {remainingCards <= 2 && remainingCards > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              💫 Almost at your limit! Want unlimited cards? Mobile app coming soon.
            </p>
          )}
        </div>

        {/* State Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {STATES.map((state) => (
            <button
              key={state.id}
              onClick={() => handleStateSelect(state.id)}
              disabled={selectedState !== null}
              className={`group relative p-8 rounded-3xl text-left transition-all duration-300 ${
                selectedState === state.id
                  ? 'scale-105 shadow-2xl'
                  : selectedState === null
                  ? 'hover:scale-105 hover:shadow-xl'
                  : 'opacity-50'
              } bg-gradient-to-br ${state.gradient} text-white disabled:cursor-not-allowed`}
            >
              {/* Loading Overlay */}
              {selectedState === state.id && (
                <div className="absolute inset-0 bg-white/20 rounded-3xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
              )}

              <div className="text-5xl mb-4">{state.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{state.name}</h3>
              <p className="text-white/90">{state.description}</p>

              <div className="mt-4 flex items-center text-white/80 text-sm">
                <span>Select →</span>
              </div>
            </button>
          ))}
        </div>

        {/* Info Card - Only show if not logged in */}
        {!userId && (
          <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Note: Free Tier Limit
            </h3>
            <p className="text-gray-600 text-sm">
              You can create up to {MAX_CARDS} wisdom cards. To save your cards permanently, you'll need to create an account. 
              Want unlimited cards? Join the waitlist for our mobile app!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
