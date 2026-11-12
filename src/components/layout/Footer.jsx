import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';
import { FiGlobe, FiChevronUp, FiCheck } from 'react-icons/fi';
import gsap from 'gsap';
import useFooterAnimations from '../../hooks/useFooterAnimations';
import styles from './Footer.module.css';

/**
 * Paths below are relative to the language prefix.
 * AppRouter mounts everything under /:lng/*, so "/products/esignature"
 * becomes "/en/products/esignature" at render time.
 */
const COLUMNS = [
  {
    key: 'product',
    title: 'Product',
    links: [
      { key: 'esignature', label: 'eSignature', to: '/products/esignature' },
      { key: 'docEditor', label: 'Document Editor', to: '/products/document-editor' },
      { key: 'templates', label: 'Templates', to: '/products/templates' },
      { key: 'workflows', label: 'Workflows', to: '/products/workflows' },
      { key: 'reminders', label: 'Smart Reminders', to: '/products/reminders' },
      { key: 'ai', label: 'AI Assistant', to: '/products/ai-builder' },
    ],
  },
  {
    key: 'solutions',
    title: 'Solutions',
    links: [
      { key: 'startups', label: 'Startups', to: '/solutions/startups' },
      { key: 'hr', label: 'HR', to: '/solutions/hr' },
      { key: 'legal', label: 'Legal', to: '/solutions/legal' },
      { key: 'sales', label: 'Sales', to: '/solutions/sales' },
      { key: 'realEstate', label: 'Real Estate', to: '/solutions/real-estate' },
      { key: 'agencies', label: 'Agencies', to: '/solutions/agencies' },
    ],
  },
  {
    key: 'developers',
    title: 'Developers',
    links: [
      { key: 'api', label: 'API Documentation', to: '/developers/api-reference' },
      { key: 'webhooks', label: 'Webhooks', to: '/developers/webhooks' },
      { key: 'sdks', label: 'SDKs', to: '/developers/sdks' },
      { key: 'status', label: 'System Status', href: 'https://status.nexgn.cloud' },
    ],
  },
  {
    key: 'trust',
    title: 'Trust & Security',
    links: [
      { key: 'trustCenter', label: 'Trust Center', to: '/trust' },
      { key: 'legality', label: 'eSignature Legality', to: '/trust/legality' },
      { key: 'security', label: 'Security Architecture', to: '/trust/security' },
      { key: 'privacyCenter', label: 'Privacy Center', to: '/trust/privacy' },
      { key: 'sustainability', label: 'Sustainability Pledge', to: '/sustainability' },
    ],
  },
  {
    key: 'company',
    title: 'Company',
    links: [
      { key: 'about', label: 'About Us', to: '/about' },
      { key: 'contact', label: 'Contact', to: '/contact' },
      { key: 'help', label: 'Help Center', to: '/help' },
      { key: 'blog', label: 'Blog', to: '/blog' },
    ],
  },
  {
    key: 'legal',
    title: 'Legal',
    links: [
      { key: 'terms', label: 'Terms of Service', to: '/legal/terms' },
      { key: 'privacy', label: 'Privacy Policy', to: '/legal/privacy-policy' },
      { key: 'cookies', label: 'Cookie Policy', to: '/legal/cookie-policy' },
      { key: 'aup', label: 'Acceptable Use Policy', to: '/legal/acceptable-use' },
      { key: 'refunds', label: 'Refund & Cancellation Policy', to: '/legal/refunds' },
      { key: 'dpa', label: 'Data Processing Addendum (DPA)', to: '/legal/dpa' },
    ],
  },
];

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/nexgncloud', Icon: FaLinkedinIn },
  { key: 'x', label: 'X', href: 'https://x.com/nexgncloud', Icon: FaXTwitter },
  { key: 'Instagram', label: 'Instagram', href: 'https://www.instagram.com/nexgn.cloud', Icon: FaInstagram },
];

const LANGUAGES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'hi', label: 'हिन्दी' },
];

const WORDMARK = [
  { ch: 'N' },
  { ch: 'e' },
  { ch: 'x', accent: true },
  { ch: 'g' },
  { ch: 'n' },
];

