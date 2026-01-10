'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      {/* Logo placeholder */}
      <div className="w-24 h-24 bg-[#e7e5e4] rounded-full mb-8" />
      
      {/* Title */}
      <h1 className="text-5xl font-bold text-[#1c1917] mb-4 text-center">
        Timeflow
      </h1>
      
      {/* Subtitle */}
      <p className="text-xl text-[#57534e] mb-12 text-center leading-relaxed">
        A field guide for staying human<br />as AI reshapes our world
      </p>
      
      {/* Description */}
      <p className="text-lg text-[#44403c] mb-12 text-center leading-relaxed">
        Notice your inner state. Reflect with wisdom.<br />
        Move through life with intention.
      </p>
      
      {/* Get Started Button */}
      <button 
        onClick={() => router.push('/state-selection')}
        className="bg-[#292524] text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-[#1c1917] transition-colors shadow-lg"
      >
        Get Started
      </button>
      
      {/* Footer */}
      <p className="text-sm text-[#78716c] mt-8 text-center">
        From the book Replugged by Satnam Bains
      </p>
    </div>
  );
}