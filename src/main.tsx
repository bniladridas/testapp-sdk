import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext.tsx';
import App from './App.tsx';
import './index.css';
import './i18n';
import { ErrorBoundary } from './ErrorBoundary';
import * as Sentry from '@sentry/react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

// Initialize Sentry for error monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Report Core Web Vitals to Sentry
onCLS((metric) => {
  Sentry.captureMessage(`CLS: ${metric.value}`, 'info');
});
onFCP((metric) => {
  Sentry.captureMessage(`FCP: ${metric.value}`, 'info');
});
onLCP((metric) => {
  Sentry.captureMessage(`LCP: ${metric.value}`, 'info');
});
onTTFB((metric) => {
  Sentry.captureMessage(`TTFB: ${metric.value}`, 'info');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
