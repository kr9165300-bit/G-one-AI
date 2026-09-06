@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing required packages...
  call npm.cmd install
)
if not exist .env (
  echo.
  echo .env file is missing.
  echo Copy .env.example to .env and add your Gemini API key.
  pause
  exit /b 1
)
start "G ONE AI Gemini Server" cmd /k "npm.cmd start"
timeout /t 3 /nobreak >nul
start http://localhost:3000
