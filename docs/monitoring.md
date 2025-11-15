# Monitoring and Error Tracking

This document covers the monitoring and error tracking setup for TestApp, including Sentry integration and performance monitoring.

## Overview

TestApp uses Sentry for comprehensive error monitoring and performance tracking across both frontend and backend components.

## Sentry Integration

### Frontend Monitoring

The React application is configured with Sentry for:

- **Error Tracking**: Automatic capture of JavaScript errors, unhandled promise rejections, and React component errors
- **Performance Monitoring**: Transaction tracing and performance metrics
- **Session Replay**: User session recordings for debugging complex issues
- **Core Web Vitals**: Real-time tracking of CLS, FCP, LCP, and TTFB metrics

#### Configuration

Sentry is initialized in `src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### Core Web Vitals Tracking

Core Web Vitals are tracked using the `web-vitals` library and reported to Sentry:

```typescript
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS((metric) => Sentry.captureMessage(`CLS: ${metric.value}`, 'info'));
onFCP((metric) => Sentry.captureMessage(`FCP: ${metric.value}`, 'info'));
onLCP((metric) => Sentry.captureMessage(`LCP: ${metric.value}`, 'info'));
onTTFB((metric) => Sentry.captureMessage(`TTFB: ${metric.value}`, 'info'));
```

### Backend Monitoring

The Node.js/Express server is configured with Sentry for:

- **Error Tracking**: Server errors, unhandled exceptions, and API failures
- **HTTP Request Monitoring**: Automatic tracing of incoming requests
- **Database Query Monitoring**: Connection pool and query performance
- **Performance Tracing**: Transaction spans for API endpoints

#### Configuration

Sentry is initialized in `server.mjs`:

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.httpIntegration()],
  tracesSampleRate: 1.0,
});

app.use(Sentry.expressIntegration());
app.use(Sentry.expressErrorHandler());
```

## Environment Setup

### Required Environment Variables

Add these to your environment configuration:

```bash
# Sentry DSN for error tracking
SENTRY_DSN=https://your_sentry_dsn_here
VITE_SENTRY_DSN=https://your_sentry_dsn_here
```

### Sentry Project Setup

1. Create a Sentry project at https://sentry.io
2. Get your DSN from Project Settings > Client Keys
3. Configure the DSN in your environment variables

## Monitoring Dashboards

### Error Tracking

- View errors in Sentry dashboard
- Filter by release, environment, and user
- See stack traces and breadcrumbs
- Access session replays for frontend issues

### Performance Monitoring

- Track API response times
- Monitor Core Web Vitals metrics
- View transaction traces
- Identify performance bottlenecks

## Alerting

Configure alerts in Sentry for:

- New error occurrences
- Performance regressions
- High error rates
- Core Web Vitals thresholds

## Best Practices

### Error Handling

- Use Sentry's error boundaries for React components
- Log meaningful error messages
- Include relevant context in error reports
- Avoid logging sensitive information

### Performance Monitoring

- Monitor Core Web Vitals regularly
- Set up performance budgets
- Track trends over time
- Use real user monitoring (RUM)

## Troubleshooting

### Common Issues

1. **Missing DSN**: Ensure `SENTRY_DSN` and `VITE_SENTRY_DSN` are set
2. **CORS Issues**: Configure Sentry to allow your domain
3. **Large Payloads**: Be mindful of attachment sizes in error reports
4. **Rate Limiting**: Monitor your Sentry plan's event limits

### Testing

Test error reporting in development:

```javascript
// Frontend
Sentry.captureException(new Error('Test error'));

// Backend
Sentry.captureException(new Error('Test server error'));
```

## Security Considerations

- Never commit DSN keys to version control
- Use environment-specific DSNs (dev/staging/prod)
- Configure appropriate data scrubbing rules
- Review PII handling in error reports</content>
  <parameter name="filePath">docs/monitoring.md
