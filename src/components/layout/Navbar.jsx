import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import useNavbarAnimations from '../../hooks/useNavbarAnimations';
import { MENUS, LANGS, LOGIN_URL, SIGNUP_URL, HELP_PATH } from './navConfig';
import styles from './Navbar.module.css';

// Menu structure, labels and routes live in ./navConfig.js (shared by Navbar and Navbar_Alt).

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

const DESKTOP_QUERY = '(min-width: 1024px) and (hover: hover)';

const Navbar = () => {
  const { t } = useTranslation();
  const { lng } = useParams(); // Navbar renders inside /:lng/*
  const location = useLocation();
  const navigate = useNavigate();

  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  // Homepage (/en, /en/) gets the dark glass; every other page gets the light glass.
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
    closeTimer.current = setTimeout(() => setOpenKey(null), 160);
  };

  // Click / keyboard toggle (touch, tablet, keyboard users)
  // On desktop (hover menus) a click goes to the menu's main landing page when it has one.
  const handleToggle = (item) => {
    if (item.to && isDesktopHover()) {
      navigate(withLng(item.to));
      return;
    }
    setOpenKey((cur) => (cur === item.key ? null : item.key));
  };

  // Highlight the trigger whose menu contains the current page
  const isActivePath = (path) => {
    const full = withLng(path);
    return location.pathname === full || location.pathname.startsWith(`${full}/`);
  };
  const menuIsActive = (item) =>
    (item.to ? isActivePath(item.to) : false) ||
    item.groups.some((group) => group.links.some((link) => link.to && isActivePath(link.to)));

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

  // All motion lives in one GSAP hook (glass, dropdowns, drawer, burger, hovers)
  useNavbarAnimations(headerRef, { openKey, mobileOpen });

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-theme={theme}
      data-menu-open={openKey !== null}
      data-mobile-open={mobileOpen}
      onMouseLeave={handleLeave}
      onMouseEnter={clearTimer}
    >
      {/* decorative layers, animated by GSAP */}
      <span className={styles.glass} data-n="glass" aria-hidden="true" />
      <span className={styles.scrim} data-n="scrim" aria-hidden="true" />
      <span className={styles.progress} data-n="progress" aria-hidden="true" />

      <div className={styles.bar}>
        <Link to={withLng('/')} className={styles.logo} data-n="logo" aria-label="Nexgn home">
          <LogoMark />
          <span className={styles.logoText}>Nexgn</span>
        </Link>

        <nav
          id="main-nav"
          className={styles.nav}
          data-n="nav"
          data-open={mobileOpen}
          aria-label={t('nav.label', 'Main navigation')}
        >
          <ul className={styles.menu}>
            {MENUS.map((item) =>
              item.groups ? (
                <li
                  key={item.key}
                  className={styles.item}
                  data-n="item"
                  onMouseEnter={() => handleEnter(item.key)}
                >
                  <button
                    type="button"
                    className={`${styles.trigger} ${menuIsActive(item) ? styles.active : ''}`}
                    data-n="trigger"
                    aria-expanded={openKey === item.key}
                    aria-controls={`panel-${item.key}`}
                    onClick={() => handleToggle(item)}
                    onFocus={() => handleEnter(item.key)}
                  >
                    <span className={styles.pill} data-n="pill" aria-hidden="true" />
                    <span className={styles.triggerLabel}>
                      {t(`nav.${item.key}.title`, item.label)}
                    </span>
                    <FiChevronDown className={styles.chevron} data-n="chevron" aria-hidden="true" />
                  </button>

                  <div
                    id={`panel-${item.key}`}
                    className={styles.panel}
                    data-n="panel"
                    data-k={item.key}
                    data-open={openKey === item.key}
                    style={{ '--cols': item.groups.filter((g) => !g.strip).length }}
                  >
                    <div className={styles.panelClip} data-n="clip">
                      <div className={styles.panelInner} data-n="inner">
                        {item.groups.map((group) => (
                          <div
                            key={group.key}
                            className={`${styles.group} ${group.strip ? styles.strip : ''}`}
                            data-n="group"
                          >
                            <h3 className={styles.groupTitle}>
                              {t(`nav.${item.key}.${group.key}.title`, group.title)}
                            </h3>
                            <ul className={styles.groupList}>
                              {group.links.map((link) => {
                                const label = t(`nav.${item.key}.${group.key}.${link.key}`, link.label);
                                return (
                                  <li key={link.key}>
                                    {link.href ? (
                                      <a
                                        href={link.href}
                                        className={styles.panelLink} data-n="plink"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {label}
                                        <FiArrowUpRight className={styles.external} aria-hidden="true" />
                                        <span className={styles.srOnly}> {t('nav.newTab', '(opens in a new tab)')}</span>
                                      </a>
                                    ) : (
                                      <Link to={withLng(link.to)} className={styles.panelLink} data-n="plink">
                                        {label}
                                      </Link>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                        {item.to && (
                          <div className={`${styles.group} ${styles.landing}`} data-n="group">
                            <Link to={withLng(item.to)} className={styles.landingLink}>
                              {t(`nav.${item.key}.overview`, item.landingLabel || item.label)}
                              <FiArrowRight aria-hidden="true" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.key} className={styles.item} data-n="item">
                  <NavLink
                    to={withLng(item.to)}
                    data-n="trigger"
                    className={({ isActive }) =>
                      `${styles.trigger} ${isActive ? styles.active : ''}`
                    }
                  >
                    <span className={styles.pill} data-n="pill" aria-hidden="true" />
                    <span className={styles.triggerLabel}>{t(`nav.${item.key}`, item.label)}</span>
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Mobile drawer actions (desktop actions live in the bar) */}
          <div className={styles.drawerActions} data-n="drawerActions">
            <a href={LOGIN_URL} className={styles.login} data-n="login">
              <span className={styles.loginLabel}>{t('nav.login', 'Log in')}</span>
            </a>
            <a href={SIGNUP_URL} className={styles.cta} data-n="cta">
              <span className={styles.sheen} data-n="sheen" aria-hidden="true" />
              {t('nav.cta', 'Start for free')}
            </a>
            <Link to={withLng(HELP_PATH)} className={styles.drawerHelp}>
              <FiHelpCircle aria-hidden="true" />
              {t('nav.helpLabel', 'Help Center')}
            </Link>
          </div>
        </nav>

        <div className={styles.actions} data-n="actions">
          <Link
            to={withLng(HELP_PATH)}
            className={styles.help}
            data-n="help"
            aria-label={t('nav.help', 'Help Center')}
          >
            <FiHelpCircle aria-hidden="true" />
          </Link>
          <a href={LOGIN_URL} className={styles.login} data-n="login">
            <span className={styles.loginLabel}>{t('nav.login', 'Log in')}</span>
          </a>
          <a href={SIGNUP_URL} className={styles.cta} data-n="cta">
            <span className={styles.sheen} data-n="sheen" aria-hidden="true" />
            {t('nav.cta', 'Start for free')}
          </a>
        </div>

        <button
          type="button"
          className={styles.burger}
          data-n="burger"
          aria-label={mobileOpen ? t('nav.close', 'Close menu') : t('nav.open', 'Open menu')}
          aria-expanded={mobileOpen}
          aria-controls="main-nav"
          onClick={() => {
            setOpenKey(null);
            setMobileOpen((v) => !v);
          }}
        >
          <span className={styles.burgerBox} data-n="burgerBox" aria-hidden="true">
            <span className={styles.burgerLine} data-n="line" />
            <span className={styles.burgerLine} data-n="line" />
            <span className={styles.burgerLine} data-n="line" />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;