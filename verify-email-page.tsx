'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    handleEmailVerification();
  }, []);

  const handleEmailVerification = async () => {
    try {
      // Get the token from URL
      const token = searchParams?.get('token');
      const type = searchParams?.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      // Verify the email token
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage('Email verified successfully! Redirecting...');

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to verify email. The link may have expired.');
    }
  };

  const handleResendEmail = async () => {
    try {
      const email = searchParams?.get('email');
      if (!email) {
        alert('Email address not found. Please sign up again.');
        router.push('/auth/signup');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      alert('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Resend error:', error);
      alert('Failed to resend email: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          {status === 'verifying' && (
            <div className="inline-block w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin"></div>
          )}
          {status === 'success' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#1c1917] mb-2">
          {status === 'verifying' && 'Verifying Email'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        {/* Message */}
        <p className="text-[#57534e] mb-8">{message}</p>

        {/* Actions */}
        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              className="w-full bg-[#292524] text-white py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
            >
              Resend Verification Email
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full bg-white border-2 border-[#e7e5e4] text-[#292524] py-3 rounded-full font-semibold hover:bg-[#faf9f7] transition-all"
            >
              Sign Up Again
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full text-[#57534e] hover:text-[#292524] transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#292524] text-white py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
          >
            Go to Home
          </button>
        )}
      </div>
    </div>
  );
}
