const fs = require('fs');
const path = require('path');

// Create auth directory
fs.mkdirSync(path.join('app', 'auth', 'login'), { recursive: true });
fs.mkdirSync(path.join('app', 'auth', 'signup'), { recursive: true });

// Login page
const loginPage = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#1c1917] mb-2 text-center">Welcome back</h1>
        <p className="text-[#57534e] text-center mb-8">Sign in to access your saved wisdom</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1c1917] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1917] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#292524] text-white py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#57534e] mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#292524] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
`;

// Signup page
const signupPage = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Check your email for the confirmation link!');
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#1c1917] mb-2 text-center">Create account</h1>
        <p className="text-[#57534e] text-center mb-8">Start saving your wisdom cards</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1c1917] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1c1917] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e7e5e4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#292524]"
              minLength={6}
              required
            />
            <p className="text-xs text-[#78716c] mt-1">At least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#292524] text-white py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-[#57534e] mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#292524] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join('app', 'auth', 'login', 'page.tsx'), loginPage);
fs.writeFileSync(path.join('app', 'auth', 'signup', 'page.tsx'), signupPage);

console.log('✓ Created app/auth/login/page.tsx');
console.log('✓ Created app/auth/signup/page.tsx');
console.log('');
console.log('Test the auth pages:');
console.log('  Login: http://localhost:3000/auth/login');
console.log('  Signup: http://localhost:3000/auth/signup');
