import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCheck, FiClock, FiEdit3, FiGlobe, FiMonitor, FiShield } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import useSecurityAnimations from '../../hooks/useSecurityAnimations';
import styles from './Security.module.css';

// TODO: replace with your real status page URL (same one used in the Footer)
const STATUS_URL = 'https://status.nexgn.cloud';

const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES  (all optional — a missing file never breaks the build)
   Drop them into  src/assets/trust/  (same folder as Privacy / Subprocessors).
   Picked up by NAME, any of png / jpg / webp / avif / svg. Restart the dev server after adding.

     security-hero             hero photo behind the frosted card
     security-byos             wide illustration under "A Decentralized Approach…"
     security-encryption       pillar 1 artwork
     security-zerotrust        pillar 2 artwork
     security-permissions      pillar 3 artwork
     security-hashing          pillar 4 artwork
     security-telemetry        wide illustration under "Irrefutable Evidence…"
     cert-iso27001             ISO 27001 logo
     cert-soc2                 SOC 2 Type II logo
     cert-pcidss               PCI-DSS logo

   Without a file the slot shows the soft placeholder (media) or an icon badge (certs).
   ===================================================================== */
const imageContext = require.context('../../assets/trust', false, /\.(png|jpe?g|webp|avif|svg)$/i);

const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const HERO_IMAGE = findImage('security-hero');
const BYOS_IMAGE = findImage('security-byos');
const TELEMETRY_IMAGE = findImage('security-telemetry');

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
].map((p) => ({ ...p, img: findImage(`security-${p.key.toLowerCase()}`) }));

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

const CERTS = [
  { name: 'ISO 27001', img: findImage('cert-iso27001') },
  { name: 'SOC 2 Type II', img: findImage('cert-soc2') },
  { name: 'PCI-DSS', img: findImage('cert-pcidss') },
];

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

// ---------- Small building blocks ----------

/* Splits a string into words. mask = each word slides up out of its own clip box (headlines);
   otherwise plain inline words that the quote band fades in one by one. */
