'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const MAX_CARDS = 5;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ cards_created: 0, cards_saved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser(authUser);

      // Load stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (userStats) {
        setStats({
          cards_created: userStats.cards_created || 0,
          cards_saved: userStats.cards_saved || 0,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
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

  const remainingCards = MAX_CARDS - stats.cards_created;
  const isAtLimit = stats.cards_created >= MAX_CARDS;

  return (
    <div className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#292524] mb-8 text-center">
          Your Profile
        </h1>

        {/* Card Limit Status - Prominent Display */}
        <div className={`mb-8 rounded-3xl p-8 text-center ${
          isAtLimit 
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200' 
            : remainingCards <= 2
            ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'
        }`}>
          <div className="text-5xl mb-4">
            {isAtLimit ? '🚫' : remainingCards <= 2 ? '⚠️' : '✨'}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {stats.cards_created}/{MAX_CARDS} Cards Created
          </h2>
          
          {isAtLimit ? (
            <>
              <p className="text-lg text-red-800 mb-6">
                You've reached your limit
              </p>
              <button
                onClick={() => router.push('/mobile-waitlist')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
              >
                Join Waitlist for Unlimited Cards
              </button>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2">
                {remainingCards} card{remainingCards !== 1 ? 's' : ''} remaining
              </p>
              {remainingCards <= 2 && (
                <p className="text-sm text-gray-600 mb-4">
                  💫 Almost at your limit! Want unlimited? Mobile app coming soon.
                </p>
              )}
              <button
                onClick={() => router.push('/state-selection')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Create New Card
              </button>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Member Since</label>
              <p className="text-gray-900">
                {new Date(user?.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{stats.cards_created}</div>
              <div className="text-sm text-gray-600 mt-1">Cards Created</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{stats.cards_saved}</div>
              <div className="text-sm text-gray-600 mt-1">Cards Saved</div>
            </div>
          </div>
        </div>

        {/* Mobile App Promo */}
        {!isAtLimit && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📱 Mobile App Coming Soon
            </h3>
            <p className="text-gray-700 mb-4 text-sm">
              Get unlimited cards, AI-generated images, offline access, and more!
            </p>
            <button
              onClick={() => router.push('/mobile-waitlist')}
              className="text-purple-700 font-semibold text-sm hover:underline"
            >
              Learn More →
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/my-cards')}
            className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all"
          >
            View My Cards
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
