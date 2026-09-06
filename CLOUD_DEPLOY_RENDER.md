# G ONE AI — Cloud Deployment (Render + Google Gemini)

This package is prepared as a Node/Express Web Service for Render.

## 1. Upload to GitHub
Create a GitHub repository and upload all files in this folder.
Do NOT upload `.env`; use Render Environment Variables.

## 2. Deploy on Render
- Open Render Dashboard.
- New -> Web Service.
- Connect your GitHub repository.
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`
- Choose Free for testing/hobby use.

Render provides an `onrender.com` URL after deployment.

## 3. Environment Variables
Set these in Render -> Environment:

GEMINI_API_KEY = your Google Gemini API key
GEMINI_MODEL = gemini-2.5-flash-lite
G_ONE_AI_API_KEY = create a separate secret for your own API
BRAVE_SEARCH_API_KEY = optional

Never put secret values into frontend JavaScript or commit them to GitHub.

## 4. Test
Open:
`https://YOUR-SERVICE.onrender.com/health`

Then:
`https://YOUR-SERVICE.onrender.com/api/g-one-ai`

## 5. Call your own API
POST:
`https://YOUR-SERVICE.onrender.com/api/g-one-ai/chat`

JSON:
`{"message":"Hello G ONE AI"}`

If `G_ONE_AI_API_KEY` is set, send:
`x-api-key: YOUR_OWN_API_KEY`

The Gemini key stays on the cloud server; it is never sent to the browser.

## Note about Render Free
Free web services can spin down after 15 minutes without inbound traffic and may take about a minute to wake up. Local filesystem data is ephemeral. This app only uses temporary upload files, so no persistent upload storage is assumed.
