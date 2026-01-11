'use client';

// This is a component that adds share functionality to existing cards
// Install: npm install html2canvas

import { useState } from 'react';

interface ShareCardButtonProps {
  cardId: number;
  state: string;
  problem: string;
  lens: string;
  wisdom: string;
  createdAt: string;
}

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

export function ShareCardButton({ cardId, state, problem, lens, wisdom, createdAt }: ShareCardButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const downloadAsImage = async () => {
    setDownloading(true);
    
    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      // Get the card element
      const cardElement = document.getElementById(`share-card-${cardId}`);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Generate canvas from the card
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `timeflow-wisdom-${lens}-${Date.now()}.png`;
        link.click();
        
        URL.revokeObjectURL(url);
        setDownloading(false);
        setShowModal(false);
      });
    } catch (err) {
      console.error('Error downloading card:', err);
      alert('Failed to download card. Please try again.');
      setDownloading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `${wisdom}\n\n— Timeflow Wisdom Card\nLens: ${lens}\nState: ${state}`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white/80 hover:text-white transition-colors"
        title="Share card"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1c1917]">Share Card</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#57534e] hover:text-[#1c1917] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Card */}
            <div className="mb-6">
              <p className="text-sm text-[#57534e] mb-4">Preview:</p>
              <div
                id={`share-card-${cardId}`}
                className={`bg-gradient-to-br ${stateColors[state as keyof typeof stateColors]} rounded-3xl shadow-2xl p-8 text-white`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{lensIcons[lens as keyof typeof lensIcons]}</span>
                    <div>
                      <p className="text-sm font-semibold capitalize">{lens}</p>
                      <p className="text-xs opacity-75 capitalize">State: {state}</p>
                    </div>
                  </div>
                </div>

                {/* Wisdom */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-lg leading-relaxed">
                    {wisdom}
                  </p>
                </div>

                {/* Problem */}
                <div className="mb-4 pb-4 border-b border-white/20">
                  <p className="text-xs opacity-75 mb-1">Your situation:</p>
                  <p className="text-sm italic">"{problem}"</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>Timeflow</span>
                  <span>
                    {new Date(createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <button
                onClick={downloadAsImage}
                disabled={downloading}
                className="w-full bg-[#292524] text-white py-4 rounded-full font-semibold hover:bg-[#1c1917] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Image...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download as Image
                  </>
                )}
              </button>

              <button
                onClick={copyToClipboard}
                className="w-full bg-white border-2 border-[#e7e5e4] text-[#292524] py-4 rounded-full font-semibold hover:bg-[#faf9f7] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
