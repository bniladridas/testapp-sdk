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
- `SENTRY_DSN`: Sentry DSN for backend error monitoring
- `VITE_SENTRY_DSN`: Sentry DSN for frontend error monitoring

## Manual Deployment

```bash
npm run build
# Deploy dist/ to static hosting
# Deploy api/ to serverless
```

## CDN and Asset Optimization

Vercel provides global CDN distribution with automatic optimization:

- **Global CDN**: Assets served from edge locations worldwide
- **Automatic Compression**: Gzip/Brotli compression enabled
- **Code Splitting**: Optimized chunks for vendor, UI, router, and utilities
- **Image Optimization**: Automatic WebP conversion and responsive images

## Monitoring Setup

### Error Tracking

1. Create a Sentry project at https://sentry.io
2. Add the DSN to environment variables
3. Configure alerts for production errors

### Performance Monitoring

- Core Web Vitals automatically tracked
- API performance monitored via Sentry
- Database connection pooling metrics available

### Health Checks

Monitor application health at `/api/health` and `/api/health/database`.

## Production URL

After deployment, your app will be available at the Vercel-provided URL.
