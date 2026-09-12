# GoSubsidy Deployment Package

This package contains the existing GoSubsidy frontend and backend.

## Folders
- frontend/ — React/Vite frontend; deploy to Vercel
- backend/ — Node/Express backend; deploy to Render or another Node host
- mobile_expo/ — retained for later mobile deployment

## Frontend
Build command: npm run build
Output directory: dist

## Backend
Start command: npm start
The hosting provider supplies PORT. Set CORS_ORIGIN to the deployed frontend URL.

## Security
Real .env files, secrets, and node_modules are intentionally excluded.
Configure production secrets only in the hosting provider's environment settings.
Do not commit API keys or service-role keys to GitHub.
