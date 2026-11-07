import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import useNavbarAnimations from '../../hooks/useNavbarAnimations';
import styles from './Navbar.module.css';

/* =====================================================================
   NEXGN NAVBAR — the one navbar for every page (replaces Navbar + Navbar_Alt)

   Desktop (>= 1024px)
     • at the top of a page: full-width, transparent, logo mark + wordmark
     • after scrolling: it contracts into a floating glass pill, wordmark folds away
     • hover / click opens a frosted dropdown with staggered columns
   Mobile / tablet (< 1024px)
     • rounded glass bar: logo mark + three dots
     • the dots morph into an X and the bar grows into the menu card (accordion sections)

   All motion lives in hooks/useNavbarAnimations.js (GSAP). The CSS has no transitions.
   ===================================================================== */

const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LANGS = ['en', 'es', 'hi'];

/**
 * Paths are relative to the language prefix (AppRouter mounts under /:lng/*).
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

const LogoMark = () => (
  <svg
    className={styles.logoMark}
    data-n="mark"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M26.126 0C29.1586 0.000103077 31.6171 2.45855 31.6172 5.49121V26.126C31.6172 26.399 31.5961 26.6673 31.5576 26.9297L23.9355 19.4746C22.8515 18.4144 21.1035 18.4239 20.0312 19.4961L18.7148 20.8135C17.6431 21.8857 17.6517 23.6146 18.7354 24.6748L25.833 31.6172H5.49121C5.39788 31.6172 5.30508 31.615 5.21289 31.6104L25.165 12.0938C26.2487 11.0333 26.2577 9.30457 25.1855 8.23242L23.8691 6.91602C22.7969 5.84377 21.0488 5.83415 19.9648 6.89453L0.00683594 26.416C0.00183573 26.32 3.37262e-06 26.2233 0 26.126V5.75195L7.64551 13.2314C8.72927 14.2916 10.4775 14.2816 11.5498 13.21L12.8672 11.8926C13.9392 10.8203 13.9296 9.09156 12.8457 8.03125L4.69434 0.0576172C4.9545 0.0197894 5.22056 5.65771e-06 5.49121 0H26.126Z"
      fill="currentColor"
    />
  </svg>
);

const DESKTOP_QUERY = '(min-width: 1024px)';
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

const Navbar = () => {
  const { t } = useTranslation();
  const { lng } = useParams(); // Navbar renders inside /:lng/*
  const location = useLocation();

  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  const [openKey, setOpenKey] = useState(null); // open dropdown (desktop) / accordion section (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const closeTimer = useRef(null);

  useNavbarAnimations(headerRef, { openKey, mobileOpen });

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

  const canHoverOpen = () =>
    typeof window !== 'undefined' &&
    window.matchMedia(DESKTOP_QUERY).matches &&
    window.matchMedia(HOVER_QUERY).matches;

  // Hover opens menus on desktop; a short delay on leave stops flicker
  const handleEnter = (key) => {
    if (!canHoverOpen()) return;
    clearTimer();
    setOpenKey(key);
  };
  const handleLeave = () => {
    if (!canHoverOpen()) return;
    clearTimer();
    closeTimer.current = setTimeout(() => setOpenKey(null), 180);
  };
  const handleToggle = (key) => setOpenKey((cur) => (cur === key ? null : key));

  const isActivePath = (path) => {
    const full = withLng(path);
    return location.pathname === full || location.pathname.startsWith(`${full}/`);
  };
  const menuIsActive = (item) =>
    item.groups.some((group) => group.links.some((link) => isActivePath(link.to)));

  // Close on route change
  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  // Escape, outside click, resize to desktop
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeAll();
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) closeAll();
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => closeAll();

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    mq.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      mq.removeEventListener('change', onChange);
      clearTimer();
    };
  }, [closeAll]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const label = (item) => t(`nav.${item.key}.title`, item.label);
  const groupTitle = (item, group) => t(`nav.${item.key}.${group.key}.title`, group.title);
  const linkLabel = (item, group, link) => t(`nav.${item.key}.${group.key}.${link.key}`, link.label);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-mobile-open={mobileOpen}
      data-menu-open={openKey !== null}
      onMouseLeave={handleLeave}
      onMouseEnter={clearTimer}
    >
      {/* dims the page behind an open dropdown / mobile menu */}
      <div className={styles.scrim} data-n="scrim" onClick={closeAll} aria-hidden="true" />

      <div className={styles.bar} data-n="bar">
        <span className={styles.glass} data-n="glass" aria-hidden="true" />
        <span className={styles.progress} data-n="progress" aria-hidden="true" />

        <div className={styles.row} data-n="row">
          <Link to={withLng('/')} className={styles.logo} data-n="logo" aria-label="Nexgn home">
            <LogoMark />
            <span className={styles.logoWord} data-n="word">
              <span className={styles.logoText}>Nexgn</span>
            </span>
          </Link>

          {/* ---------------- desktop navigation ---------------- */}
          <nav className={styles.nav} aria-label={t('nav.label', 'Main navigation')}>
            <ul className={styles.menu} data-n="menu">
              <li className={styles.hlWrap} aria-hidden="true">
                <span className={styles.hl} data-n="hl" />
              </li>
              {MENUS.map((item) =>
                item.groups ? (
                  <li key={item.key} className={styles.item} onMouseEnter={() => handleEnter(item.key)}>
                    <button
                      type="button"
                      className={`${styles.trigger} ${menuIsActive(item) ? styles.active : ''}`}
                      data-n="trigger"
                      data-k={item.key}
                      aria-expanded={openKey === item.key}
                      aria-controls={`panel-${item.key}`}
                      onClick={() => handleToggle(item.key)}
                      onFocus={() => handleEnter(item.key)}
                    >
                      <span>{label(item)}</span>
                      <FiChevronDown className={styles.chevron} data-n="chev" aria-hidden="true" />
                    </button>

                    <div
                      id={`panel-${item.key}`}
                      className={styles.panel}
                      data-n="panel"
                      data-k={item.key}
                      data-open={openKey === item.key}
                      style={{ '--cols': item.groups.length }}
                    >
                      <div className={styles.panelInner}>
                        {item.groups.map((group) => (
                          <div key={group.key} className={styles.group} data-n="group">
                            <h3 className={styles.groupTitle}>{groupTitle(item, group)}</h3>
                            <ul className={styles.groupList}>
                              {group.links.map((link) => (
                                <li key={link.key}>
                                  <Link to={withLng(link.to)} className={styles.panelLink} data-n="plink">
                                    {linkLabel(item, group, link)}
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
                      data-n="trigger"
                      className={({ isActive }) => `${styles.trigger} ${isActive ? styles.active : ''}`}
                    >
                      <span>{t(`nav.${item.key}`, item.label)}</span>
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a href={LOGIN_URL} className={styles.login} data-n="login">
              <span>{t('nav.login', 'Log in')}</span>
              <i className={styles.loginLine} data-n="loginLine" aria-hidden="true" />
            </a>
            <a href={SIGNUP_URL} className={styles.cta} data-n="cta">
              <span className={styles.ctaLabel}>{t('nav.cta', 'Start for free')}</span>
              <i className={styles.sheen} data-n="sheen" aria-hidden="true" />
            </a>
          </div>

          {/* ---------------- mobile: three dots -> X ---------------- */}
          <button
            type="button"
            className={styles.burger}
            data-n="burger"
            aria-label={mobileOpen ? t('nav.close', 'Close menu') : t('nav.open', 'Open menu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              setOpenKey(null);
              setMobileOpen((v) => !v);
            }}
          >
            <span className={styles.dots} aria-hidden="true">
              <i className={styles.dot} data-n="dot" />
              <i className={styles.dot} data-n="dot" />
              <i className={styles.dot} data-n="dot" />
              <i className={styles.xl} data-n="xl" />
              <i className={styles.xl} data-n="xl" />
            </span>
          </button>
        </div>

        {/* ---------------- mobile menu card (grows out of the bar) ---------------- */}
        <div id="mobile-menu" className={styles.drawer} data-n="drawer" data-open={mobileOpen}>
          <ul className={styles.mList}>
            {MENUS.map((item) =>
              item.groups ? (
                <li key={item.key} className={styles.mItem} data-n="mitem">
                  <button
                    type="button"
                    className={styles.mTrigger}
                    aria-expanded={openKey === item.key}
                    aria-controls={`m-${item.key}`}
                    data-k={item.key}
                    onClick={() => handleToggle(item.key)}
                  >
                    <span>{label(item)}</span>
                    <FiChevronDown className={styles.mChev} data-n="mchev" aria-hidden="true" />
                  </button>
                  <div
                    id={`m-${item.key}`}
                    className={styles.mAcc}
                    data-n="acc"
                    data-k={item.key}
                    data-open={openKey === item.key}
                  >
                    <div className={styles.mAccInner}>
                      {item.groups.map((group) => (
                        <div key={group.key} className={styles.mGroup}>
                          <h3 className={styles.mGroupTitle}>{groupTitle(item, group)}</h3>
                          <ul className={styles.mLinks}>
                            {group.links.map((link) => (
                              <li key={link.key}>
                                <Link to={withLng(link.to)} className={styles.mLink} data-n="mlink">
                                  {linkLabel(item, group, link)}
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
                <li key={item.key} className={styles.mItem} data-n="mitem">
                  <NavLink
                    to={withLng(item.to)}
                    className={({ isActive }) => `${styles.mTrigger} ${isActive ? styles.mActive : ''}`}
                  >
                    <span>{t(`nav.${item.key}`, item.label)}</span>
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <div className={styles.mActions} data-n="mactions">
            <a href={LOGIN_URL} className={styles.mLogin}>
              {t('nav.login', 'Log in')}
            </a>
            <a href={SIGNUP_URL} className={styles.mCta} data-n="mcta">
              {t('nav.cta', 'Start for free')}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;