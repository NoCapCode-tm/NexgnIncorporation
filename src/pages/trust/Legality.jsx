import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiCheckSquare, FiEdit3, FiLock, FiUser, FiX } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import styles from './Legality.module.css';

// TODO: confirm before launch (put the PDF in public/)
const WHITEPAPER_URL = '/nexgn-legality-whitepaper.pdf';

const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES
   Drop the hero photo into  src/assets/trust/  as  legality-hero.(png|jpg|webp...)
   (same folder as the Privacy page). Picked up by NAME; a missing file never breaks the build,
   a dark gradient shows instead. Restart the dev server after adding it.
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

const HERO_IMAGE = findImage('legality-hero');

// ---------- Content (every string has an i18n key + English default) ----------

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

/* x / y are the pin positions in % of the map (lon -170..180, lat 80..-58).
   TODO: have legal counsel confirm the wording of every region before launch. */
const REGIONS = [
  {
    key: 'us',
    label: 'United States',
    x: 20,
    y: 38,
    laws: 'ESIGN Act (Electronic Signatures in Global and National Commerce Act) & UETA (Uniform Electronic Transactions Act).',
    stance:
      'Nexgn fully complies with the ESIGN Act and UETA. Signatures collected via Nexgn carry the same legal weight as traditional paper signatures in all 50 states for broad commercial, B2B, and B2C transactions.',
  },
  {
    key: 'eu',
    label: 'EU & UK',
    x: 51,
    y: 31,
    laws: 'eIDAS Regulation (EU No. 910/2014) and the UK Electronic Communications Act 2000 / UK eIDAS.',
    stance:
      'Nexgn supports Simple and Advanced Electronic Signatures, backed by a full audit trail, which are admissible as evidence and cannot be denied legal effect solely because they are electronic.',
  },
  {
    key: 'in',
    label: 'India',
    x: 72,
    y: 52,
    laws: 'Information Technology Act, 2000 (including Sections 3A and 10A) and the Indian Evidence Act framework.',
    stance:
      'Contracts concluded through electronic means are valid and enforceable in India. Nexgn’s signer identity, timestamp and integrity evidence is designed to support admissibility of electronic records.',
  },
  {
    key: 'row',
    label: 'Rest of the World',
    x: 78,
    y: 79,
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
   Dotted world map, generated once from rough continent outlines
   ([lon, lat] pairs). Land dots are laid on a regular grid and drawn as ONE path.
   --------------------------------------------------------------------- */
const LAND = [
  // North America
  [[-168, 66], [-160, 71], [-140, 70], [-125, 70], [-95, 72], [-82, 68], [-62, 60], [-55, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-83, 29], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-83, 15], [-78, 9], [-84, 10], [-92, 15], [-105, 20], [-110, 24], [-113, 31], [-118, 34], [-124, 40], [-125, 48], [-135, 58], [-150, 60], [-165, 60]],
  // Greenland
  [[-55, 60], [-45, 60], [-20, 70], [-20, 82], [-45, 83], [-65, 80], [-70, 76]],
  // South America
  [[-78, 9], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-35, -6], [-39, -15], [-48, -26], [-58, -35], [-65, -42], [-68, -52], [-72, -52], [-74, -42], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0]],
  // Eurasia
  [[-9, 43], [-2, 47], [2, 51], [8, 56], [5, 60], [5, 62], [15, 69], [30, 71], [40, 67], [60, 68], [70, 73], [100, 77], [115, 73], [140, 72], [170, 70], [180, 66], [178, 62], [163, 60], [157, 52], [142, 53], [140, 48], [131, 43], [129, 36], [126, 35], [125, 39], [121, 40], [122, 31], [119, 25], [110, 20], [108, 16], [106, 10], [103, 2], [100, 7], [98, 14], [94, 18], [92, 22], [88, 21], [80, 15], [77, 8], [73, 18], [68, 23], [61, 25], [57, 26], [52, 28], [48, 30], [50, 26], [56, 25], [59, 22], [52, 16], [44, 12], [39, 21], [35, 28], [34, 31], [36, 36], [30, 36], [27, 37], [26, 40], [23, 40], [22, 37], [20, 40], [19, 42], [14, 45], [12, 45], [16, 40], [16, 38], [12, 42], [8, 44], [3, 43], [0, 39], [-5, 36], [-9, 37]],
  // Africa
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 28], [43, 12], [51, 12], [49, 5], [40, -3], [40, -15], [35, -25], [32, -29], [27, -34], [20, -35], [18, -32], [12, -17], [13, -6], [9, 4], [-8, 4], [-17, 14]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [135, -34], [130, -32], [115, -34]],
  // UK, Japan, Sumatra, Borneo, Madagascar, New Zealand
  [[-5, 50], [1, 51], [2, 53], [-2, 57], [-5, 58], [-6, 55], [-3, 54]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [140, 41], [135, 36]],
  [[95, 5], [106, -6], [104, -6], [95, 3]],
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
  [[44, -25], [50, -15], [49, -12], [44, -17]],
  [[172, -34], [178, -38], [174, -41], [168, -46], [171, -42]],
];

const MAP = { lon0: -170, lon1: 180, lat0: 80, lat1: -58, step: 2.6 };

