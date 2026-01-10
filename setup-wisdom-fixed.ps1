Write-Host "Creating Timeflow Wisdom Card System" -ForegroundColor Cyan

# Create .env.local
Write-Host "Creating environment file..." -ForegroundColor Yellow
"ANTHROPIC_API_KEY=your_api_key_here" | Out-File -FilePath ".env.local" -Encoding UTF8

# Create API directory
New-Item -ItemType Directory -Force -Path "app\api\generate-wisdom" | Out-Null

# Create API route
$api = @'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { state, problem, lens } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `You are a wise philosophical guide. A person is experiencing a "${state}" state and shared: "${problem}". Provide guidance through the lens of ${lens}. Structure your response as: 1) A brief reflection (2-3 sentences), 2) Key insight (1 sentence), 3) Practical action (1 sentence). Keep total under 150 words. Be warm, clear, and actionable.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return NextResponse.json({ wisdom: data.content[0].text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 });
  }
}
'@
Set-Content -Path "app\api\generate-wisdom\route.ts" -Value $api

# Create wisdom-card directory
New-Item -ItemType Directory -Force -Path "app\wisdom-card" | Out-Null

# Create wisdom card page
$card = @'
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function WisdomCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wisdom, setWisdom] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const stateColors = {
    rising: 'from-emerald-500 to-emerald-600',
    falling: 'from-red-500 to-red-600',
    turbulent: 'from-amber-500 to-amber-600',
    stuck: 'from-slate-500 to-slate-600',
    grounded: 'from-blue-500 to-blue-600'
  };

  const lensIcons = { stoicism: '🏛️', buddhism: '☸️', existentialism: '🎭', taoism: '☯️', pragmatism: '🔧' };

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch('/api/generate-wisdom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: searchParams.get('state'),
            problem: searchParams.get('problem'),
            lens: searchParams.get('lens')
          })
        });
        const data = await res.json();
        data.error ? setError(data.error) : setWisdom(data.wisdom);
      } catch (e) {
        setError('Failed to generate');
      } finally {
        setIsLoading(false);
      }
    }
    generate();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <div className="w-16 h-16 border-4 border-[#292524] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-[#57534e]">Generating your wisdom card...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => router.back()} className="px-6 py-3 bg-[#292524] text-white rounded-full">Go Back</button>
    </div>
  );

  const state = searchParams.get('state');
  const lens = searchParams.get('lens');

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12">
      <div className="max-w-2xl w-full">
        <div className={`bg-gradient-to-br ${stateColors[state]} rounded-3xl p-8 shadow-2xl text-white mb-8`}>
          <div className="flex justify-between items-start mb-6">
            <div className="text-5xl">{lensIcons[lens]}</div>
            <div className="text-right">
              <div className="text-sm opacity-80 capitalize">{state}</div>
              <div className="text-xs opacity-60 capitalize">{lens}</div>
            </div>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{wisdom}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/')} className="px-8 py-3 bg-white border-2 border-[#e7e5e4] text-[#57534e] rounded-full hover:border-[#292524]">Create Another</button>
          <button onClick={() => alert('Save feature coming soon!')} className="px-8 py-3 bg-[#292524] text-white rounded-full hover:bg-[#1c1917]">Save Card</button>
        </div>
      </div>
    </div>
  );
}

export default function WisdomCard() {
  return <Suspense><WisdomCardContent /></Suspense>;
}
'@
Set-Content -Path "app\wisdom-card\page.tsx" -Value $card

Write-Host "Done! Files created:" -ForegroundColor Green
Write-Host "  .env.local" -ForegroundColor White
Write-Host "  app/api/generate-wisdom/route.ts" -ForegroundColor White
Write-Host "  app/wisdom-card/page.tsx" -ForegroundColor White
Write-Host ""
Write-Host "NEXT: Edit .env.local and add your Claude API key!" -ForegroundColor Yellow
