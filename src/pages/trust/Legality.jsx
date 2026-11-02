import React, { useMemo, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiCheckSquare, FiEdit3, FiLock, FiUser, FiX } from 'react-icons/fi';
import DottedMap from 'dotted-map';
import { SEOHead } from '../../components/seo/SEOHead';
import useLegalityAnimations from '../../hooks/useLegalityAnimations';
import styles from './Legality.module.css';

const WHITEPAPER_URL = '/nexgn-legality-whitepaper.pdf';
const LANGS = ['en', 'es', 'hi'];

const imageContext = require.context('../../assets/trust', false, /\.(png|jpe?g|webp|avif|svg)$/i);

const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const HERO_IMAGE = findImage('legality-hero');

const PILLARS = [
  {
    key: 'intent',
    Icon: FiEdit3,
    title: 'Intent to Sign',
    text: 'Signers are clearly prompted to type, draw, or upload their signature, proving deliberate intent to execute the document.',
  },
  {
    key: 'consent',
    Icon: FiCheckSquare,
    title: 'Explicit Consent',
    text: 'Mandatory “Electronic Record and Signature Consent” overlays must be accepted by the signer before the document can even be viewed.',
  },
  {
    key: 'association',
    Icon: FiUser,
    title: 'Signer Association',
    text: 'Nexgn ties the signature directly to the signer via secure email links, session tokens, and IP address (IPv4/IPv6) telemetry.',
  },
  {
    key: 'integrity',
    Icon: FiLock,
    title: 'Document Integrity',
    text: 'Upon completion, the document is sealed with a SHA-256 cryptographic hash. Any post-signature tampering instantly breaks the seal and invalidates the file.',
  },
];

/* Percentages mapped exactly to the high-res dotted-map grid (US, EU, IN, AUS) */
const REGIONS = [
  {
    key: 'us',
    label: 'United States',
    x: 21,
    y: 33,
    laws: 'ESIGN Act (Electronic Signatures in Global and National Commerce Act) & UETA (Uniform Electronic Transactions Act).',
    stance:
      'Nexgn fully complies with the ESIGN Act and UETA. Signatures collected via Nexgn carry the same legal weight as traditional paper signatures in all 50 states for broad commercial, B2B, and B2C transactions.',
  },
  {
    key: 'eu',
    label: 'EU & UK',
    x: 48,
    y: 25,
    laws: 'eIDAS Regulation (EU No. 910/2014) and the UK Electronic Communications Act 2000 / UK eIDAS.',
    stance:
      'Nexgn supports Simple and Advanced Electronic Signatures, backed by a full audit trail, which are admissible as evidence and cannot be denied legal effect solely because they are electronic.',
  },
  {
    key: 'in',
    label: 'India',
    x: 69,
    y: 45,
    laws: 'Information Technology Act, 2000 (including Sections 3A and 10A) and the Indian Evidence Act framework.',
    stance:
      'Contracts concluded through electronic means are valid and enforceable in India. Nexgn’s signer identity, timestamp and integrity evidence is designed to support admissibility of electronic records.',
  },
  {
    key: 'row',
    label: 'Rest of the World',
    x: 84,
    y: 72,
    laws: 'UNCITRAL Model Law on Electronic Commerce and Electronic Signatures, and national laws based on it.',
    stance:
      'Most jurisdictions recognize electronic signatures under laws modelled on UNCITRAL. Because rules vary by country and document type, we recommend confirming requirements with local counsel.',
  },
];

const EVIDENCE_ROWS = [
  {
    key: 'type',
    label: 'Evidence Type',
    paper: 'Traditional Paper Signature',
    digital: 'Verified Email, User-Agent, Device Fingerprint',
  },
  {
    key: 'location',
    label: 'Location Data',
    paper: 'None',
    digital: 'IPv4 and IPv6 Address logged',
  },
  {
    key: 'time',
    label: 'Exact Timestamp',
    paper: 'Handwritten Date (Easily forged)',
    digital: 'Cryptographic UTC Server Timestamp',
  },
  {
    key: 'tamper',
    label: 'Tamper Evidence',
    paper: 'Page replacement is difficult to detect',
    digital: 'SHA-256 Hash breaks if a single pixel is altered',
  },
];

