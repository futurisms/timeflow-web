@echo off
echo Creating Timeflow pages...

REM Create problem-statement directory and file
mkdir "app\problem-statement" 2>nul
(
echo 'use client';
echo.
echo import { useRouter, useSearchParams } from 'next/navigation';
echo import { useState, Suspense } from 'react';
echo.
echo function ProblemStatementContent^(^) {
echo   const router = useRouter^(^);
echo   const searchParams = useSearchParams^(^);
echo   const state = searchParams.get^('state'^);
echo   const [problem, setProblem] = useState^(''^);
echo.
echo   const stateColors: { [key: string]: string } = {
echo     rising: 'bg-emerald-500',
echo     falling: 'bg-red-500',
echo     turbulent: 'bg-amber-500',
echo     stuck: 'bg-slate-500',
echo     grounded: 'bg-blue-500',
echo   };
echo.
echo   const handleContinue = ^(^) =^> {
echo     if ^(problem.trim^(^)^) {
echo       router.push^(`/lens-selection?state=${state}^&problem=${encodeURIComponent^(problem^)}`^);
echo     }
echo   };
echo.
echo   return ^(
echo     ^<div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-8 py-12"^>
echo       ^<div className="max-w-2xl w-full mb-8"^>
echo         {state ^&^& ^(
echo           ^<div className="flex justify-center mb-6"^>
echo             ^<div className={`${stateColors[state]} text-white px-6 py-2 rounded-full text-sm font-semibold`}^>
echo               {state.charAt^(0^).toUpperCase^(^) + state.slice^(1^)}
echo             ^</div^>
echo           ^</div^>
echo         ^)}
echo         ^<h1 className="text-4xl font-bold text-[#1c1917] mb-4 text-center"^>
echo           What's on your mind?
echo         ^</h1^>
echo         ^<p className="text-lg text-[#57534e] text-center"^>
echo           Describe the situation, challenge, or question you're facing
echo         ^</p^>
echo       ^</div^>
echo       ^<div className="max-w-2xl w-full mb-8"^>
echo         ^<textarea value={problem} onChange={^(e^) =^> setProblem^(e.target.value^)} placeholder="I'm struggling with..." className="w-full h-48 p-6 rounded-2xl bg-white border-2 border-[#e7e5e4] focus:border-[#292524] focus:outline-none resize-none text-lg text-[#1c1917] placeholder-[#a8a29e]" autoFocus /^>
echo         ^<p className="text-sm text-[#78716c] mt-2 text-right"^>{problem.length} characters^</p^>
echo       ^</div^>
echo       ^<div className="flex gap-4"^>
echo         ^<button onClick={^(^) =^> router.back^(^)} className="px-8 py-3 rounded-full text-base font-semibold bg-white border-2 border-[#e7e5e4] text-[#57534e] hover:border-[#292524] hover:text-[#1c1917] transition-all"^>^← Back^</button^>
echo         ^<button onClick={handleContinue} disabled={!problem.trim^(^)} className={`px-12 py-3 rounded-full text-base font-semibold transition-all ${problem.trim^(^) ? 'bg-[#292524] text-white hover:bg-[#1c1917] shadow-lg' : 'bg-[#e7e5e4] text-[#78716c] cursor-not-allowed'}`}^>Continue ^→^</button^>
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
echo.
echo export default function ProblemStatement^(^) {
echo   return ^(^<Suspense fallback={^<div className="min-h-screen bg-[#faf9f7] flex items-center justify-center"^>Loading...^</div^>}^>^<ProblemStatementContent /^>^</Suspense^>^);
echo }
) > "app\problem-statement\page.tsx"

echo Done! Pages created successfully.
echo Refresh your browser to see the changes.
pause
