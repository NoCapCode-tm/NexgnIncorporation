import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCheck, FiClock, FiEdit3, FiGlobe, FiMonitor, FiShield } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './Security.module.css';

// TODO: replace with your real status page URL (same one used in the Footer)
const STATUS_URL = 'https://status.nexgn.cloud';

const LANGS = ['en', 'es', 'hi'];

// ---------- Content (each string has an i18n key + English default) ----------

const BYOS = [
  {
    key: 'routing',
    title: 'Direct Cloud Routing',
    text: 'Through our secure API integration, completed documents and Audit Certificates are deposited instantly and securely into your organization’s authorized Google Drive.',
  },
  {
    key: 'sovereignty',
    title: 'Data Sovereignty',
    text: 'You retain ultimate control, ownership, and governance over your legal files. Nexgn acts as the secure execution and routing engine, significantly reducing the risk of centralized data breaches.',
  },
  {
    key: 'surface',
    title: 'Minimized Attack Surface',
    text: 'By refusing to hoard your proprietary PDFs, we drastically minimize the attack surface of our platform.',
  },
];

const PILLARS = [
  {
    key: 'encryption',
    title: 'Encryption In Transit & At Rest',
    text: 'All communications between the Nexgn platform, signers, and your storage providers are encrypted in transit using industry-standard TLS 1.2. Sensitive application data, widget configurations, and user metadata are encrypted at rest using AES-256 encryption protocols within our cloud databases.',
  },
  {
    key: 'zeroTrust',
    title: 'Zero-Trust Access Architecture',
    text: 'Secure your workspace with mandatory TOTP Two-Factor Authentication (2FA) via any authenticator apps. Nexgn includes active brute-force protection, automatically locking accounts after suspicious login attempts. Session tokens are actively monitored and systematically expired.',
  },
  {
    key: 'permissions',
    title: 'Granular Team Permissions',
    text: 'Prevent unauthorized internal access with strict Role-Based Access Control. Administrators can invite Sub-Admins and definitively restrict their permissions—ensuring only authorized personnel can view documents, delete templates, or alter billing settings.',
  },
  {
    key: 'hashing',
    title: 'Tamper-Evident Hashing',
    text: 'Every completed agreement is sealed with a cryptographic SHA-256 document hash. If a single pixel or character of the signed PDF is altered after execution, the hash breaks, immediately voiding the document and alerting all parties to the tampering.',
  },
];

const TELEMETRY = [
  {
    key: 'network',
    Icon: FiGlobe,
    title: 'Network Identity',
    text: 'Secure logging of the signer’s IPv4 and IPv6 addresses.',
  },
  {
    key: 'temporal',
    Icon: FiClock,
    title: 'Temporal Accuracy',
    text: 'Cryptographically sealed UTC timestamps for document creation, viewing, and signature execution.',
  },
  {
    key: 'intent',
    Icon: FiEdit3,
    title: 'Signer Intent',
    text: 'Explicit capture of mandatory data collection and electronic signature consent prior to document access.',
  },
  {
    key: 'device',
    Icon: FiMonitor,
    title: 'Device Context',
    text: 'Secure logging of the browser and User-Agent strings used during the transaction.',
  },
];

const CHECKS = [
  { key: 'certified', text: 'Data centers certified for ISO 27001, SOC 2 Type II, and PCI-DSS.' },
  { key: 'ha', text: 'High-availability architecture with automated failover and multi-zone redundancy.' },
  { key: 'monitoring', text: 'Continuous 24/7/365 infrastructure monitoring and threat detection.' },
  { key: 'pentest', text: 'Regular third-party penetration testing and vulnerability scanning.' },
];

const CERTS = ['ISO 27001', 'SOC 2 Type II', 'PCI-DSS'];

