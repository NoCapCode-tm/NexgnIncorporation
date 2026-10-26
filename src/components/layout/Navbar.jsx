import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import styles from './Navbar.module.css';

// TODO: replace with your real app URLs
const LOGIN_URL = 'https://app.nexgn.com/login';
const SIGNUP_URL = 'https://app.nexgn.com/signup';

const LANGS = ['en', 'es', 'hi'];

/**
 * Paths are relative to the language prefix (AppRouter mounts under /:lng/*).
 * Each menu has `groups`, and each group has `links`. The Product menu mirrors the Figma overlay.
 *
 * TODO route not in AppRouter yet: /labs (Nexgn Labs)
 */
const MENUS = [
  {
    key: 'product',
    label: 'Product',
    groups: [
      {
        key: 'core',
        title: 'Core Agreement Products',
        links: [
          { key: 'esignature', label: 'eSignature', to: '/products/esignature' },
          { key: 'docEditor', label: 'Document Editor', to: '/products/document-editor' },
          { key: 'templates', label: 'Templates', to: '/products/templates' },
          { key: 'workflows', label: 'Agreement Workflow & Scheduler', to: '/products/workflows' },
        ],
      },
      {
        key: 'intelligence',
        title: 'Intelligence (Nexgn AI)',
        links: [
          { key: 'aiSummary', label: 'AI Agreement Summary', to: '/products/ai-summary' },
          { key: 'aiBuilder', label: 'AI Template Builder', to: '/products/ai-builder' },
        ],
      },
      {
        key: 'trust',
        title: 'Trust & Evidence',
        links: [
          { key: 'identity', label: 'Identity Assurance', to: '/products/identity-assurance' },
          { key: 'audit', label: 'Audit Trails', to: '/products/audit-trail' },
          { key: 'verification', label: 'Agreement Verification', to: '/products/agreement-verification' },
        ],
      },
      {
        key: 'workspace',
        title: 'Workspace & Management',
        links: [
          { key: 'workspace', label: 'Team Workspace & RBAC', to: '/products/workspace' },
          { key: 'storage', label: 'Google Drive & Storage', to: '/products/storage' },
        ],
      },
      {
        key: 'explore',
        title: 'Explore',
        links: [
          { key: 'whatsNew', label: 'What’s New', to: '/changelog' },
          { key: 'labs', label: 'Nexgn Labs', to: '/labs' },
          { key: 'roadmap', label: 'Product Roadmap', to: '/roadmap' },
        ],
      },
    ],
  },
  {
    key: 'solutions',
    label: 'Solutions',
    groups: [
      {
        key: 'teams',
        title: 'By Team',
        links: [
          { key: 'hr', label: 'HR', to: '/solutions/hr' },
          { key: 'sales', label: 'Sales', to: '/solutions/sales' },
          { key: 'legal', label: 'Legal', to: '/solutions/legal' },
          { key: 'realEstate', label: 'Real Estate', to: '/solutions/real-estate' },
        ],
      },
      {
        key: 'company',
        title: 'By Company Size',
        links: [
          { key: 'startups', label: 'Startups', to: '/solutions/startups' },
          { key: 'smb', label: 'Small & Medium Business', to: '/solutions/smb' },
          { key: 'enterprise', label: 'Enterprise', to: '/solutions/enterprise' },
        ],
      },
      {
        key: 'more',
        title: 'More',
        links: [
          { key: 'agencies', label: 'Agencies', to: '/solutions/agencies' },
          { key: 'individuals', label: 'Individuals', to: '/solutions/individuals' },
        ],
      },
    ],
  },
  {
    key: 'developers',
    label: 'Developers',
    groups: [
      {
        key: 'build',
        title: 'Build',
        links: [
          { key: 'portal', label: 'Developer Portal', to: '/developers' },
          { key: 'api', label: 'API Reference', to: '/developers/api-reference' },
          { key: 'embedded', label: 'Embedded Signing', to: '/developers/embedded' },
        ],
      },
      {
        key: 'integrate',
        title: 'Integrate',
        links: [
          { key: 'webhooks', label: 'Webhooks', to: '/developers/webhooks' },
          { key: 'sdks', label: 'SDKs', to: '/developers/sdks' },
          { key: 'sandbox', label: 'Sandbox', to: '/developers/sandbox' },
        ],
      },
    ],
  },
  {
    key: 'trust',
    label: 'Trust Centre',
    groups: [
      {
        key: 'trust',
        title: 'Trust',
        links: [
          { key: 'center', label: 'Trust Centre', to: '/trust' },
          { key: 'security', label: 'Security Architecture', to: '/trust/security' },
          { key: 'legality', label: 'eSignature Legality', to: '/trust/legality' },
          { key: 'privacy', label: 'Privacy Centre', to: '/trust/privacy' },
        ],
      },
      {
        key: 'compliance',
        title: 'Compliance',
        links: [
          { key: 'subprocessors', label: 'Subprocessors', to: '/trust/subprocessors' },
          { key: 'vuln', label: 'Vulnerability Disclosure', to: '/trust/vulnerability-disclosure' },
          { key: 'sustainability', label: 'Sustainability Pledge', to: '/sustainability' },
        ],
      },
    ],
  },
  { key: 'pricing', label: 'Pricing', to: '/pricing' },
];

