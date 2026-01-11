'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token from URL
        const token_hash = searchParams?.get('token_hash');
        const type = searchParams?.get('type');

        if (token_hash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email',
          });

          if (error) {
            setStatus('error');
            setMessage(error.message);
          } else {
            setStatus('success');
            setMessage('Email verified successfully!');
            
            // Redirect to home after 2 seconds
            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification link');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Verifying your email...</h1>
            <p className="text-[#57534e]">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Email Verified!</h1>
            <p className="text-[#57534e] mb-4">{message}</p>
            <p className="text-sm text-[#57534e]">Redirecting you to home...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1c1917] mb-2">Verification Failed</h1>
            <p className="text-[#57534e] mb-6">{message}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-[#292524] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#57534e]">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
