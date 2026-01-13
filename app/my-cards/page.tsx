'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShareCardButton } from '../components/ShareCardButton';
import Link from 'next/link';

const stateColors = {
  rising: 'from-emerald-500 to-emerald-600',
  falling: 'from-red-500 to-red-600',
  turbulent: 'from-amber-500 to-amber-600',
  stuck: 'from-slate-500 to-slate-600',
  grounded: 'from-blue-500 to-blue-600',
};

const lensIcons = {
  stoicism: '🏛️',
  buddhism: '☸️',
  existentialism: '🎭',
  taoism: '☯️',
  pragmatism: '🔧',
};

interface WisdomCard {
  id: number;
  created_at: string;
  state: string;
  problem: string;
  lens: string;
  wisdom: string;
}

interface UserStats {
  cards_saved: number;
  cards_created: number;
}

export default function MyCardsAnimated() {
  const router = useRouter();
  const [cards, setCards] = useState<WisdomCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    checkAuthAndLoadCards();
  }, []);

  // Check for pending card and redirect to save it
  useEffect(() => {
    const pendingCard = localStorage.getItem('pendingCard');
    if (pendingCard) {
      try {
        const cardData = JSON.parse(pendingCard);
        // Redirect back to wisdom card page to save it
        router.push(`/wisdom-card?state=${cardData.state}&problem=${encodeURIComponent(cardData.problem)}&lens=${cardData.lens}`);
      } catch (e) {
        console.error('Failed to parse pending card:', e);
        localStorage.removeItem('pendingCard');
      }
    }
  }, []);

  const checkAuthAndLoadCards = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      await Promise.all([loadCards(), loadUserStats()]);
      
      // Trigger card entrance animations
      setTimeout(() => setCardsVisible(true), 100);
    } catch (err) {
      console.error('Error checking auth:', err);
      setError('Failed to load cards');
      setLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('wisdom_cards')
        .select('*')
        .order('created_at', { ascending: sortBy === 'oldest' });

      if (fetchError) throw fetchError;

      setCards(data || []);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('cards_saved, cards_created')
        .eq('user_id', user.id)
        .single();

      // If no stats exist yet, that's okay - user just signed up
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading stats:', error);
        return;
      }

      // Set stats or use defaults
      setUserStats(data || { cards_saved: 0, cards_created: 0 });
    } catch (err) {
      console.error('Error loading stats:', err);
      // Set default stats if error
      setUserStats({ cards_saved: 0, cards_created: 0 });
    }
  };

  useEffect(() => {
    loadCards();
  }, [sortBy]);

  const handleDelete = async (cardId: number) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      setDeletingId(cardId);
      setError('');

      const { error: deleteError } = await supabase
        .from('wisdom_cards')
        .delete()
        .eq('id', cardId);

      if (deleteError) throw deleteError;

      setCards(cards.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCards = cards.filter(card => {
    if (filter === 'all') return true;
    return card.state === filter || card.lens === filter;
  });

  const uniqueStates = [...new Set(cards.map(card => card.state))];
  const uniqueLenses = [...new Set(cards.map(card => card.lens))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-8">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#57534e] text-lg">Loading your wisdom cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div 
          className="mb-8"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          <h2 className="text-4xl font-bold text-[#1c1917] mb-2">My Wisdom Cards</h2>
          <div className="flex items-center gap-6 text-[#57534e]">
            <p>
              {cards.length === 0 
                ? "You haven't saved any cards yet"
                : `${cards.length} ${cards.length === 1 ? 'card' : 'cards'} saved`}
            </p>
            {userStats && (
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  💾 {userStats.cards_saved} saved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile App Teaser - Subtle version for My Cards */}
        {userStats && userStats.cards_saved >= 5 && (
          <div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 mb-6"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📱</div>
              <div className="flex-1">
                <p className="text-indigo-900 font-semibold">
                  Mobile app coming soon! Unlimited cards, offline access, and more.
                </p>
              </div>
              <Link
                href="/profile"
                className="text-indigo-600 font-semibold hover:underline whitespace-nowrap"
              >
                Learn More →
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {cards.length === 0 ? (
          <div 
            className="text-center py-20"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
          >
            <div className="text-6xl mb-6">🌊</div>
            <h3 className="text-2xl font-bold text-[#1c1917] mb-4">No cards yet</h3>
            <p className="text-lg text-[#57534e] mb-8 max-w-md mx-auto">
              Create your first wisdom card to start your Timeflow journey
            </p>
            <Link
              href="/state-selection"
              className="inline-block bg-[#292524] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all shadow-lg"
            >
              Create Your First Card
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div 
              className="grid sm:grid-cols-2 gap-4 mb-8"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
            >
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-2">
                  Filter by
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#e7e5e4] rounded-xl focus:outline-none focus:border-[#292524] transition-all"
                >
                  <option value="all">All Cards</option>
                  <optgroup label="States">
                    {uniqueStates.map(state => (
                      <option key={state} value={state} className="capitalize">
                        {state}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Lenses">
                    {uniqueLenses.map(lens => (
                      <option key={lens} value={lens} className="capitalize">
                        {lens}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="w-full px-4 py-3 bg-white border-2 border-[#e7e5e4] rounded-xl focus:outline-none focus:border-[#292524] transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`
                    bg-gradient-to-br ${stateColors[card.state as keyof typeof stateColors] || 'from-gray-500 to-gray-600'}
                    rounded-3xl shadow-xl p-6 text-white transition-all duration-300
                    ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    hover:scale-105 hover:shadow-2xl
                  `}
                  style={{
                    animation: cardsVisible ? `fadeInUp 0.6s ease-out ${0.5 + index * 0.1}s both` : 'none',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">
                        {lensIcons[card.lens as keyof typeof lensIcons]}
                      </span>
                      <div className="text-sm">
                        <p className="opacity-90 capitalize font-semibold">{card.lens}</p>
                        <p className="opacity-75 capitalize text-xs">State: {card.state}</p>
                      </div>
                    </div>
                    <p className="text-xs opacity-75">
                      {new Date(card.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Wisdom Preview */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <p className="text-sm line-clamp-4 leading-relaxed">
                      {card.wisdom}
                    </p>
                  </div>

                  {/* Problem */}
                  <div className="mb-4 pb-4 border-b border-white/20">
                    <p className="text-xs opacity-75 mb-1">Your situation:</p>
                    <p className="text-sm opacity-90 italic line-clamp-2">"{card.problem}"</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <ShareCardButton 
                      cardId={card.id}
                      state={card.state}
                      problem={card.problem}
                      lens={card.lens}
                      wisdom={card.wisdom}
                      createdAt={card.created_at}
                    />
                    <button
                      onClick={() => handleDelete(card.id)}
                      disabled={deletingId === card.id}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deletingId === card.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Card Button */}
            <div 
              className="text-center"
              style={{ animation: `fadeInUp 0.6s ease-out ${0.5 + filteredCards.length * 0.1 + 0.2}s both` }}
            >
              <Link
                href="/state-selection"
                className="inline-flex items-center gap-2 bg-[#292524] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Card
              </Link>
            </div>
          </>
        )}
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