// Placeholder mark. Replace with your real logo SVG.
const LogoMark = () => (
  <svg viewBox="0 0 32 32" className={styles.logoMark} aria-hidden="true" focusable="false">
    <path d="M2 2h12l-5 8 7 4-7 4 4 12H2z" fill="currentColor" />
    <path d="M30 30H18l5-8-7-4 7-4-4-12h12z" fill="currentColor" opacity="0.85" />
  </svg>
);

const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover)';

const Navbar = () => {
  const { t } = useTranslation();
  const { lng } = useParams(); // Navbar renders inside /:lng/*
  const location = useLocation();

  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  // Homepage (/en, /en/) gets the dark navbar; every other page gets the white one.
  const isHome = location.pathname.split('/').filter(Boolean).length <= 1;
  const theme = isHome ? 'dark' : 'light';

  const [openKey, setOpenKey] = useState(null); // open dropdown (desktop) / accordion (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const closeTimer = useRef(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeAll = useCallback(() => {
    clearTimer();
    setOpenKey(null);
    setMobileOpen(false);
  }, []);

  const isDesktopHover = () =>
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

  // Hover opens menus on desktop; small delay on leave stops flicker
  const handleEnter = (key) => {
    if (!isDesktopHover()) return;
    clearTimer();
    setOpenKey(key);
  };
  const handleLeave = () => {
    if (!isDesktopHover()) return;
    clearTimer();
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };

  // Click / keyboard toggle (touch, tablet, keyboard users)
  const handleToggle = (key) => setOpenKey((cur) => (cur === key ? null : key));

  // Close on route change
  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  // Escape, outside click, and resize to desktop
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeAll();
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) closeAll();
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onResize = () => mq.matches && setMobileOpen(false);

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    mq.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      mq.removeEventListener('change', onResize);
      clearTimer();
    };
  }, [closeAll]);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-theme={theme}
      onMouseLeave={handleLeave}
      onMouseEnter={clearTimer}
    >
      <div className={styles.bar}>
        <Link to={withLng('/')} className={styles.logo} aria-label="Nexgn home">
          <LogoMark />
          <span className={styles.logoText}>Nexgn</span>
        </Link>

        <nav
          id="main-nav"
          className={styles.nav}
          data-open={mobileOpen}
          aria-label={t('nav.label', 'Main navigation')}
        >
          <ul className={styles.menu}>
            {MENUS.map((item) =>
              item.groups ? (
                <li
                  key={item.key}
                  className={styles.item}
                  onMouseEnter={() => handleEnter(item.key)}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={openKey === item.key}
                    aria-controls={`panel-${item.key}`}
                    onClick={() => handleToggle(item.key)}
                    onFocus={() => handleEnter(item.key)}
                  >
                    {t(`nav.${item.key}.title`, item.label)}
                    <FiChevronDown className={styles.chevron} aria-hidden="true" />
                  </button>

                  <div
                    id={`panel-${item.key}`}
                    className={styles.panel}
                    data-open={openKey === item.key}
                    style={{ '--cols': item.groups.length }}
                  >
                    <div className={styles.panelInner}>
                      {item.groups.map((group) => (
                        <div key={group.key} className={styles.group}>
                          <h3 className={styles.groupTitle}>
                            {t(`nav.${item.key}.${group.key}.title`, group.title)}
                          </h3>
                          <ul className={styles.groupList}>
                            {group.links.map((link) => (
                              <li key={link.key}>
                                <Link to={withLng(link.to)} className={styles.panelLink}>
                                  {t(`nav.${item.key}.${group.key}.${link.key}`, link.label)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.key} className={styles.item}>
                  <NavLink
                    to={withLng(item.to)}
                    className={({ isActive }) =>
                      `${styles.trigger} ${isActive ? styles.active : ''}`
                    }
                  >
                    {t(`nav.${item.key}`, item.label)}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Mobile drawer actions (desktop actions live in the bar) */}
          <div className={styles.drawerActions}>
            <a href={LOGIN_URL} className={styles.login}>
              {t('nav.login', 'Log in')}
            </a>
            <a href={SIGNUP_URL} className={styles.cta}>
              {t('nav.cta', 'Start for free')}
            </a>
          </div>
        </nav>

        <div className={styles.actions}>
          <a href={LOGIN_URL} className={styles.login}>
            {t('nav.login', 'Log in')}
          </a>
          <a href={SIGNUP_URL} className={styles.cta}>
            {t('nav.cta', 'Start for free')}
          </a>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label={mobileOpen ? t('nav.close', 'Close menu') : t('nav.open', 'Open menu')}
          aria-expanded={mobileOpen}
          aria-controls="main-nav"
          onClick={() => {
            setOpenKey(null);
            setMobileOpen((v) => !v);
          }}
        >
          {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;