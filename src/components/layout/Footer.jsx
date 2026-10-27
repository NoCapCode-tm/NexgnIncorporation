import React from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGlobe } from 'react-icons/fi';
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
      { key: 'finance', label: 'Finance', to: '/solutions/finance' },
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
      { key: 'careers', label: 'Careers', to: '/careers' },
      { key: 'contact', label: 'Contact', to: '/contact' },
      { key: 'partners', label: 'Partners', to: '/partners' },
      { key: 'blog', label: 'Blog', to: '/blog' }, // Added Blog Route Here
    ],
  },
  {
    key: 'legal',
    title: 'Legal',
    links: [
      { key: 'terms', label: 'Terms of Service', to: '/legal/terms' },
      { key: 'privacy', label: 'Privacy Policy', to: '/legal/privacy-policy' },
      { key: 'cookies', label: 'Cookie Policy', to: '/legal/cookies' },
      { key: 'aup', label: 'Acceptable Use Policy', to: '/legal/acceptable-use' },
      { key: 'dpa', label: 'Data Processing Addendum (DPA)', to: '/legal/dpa' },
    ],
  },
];

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/nexgncloud', Icon: FaLinkedinIn },
  { key: 'x', label: 'X', href: 'https://x.com/nexgncloud', Icon: FaXTwitter },
  { key: 'github', label: 'GitHub', href: 'https://github.com/', Icon: FaGithub },
];

const LANGUAGES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'hi', label: 'हिन्दी' },
];

const Footer = () => {
  const { t } = useTranslation();
  const { lng } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const currentLng = LANGUAGES.some((l) => l.code === lng) ? lng : 'en';
  const currentLabel = LANGUAGES.find((l) => l.code === currentLng).label;
  const year = new Date().getFullYear();

  const withLng = (path) => `/${currentLng}${path === '/' ? '' : path}`;

  const handleLanguageChange = (e) => {
    const next = e.target.value;
    const nextPath = location.pathname.replace(/^\/[^/]+/, `/${next}`);
    navigate(`${nextPath}${location.search}${location.hash}`);
  };

  return (
    <footer className={styles.footer} aria-label={t('footer.label', 'Site footer')}>
      <div className={styles.container}>
        <nav className={styles.columns} aria-label={t('footer.nav', 'Footer navigation')}>
          {COLUMNS.map((col) => (
            <div className={styles.column} key={col.key}>
              <h3 className={styles.heading}>{t(`footer.${col.key}.title`, col.title)}</h3>
              <ul className={styles.list}>
                {col.links.map((link) => (
                  <li key={link.key}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(`footer.${col.key}.${link.key}`, link.label)}
                      </a>
                    ) : (
                      <Link to={withLng(link.to)} className={styles.link}>
                        {t(`footer.${col.key}.${link.key}`, link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.wordmark} aria-label="Nexgn" role="img">
          <span aria-hidden="true">
            Ne<span className={styles.accent}>x</span>gn
          </span>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} Nexgn. {t('footer.rights', 'All rights reserved.')}
          </p>

          <div className={styles.meta}>
            <label className={styles.lang}>
              <FiGlobe aria-hidden="true" />
              <span>{currentLabel}</span>
              <select
                className={styles.langSelect}
                value={currentLng}
                onChange={handleLanguageChange}
                aria-label={t('footer.language', 'Select language')}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <ul className={styles.socials}>
              {SOCIALS.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    className={styles.social}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <p className={styles.built}>
              {t('footer.built', 'Securely built by')}{' '}
              <a
                href="https://nocapcode.cloud"
                className={styles.builtLink}
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