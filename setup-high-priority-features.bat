@echo off
REM Timeflow High Priority Features Setup Script (Windows)
REM This script copies all files to their correct locations in the project

echo.
echo ========================================================
echo    Timeflow - High Priority Features Setup
echo ========================================================
echo.

REM Check if we're in the right directory
if not exist "app" (
    echo [ERROR] 'app' directory not found.
    echo Please run this script from your project root: C:\Users\SatnamBains\timeflow-web
    echo.
    pause
    exit /b 1
)

echo [OK] Project root found
echo.

REM Step 1: Copy middleware to root
echo Step 1: Setting up middleware...
if exist "middleware.ts" (
    echo [WARNING] middleware.ts already exists, creating backup...
    copy middleware.ts middleware.ts.backup >nul
)
copy middleware.ts .\ >nul
echo [OK] Middleware copied to root directory
echo.

REM Step 2: Create components directory and copy Modal
echo Step 2: Setting up Modal component...
if not exist "app\components" mkdir app\components
copy Modal.tsx app\components\ >nul
echo [OK] Modal.tsx created at app\components\Modal.tsx
echo.

REM Step 3: Update My Cards page
echo Step 3: Updating My Cards page...
if exist "app\my-cards\page.tsx" (
    echo [WARNING] Backing up existing My Cards page...
    copy app\my-cards\page.tsx app\my-cards\page.tsx.backup >nul
)
copy my-cards-page-updated.tsx app\my-cards\page.tsx >nul
echo [OK] My Cards page updated
echo.

REM Step 4: Update Signup page
echo Step 4: Updating Signup page...
if exist "app\auth\signup\page.tsx" (
    echo [WARNING] Backing up existing Signup page...
    copy app\auth\signup\page.tsx app\auth\signup\page.tsx.backup >nul
)
copy signup-page-updated.tsx app\auth\signup\page.tsx >nul
echo [OK] Signup page updated
echo.

REM Step 5: Update Login page
echo Step 5: Updating Login page...
if exist "app\auth\login\page.tsx" (
    echo [WARNING] Backing up existing Login page...
    copy app\auth\login\page.tsx app\auth\login\page.tsx.backup >nul
)
copy login-page-updated.tsx app\auth\login\page.tsx >nul
echo [OK] Login page updated
echo.

REM Step 6: Create Verify Email page
echo Step 6: Creating Verify Email page...
if not exist "app\auth\verify-email" mkdir app\auth\verify-email
copy verify-email-page.tsx app\auth\verify-email\page.tsx >nul
echo [OK] Verify Email page created
echo.

REM Summary
echo.
echo ========================================================
echo    All files have been set up successfully!
echo ========================================================
echo.

REM Show file structure
echo File Structure:
echo timeflow-web/
echo   middleware.ts [OK]
echo   app/
echo     components/
echo       Modal.tsx [OK]
echo     my-cards/
echo       page.tsx [OK] (updated)
echo     auth/
echo       login/
echo         page.tsx [OK] (updated)
echo       signup/
echo         page.tsx [OK] (updated)
echo       verify-email/
echo         page.tsx [OK] (new)
echo.

REM Next steps
echo ========================================================
echo    Next Steps:
echo ========================================================
echo.
echo 1. Install required dependency:
echo    npm install @supabase/auth-helpers-nextjs
echo.
echo 2. Run database migrations:
echo    - Open Supabase Dashboard
echo    - Go to SQL Editor
echo    - Run SQL from DATABASE_UPDATES.md
echo.
echo 3. Update Supabase redirect URLs:
echo    - Add: http://localhost:3000/auth/verify-email
echo    - Add: https://timeflow-web.vercel.app/auth/verify-email
echo.
echo 4. Test locally:
echo    npm run dev
echo.
echo 5. If everything works, deploy:
echo    git add .
echo    git commit -m "Add high priority features"
echo    git push
echo.
echo ========================================================
echo    Setup complete!
echo    Read HIGH_PRIORITY_IMPLEMENTATION_GUIDE.md
echo    for detailed instructions.
echo ========================================================
echo.
pause