const Footer = () => {
  const footerRef = useRef(null);
  const { t } = useTranslation();
  const { lng } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLng = LANGUAGES.some((l) => l.code === lng) ? lng : 'en';
  const currentLabel = LANGUAGES.find((l) => l.code === currentLng).label;
  const year = new Date().getFullYear();

  useFooterAnimations(footerRef, location.pathname);

  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  /* ---------- language picker (custom listbox, styled to match the footer) ---------- */
  const [langOpen, setLangOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const langRef = useRef(null);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const switchLanguage = (next) => {
    setLangOpen(false);
    if (next === currentLng) return;
    const nextPath = location.pathname.replace(/^\/[^/]+/, `/${next}`) || `/${next}`;
    navigate(`${nextPath}${location.search}${location.hash}`);
  };

  const openMenu = () => {
    setActiveIdx(Math.max(0, LANGUAGES.findIndex((l) => l.code === currentLng)));
    setLangOpen(true);
  };

  // close on outside click / Escape
  useEffect(() => {
    if (!langOpen) return undefined;
    const onDown = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  // menu entrance (GSAP; skipped for reduced motion) + keyboard focus on the list
  useEffect(() => {
    const menu = menuRef.current;
    if (!langOpen || !menu) return undefined;
    menu.focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const items = menu.querySelectorAll('[role="option"]');
    const tween = gsap.timeline();
    tween.fromTo(menu, { autoAlpha: 0, y: 10, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
    tween.fromTo(items, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }, 0.05);
    return () => tween.kill();
  }, [langOpen]);

  const onMenuKeyDown = (e) => {
    const last = LANGUAGES.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i >= last ? 0 : i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? last : i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(last);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      switchLanguage(LANGUAGES[activeIdx].code);
      btnRef.current?.focus();
    } else if (e.key === 'Tab') {
      setLangOpen(false);
    }
  };

  return (
    <footer ref={footerRef} className={styles.footer} aria-label={t('footer.label', 'Site footer')}>
      <span className={styles.edge} data-f="edge" aria-hidden="true" />
      <div className={styles.container}>
        <nav className={styles.columns} aria-label={t('footer.nav', 'Footer navigation')}>
          {COLUMNS.map((col) => (
            <div className={styles.column} key={col.key} data-f="col">
              <h3 className={styles.heading}>{t(`footer.${col.key}.title`, col.title)}</h3>
              <ul className={styles.list}>
                {col.links.map((link) => (
                  <li key={link.key}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className={styles.link}
                        data-f="link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(`footer.${col.key}.${link.key}`, link.label)}
                      </a>
                    ) : (
                      <Link to={withLng(link.to)} className={styles.link} data-f="link">
                        {t(`footer.${col.key}.${link.key}`, link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.wordmark} aria-label="Nexgn" role="img" data-f="word">
          <span className={styles.spot} data-f="spot" aria-hidden="true" />
          <span className={styles.word} aria-hidden="true">
            {WORDMARK.map(({ ch, accent }, i) => (
              <span
                key={i}
                className={`${styles.letter} ${accent ? styles.accent : ''}`}
                data-f="letter"
                data-accent={accent ? 'true' : undefined}
              >
                {ch}
              </span>
            ))}
          </span>
        </div>

        <div className={styles.rule} data-f="rule" aria-hidden="true" />

        <div className={styles.bottom}>
          <p className={styles.copy} data-f="bottom">
            © {year} Nexgn. {t('footer.rights', 'All rights reserved.')}
          </p>

          <div className={styles.meta}>
            <div className={styles.langWrap} ref={langRef} data-f="bottom">
              <button
                type="button"
                ref={btnRef}
                className={`${styles.langBtn} ${langOpen ? styles.langBtnActive : ''}`}
                data-f="lang"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={`${t('footer.language', 'Select language')}: ${currentLabel}`}
                onClick={() => (langOpen ? setLangOpen(false) : openMenu())}
              >
                <FiGlobe className={styles.langGlobe} aria-hidden="true" />
                <span>{currentLabel}</span>
                <FiChevronUp
                  className={`${styles.langChevron} ${langOpen ? styles.langChevronOpen : ''}`}
                  aria-hidden="true"
                />
              </button>

              {langOpen && (
                <ul
                  ref={menuRef}
                  className={styles.langMenu}
                  role="listbox"
                  tabIndex={-1}
                  aria-label={t('footer.language', 'Select language')}
                  aria-activedescendant={`lang-opt-${LANGUAGES[activeIdx].code}`}
                  onKeyDown={onMenuKeyDown}
                >
                  {LANGUAGES.map((l, i) => (
                    <li
                      key={l.code}
                      id={`lang-opt-${l.code}`}
                      role="option"
                      lang={l.code}
                      aria-selected={l.code === currentLng}
                      className={`${styles.langOption} ${l.code === currentLng ? styles.langOptionActive : ''} ${
                        i === activeIdx ? styles.langOptionFocus : ''
                      }`}
                      onPointerEnter={() => setActiveIdx(i)}
                      onClick={() => switchLanguage(l.code)}
                    >
                      <span>{l.label}</span>
                      {l.code === currentLng && <FiCheck className={styles.langCheck} aria-hidden="true" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ul className={styles.socials}>
              {SOCIALS.map(({ key, label, href, Icon }) => (
                <li key={key} data-f="bottom pop">
                  <a
                    href={href}
                    className={styles.social}
                    data-f="social"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <p className={styles.built} data-f="bottom">
              {t('footer.built', 'Securely built by')}{' '}
              <a
                href="https://nocapcode.cloud"
                className={styles.builtLink}
                data-f="built"
                target="_blank"
                rel="noopener noreferrer"
              >
                NoCapCode Inc.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;