import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ErrorBoundary.module.css';

/**
 * ErrorBoundary
 *
 * Catches render and lazy-load errors below it and shows one of two screens:
 *   1. "A new version is available": the browser asked for a page file from an older build that
 *      no longer exists (ChunkLoadError / failed dynamic import after a deploy). Only a reload fixes it.
 *   2. "We couldn't load this page": any other runtime error. Offers "Try again", a way home,
 *      support links and a reference ID the customer can quote to support.
 *
 * Usage (AppRouter.jsx): <ErrorBoundary key={location.pathname}> ... </ErrorBoundary>
 * The key remounts the boundary on every URL change, so the error screen clears on navigation.
 *
 * Copy is translated through i18next (keys under `errorBoundary.*`, English defaults below).
 * Error details are written to the browser console together with the reference ID.
 */

const SUPPORTED_LANGUAGES = ['en', 'es', 'hi']; // keep in sync with AppRouter.jsx
const SUPPORT_EMAIL = 'gateway@nexgn.cloud';
const STATUS_URL = 'https://status.nexgn.cloud';

const STALE_BUILD_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk [\w-]+ failed/i,
  /Loading CSS chunk/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS/i,
];

const isStaleBuildError = (error) => {
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`;
  return STALE_BUILD_PATTERNS.some((pattern) => pattern.test(text));
};

const makeReference = () =>
  `NGX-${(Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).slice(-6).toUpperCase()}`;

const formatUtc = (iso) => iso.slice(0, 16).replace('T', ' ');

// The boundary can render outside the router, so read the language from the URL directly.
const langPrefix = () => {
  try {
    const segment = window.location.pathname.split('/')[1];
    return SUPPORTED_LANGUAGES.includes(segment) ? `/${segment}` : '/en';
  } catch {
    return '/en';
  }
};

// English defaults (used when a translation key is missing)
const COPY = {
  update: {
    title: 'A new version of Nexgn is available',
    body: 'We’ve released an update since you opened this page. Reload to continue with the latest version.',
    primary: 'Reload page',
  },
  error: {
    title: 'We couldn’t load this page',
    body: 'Something went wrong while displaying this content. Please try again. If the issue continues, quote the reference below when you contact our support team.',
    primary: 'Try again',
  },
  home: 'Go to homepage',
  support: 'Need assistance?',
  contact: 'Contact support',
  helpCenter: 'Help Center',
  status: 'System status',
  reference: 'Reference ID',
  time: 'Time (UTC)',
};

const ErrorFallback = ({ stale, reference, timestamp, onRetry }) => {
  const { t } = useTranslation();
  const headingRef = useRef(null);
  const prefix = langPrefix();
  const kind = stale ? 'update' : 'error';
  const copy = COPY[kind];

  // Move focus to the heading so screen readers announce the problem right away
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handlePrimary = stale ? () => window.location.reload() : onRetry;

  return (
    <section className={styles.wrap} role="alert" aria-labelledby="nx-error-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 id="nx-error-title" ref={headingRef} tabIndex={-1} className={styles.title}>
            {t(`errorBoundary.${kind}.title`, copy.title)}
          </h1>
          <p className={styles.body}>{t(`errorBoundary.${kind}.body`, copy.body)}</p>

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={handlePrimary}>
              {t(`errorBoundary.${kind}.primary`, copy.primary)}
            </button>
            <a className={styles.secondary} href={prefix}>
              {t('errorBoundary.home', COPY.home)}
            </a>
          </div>

          {!stale && (
            <>
              <dl className={styles.meta}>
                <div>
                  <dt>{t('errorBoundary.reference', COPY.reference)}</dt>
                  <dd>
                    <code>{reference}</code>
                  </dd>
                </div>
                <div>
                  <dt>{t('errorBoundary.time', COPY.time)}</dt>
                  <dd>
                    <time dateTime={timestamp}>{formatUtc(timestamp)}</time>
                  </dd>
                </div>
              </dl>

              <p className={styles.support}>
                <span>{t('errorBoundary.support', COPY.support)}</span>
                <a href={`mailto:${SUPPORT_EMAIL}`}>{t('errorBoundary.contact', COPY.contact)}</a>
                <a href={`${prefix}/help`}>{t('errorBoundary.helpCenter', COPY.helpCenter)}</a>
                <a href={STATUS_URL} target="_blank" rel="noopener noreferrer">
                  {t('errorBoundary.status', COPY.status)}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export class ErrorBoundary extends React.Component {
  state = { error: null, reference: '', timestamp: '' };

  static getDerivedStateFromError(error) {
    return { error, reference: makeReference(), timestamp: new Date().toISOString() };
  }

  componentDidCatch(error, info) {
    // Visible in the browser console and in any log collector attached to it
    console.error(`[Nexgn] ${this.state.reference} ${error?.name || 'Error'}: ${error?.message}`, info?.componentStack);
    this.props.onError?.(error, info, this.state.reference);
  }

  handleRetry = () => this.setState({ error: null });

  render() {
    const { error, reference, timestamp } = this.state;
    if (!error) return this.props.children;

    return (
      <ErrorFallback
        stale={isStaleBuildError(error)}
        reference={reference}
        timestamp={timestamp}
        onRetry={this.handleRetry}
      />
    );
  }
}

export default ErrorBoundary;