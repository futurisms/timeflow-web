'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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

export default function WisdomCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [wisdom, setWisdom] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const state = searchParams?.get('state') || '';
  const problem = searchParams?.get('problem') || '';
  const lens = searchParams?.get('lens') || '';

  useEffect(() => {
    checkAuthAndGenerate();
  }, []);

  const checkAuthAndGenerate = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
    
    // Generate wisdom regardless of login status
    await generateWisdom();
  };

  const generateWisdom = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/generate-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, problem, lens })
      });

      if (!response.ok) {
        throw new Error('Failed to generate wisdom');
      }

      const data = await response.json();
      setWisdom(data.wisdom);
    } catch (err) {
      console.error('Error generating wisdom:', err);
      setError('Failed to generate wisdom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCard = async () => {
    if (!isLoggedIn) {
      // Store card data in sessionStorage
      sessionStorage.setItem('pendingCard', JSON.stringify({
        state,
        problem,
        lens,
        wisdom
      }));
      
      // Show login prompt instead of redirecting
      setShowLoginPrompt(true);
      return;
    }

    try {
      setSaving(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      // Save the card to Supabase
      const { error: insertError } = await supabase
        .from('wisdom_cards')
        .insert({
          user_id: user.id,
          state,
          problem,
          lens,
          wisdom
        });

      if (insertError) {
        throw insertError;
      }

      // Show success state
      setSaved(true);
      
      // Clear any pending card
      sessionStorage.removeItem('pendingCard');
      
      // Redirect to My Cards after a delay
      setTimeout(() => {
        router.push('/my-cards');
      }, 1500);

    } catch (err) {
      console.error('Error saving card:', err);
      setError('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTryAgain = () => {
    router.push('/state-selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-8">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#57534e] text-lg">Generating your wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] py-12 px-8">
      <div className="max-w-2xl mx-auto">
        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#1c1917] mb-4">Please Log In</h2>
              <p className="text-[#57534e] mb-6">
                Your card has been saved temporarily. Log in to save it permanently to your account!
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="bg-[#292524] text-white py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all text-center"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="bg-white border-2 border-[#e7e5e4] text-[#292524] py-3 rounded-full font-semibold hover:bg-[#faf9f7] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saved && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-emerald-800 font-semibold">
                Card saved successfully! Redirecting to My Cards...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Login Tip */}
        {!isLoggedIn && !showLoginPrompt && (
          <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-4 mb-6">
            <p className="text-blue-800">
              💡 <strong>Not logged in?</strong> You can still view this card, but you'll need to log in to save it.
            </p>
          </div>
        )}

        {/* Wisdom Card */}
        <div className={`bg-gradient-to-br ${stateColors[state as keyof typeof stateColors] || 'from-gray-500 to-gray-600'} rounded-3xl shadow-2xl p-8 text-white mb-6`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{lensIcons[lens as keyof typeof lensIcons]}</span>
              <div>
                <p className="text-sm opacity-90 capitalize">{lens}</p>
                <p className="text-xs opacity-75 capitalize">State: {state}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Wisdom Content */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {wisdom}
              </p>
            </div>
          </div>

          {/* Problem Reference */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs opacity-75 mb-1">Your situation:</p>
            <p className="text-sm opacity-90 italic">"{problem}"</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSaveCard}
            disabled={saving || saved}
            className="flex-1 bg-[#292524] text-white py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {isLoggedIn ? 'Save Card' : 'Save Card (Login Required)'}
              </>
            )}
          </button>

          <button
            onClick={handleTryAgain}
            className="flex-1 bg-white border-2 border-[#e7e5e4] text-[#292524] py-4 rounded-full font-semibold hover:bg-[#faf9f7] transition-all"
          >
            Create Another Card
          </button>
        </div>
      </div>
    </div>
  );
}
