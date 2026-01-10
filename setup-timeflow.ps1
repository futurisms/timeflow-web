# Timeflow Setup Script
# Run this from your timeflow-web directory

Write-Host "Setting up Timeflow pages..." -ForegroundColor Green

# Create problem-statement page
Write-Host "Creating problem-statement page..." -ForegroundColor Yellow
$problemStatementDir = "app/problem-statement"
New-Item -ItemType Directory -Force -Path $problemStatementDir | Out-Null

$problemStatementContent = @'
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function ProblemStatementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const [problem, setProblem] = useState('');

  const stateNames: { [key: string]: string } = {
    rising: 'Rising',
    falling: 'Falling',
    turbulent: 'Turbulent',
    stuck: 'Stuck',
    grounded: 'Grounded',
  };

  const stateColors: { [key: string]: string } = {
    rising: 'bg-emerald-500',
    falling: 'bg-red-500',
    turbulent: 'bg-amber-500',
    stuck: 'bg-slate-500',
    grounded: 'bg-blue-500',
  };

  const handleContinue = () => {
    if (problem.trim()) {
      router.push(`/lens-selection?state=${state}&problem=${encodeURIComponent(problem)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      {/* Header */}
      <div className="max-w-2xl w-full mb-8">
        {/* Selected State Badge */}
        {state && (
          <div className="flex justify-center mb-6">
            <div className={`${stateColors[state]} text-white px-6 py-2 rounded-full text-sm font-semibold`}>
              {stateNames[state]}
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center">
          What's on your mind?
        </h1>
        <p className="text-lg text-[#57534e] text-center">
          Describe the situation, challenge, or question you're facing
        </p>
      </div>

      {/* Text Input */}
      <div className="max-w-2xl w-full mb-8">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="I'm struggling with..."
          className="w-full h-48 p-6 rounded-2xl bg-white border-2 border-[#e7e5e4] focus:border-[#292524] focus:outline-none resize-none text-lg text-[#1c1917] placeholder-[#a8a29e]"
          autoFocus
        />
        <p className="text-sm text-[#78716c] mt-2 text-right">
          {problem.length} characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-8 py-3 rounded-full text-base font-semibold bg-white border-2 border-[#e7e5e4] text-[#57534e] hover:border-[#292524] hover:text-[#1c1917] transition-all"
        >
          ← Back
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!problem.trim()}
          className={`px-12 py-3 rounded-full text-base font-semibold transition-all ${
            problem.trim()
              ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg'
              : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default function ProblemStatement() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">Loading...</div>}>
      <ProblemStatementContent />
    </Suspense>
  );
}
'@

Set-Content -Path "$problemStatementDir/page.tsx" -Value $problemStatementContent

# Create lens-selection page
Write-Host "Creating lens-selection page..." -ForegroundColor Yellow
$lensSelectionDir = "app/lens-selection"
New-Item -ItemType Directory -Force -Path $lensSelectionDir | Out-Null

$lensSelectionContent = @'
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

const philosophicalLenses = [
  {
    id: 'stoicism',
    name: 'Stoicism',
    icon: '🏛️',
    description: 'Focus on what you can control, accept what you cannot',
    philosopher: 'Marcus Aurelius, Epictetus',
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    icon: '☸️',
    description: 'Understand suffering, cultivate compassion and presence',
    philosopher: 'Buddha, Thich Nhat Hanh',
  },
  {
    id: 'existentialism',
    name: 'Existentialism',
    icon: '🎭',
    description: 'Create meaning through authentic choice and action',
    philosopher: 'Sartre, Camus',
  },
  {
    id: 'taoism',
    name: 'Taoism',
    icon: '☯️',
    description: 'Flow with nature, embrace simplicity and balance',
    philosopher: 'Lao Tzu, Zhuangzi',
  },
  {
    id: 'pragmatism',
    name: 'Pragmatism',
    icon: '🔧',
    description: 'Focus on practical consequences and real-world results',
    philosopher: 'William James, John Dewey',
  },
];

function LensSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const problem = searchParams.get('problem');
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stateColors: { [key: string]: string } = {
    rising: 'bg-emerald-500',
    falling: 'bg-red-500',
    turbulent: 'bg-amber-500',
    stuck: 'bg-slate-500',
    grounded: 'bg-blue-500',
  };

  const handleGenerate = async () => {
    if (selectedLens) {
      setIsGenerating(true);
      // Simulate generation delay
      setTimeout(() => {
        router.push(`/wisdom-card?state=${state}&problem=${problem}&lens=${selectedLens}`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl w-full mb-8">
        <h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center">
          Choose your philosophical lens
        </h1>
        <p className="text-lg text-[#57534e] text-center">
          Each tradition offers unique wisdom for your situation
        </p>
      </div>

      {/* Lens Cards Grid */}
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {philosophicalLenses.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setSelectedLens(lens.id)}
            className={`p-6 rounded-2xl text-left transition-all ${
              selectedLens === lens.id
                ? 'bg-[#292524] ring-4 ring-offset-4 ring-[#292524] scale-105'
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <div className="text-4xl mb-3">{lens.icon}</div>
            <h3
              className={`text-xl font-bold mb-2 ${
                selectedLens === lens.id ? 'text-white' : 'text-[#1c1917]'
              }`}
            >
              {lens.name}
            </h3>
            <p
              className={`text-sm mb-3 ${
                selectedLens === lens.id ? 'text-white/90' : 'text-[#57534e]'
              }`}
            >
              {lens.description}
            </p>
            <p
              className={`text-xs italic ${
                selectedLens === lens.id ? 'text-white/70' : 'text-[#78716c]'
              }`}
            >
              {lens.philosopher}
            </p>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          disabled={isGenerating}
          className="px-8 py-3 rounded-full text-base font-semibold bg-white border-2 border-[#e7e5e4] text-[#57534e] hover:border-[#292524] hover:text-[#1c1917] transition-all disabled:opacity-50"
        >
          ← Back
        </button>
        
        <button
          onClick={handleGenerate}
          disabled={!selectedLens || isGenerating}
          className={`px-12 py-3 rounded-full text-base font-semibold transition-all ${
            selectedLens && !isGenerating
              ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg'
              : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Wisdom Card →'}
        </button>
      </div>
    </div>
  );
}

export default function LensSelection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">Loading...</div>}>
      <LensSelectionContent />
    </Suspense>
  );
}
'@

Set-Content -Path "$lensSelectionDir/page.tsx" -Value $lensSelectionContent

Write-Host "`nSetup complete! ✓" -ForegroundColor Green
Write-Host "`nCreated pages:" -ForegroundColor Cyan
Write-Host "  - app/problem-statement/page.tsx" -ForegroundColor White
Write-Host "  - app/lens-selection/page.tsx" -ForegroundColor White
Write-Host "`nYour app is ready! Refresh your browser to see the changes." -ForegroundColor Green
'@

Set-Content -Path "setup-timeflow.ps1" -Value $fileContent
