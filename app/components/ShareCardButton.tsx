'use client';

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
  rising: '#10b981',  // emerald-500
  falling: '#ef4444',  // red-500
  turbulent: '#f59e0b',  // amber-500
  stuck: '#64748b',  // slate-500
  grounded: '#3b82f6',  // blue-500
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

  // Sanitize text by replacing special characters with plain equivalents
  const sanitizeText = (text: string) => {
    return text
      .replace(/[—–]/g, '-')  // Replace em/en dashes with hyphens
      .replace(/[""]/g, '"')   // Replace smart quotes with straight quotes
      .replace(/['']/g, "'")   // Replace smart apostrophes with straight apostrophes
      .replace(/…/g, '...')    // Replace ellipsis character with three dots
      .replace(/[‐‑‒–—―]/g, '-') // Replace all dash variants
      .replace(/[\u2000-\u200B]/g, ' ') // Replace special spaces with normal space
      .trim();
  };

  const displayWisdom = sanitizeText(wisdom);
  const displayProblem = sanitizeText(problem);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const div = document.createElement('div');
    div.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-lg z-[9999] animate-fade-in`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
    }, 3000);
  };

  const downloadAsImage = async () => {
    setDownloading(true);
    
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const cardElement = document.getElementById(`share-card-${cardId}`);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate the canvas
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
      });

      // Use modern API if available
      if ('toBlob' in canvas && typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Failed to create image');
          }
          
          // Create and trigger download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `timeflow-${lens}-card.png`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
          
          setDownloading(false);
          showNotification('Card downloaded successfully!', 'success');
          setTimeout(() => setShowModal(false), 1000);
        }, 'image/png', 1.0);
      } else {
        // Fallback for older browsers - canvas is guaranteed to be HTMLCanvasElement here
        const url = (canvas as HTMLCanvasElement).toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeflow-${lens}-card.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setDownloading(false);
        showNotification('Card downloaded successfully!', 'success');
        setTimeout(() => setShowModal(false), 1000);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloading(false);
      showNotification('Download failed. Please try again.', 'error');
    }
  };

  const copyToClipboard = async () => {
    const text = `${displayWisdom}\n\n- Timeflow Card\nLens: ${lens}\nState: ${state}`;
    
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      console.error('Copy failed:', err);
      showNotification('Failed to copy. Please try again.', 'error');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
        title="Share card"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="mb-6">
              <p className="text-sm text-[#57534e] mb-4">Preview:</p>
              <div
                id={`share-card-${cardId}`}
                className="rounded-3xl shadow-2xl p-8 text-white"
                style={{ 
                  width: '500px', 
                  maxWidth: '100%',
                  backgroundColor: stateColors[state as keyof typeof stateColors],
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{lensIcons[lens as keyof typeof lensIcons]}</span>
                    <div>
                      <p className="text-sm font-semibold capitalize">{lens}</p>
                      <p className="text-xs opacity-75 capitalize">State: {state}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <p className="text-base leading-relaxed">
                    {displayWisdom}
                  </p>
                </div>

                <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <p className="text-xs mb-1" style={{ opacity: 0.75 }}>Context:</p>
                  <p className="text-sm italic">"{displayProblem}"</p>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ opacity: 0.75 }}>
                  <span>
                    {new Date(createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <p className="text-xs font-semibold" style={{ opacity: 0.95 }}>
                    Timeflow App
                  </p>
                  <p className="text-xs mt-1" style={{ opacity: 0.75 }}>
                    Based on the Timeflow concept from the book{' '}
                    <a 
                      href="https://replugged.ai/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="italic underline"
                      style={{ opacity: 0.95 }}
                    >
                      Replugged
                    </a>
                  </p>
                </div>
              </div>
            </div>

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
