'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = () => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('timeflow_onboarding_complete');
    
    if (!onboardingComplete) {
      // First-time user - redirect to onboarding
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-6xl mb-8">🌊</div>
          <h2 className="text-5xl font-bold text-[#1c1917] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Tune Your Timeflow
          </h2>
          <p className="text-xl text-[#57534e] mb-4 leading-relaxed">
            Navigate life's states with philosophical wisdom. Understand where your energy is flowing and receive guidance tailored to your current state.
          </p>
          <p className="text-base text-[#78716c] mb-8 italic">
            Based on the Timeflow concept from the book{' '}
            <a 
              href="https://replugged.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              Replugged
            </a>
          </p>
          <Link
            href="/state-selection"
            className="inline-block bg-[#292524] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#1c1917] transition-all shadow-lg hover:shadow-xl"
          >
            Create Wisdom Card
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-[#1c1917] mb-3">Five States</h3>
            <p className="text-[#57534e]">
              Rising, Falling, Turbulent, Stuck, or Grounded. Identify where you are in your Timeflow.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold text-[#1c1917] mb-3">Five Lenses</h3>
            <p className="text-[#57534e]">
              Stoicism, Buddhism, Existentialism, Taoism, or Pragmatism. Choose your philosophical guide.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-[#1c1917] mb-3">AI Wisdom</h3>
            <p className="text-[#57534e]">
              Receive personalized guidance that helps you shift toward clarity, purpose, and peace.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Book Thumbnail */}
            <div className="flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/dr1zhs7hi/image/upload/v1765451737/thumbnail_book_olo7wk.png"
                alt="Replugged Book Cover"
                className="w-48 h-auto rounded-lg shadow-xl"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-[#1c1917] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Based on Timeflow
              </h3>
              <p className="text-lg text-[#57534e] mb-6 leading-relaxed">
                Timeflow is a concept from the book{' '}
                <a 
                  href="https://replugged.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="italic font-semibold hover:underline"
                >
                  Replugged
                </a>
                , which explores how to stay human as AI reshapes work, culture, and everyday life.
              </p>
              <Link
                href="/onboarding"
                className="inline-block bg-[#292524] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1c1917] transition-all"
              >
                Learn More About Timeflow
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e7e5e4] py-8 mt-20">
        <div className="max-w-7xl mx-auto px-8 text-center text-[#57534e] text-sm">
          <p>
            © 2026 Timeflow. Based on the Timeflow concept from the book{' '}
            <a 
              href="https://replugged.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="italic hover:underline"
            >
              Replugged
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
