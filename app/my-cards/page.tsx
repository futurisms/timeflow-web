'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

export default function MyCards() {
  const router = useRouter();
  const [cards, setCards] = useState<WisdomCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    checkAuthAndLoadCards();
  }, []);

  const checkAuthAndLoadCards = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      await Promise.all([loadCards(), loadUserStats()]);
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
      setError('Failed to load your cards');
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

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading stats:', error);
      } else {
        setUserStats(data);
      }
    } catch (err) {
      console.error('Error loading user stats:', err);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      setDeletingId(cardId);
      
      const { error: deleteError } = await supabase
        .from('wisdom_cards')
        .delete()
        .eq('id', cardId);

      if (deleteError) throw deleteError;

      setCards(cards.filter(card => card.id !== cardId));
      await loadUserStats();
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
      <header className="bg-white border-b border-[#e7e5e4] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-[#1c1917]">Timeflow</h1>
            <nav className="hidden sm:flex gap-6">
              <a href="/" className="text-[#57534e] hover:text-[#292524] transition-colors">
                Home
              </a>
              <a href="/my-cards" className="text-[#292524] font-semibold">
                My Cards
              </a>
              <a href="/profile" className="text-[#57534e] hover:text-[#292524] transition-colors">
                Profile
              </a>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#57534e] hover:text-[#292524] transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
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

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {cards.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#1c1917] mb-2">
                Filter by
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524] bg-white"
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

            <div className="flex-1">
              <label className="block text-sm font-medium text-[#1c1917] mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'newest' | 'oldest');
                  loadCards();
                }}
                className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524] bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        )}

        {filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-[#1c1917] mb-2">
              {filter === 'all' ? 'No cards yet' : 'No cards match your filter'}
            </h3>
            <p className="text-[#57534e] mb-8">
              {filter === 'all' 
                ? 'Start your journey by creating your first wisdom card'
                : 'Try adjusting your filters to see more cards'}
            </p>
            {filter === 'all' ? (
              <button
                onClick={() => router.push('/state-selection')}
                className="bg-[#292524] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
              >
                Create Your First Card
              </button>
            ) : (
              <button
                onClick={() => setFilter('all')}
                className="bg-[#292524] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
              >
                Show All Cards
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`bg-gradient-to-br ${stateColors[card.state as keyof typeof stateColors] || 'from-gray-500 to-gray-600'} rounded-2xl shadow-lg p-6 text-white relative group hover:shadow-2xl transition-all`}
              >
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    disabled={deletingId === card.id}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                    title="Delete card"
                  >
                    {deletingId === card.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{lensIcons[card.lens as keyof typeof lensIcons]}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold capitalize">{card.lens}</p>
                    <p className="text-xs opacity-75 capitalize">State: {card.state}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                  <p className="text-sm leading-relaxed line-clamp-6">
                    {card.wisdom}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs opacity-75 mb-1">Your situation:</p>
                  <p className="text-sm italic line-clamp-2">"{card.problem}"</p>
                </div>

                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>
                    {new Date(card.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {cards.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/state-selection')}
              className="bg-[#292524] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Card
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
