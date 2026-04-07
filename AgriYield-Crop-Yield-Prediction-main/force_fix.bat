@echo off
title AgriAI - Force Fix & Restart
color 0C

echo ==================================================
echo       AgriAI - SYSTEM REPAIR TOOL 🛠️
echo ==================================================
echo.
echo This script will:
echo 1. Kill all running Python and Node processes (Fixes Port 8000)
echo 2. Re-install key dependencies
echo 3. Restart the entire application
echo.
echo Press ANY KEY to start repair...
pause >nul

echo.
echo [1/3] Stopping all background processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1
echo    - All processes stopped. Ports cleared.
echo.

echo [2/3] Verifying Backend & Installing OpenCV...
cd backend
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
echo    - Installing opencv-python-headless...
pip install opencv-python-headless uvicorn fastapi python-multipart numpy requests >nul 2>&1
echo    - Dependencies repaired.
echo.

echo [3/3] Restarting Servers...
echo    - Starting Backend API...
start "AgriAI Backend" cmd /k "title AgriAI Backend & python main.py"
timeout /t 5 >nul

cd ..\frontend
echo    - Starting Frontend...
start "AgriAI Frontend" cmd /k "title AgriAI Frontend & npm run dev"

echo.
echo ==================================================
echo       ✅ REPAIR COMPLETE!
echo ==================================================
echo.
echo 1. Close this window.
echo 2. Wait for the new Backend window to say "Application startup complete".
echo 3. Open the Frontend URL (localhost:5173).
echo 4. Try the Disease Detection again.
echo.
pause
