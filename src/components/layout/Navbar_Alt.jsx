import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Navbar_Alt.module.css';

const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';

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

const LogoMark = () => (
  <svg
    className={styles.logoMark}
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

const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover)';
const SCROLL_THRESHOLD = 8;

/* Navbar_Alt: for every page except the homepage.
   Transparent over the hero (white text), frosted dropdowns, and a dark frosted bar once you scroll.
   Pages whose very top is LIGHT (no dark/photo hero) can be listed here to get dark text instead,
   e.g. ['/pricing']. Paths are relative to the language prefix. */
const LIGHT_TOP_PAGES = [];

const Navbar_Alt = () => {
  const { t } = useTranslation();
  const { lng } = useParams(); // Navbar renders inside /:lng/*
  const location = useLocation();

  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  const subPath = '/' + location.pathname.split('/').filter(Boolean).slice(1).join('/');
  const lightTop = LIGHT_TOP_PAGES.some((p) => subPath === p || subPath.startsWith(`${p}/`));
  const theme = lightTop ? 'light' : 'clear';

  const [openKey, setOpenKey] = useState(null); // open dropdown (desktop) / accordion (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD
  );
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
    closeTimer.current = setTimeout(() => setOpenKey(null), 160);
  };

  // Click / keyboard toggle (touch, tablet, keyboard users)
  const handleToggle = (key) => setOpenKey((cur) => (cur === key ? null : key));

  // Highlight the trigger whose menu contains the current page
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

  // Scroll state: switches the glass to its stronger "scrolled" look
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      data-scrolled={scrolled}
      data-menu-open={openKey !== null}
      data-mobile-open={mobileOpen}
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
            {MENUS.map((item, index) =>
              item.groups ? (
                <li
                  key={item.key}
                  className={styles.item}
                  style={{ '--i': index + 1 }}
                  onMouseEnter={() => handleEnter(item.key)}
                >
                  <button
                    type="button"
                    className={`${styles.trigger} ${menuIsActive(item) ? styles.active : ''}`}
                    aria-expanded={openKey === item.key}
                    aria-controls={`panel-${item.key}`}
                    onClick={() => handleToggle(item.key)}
                    onFocus={() => handleEnter(item.key)}
                  >
                    <span className={styles.triggerLabel}>
                      {t(`nav.${item.key}.title`, item.label)}
                    </span>
                    <FiChevronDown className={styles.chevron} aria-hidden="true" />
                  </button>

                  <div
                    id={`panel-${item.key}`}
                    className={styles.panel}
                    data-open={openKey === item.key}
                    style={{ '--cols': item.groups.length }}
                  >
                    <div className={styles.panelClip}>
                      <div className={styles.panelInner}>
                        {item.groups.map((group, gi) => (
                          <div key={group.key} className={styles.group} style={{ '--gi': gi }}>
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
                  </div>
                </li>
              ) : (
                <li key={item.key} className={styles.item} style={{ '--i': index + 1 }}>
                  <NavLink
                    to={withLng(item.to)}
                    className={({ isActive }) =>
                      `${styles.trigger} ${isActive ? styles.active : ''}`
                    }
                  >
                    <span className={styles.triggerLabel}>{t(`nav.${item.key}`, item.label)}</span>
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Mobile drawer actions (desktop actions live in the bar) */}
          <div className={styles.drawerActions}>
            <a href={LOGIN_URL} className={styles.login}>
              <span className={styles.loginLabel}>{t('nav.login', 'Log in')}</span>
            </a>
            <a href={SIGNUP_URL} className={styles.cta}>
              {t('nav.cta', 'Start for free')}
            </a>
          </div>
        </nav>

        <div className={styles.actions} style={{ '--i': MENUS.length + 1 }}>
          <a href={LOGIN_URL} className={styles.login}>
            <span className={styles.loginLabel}>{t('nav.login', 'Log in')}</span>
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
          <span className={styles.burgerBox} aria-hidden="true">
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar_Alt;