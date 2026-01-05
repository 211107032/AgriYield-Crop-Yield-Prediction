@echo off
title AgriAI Launcher
color 0A

echo ==================================================
echo       AgriAI - Farming Assistant Launcher 🚜
echo ==================================================
echo.

echo [0/4] Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
echo    - Port 8000 is free.

echo [1/4] Checking Backend Configuration...
cd backend
if not exist "venv" (
    echo    - Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo    - Installing Backend Dependencies...
pip install -r requirements.txt > nul 2>&1
echo    - Dependencies installed.
echo.

echo [2/4] Starting AI Brain Server...
start "AgriAI Backend" cmd /k "title AgriAI Backend & python main.py"
echo    - Backend server starting in new window...
echo.

cd ..\frontend

echo [3/4] Checking Frontend Configuration...
if not exist "node_modules" (
    echo    - Installing Frontend Dependencies (This may take a minute)...
    call npm install
) else (
    echo    - Frontend dependencies ready.
)
echo.

echo [4/4] Starting Farmer App Dashboard...
echo.
echo    - Launching App...
start "AgriAI Frontend" cmd /k "title AgriAI Frontend & npm run dev"

echo.
echo ==================================================
echo       ✅ SYSTEM STARTED SUCCESSFULLY!
echo ==================================================
echo.
echo Please look for the 'Local' URL in the Frontend 
echo window (usually http://localhost:5173) and open it.
echo.
pause