const RESOURCES = [
  {
    key: 'privacy',
    title: 'Privacy Center',
    text: 'Learn how we handle data, protect signer privacy, and comply with global data protection laws (GDPR, DPDP).',
    cta: 'Read Privacy Notice',
    to: '/trust/privacy',
  },
  {
    key: 'vuln',
    title: 'Vulnerability Disclosure',
    text: 'Are you a security researcher? Learn how to safely report bugs to our engineering team.',
    cta: 'View Disclosure Program',
    to: '/trust/vulnerability-disclosure',
  },
  {
    key: 'subprocessors',
    title: 'Subprocessors',
    text: 'View the trusted third-party vendors we use to deliver the Nexgn platform.',
    cta: 'View Subprocessors',
    to: '/trust/subprocessors',
  },
];

// ---------- Page ----------

const Security = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`security.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Security & Data Protection');
  const seoDescription = tr(
    'seo.description',
    'Enterprise-grade eSignature security: bring-your-own-storage privacy, AES-256 and TLS 1.2 encryption, zero-trust access, SHA-256 tamper-evident hashing and court-admissible audit certificates.'
  );

  // Structured data: page + breadcrumb trail (url must match the SEOHead `url` prop)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://nexgn.cloud/${currentLng}/trust/security#webpage`,
        url: `https://nexgn.cloud/${currentLng}/trust/security`,
        name: `${seoTitle} | Nexgn`,
        description: seoDescription,
        inLanguage: currentLng,
        isPartOf: { '@type': 'WebSite', name: 'Nexgn', url: 'https://nexgn.cloud' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://nexgn.cloud/${currentLng}` },
          { '@type': 'ListItem', position: 2, name: 'Trust Center', item: `https://nexgn.cloud/${currentLng}/trust` },
          { '@type': 'ListItem', position: 3, name: 'Security', item: `https://nexgn.cloud/${currentLng}/trust/security` },
        ],
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url="/trust/security"
        schema={schema}
      />
      {/* ============ 1. HERO (dark) ============ */}
      <section className={`${styles.section} ${styles.dark} ${styles.hero}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight}`}>
            {tr('hero.eyebrow', 'Nexgn Trust Center')}
          </p>
          <h1 className={styles.heroTitle}>
            {tr('hero.title1', 'Enterprise-grade security,')}{' '}
            <span className={styles.muted}>
              {tr('hero.title2', 'without the enterprise complexity.')}
            </span>
          </h1>
          <p className={`${styles.lead} ${styles.leadLight}`}>
            {tr(
              'hero.text',
              'Trust is not a feature; it is our foundation. Nexgn employs advanced cryptographic hashing, strict access controls, and a decentralized storage architecture to ensure your agreements remain private, secure, and irrefutable.'
            )}
          </p>
          <div className={styles.actions}>
            <a
              href={STATUS_URL}
              className={styles.btnPrimary}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tr('hero.status', 'View System Status')}
            </a>
            <Link to={withLng('/trust/vulnerability-disclosure')} className={styles.btnOutline}>
              {tr('hero.report', 'Report a Vulnerability')}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 2. BRING YOUR OWN STORAGE (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>{tr('byos.eyebrow', 'Bring Your Own Storage')}</p>
            <h2 className={styles.title}>
              {tr('byos.title', 'A Decentralized Approach to Document Privacy.')}
            </h2>
            <p className={styles.lead}>
              {tr(
                'byos.text',
                'Unlike legacy electronic signature platforms that lock your highly confidential contracts inside their proprietary servers, Nexgn operates on a “Bring Your Own Storage” (BYOS) philosophy.'
              )}
            </p>
          </header>

          {/* Illustration slot: swap for an <img> or SVG when the artwork is ready */}
          <div className={`${styles.media} ${styles.mediaWide}`} aria-hidden="true" />

          <ul className={styles.threeCol}>
            {BYOS.map((item, i) => (
              <li key={item.key} className={styles.feature}>
                <span className={styles.index}>#{i + 1}</span>
                <h3 className={styles.featureTitle}>{tr(`byos.${item.key}.title`, item.title)}</h3>
                <p className={styles.body}>{tr(`byos.${item.key}.text`, item.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 3. QUOTE BAND (dark) ============ */}
      <section className={`${styles.section} ${styles.dark} ${styles.quoteBand}`}>
        <div className={styles.container}>
          <p className={styles.quote}>
            {tr('quote', 'Trust is not a feature; it is our foundation.')}
          </p>
        </div>
      </section>

      {/* ============ 4. CORE SECURITY PILLARS (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>
            {tr('pillars.eyebrow', 'Core Security Pillars')}
          </p>

          <ul className={styles.pillars}>
            {PILLARS.map((p) => (
              <li key={p.key} className={styles.pillar}>
                <div className={`${styles.media} ${styles.mediaCard}`} aria-hidden="true" />
                <h3 className={styles.featureTitle}>{tr(`pillars.${p.key}.title`, p.title)}</h3>
                <p className={styles.body}>{tr(`pillars.${p.key}.text`, p.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 5. TELEMETRY (tinted) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>{tr('telemetry.eyebrow', 'The Telemetry We Capture')}</p>
            <h2 className={styles.title}>
              {tr('telemetry.title', 'Irrefutable Evidence for Every Transaction.')}
            </h2>
            <p className={styles.lead}>
              {tr(
                'telemetry.text',
                'A signature is only as reliable as the evidence that backs it. Nexgn generates a comprehensive, court-admissible Audit Certificate for every completed envelope, automatically appended to the final PDF.'
              )}
            </p>
          </header>

          <div className={`${styles.media} ${styles.mediaWhite} ${styles.mediaTall}`} aria-hidden="true" />

          <ul className={styles.fourCol}>
            {TELEMETRY.map(({ key, Icon, title, text }) => (
              <li key={key} className={styles.telemetry}>
                <span className={styles.iconBox} aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3 className={styles.smallTitle}>{tr(`telemetry.${key}.title`, title)}</h3>
                  <p className={styles.bodySmall}>{tr(`telemetry.${key}.text`, text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. INFRASTRUCTURE (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <div className={styles.infra}>
            <div>
              <p className={styles.eyebrow}>
                {tr('infra.eyebrow', 'Infrastructure & Compliance Readiness')}
              </p>
              <h2 className={`${styles.title} ${styles.titleLeft}`}>
                {tr('infra.title', 'Built on World-Class Infrastructure.')}
              </h2>
              <p className={`${styles.lead} ${styles.leadLeft}`}>
                {tr(
                  'infra.text',
                  'Nexgn is hosted on tier-1 cloud infrastructure providers (such as AWS/Google Cloud) that maintain stringent, independent security certifications.'
                )}
              </p>
            </div>

            <ul className={styles.checks}>
              {CHECKS.map((c) => (
                <li key={c.key} className={styles.check}>
                  <FiCheck className={styles.checkIcon} aria-hidden="true" />
                  <span>{tr(`infra.checks.${c.key}`, c.text)}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className={styles.rule} />

          <ul className={styles.certs}>
            {CERTS.map((name) => (
              <li key={name} className={styles.cert}>
                <span className={styles.certBadge} aria-hidden="true">
                  <FiShield />
                </span>
                <span className={styles.certName}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 7. RESOURCES (light) ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>
            {tr('resources.eyebrow', 'Security Resources & Next Steps')}
          </p>

          <ul className={styles.resources}>
            {RESOURCES.map((r, i) => (
              <li key={r.key} className={styles.resourceItem}>
                <Link to={withLng(r.to)} className={styles.resource}>
                  <span className={styles.index}>#{i + 1}</span>
                  <h3 className={styles.featureTitle}>{tr(`resources.${r.key}.title`, r.title)}</h3>
                  <p className={styles.bodySmall}>{tr(`resources.${r.key}.text`, r.text)}</p>
                  <span className={styles.resourceCta}>
                    <span>{tr(`resources.${r.key}.cta`, r.cta)}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      <FiArrowRight />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Security;