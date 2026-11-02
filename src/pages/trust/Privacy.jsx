import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiClock,
  FiFilter,
  FiGlobe,
  FiKey,
  FiLock,
  FiSlash,
  FiToggleRight,
} from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import usePrivacyAnimations from '../../hooks/usePrivacyAnimations';
import styles from './Privacy.module.css';

// TODO: confirm these three before launch
const PRIVACY_EMAIL = 'privacy@nexgn.cloud';
const PRIVACY_PDF_URL = '/nexgn-privacy-policy.pdf'; // put the PDF in public/

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

const IMAGES = {
  hero: findImage('privacy-hero'),
  collection: findImage('privacy-collection'),
  byos: findImage('privacy-byos'),
};

const bg = (src) => (src ? { '--img': `url("${src}")` } : undefined);

const PRINCIPLES = [
  {
    key: 'minimization',
    Icon: FiFilter,
    title: 'Data Minimization',
    text: 'We only collect the data strictly necessary to execute the agreement and generate a legally binding Audit Certificate. If we don’t need it, we don’t ask for it.',
  },
  {
    key: 'ownership',
    Icon: FiKey,
    title: 'You Own Your Data',
    text: 'Nexgn acts as a Data Processor. You (the Workspace Admin) act as the Data Controller. You dictate what happens to your contracts, who can see them, and when they are deleted.',
  },
  {
    key: 'monetization',
    Icon: FiSlash,
    title: 'Zero Monetization',
    text: 'We make money by providing excellent software subscriptions, never by selling your proprietary contract data or signer telemetry to third-party data brokers.',
  },
];

const AI_PRACTICES = [
  {
    key: 'training',
    Icon: FiLock,
    title: 'Zero Training',
    text: 'Nexgn does NOT use your confidential contracts, signatures, or uploaded templates to train our own, or any third-party, foundational AI models.',
  },
  {
    key: 'ephemeral',
    Icon: FiClock,
    title: 'Ephemeral Processing',
    text: 'When you utilize our AI tools to summarize a contract, the document text is processed securely and the resulting data is discarded immediately after the summary is generated.',
  },
  {
    key: 'optin',
    Icon: FiToggleRight,
    title: 'Opt-In Only',
    text: 'AI features are strictly opt-in. Workspace Admins can globally disable AI processing for their entire organization with a single toggle in the settings dashboard.',
  },
];

const FRAMEWORKS = [
  {
    key: 'gdpr',
    region: 'Europe',
    name: 'GDPR',
    text: 'Nexgn is designed to support General Data Protection Regulation compliance. We facilitate Data Subject Access Requests (DSARs), support the “Right to be Forgotten,” and provide a standard Data Processing Addendum (DPA) for our EU customers.',
  },
  {
    key: 'dpdp',
    region: 'India',
    name: 'DPDP Act',
    text: 'We are aligning our infrastructure with the phased rollout of India’s Digital Personal Data Protection Rules 2025. We prioritize explicit consent mechanisms (like our Signer Consent Overlays) and strict purpose limitation for all collected telemetry.',
  },
  {
    key: 'ccpa',
    region: 'California',
    name: 'CCPA',
    text: 'We comply with the California Consumer Privacy Act. Nexgn does not sell personal information. California residents can easily exercise their data rights by contacting our privacy team.',
  },
];