/* ---------------------------------------------------------------------
   Dotted Map Setup
   Generates a high-density grid map SVG via the dotted-map package.
   --------------------------------------------------------------------- */
const map = new DottedMap({ height: 100, grid: 'diagonal' });
const points = map.getPoints();

// Compute precise map boundaries to perfectly bind the HTML pins to the SVG viewBox
const maxX = Math.max(...points.map((p) => p.x)) + 1;
const maxY = Math.max(...points.map((p) => p.y)) + 1;

const Words = ({ text }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className={styles.wMask}>
        <span className={styles.wIn} data-l="w">
          {w}
        </span>
      </span>
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

const Legality = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`legality.${key}`, fallback);

  const [activeRegion, setActiveRegion] = useState(REGIONS[0].key);
  const region = REGIONS.find((r) => r.key === activeRegion) || REGIONS[0];

  const rootRef = useRef(null);
  useLegalityAnimations(rootRef, { lng: currentLng });

  const seoTitle = tr('seo.title', 'eSignature Legality');
  const seoDescription = tr(
    'seo.description',
    'Nexgn electronic signatures are valid, binding and court-admissible worldwide. See how we meet ESIGN, UETA, eIDAS and the India IT Act, and why a digital audit trail is stronger evidence than paper.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/trust/legality`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
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
          { '@type': 'ListItem', position: 3, name: 'Legality', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/legality" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-l="hero">
        <div
          className={styles.heroPhoto}
          style={HERO_IMAGE ? { '--img': `url("${HERO_IMAGE}")` } : undefined}
          data-l="photo"
          aria-hidden="true"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard} data-l="card">
            <span className={styles.cardLine} data-l="cardline" aria-hidden="true" />
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-l="hr">
              {tr('hero.eyebrow', 'Legal & Compliance')}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title1', 'Valid, binding, & court-admissible')} />{' '}
              <span className={styles.muted}>
                <Words text={tr('hero.title2', 'worldwide.')} />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-l="hr">
              {tr(
                'hero.text',
                'Nexgn is designed to meet and exceed the stringent requirements of global electronic signature laws. With cryptographic integrity and comprehensive audit trails, a Nexgn agreement provides stronger legal evidence than a traditional wet-ink signature.'
              )}
            </p>
            <div className={styles.actions} data-l="hr">
              <a
                href={WHITEPAPER_URL}
                className={styles.btnPrimary}
                download
                data-l="magnet"
                data-hv="primary"
              >
                {tr('hero.whitepaper', 'Download Legality Whitepaper (PDF)')}
              </a>
              <Link
                to={withLng('/products/audit-trail')}
                className={styles.btnGlass}
                data-l="magnet"
                data-hv="outline"
              >
                {tr('hero.audit', 'View Audit Trail Features')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. FOUR PILLARS ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-l="head">
            <p className={styles.eyebrow} data-l="r">
              {tr('pillars.eyebrow', 'The Core Elements of a Legal eSignature')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('pillars.title', 'How Nexgn Ensures Legal Enforceability')} />
            </h2>
            <p className={styles.lead} data-l="r">
              {tr(
                'pillars.text',
                'To be legally binding, an electronic signature must satisfy four core legal pillars. Nexgn’s architecture automates compliance for all of them:'
              )}
            </p>
          </header>

          <ul className={styles.fourCol}>
            {PILLARS.map(({ key, Icon, title, text }) => (
              <li key={key} className={`${styles.card} ${styles.lift}`} data-l="item spot" data-hv="spot">
                <span className={styles.iconBox} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={styles.cardTitle}>{tr(`pillars.${key}.title`, title)}</h3>
                <p className={styles.body}>{tr(`pillars.${key}.text`, text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 3. JURISDICTIONS ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-l="head">
            <p className={styles.eyebrow} data-l="r">
              {tr('map.eyebrow', 'Global Compliance Directory')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('map.title', 'Electronic Signature Laws by Jurisdiction')} />
            </h2>
          </header>

          <div className={styles.mapCard} data-l="item">
            {/* 
              By setting the container aspect ratio to match the precise SVG output, 
              we ensure absolute pin coordinates (like left: 21%) perfectly align 
              with the SVG dots underneath them on every screen size.
            */}
            <div className={styles.mapBox} style={{ aspectRatio: `${maxX} / ${maxY}` }}>
              <svg
                className={styles.mapSvg}
                style={{ width: '100%', height: '100%' }}
                viewBox={`-0.5 -0.5 ${maxX} ${maxY}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                {points.map((p, i) => (
                  <circle 
                    key={i} 
                    cx={p.x} 
                    cy={p.y} 
                    r={0.35} 
                    fill="#bcc5cd" 
                  />
                ))}
              </svg>

              <div className={styles.pins} role="tablist" aria-label={tr('map.eyebrow', 'Global Compliance Directory')}>
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    role="tab"
                    aria-selected={activeRegion === r.key}
                    className={`${styles.pin} ${activeRegion === r.key ? styles.pinActive : ''}`}
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                    onClick={() => setActiveRegion(r.key)}
                    onMouseEnter={() => setActiveRegion(r.key)}
                    onFocus={() => setActiveRegion(r.key)}
                  >
                    <span className={styles.pinDot} aria-hidden="true" />
                    <span className={styles.pinLabel}>{tr(`map.${r.key}.label`, r.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.regionPanel} key={region.key} role="tabpanel" aria-live="polite">
              <h3 className={styles.regionName}>{tr(`map.${region.key}.label`, region.label)}</h3>
              <div className={styles.regionBlock}>
                <p className={styles.tagSmall}>{tr('map.lawsLabel', 'Governing Laws')}</p>
                <p className={styles.regionLaws}>{tr(`map.${region.key}.laws`, region.laws)}</p>
              </div>
              <div className={styles.regionBlock}>
                <p className={styles.tagSmall}>{tr('map.stanceLabel', 'Nexgn’s Stance')}</p>
                <p className={styles.body}>{tr(`map.${region.key}.stance`, region.stance)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. EVIDENCE TABLE ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <header className={styles.head} data-l="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-l="r">
              {tr('evidence.eyebrow', 'The Evidence')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('evidence.title', 'Why Digital is More Secure Than Paper')} />
            </h2>
            <p className={`${styles.lead} ${styles.leadLight}`} data-l="r">
              {tr(
                'evidence.text',
                'A traditional “wet” signature on paper is highly susceptible to forgery and provides almost zero contextual evidence. Here is why courts increasingly prefer digital audit trails.'
              )}
            </p>
          </header>

          <div className={styles.tableCard} data-l="item">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{tr('evidence.colType', 'Evidence Type')}</th>
                  <th scope="col">{tr('evidence.colPaper', 'Traditional Paper Signature')}</th>
                  <th scope="col">{tr('evidence.colDigital', 'Nexgn Digital Agreement')}</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE_ROWS.map((row) => (
                  <tr key={row.key}>
                    <th scope="row" className={styles.rowLabel}>
                      {tr(`evidence.${row.key}.label`, row.label)}
                    </th>
                    <td data-label={tr('evidence.colPaper', 'Traditional Paper Signature')}>
                      <span className={`${styles.mark} ${styles.markNo}`} aria-hidden="true">
                        <FiX />
                      </span>
                      <span className={styles.paperText}>{tr(`evidence.${row.key}.paper`, row.paper)}</span>
                    </td>
                    <td data-label={tr('evidence.colDigital', 'Nexgn Digital Agreement')}>
                      <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true">
                        <FiCheck />
                      </span>
                      <span>{tr(`evidence.${row.key}.digital`, row.digital)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ 5. LEGAL DISCLAIMER ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <div className={styles.disclaimer} data-l="item">
            <h2 className={styles.disclaimerTitle}>{tr('disclaimer.title', 'Legal Disclaimer')}</h2>
            <p className={styles.disclaimerText}>
              {tr(
                'disclaimer.text',
                'The information provided on this page is for general informational and educational purposes only and does not constitute legal advice. Laws regarding electronic signatures vary significantly by jurisdiction and by the specific type of document being signed (e.g., wills, property transfers, and family law documents often require specialized handling or physical notarization). We strongly recommend consulting with qualified legal counsel in your jurisdiction to ensure your specific use of electronic signatures complies with all applicable local, state, and national laws.'
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legality;