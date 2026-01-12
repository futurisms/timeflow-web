'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface UserStats {
  cards_saved: number;
  cards_created: number;
}

interface UserProfile {
  email: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      setProfile({
        email: user.email || '',
        created_at: user.created_at || '',
      });

      // Load user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('cards_saved, cards_created')
        .eq('user_id', user.id)
        .single();

      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setDeleting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete all user's cards
      await supabase
        .from('wisdom_cards')
        .delete()
        .eq('user_id', user.id);

      // Delete user stats
      await supabase
        .from('user_stats')
        .delete()
        .eq('user_id', user.id);

      // Sign out (Supabase doesn't allow deleting own account via client)
      await supabase.auth.signOut();
      
      alert('Account data deleted. Please contact support to fully delete your account.');
      router.push('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#57534e]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="bg-white border-b border-[#e7e5e4] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-[#1c1917]">Timeflow</h1>
            <nav className="hidden sm:flex gap-6">
              <Link href="/" className="text-[#57534e] hover:text-[#292524] transition-colors">
                Home
              </Link>
              <Link href="/my-cards" className="text-[#57534e] hover:text-[#292524] transition-colors">
                My Cards
              </Link>
              <Link href="/profile" className="text-[#292524] font-semibold">
                Profile
              </Link>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#1c1917] mb-2">My Profile</h2>
          <p className="text-[#57534e]">Manage your account settings and view your stats</p>
        </div>

        {/* Mobile App Teaser Banner - Shows after 5 cards */}
        {stats && stats.cards_created >= 5 && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl shadow-xl p-8 mb-6 text-white">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  You've created {stats.cards_created} wisdom cards!
                </h3>
                <p className="text-purple-100 text-lg mb-4">
                  Loving Timeflow? Our mobile app is coming soon with unlimited cards, 
                  offline access, and more features designed for iOS & Android.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    📱 iOS & Android
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    ♾️ Unlimited Cards
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    ⚡ Offline Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {/* Account Information */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#1c1917] mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1">Email</label>
                <p className="text-lg text-[#1c1917]">{profile?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#57534e] mb-1">Member Since</label>
                <p className="text-lg text-[#1c1917]">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#e7e5e4]">
              <Link
                href="/auth/forgot-password"
                className="text-[#292524] font-semibold hover:underline"
              >
                Change Password →
              </Link>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#1c1917] mb-6">Your Stats</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {stats?.cards_saved || 0}
                </div>
                <div className="text-sm text-[#57534e]">Cards Saved</div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats?.cards_created || 0}
                </div>
                <div className="text-sm text-[#57534e]">Cards Created</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#1c1917] mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <Link
                href="/my-cards"
                className="block w-full bg-[#292524] text-white py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all text-center"
              >
                View My Cards
              </Link>

              <Link
                href="/state-selection"
                className="block w-full bg-white border-2 border-[#292524] text-[#292524] py-4 rounded-full font-semibold hover:bg-[#faf9f7] transition-all text-center"
              >
                Create New Card
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border-2 border-red-200 rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-[#57534e] mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-semibold">
                  Are you absolutely sure? This will delete all your wisdom cards.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white border-2 border-[#e7e5e4] text-[#292524] px-6 py-3 rounded-full font-semibold hover:bg-[#faf9f7] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