const Words = ({ text }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className={styles.wMask}>
        <span className={styles.wIn} data-p="w">
          {w}
        </span>
      </span>
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

const Privacy = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`privacy.${key}`, fallback);

  const rootRef = useRef(null);
  usePrivacyAnimations(rootRef, { lng: currentLng });

  const seoTitle = tr('seo.title', 'Privacy Center');
  const seoDescription = tr(
    'seo.description',
    'Your agreements are your business. Learn how Nexgn minimizes data collection, never sells your data, never trains AI on your contracts, and supports GDPR, DPDP and CCPA compliance.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/trust/privacy`;
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
          { '@type': 'ListItem', position: 3, name: 'Privacy Center', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/privacy" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-p="hero">
        <div className={styles.heroPhoto} style={bg(IMAGES.hero)} data-p="photo" aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard} data-p="card">
            <span className={styles.cardLine} data-p="cardline" aria-hidden="true" />
            <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.eyebrowCenter}`} data-p="hr">
              {tr('hero.eyebrow', 'Nexgn Trust Center')}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title1', 'Your agreements are your business.')} />{' '}
              <br />
              <span className={styles.muted}>
                <Words text={tr('hero.title2', 'Not ours.')} />
              </span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-p="hr">
              {tr(
                'hero.text',
                'At Nexgn, we build routing and execution infrastructure. We do not sell, monetize, or needlessly retain your proprietary legal data. Our privacy practices are designed to comply with the GDPR, the CCPA, and India’s DPDP Act.'
              )}
            </p>
            <div className={styles.actions} data-p="hr">
              <a
                href={PRIVACY_PDF_URL}
                className={styles.btnPrimary}
                download
                data-p="magnet"
                data-hv="primary"
              >
                {tr('hero.pdf', 'Download Privacy Policy (PDF)')}
              </a>
              <Link
                to={withLng('/trust/subprocessors')}
                className={styles.btnOutline}
                data-p="magnet"
                data-hv="outline"
              >
                {tr('hero.subprocessors', 'View Subprocessors')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. PRINCIPLES ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-p="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-p="r">
              {tr('principles.eyebrow', 'Our Core Privacy Principles')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('principles.title', 'Our Commitment to Your Data')} />
            </h2>
            <p className={styles.lead} data-p="r">
              {tr('principles.text', 'We operate on three fundamental privacy principles:')}
            </p>
          </header>

          <ul className={styles.threeCol}>
            {PRINCIPLES.map(({ key, Icon, title, text }) => (
              <li key={key} className={`${styles.card} ${styles.lift}`} data-p="item spot" data-hv="spot">
                <span className={styles.iconBox} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={styles.cardTitle}>{tr(`principles.${key}.title`, title)}</h3>
                <p className={styles.body}>{tr(`principles.${key}.text`, text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 3. DATA COLLECTION ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={styles.head} data-p="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-p="r">
              {tr('collection.eyebrow', 'What Data We Collect & Why')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('collection.title', 'Data Collection for Legal Evidence')} />
            </h2>
            <p className={styles.lead} data-p="r">
              {tr(
                'collection.text',
                'To ensure that your electronic signatures hold up in court under frameworks like the US ESIGN Act, the EU eIDAS, and the India IT Act, Nexgn must capture specific telemetry to prove the intent and identity of the signer.'
              )}
            </p>
          </header>

          <div className={`${styles.media} ${styles.mediaCollection}`} style={bg(IMAGES.collection)} data-p="media" aria-hidden="true" />
        </div>
      </section>

      {/* ============ 4. BYOS & RETENTION ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={styles.splitText}>
              <header data-p="head">
                <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`} data-p="r">
                  {tr('byos.eyebrow', 'Bring Your Own Storage (BYOS) & Retention')}
                </p>
                <h2 className={`${styles.title} ${styles.titleLeft}`}>
                  <Words text={tr('byos.title', 'Decentralized Storage for Maximum Privacy')} />
                </h2>
                <p className={`${styles.lead} ${styles.leadLeft}`} data-p="r">
                  {tr(
                    'byos.text',
                    'Nexgn is hosted on tier-1 cloud infrastructure providers (such as AWS/Google Cloud) that maintain stringent, independent security certifications.'
                  )}
                </p>
              </header>

              <dl className={styles.facts}>
                <div className={styles.fact} data-p="item">
                  <dt className={styles.factTitle}>{tr('byos.howTitle', 'How it works')}</dt>
                  <dd className={styles.factText}>
                    {tr(
                      'byos.howText',
                      'When you connect Nexgn to your Google Workspace, signed agreements and their corresponding Audit Certificates are automatically synced directly to your secure Google Drive folder.'
                    )}
                  </dd>
                </div>
                <div className={styles.fact} data-p="item">
                  <dt className={styles.factTitle}>{tr('byos.retentionTitle', 'Data Retention')}</dt>
                  <dd className={styles.factText}>
                    {tr(
                      'byos.retentionText',
                      'Unless explicitly configured otherwise in your workspace settings, Nexgn does not indefinitely store your completed PDFs on our servers. Once the execution is complete and the file is synced to your drive, our primary job is done.'
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className={styles.splitMedia}>
              <div className={`${styles.media} ${styles.mediaSplit}`} style={bg(IMAGES.byos)} data-p="media" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. RESPONSIBLE AI ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <header className={styles.head} data-p="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.eyebrowCenter}`} data-p="r">
              {tr('ai.eyebrow', 'AI Data Practices')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('ai.title', 'Responsible AI & Your Confidential Data')} />
            </h2>
            <p className={`${styles.lead} ${styles.leadLight}`} data-p="r">
              {tr(
                'ai.text',
                'As Nexgn introduces intelligent features like the AI Agreement Summary and AI Clause Assistant, we understand the hesitation businesses have regarding proprietary data. Our AI principles are non-negotiable:'
              )}
            </p>
          </header>

          <ul className={styles.threeCol}>
            {AI_PRACTICES.map(({ key, Icon, title, text }) => (
              <li key={key} className={styles.aiItem} data-p="item">
                <span className={`${styles.iconBox} ${styles.iconBoxDark}`} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={`${styles.cardTitle} ${styles.cardTitleSmall}`}>
                  {tr(`ai.${key}.title`, title)}
                </h3>
                <p className={`${styles.body} ${styles.bodyLight}`}>{tr(`ai.${key}.text`, text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. GLOBAL FRAMEWORKS ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head} data-p="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-p="r">
              {tr('frameworks.eyebrow', 'Global Privacy Compliance')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('frameworks.title', 'Designed for Global Frameworks')} />
            </h2>
          </header>

          <ul className={styles.threeCol}>
            {FRAMEWORKS.map(({ key, region, name, text }) => (
              <li key={key} className={`${styles.card} ${styles.framework} ${styles.lift}`} data-p="item spot" data-hv="spot">
                <span className={styles.tag}>
                  <FiGlobe aria-hidden="true" />
                  <span>{tr(`frameworks.${key}.region`, region)}</span>
                </span>
                <p className={styles.frameworkName}>{name}</p>
                <hr className={styles.rule} data-p="rule" />
                <p className={styles.body}>{tr(`frameworks.${key}.text`, text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 7. MANAGING YOUR PRIVACY ============ */}
      <section className={`${styles.section} ${styles.tint} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <header className={`${styles.head} ${styles.headNoMargin}`} data-p="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`} data-p="r">
              {tr('manage.eyebrow', 'Take Control of Your Data')}
            </p>
            <h2 className={styles.title}>
              <Words text={tr('manage.title', 'Managing Your Privacy')} />
            </h2>
            <p className={styles.lead} data-p="r">
              {tr(
                'manage.text',
                'Need to exercise your data rights, request a Data Processing Addendum (DPA), or have questions about our sub-processors?'
              )}
            </p>
            <div className={styles.actions} data-p="r">
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className={styles.btnPrimary}
                data-p="magnet"
                data-hv="primary"
              >
                {tr('manage.contact', 'Contact Privacy Team')}
              </a>
              <Link
                to={withLng('/legal/privacy-policy')}
                className={styles.btnDark}
                data-p="magnet"
                data-hv="dark"
              >
                {tr('manage.policy', 'View Full Privacy Policy')}
              </Link>
            </div>
          </header>
        </div>
      </section>
    </div>
  );
};

export default Privacy;