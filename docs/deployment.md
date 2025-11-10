# Deployment

TestApp is configured for deployment on Vercel.

## Vercel Setup

1. Connect your GitHub repository to Vercel
2. Add `GEMINI_API_KEY` to Environment Variables
3. Deploy automatically on push to main

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **API Routes**: `/api/*` handled by serverless functions

## Environment Variables

- `GEMINI_API_KEY`: Your Google AI API key

## Manual Deployment

```bash
npm run build
# Deploy dist/ to static hosting
# Deploy api/ to serverless
```

## Production URL

After deployment, your app will be available at the Vercel-provided URL.