const inPolygon = (lon, lat, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const buildDots = () => {
  const w = MAP.lon1 - MAP.lon0;
  const h = MAP.lat0 - MAP.lat1;
  const scale = 4; // 1 degree = 4 units, so the viewBox is 1400 x 552
  let d = '';
  let row = 0;
  for (let lat = MAP.lat0; lat >= MAP.lat1; lat -= MAP.step, row++) {
    const offset = row % 2 ? MAP.step / 2 : 0; // staggered rows look more like a halftone map
    for (let lon = MAP.lon0 + offset; lon <= MAP.lon1; lon += MAP.step) {
      if (LAND.some((poly) => inPolygon(lon, lat, poly))) {
        d += `M${((lon - MAP.lon0) * scale).toFixed(1)} ${((MAP.lat0 - lat) * scale).toFixed(1)}h0`;
      }
    }
  }
  return { d, width: w * scale, height: h * scale };
};

// ---------- Page ----------

const Legality = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`legality.${key}`, fallback);

  const [activeRegion, setActiveRegion] = useState(REGIONS[0].key);
  const region = REGIONS.find((r) => r.key === activeRegion) || REGIONS[0];
  const dots = useMemo(buildDots, []);

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
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/legality" schema={schema} />

      {/* ============ 1. HERO (photo + frosted card) ============ */}
      <section className={styles.hero}>
        <div
          className={styles.heroPhoto}
          style={HERO_IMAGE ? { '--img': `url("${HERO_IMAGE}")` } : undefined}
          aria-hidden="true"
        />
        <div className={styles.container}>
          <div className={styles.heroCard}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.rise}`}>
              {tr('hero.eyebrow', 'Legal & Compliance')}
            </p>
            <h1 className={`${styles.heroTitle} ${styles.rise}`} style={{ '--d': '100ms' }}>
              {tr('hero.title1', 'Valid, binding, & court-admissible')}{' '}
              <span className={styles.muted}>{tr('hero.title2', 'worldwide.')}</span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight} ${styles.rise}`} style={{ '--d': '200ms' }}>
              {tr(
                'hero.text',
                'Nexgn is designed to meet and exceed the stringent requirements of global electronic signature laws. With cryptographic integrity and comprehensive audit trails, a Nexgn agreement provides stronger legal evidence than a traditional wet-ink signature.'
              )}
            </p>
            <div className={`${styles.actions} ${styles.rise}`} style={{ '--d': '300ms' }}>
              <a href={WHITEPAPER_URL} className={styles.btnPrimary} download>
                {tr('hero.whitepaper', 'Download Legality Whitepaper (PDF)')}
              </a>
              <Link to={withLng('/products/audit-trail')} className={styles.btnGlass}>
                {tr('hero.audit', 'View Audit Trail Features')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. FOUR PILLARS (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={styles.eyebrow}>{tr('pillars.eyebrow', 'The Core Elements of a Legal eSignature')}</p>
            <h2 className={styles.title}>{tr('pillars.title', 'How Nexgn Ensures Legal Enforceability')}</h2>
            <p className={styles.lead}>
              {tr(
                'pillars.text',
                'To be legally binding, an electronic signature must satisfy four core legal pillars. Nexgn’s architecture automates compliance for all of them:'
              )}
            </p>
          </Reveal>

          <ul className={styles.fourCol}>
            {PILLARS.map(({ key, Icon, title, text }, i) => (
              <Reveal as="li" key={key} delay={i * 100} className={`${styles.card} ${styles.lift}`}>
                <span className={styles.iconBox} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={styles.cardTitle}>{tr(`pillars.${key}.title`, title)}</h3>
                <p className={styles.body}>{tr(`pillars.${key}.text`, text)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 3. JURISDICTIONS (tint) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={styles.eyebrow}>{tr('map.eyebrow', 'Global Compliance Directory')}</p>
            <h2 className={styles.title}>{tr('map.title', 'Electronic Signature Laws by Jurisdiction')}</h2>
          </Reveal>

          <Reveal delay={100} className={styles.mapCard}>
            <div className={styles.mapBox}>
              <svg
                className={styles.mapSvg}
                viewBox={`0 0 ${dots.width} ${dots.height}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <path d={dots.d} className={styles.mapDots} />
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

            {/* key= remounts the panel so it fades in on every region change */}
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
          </Reveal>
        </div>
      </section>

      {/* ============ 4. EVIDENCE TABLE (dark) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`}>{tr('evidence.eyebrow', 'The Evidence')}</p>
            <h2 className={styles.title}>{tr('evidence.title', 'Why Digital is More Secure Than Paper')}</h2>
            <p className={`${styles.lead} ${styles.leadLight}`}>
              {tr(
                'evidence.text',
                'A traditional “wet” signature on paper is highly susceptible to forgery and provides almost zero contextual evidence. Here is why courts increasingly prefer digital audit trails.'
              )}
            </p>
          </Reveal>

          <Reveal delay={100} className={styles.tableCard}>
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
          </Reveal>
        </div>
      </section>

      {/* ============ 5. LEGAL DISCLAIMER ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <Reveal className={styles.disclaimer}>
            <h2 className={styles.disclaimerTitle}>{tr('disclaimer.title', 'Legal Disclaimer')}</h2>
            <p className={styles.disclaimerText}>
              {tr(
                'disclaimer.text',
                'The information provided on this page is for general informational and educational purposes only and does not constitute legal advice. Laws regarding electronic signatures vary significantly by jurisdiction and by the specific type of document being signed (e.g., wills, property transfers, and family law documents often require specialized handling or physical notarization). We strongly recommend consulting with qualified legal counsel in your jurisdiction to ensure your specific use of electronic signatures complies with all applicable local, state, and national laws.'
              )}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Legality;