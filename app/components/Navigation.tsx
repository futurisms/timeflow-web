'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
    setUserEmail(user?.email || null);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail(null);
    router.push('/');
  };

  // Don't show navigation on onboarding or auth pages
  const hideNav = pathname?.startsWith('/onboarding') || 
                  pathname?.startsWith('/auth/login') || 
                  pathname?.startsWith('/auth/signup') ||
                  pathname?.startsWith('/auth/forgot-password') ||
                  pathname?.startsWith('/auth/reset-password');

  if (hideNav) return null;

  if (loading) {
    return (
      <header className="bg-white border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1c1917]">Timeflow</h1>
          <div className="w-20 h-8 bg-[#e7e5e4] animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-[#e7e5e4] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Left Side - Logo & Nav Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[#1c1917] hover:text-[#57534e] transition-colors">
            Timeflow
          </Link>
          {isLoggedIn && (
            <nav className="hidden md:flex gap-4 lg:gap-6">
              <Link 
                href="/" 
                className={`text-sm lg:text-base transition-colors ${
                  pathname === '/' 
                    ? 'text-[#292524] font-semibold' 
                    : 'text-[#57534e] hover:text-[#292524]'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/my-cards" 
                className={`text-sm lg:text-base transition-colors ${
                  pathname === '/my-cards' 
                    ? 'text-[#292524] font-semibold' 
                    : 'text-[#57534e] hover:text-[#292524]'
                }`}
              >
                My Cards
              </Link>
              <Link 
                href="/profile" 
                className={`text-sm lg:text-base transition-colors ${
                  pathname === '/profile' 
                    ? 'text-[#292524] font-semibold' 
                    : 'text-[#57534e] hover:text-[#292524]'
                }`}
              >
                Profile
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side - Auth Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            <>
              {/* User Email - Hidden on small screens */}
              <span className="hidden lg:inline text-sm text-[#57534e] truncate max-w-[150px]">
                {userEmail}
              </span>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-sm text-[#57534e] hover:text-[#292524] transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link
                href="/auth/login"
                className="text-sm text-[#57534e] hover:text-[#292524] transition-colors font-semibold"
              >
                Log In
              </Link>
              {/* Sign Up Button */}
              <Link
                href="/auth/signup"
                className="bg-[#292524] text-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#1c1917] transition-all shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu - Only show when logged in */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-[#e7e5e4] px-4 py-3 flex gap-4 bg-[#faf9f7]">
          <Link 
            href="/" 
            className={`text-sm transition-colors ${
              pathname === '/' 
                ? 'text-[#292524] font-semibold' 
                : 'text-[#57534e] hover:text-[#292524]'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/my-cards" 
            className={`text-sm transition-colors ${
              pathname === '/my-cards' 
                ? 'text-[#292524] font-semibold' 
                : 'text-[#57534e] hover:text-[#292524]'
            }`}
          >
            My Cards
          </Link>
          <Link 
            href="/profile" 
            className={`text-sm transition-colors ${
              pathname === '/profile' 
                ? 'text-[#292524] font-semibold' 
                : 'text-[#57534e] hover:text-[#292524]'
            }`}
          >
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