const Words = ({ text, mask = true }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      {mask ? (
        <span className={styles.wMask}>
          <span className={styles.wIn} data-s="w">
            {w}
          </span>
        </span>
      ) : (
        <span className={styles.wFree} data-s="qw">
          {w}
        </span>
      )}
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

/* Artwork slot: real image when the file exists, soft placeholder with a light sweep otherwise. */
const Media = ({ img, className }) => (
  <div className={`${styles.media} ${className}`} data-s="media" aria-hidden="true">
    {img ? (
      <img src={img} alt="" className={styles.mediaImg} data-s="mediaImg" loading="lazy" decoding="async" />
    ) : (
      <span className={styles.sheen} data-s="sheen" />
    )}
  </div>
);

// ---------- Page ----------

const Security = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`security.${key}`, fallback);

  const rootRef = useRef(null);
  useSecurityAnimations(rootRef, { lng: currentLng });

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
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/security" schema={schema} />

      {/* ============ 1. HERO (photo + frosted card) ============ */}
      <section className={styles.hero} data-s="hero">
        <div
          className={styles.heroPhoto}
          style={HERO_IMAGE ? { '--img': `url("${HERO_IMAGE}")` } : undefined}
          data-s="photo"
          aria-hidden="true"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard} data-s="card">
            <span className={styles.cardLine} data-s="cardline" aria-hidden="true" />
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-s="hr">
              {tr('hero.eyebrow', 'Nexgn Trust Center')}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title1', 'Enterprise-grade security,')} />{' '}
              <span className={styles.muted}>
                <Words text={tr('hero.title2', 'without the enterprise complexity.')} />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-s="hr">
              {tr(
                'hero.text',
                'Trust is not a feature; it is our foundation. Nexgn employs advanced cryptographic hashing, strict access controls, and a decentralized storage architecture to ensure your agreements remain private, secure, and irrefutable.'
              )}
            </p>
            <div className={styles.actions} data-s="hr">
              <a
                href={STATUS_URL}
                className={styles.btnPrimary}
                target="_blank"
                rel="noopener noreferrer"
                data-s="magnet"
                data-hv="primary"
              >
                {tr('hero.status', 'View System Status')}
              </a>
              <Link
                to={withLng('/trust/vulnerability-disclosure')}
                className={styles.btnOutline}
                data-s="magnet"
                data-hv="outline"
              >
                {tr('hero.report', 'Report a Vulnerability')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. BRING YOUR OWN STORAGE (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('byos.eyebrow', 'Bring Your Own Storage')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('byos.title', 'A Decentralized Approach to Document Privacy.')} />
            </h2>
            <p className={styles.lead} data-s="r">
              {tr(
                'byos.text',
                'Unlike legacy electronic signature platforms that lock your highly confidential contracts inside their proprietary servers, Nexgn operates on a “Bring Your Own Storage” (BYOS) philosophy.'
              )}
            </p>
          </header>

          <Media img={BYOS_IMAGE} className={styles.mediaWide} />

          <ul className={styles.threeCol}>
            {BYOS.map((item, i) => (
              <li key={item.key} className={styles.feature} data-s="item">
                <span className={styles.featureLine} data-s="line" aria-hidden="true" />
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
          <p className={styles.quote} data-s="quote">
            <Words text={tr('quote', 'Trust is not a feature; it is our foundation.')} mask={false} />
          </p>
        </div>
      </section>

      {/* ============ 4. CORE SECURITY PILLARS (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-s="r">
            {tr('pillars.eyebrow', 'Core Security Pillars')}
          </p>

          <ul className={styles.pillars}>
            {PILLARS.map((p) => (
              <li key={p.key} className={styles.pillar} data-s="item spot">
                <Media img={p.img} className={`${styles.mediaCard}`} />
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
          <header className={styles.head} data-s="head">
            <p className={styles.eyebrow} data-s="r">
              {tr('telemetry.eyebrow', 'The Telemetry We Capture')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('telemetry.title', 'Irrefutable Evidence for Every Transaction.')} />
            </h2>
            <p className={styles.lead} data-s="r">
              {tr(
                'telemetry.text',
                'A signature is only as reliable as the evidence that backs it. Nexgn generates a comprehensive, court-admissible Audit Certificate for every completed envelope, automatically appended to the final PDF.'
              )}
            </p>
          </header>

          <Media img={TELEMETRY_IMAGE} className={`${styles.mediaWhite} ${styles.mediaTall}`} />

          <ul className={styles.fourCol}>
            {TELEMETRY.map(({ key, Icon, title, text }) => (
              <li key={key} className={styles.telemetry} data-s="item" data-hv="tele">
                <span className={styles.iconBox} data-s="pop icon" aria-hidden="true">
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
            <div data-s="head">
              <p className={styles.eyebrow} data-s="r">
                {tr('infra.eyebrow', 'Infrastructure & Compliance Readiness')}
              </p>
              <h2 className={`${styles.title} ${styles.titleLeft}`}>
                <Words text={tr('infra.title', 'Built on World-Class Infrastructure.')} />
              </h2>
              <p className={`${styles.lead} ${styles.leadLeft}`} data-s="r">
                {tr(
                  'infra.text',
                  'Nexgn is hosted on tier-1 cloud infrastructure providers (such as AWS/Google Cloud) that maintain stringent, independent security certifications.'
                )}
              </p>
            </div>

            <ul className={styles.checks}>
              {CHECKS.map((c) => (
                <li key={c.key} className={styles.check} data-s="item">
                  <span className={styles.checkIcon} data-s="pop" aria-hidden="true">
                    <FiCheck />
                  </span>
                  <span>{tr(`infra.checks.${c.key}`, c.text)}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className={styles.rule} data-s="rule" />

          <ul className={styles.certs}>
            {CERTS.map(({ name, img }) => (
              <li key={name} className={styles.cert} data-s="item" data-hv="cert">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    className={styles.certLogo}
                    data-s="certLogo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className={styles.certBadge} data-s="certLogo" aria-hidden="true">
                    <FiShield />
                  </span>
                )}
                <span className={styles.certName}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 7. RESOURCES (light) ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-s="r">
            {tr('resources.eyebrow', 'Security Resources & Next Steps')}
          </p>

          <ul className={styles.resources}>
            {RESOURCES.map((r, i) => (
              <li key={r.key} className={styles.resourceItem} data-s="item">
                <Link to={withLng(r.to)} className={styles.resource} data-s="spot" data-hv="res">
                  <span className={styles.index}>#{i + 1}</span>
                  <h3 className={styles.featureTitle}>{tr(`resources.${r.key}.title`, r.title)}</h3>
                  <p className={styles.bodySmall}>{tr(`resources.${r.key}.text`, r.text)}</p>
                  <span className={styles.resourceCta}>
                    <span>{tr(`resources.${r.key}.cta`, r.cta)}</span>
                    <span className={styles.arrow} data-s="arrow" aria-hidden="true">
                      <span className={styles.arrowIcon} data-s="arrowIcon">
                        <FiArrowRight />
                      </span>
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