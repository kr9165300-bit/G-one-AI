@echo off
echo G ONE AI API setup
if not exist .env copy .env.example .env >nul
echo.
echo .env created. Open .env and add your own API keys.
echo Then run: npm install
 echo Then run: npm start
pause
