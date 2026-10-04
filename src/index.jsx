import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './i18n'; // <-- IMPORT THIS HERE
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

// To ensure i18n has time to load the HTTP backend file, we wrap in React.Suspense
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <React.Suspense fallback={<div className="spinner">Loading...</div>}>
          <AppRouter />
        </React.Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);