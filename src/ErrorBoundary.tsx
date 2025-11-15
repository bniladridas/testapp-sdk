import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('error')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('internalError')}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-gray-500">
            Error Details
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
