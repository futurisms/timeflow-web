'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: 'Welcome to Timeflow',
    subtitle: 'A tool to tune your energy and navigate life\'s states',
    content: 'Timeflow helps you understand where your energy is flowing and provides philosophical wisdom to guide you toward clarity, purpose, and peace.',
    visual: '🌊',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  {
    id: 2,
    title: 'Inspired by Replugged',
    subtitle: 'A journey through technology, philosophy, and human experience',
    content: 'Replugged is a reflective journey through technology, philosophy, and human experience that explores how our creations shape us—and how we might consciously reconnect with meaning in an age of acceleration.',
    visual: 'book',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
  {
    id: 3,
    title: 'Time as Energy',
    subtitle: 'Not a line, but a living stream',
    content: 'Imagine time not as a straight path, but as a continuous flow of energy that carries you through existence. Your conscious awareness can only perceive one point in that flow at any given moment.',
    visual: '⚡',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    id: 4,
    title: 'Upper & Lower Membranes',
    subtitle: 'The boundaries of your energy',
    content: 'Your Timeflow oscillates between two invisible boundaries. The upper membrane represents clarity, contentment, and purpose. The lower membrane symbolizes anxiety, disconnection, and stress.',
    visual: '〰️',
    bgGradient: 'from-pink-50 to-rose-50',
  },
  {
    id: 5,
    title: 'Five States of Being',
    subtitle: 'Understand where you are',
    content: 'Rising toward clarity. Falling into stress. Turbulent with uncertainty. Stuck in patterns. Grounded in peace. Each state is a place in your Timeflow, and each has wisdom to guide you forward.',
    visual: '🎭',
    bgGradient: 'from-rose-50 to-orange-50',
  },
  {
    id: 6,
    title: 'Ready to Begin?',
    subtitle: 'Tune your Timeflow',
    content: 'Select your current state and receive philosophical wisdom tailored to where you are. Each card is designed to help you shift your energy toward the upper membrane.',
    visual: '✨',
    bgGradient: 'from-orange-50 to-amber-50',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Mark onboarding as complete
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeflow_onboarding_complete', 'true');
    }
    router.push('/state-selection');
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bgGradient} transition-all duration-700 ease-in-out`}>
      {/* Login Link for Returning Users */}
      <Link
        href="/auth/login"
        className="absolute top-8 left-8 text-[#57534e] hover:text-[#1c1917] transition-colors font-medium z-10 flex items-center gap-2"
      >
        <span>←</span> Already have an account? <span className="underline">Login</span>
      </Link>

      {/* Skip Button */}
      {!isLastSlide && (
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 text-[#57534e] hover:text-[#1c1917] transition-colors font-medium z-10"
        >
          Skip
        </button>
      )}

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-2xl w-full">
          {/* Visual Icon or Book Image */}
          {slide.visual === 'book' ? (
            <div 
              className="flex justify-center mb-8 animate-fade-in"
              style={{ 
                animation: 'fadeIn 0.6s ease-out',
                animationFillMode: 'both'
              }}
            >
              <Image
                src="https://res.cloudinary.com/dr1zhs7hi/image/upload/v1765451737/thumbnail_book_olo7wk.png"
                alt="Replugged Book Cover"
                width={200}
                height={300}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>
          ) : (
            <div 
              className="text-9xl text-center mb-8 animate-fade-in"
              style={{ 
                animation: 'fadeIn 0.6s ease-out',
                animationFillMode: 'both'
              }}
            >
              {slide.visual}
            </div>
          )}

          {/* Title */}
          <h1 
            className="text-5xl font-bold text-[#1c1917] text-center mb-4 animate-fade-in"
            style={{ 
              animation: 'fadeIn 0.6s ease-out 0.1s',
              animationFillMode: 'both',
              fontFamily: 'Georgia, serif'
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl text-[#57534e] text-center mb-8 animate-fade-in"
            style={{ 
              animation: 'fadeIn 0.6s ease-out 0.2s',
              animationFillMode: 'both'
            }}
          >
            {slide.subtitle}
          </p>

          {/* Content */}
          <p 
            className="text-lg text-[#292524] text-center leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in"
            style={{ 
              animation: 'fadeIn 0.6s ease-out 0.3s',
              animationFillMode: 'both'
            }}
          >
            {slide.content}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-[#292524]' 
                    : 'w-2 bg-[#e7e5e4] hover:bg-[#d6d3d1]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div 
            className="flex justify-between items-center gap-4 animate-fade-in"
            style={{ 
              animation: 'fadeIn 0.6s ease-out 0.4s',
              animationFillMode: 'both'
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className={`px-8 py-4 rounded-full font-semibold transition-all ${
                currentSlide === 0
                  ? 'opacity-0 cursor-not-allowed'
                  : 'border-2 border-[#292524] text-[#292524] hover:bg-[#292524] hover:text-white'
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-[#292524] text-white rounded-full font-semibold hover:bg-[#1c1917] transition-all shadow-lg hover:shadow-xl"
            >
              {isLastSlide ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
