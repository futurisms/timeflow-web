'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Header with Auth-aware Navigation */}
      <header className="bg-white border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-[#1c1917]">Timeflow</h1>
            {isLoggedIn && (
              <nav className="hidden sm:flex gap-6">
                <Link href="/" className="text-[#292524] font-semibold">
                  Home
                </Link>
                <Link href="/my-cards" className="text-[#57534e] hover:text-[#292524] transition-colors">
                  My Cards
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8"></div>
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/my-cards"
                  className="text-[#57534e] hover:text-[#292524] transition-colors text-sm font-medium"
                >
                  My Cards
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#57534e] hover:text-[#292524] transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[#57534e] hover:text-[#292524] transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#292524] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1c1917] transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="max-w-2xl text-center">
          <h2 className="text-5xl font-bold text-[#1c1917] mb-4">
            Timeflow
          </h2>
          <p className="text-xl text-[#57534e] mb-2">
            A field guide for staying human
          </p>
          <p className="text-xl text-[#57534e] mb-12">
            as AI reshapes our world
          </p>

          <div className="space-y-4 mb-12">
            <p className="text-lg text-[#1c1917]">
              Notice your inner state. Reflect with wisdom.
            </p>
            <p className="text-lg text-[#1c1917]">
              Move through life with intention.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/state-selection')}
              className="bg-[#292524] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#1c1917] transition-all shadow-lg"
            >
              Get Started
            </button>

            {isLoggedIn && (
              <Link
                href="/my-cards"
                className="bg-white border-2 border-[#292524] text-[#292524] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#faf9f7] transition-all"
              >
                View My Cards
              </Link>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-sm text-[#57534e] mt-12">
            From the book <span className="italic">Replugged</span> by Satnam Bains
          </p>
        </div>
      </main>
    </div>
  );
}
