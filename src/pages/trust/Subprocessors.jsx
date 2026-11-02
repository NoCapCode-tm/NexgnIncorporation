import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShield } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import useSubprocessorsAnimations from '../../hooks/useSubprocessorsAnimations';
import styles from './Subprocessors.module.css';

const PRIVACY_EMAIL = 'privacy@nexgn.cloud';
const SUBSCRIBE_URL = '';
const LANGS = ['en', 'es', 'hi'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const imageContext = require.context('../../assets/trust', false, /\.(png|jpe?g|webp|avif|svg)$/i);
const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const HERO_IMAGE = findImage('subprocessors-hero');

const CORE = [
  {
    key: 'mongodb',
    name: 'MongoDB Atlas',
    purpose: 'Cloud database services for Nexgn application operations',
    data: 'Account, workspace, and application records; confirm the exact data scope',
    location: 'To be confirmed',
  },
  {
    key: 'razorpay',
    name: 'Razorpay',
    purpose: 'Subscription billing and payment processing',
    data: 'Billing and transaction details; confirm the exact data scope',
    location: 'To be confirmed',
  },
  {
    key: 'cloudflare',
    name: 'Cloudflare',
    purpose: 'DNS, CDN, proxy, and security infrastructure; traffic routing under review',
    data: 'Network request metadata and IP addresses, where processed',
    location: 'To be confirmed',
  },
  {
    key: 'resend',
    name: 'Resend',
    purpose: 'Transactional email delivery; production use to be confirmed',
    data: 'Recipient names and email addresses, where processed',
    location: 'To be confirmed',
  },
];

const OPTIONAL = [
  { key: 'ai', name: 'AI model provider (zero-retention enterprise API)', purpose: 'AI Agreement Summary and AI features (opt-in only)', data: 'Document text, processed and not retained', location: 'To be confirmed' },
];

const CHANGELOG = [
  { key: 'inventory-reconciled', date: '2026-11-02', text: 'Reviewed the provider list against Nexgn architecture and trust records.' },
  { key: 'infrastructure-classification', date: '2026-11-01', text: 'Clarified the distinction between self-managed infrastructure and external service providers.' },
  { key: 'registry-published', date: '2026-10-30', text: 'Published the initial Nexgn Subprocessor Registry.' },
  { key: 'registry-fields-defined', date: '2026-10-29', text: 'Standardized provider, purpose, data-category, and processing-location fields.' },
  { key: 'cloudflare-infrastructure', date: '2026-10-27', text: 'Recorded Cloudflare for DNS, CDN, SSL/TLS, and security infrastructure.' },
  { key: 'managed-server', date: '2026-10-25', text: 'Documented the Ubuntu and Docker environment as self-managed infrastructure.' },
  { key: 'render-backup', date: '2026-10-23', text: 'Noted Render as a possible backup API environment; Nexgn data processing is unconfirmed.' },
  { key: 'object-storage-design', date: '2026-10-21', text: 'Referenced S3-compatible storage in a proposed design, not as a confirmed live provider.' },
  { key: 'caddy-proxy', date: '2026-10-19', text: 'Recorded Caddy as a reverse-proxy option; active deployment was not established.' },
  { key: 'cloudflare-failover', date: '2026-10-17', text: 'Documented Cloudflare Worker routing and failover as an architecture discussion.' },
  { key: 'mongodb-atlas', date: '2026-10-15', text: 'Identified MongoDB Atlas as the cloud database in the Nexgn architecture.' },
  { key: 'razorpay-billing', date: '2026-10-14', text: 'Recorded Razorpay for subscription billing and payment-webhook integration.' },
  { key: 'resend-research', date: '2026-10-13', text: 'Noted Resend in research material; production use was not confirmed.' },
  { key: 'drive-oauth-sync', date: '2026-10-12', text: 'Recorded Google Drive OAuth and file synchronization as the BYOS integration.' },
  { key: 'drive-integration-release', date: '2026-10-10', text: 'Release notes documented Google Drive connection and management capabilities.' },
  { key: 'integration-security-release', date: '2026-10-08', text: 'Release notes grouped connected services, account security, notifications, and billing.' },
  { key: 'templates-workspace-release', date: '2026-10-06', text: 'Release history documented reusable templates, contacts, and workspace capabilities.' },
  { key: 'byos-decision', date: '2026-10-03', text: 'The pre-beta decision log selected Google Drive as the BYOS storage approach.' },
  { key: 'drive-admin-authorization', date: '2026-09-30', text: 'The BYOS design specified Team Admin authorization through Google Drive OAuth.' },
  { key: 'drive-scope-and-templates', date: '2026-09-25', text: 'The design records the drive.file scope and Google Drive PDF references for templates.' },
  { key: 'beta-baseline', date: '2026-09-20', text: 'Nexgn public beta launched with Google Drive syncing described in the release notes.' },
];

const Words = ({ text }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className={styles.wMask}>
        <span className={styles.wIn} data-sub="w">
          {w}
        </span>
      </span>
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

const RegistryTable = ({ rows, tr, group, emptyText }) => (
  <div className={styles.tableCard} data-sub="item">
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">{tr('registry.colName', 'Subprocessor')}</th>
          <th scope="col">{tr('registry.colPurpose', 'Purpose')}</th>
          <th scope="col">{tr('registry.colData', 'Data processed')}</th>
          <th scope="col">{tr('registry.colLocation', 'Location')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={4} className={styles.emptyRow}>
              {emptyText}
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={row.key}>
            <th scope="row" className={styles.rowLabel}>
              <span className={styles.vendor}>{tr(`${group}.${row.key}.name`, row.name)}</span>
            </th>
            <td data-label={tr('registry.colPurpose', 'Purpose')}>{tr(`${group}.${row.key}.purpose`, row.purpose)}</td>
            <td data-label={tr('registry.colData', 'Data processed')}>{tr(`${group}.${row.key}.data`, row.data)}</td>
            <td data-label={tr('registry.colLocation', 'Location')}>
              <span className={styles.pill}>{tr(`${group}.${row.key}.location`, row.location)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Subprocessors = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`subprocessors.${key}`, fallback);

  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');

  const rootRef = useRef(null);
  useSubprocessorsAnimations(rootRef, { lng: currentLng });

  const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(currentLng, { day: 'numeric', month: 'long', year: 'numeric' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setState('invalid');
      return;
    }
    setState('sending');
    try {
      if (SUBSCRIBE_URL) {
        const res = await fetch(SUBSCRIBE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: value, list: 'subprocessors' }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const subject = encodeURIComponent('Subscribe to Nexgn subprocessor updates');
        const body = encodeURIComponent(`Please add ${value} to the Nexgn subprocessor update notifications.`);
        window.location.href = `mailto:${PRIVACY_EMAIL}?subject=${subject}&body=${body}`;
      }
      setState('done');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  const seoTitle = tr('seo.title', 'Subprocessor Registry');
  const seoDescription = tr(
    'seo.description',
    'The official list of Nexgn authorized subprocessors, the optional feature-specific vendors, and how we notify customers of changes.'
  );
  const pageUrl = `https://nexgn.cloud/${currentLng}/trust/subprocessors`;

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/subprocessors" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-sub="hero">
        <div
          className={styles.heroPhoto}
          style={HERO_IMAGE ? { '--img': `url("${HERO_IMAGE}")` } : undefined}
          data-sub="photo"
          aria-hidden="true"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard} data-sub="card">
            <span className={styles.cardLine} data-sub="cardline" aria-hidden="true" />
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-sub="hr">
              {tr('hero.eyebrow', 'Nexgn Trust Center')}
            </p>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title', 'Subprocessor Registry')} />
            </h1>
            <p className={`${styles.lead} ${styles.leadLight}`} data-sub="hr">
              {tr(
                'hero.text',
                'At Nexgn, transparency is our baseline. To provide our secure agreement platform, we engage certain third-party service providers to process customer data on our behalf. Below is the official list of authorized Nexgn Subprocessors.'
              )}
            </p>
            <div className={styles.actions} data-sub="hr">
              <a href="#subscribe" className={styles.btnPrimary}>
                {tr('hero.subscribe', 'Subscribe to Updates')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. UNDERSTANDING ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <header className={styles.splitHead} data-sub="head">
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`} data-sub="r">
                {tr('about.eyebrow', 'What is a Subprocessor?')}
              </p>
              <h2 className={styles.splitTitle}>
                <Words text={tr('about.title', 'Understanding Our Vendor Ecosystem')} />
              </h2>
            </header>

            <div className={styles.splitBody} data-sub="item">
              <p className={styles.copy}>
                {tr(
                  'about.text',
                  'A subprocessor is a third-party data processor engaged by Nexgn who has access to or potentially will have access to or process Customer Data. We evaluate the security, privacy, and confidentiality practices of all proposed subprocessors before granting them access to any data.'
                )}
              </p>
              <div className={styles.guarantee}>
                <span className={styles.guaranteeIcon} aria-hidden="true">
                  <FiShield />
                </span>
                <div>
                  <p className={styles.tagSmall}>{tr('about.guaranteeLabel', 'Our Guarantee')}</p>
                  <p className={styles.guaranteeText}>
                    {tr(
                      'about.guarantee',
                      'Every vendor listed below is bound by a strict Data Processing Agreement (DPA) that obligates them to protect your data to the exact same high standards that we do.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. REGISTRY ============ */}
      <section className={`${styles.section} ${styles.tint}`} id="registry">
        <div className={styles.container}>
          <div className={styles.registryBlock}>
            <header className={styles.registryHead} data-sub="head">
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`} data-sub="r">
                {tr('core.eyebrow', 'Authorized Subprocessors')}
              </p>
              <h2 className={`${styles.title} ${styles.titleLeft}`}>
                <Words text={tr('core.title', 'Current Subprocessors')} />
              </h2>
            </header>
            <RegistryTable
              rows={CORE}
              tr={tr}
              group="core"
              emptyText={tr('registry.empty', 'No subprocessors to list at this time.')}
            />
          </div>

          <div className={styles.registryBlock}>
            <header className={`${styles.split} ${styles.registryHead}`} data-sub="head">
              <h2 className={styles.splitTitleSmall}>
                <Words text={tr('optional.title', 'Optional / Feature-Specific Subprocessors')} />
              </h2>
              <p className={styles.copySmall} data-sub="r">
                {tr(
                  'optional.text',
                  'Feature-specific subprocessors will be listed here only after the relevant production integration, data flow, and contractual processing role have been verified. No optional AI provider is currently included in this registry.'
                )}
              </p>
            </header>
            <RegistryTable
              rows={OPTIONAL}
              tr={tr}
              group="optional"
              emptyText={tr('registry.empty', 'No subprocessors to list at this time.')}
            />
          </div>
        </div>
      </section>

      {/* ============ 4. BYOS NOTE ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <div className={styles.note} data-sub="item">
            <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`}>
              {tr('byos.eyebrow', 'Infrastructure & Integrations Clarification')}
            </p>
            <h2 className={`${styles.splitTitleSmall} ${styles.noteTitle}`}>
              {tr('byos.title', 'Important Note Regarding “Bring Your Own Storage” (BYOS)')}
            </h2>
            <p className={styles.copySmall}>
              {tr(
                'byos.text',
                'Nexgn allows Workspace Admins to connect a customer-controlled Google Workspace / Google Drive destination for completed PDFs and Audit Certificates. The connection is authorized by the customer. The formal data-processing classification depends on the applicable Google terms, Nexgn agreements, and the actual data flow; it should not be inferred from the BYOS label alone.'
              )}
            </p>
            <p className={styles.copySmall}>
              {tr(
                'byos.infrastructureNote',
                'Nexgn-managed servers, where used, are operated as internal infrastructure and are not themselves third-party subprocessors. Any external hosting, database, network, email, or backup provider that processes Customer Data is assessed separately and listed where applicable.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. STAY INFORMED ============ */}
      <section className={`${styles.section} ${styles.dark}`} id="subscribe">
        <div className={styles.container}>
          <div className={styles.split}>
            <header className={styles.splitHead} data-sub="head">
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft} ${styles.eyebrowLight}`} data-sub="r">
                {tr('inform.eyebrow', 'Notification of Changes')}
              </p>
              <h2 className={`${styles.splitTitle} ${styles.splitTitleLight}`}>
                <Words text={tr('inform.title', 'Stay Informed')} />
              </h2>
              <p className={`${styles.copy} ${styles.copyLight}`} data-sub="r">
                {tr(
                  'inform.text',
                  'As our business grows, we may occasionally partner with new service providers. In accordance with global data protection laws (including the GDPR), we will notify all subscribed users at least 30 days prior to authorizing any new subprocessor to process Customer Data.'
                )}
              </p>
            </header>

            <div className={styles.form} data-sub="item">
              <form onSubmit={onSubmit} noValidate>
                <div className={`${styles.fieldWrap} ${state === 'invalid' ? styles.fieldWrapError : ''}`}>
                  <label htmlFor="subproc-email" className={styles.srOnly}>
                    {tr('inform.label', 'Email address')}
                  </label>
                  <input
                    id="subproc-email"
                    className={styles.field}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={tr('inform.placeholder', 'Enter your email address')}
                    value={email}
                    aria-invalid={state === 'invalid'}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state !== 'idle') setState('idle');
                    }}
                  />
                  <button type="submit" className={styles.submit} disabled={state === 'sending'}>
                    {state === 'sending' ? tr('inform.sending', 'Sending…') : tr('inform.button', 'Subscribe')}
                  </button>
                </div>

                <p className={styles.formNote}>
                  {tr(
                    'inform.note',
                    'By subscribing, you are opting in to receive legal and compliance notifications regarding our vendor ecosystem. You will not receive marketing emails from this list.'
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. CHANGELOG ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <header className={styles.registryHead} data-sub="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`} data-sub="r">
              {tr('log.eyebrow', 'Recent Updates Log')}
            </p>
            <h2 className={`${styles.title} ${styles.titleLeft}`}>
              <Words text={tr('log.title', 'Subprocessor Changelog')} />
            </h2>
          </header>

          <div data-sub="item">
            <p className={styles.logHint} id="subprocessor-log-hint">
              {tr('log.scrollHint', 'Showing the latest updates first. Scroll within this panel to review older records.')}
            </p>
            <div className={styles.logViewport} tabIndex={0}>
              <ul className={styles.log}>
                {CHANGELOG.map((item) => (
                  <li key={item.key} className={styles.logItem}>
                    <time className={styles.logDate} dateTime={item.date}>
                      <span className={styles.logDot} aria-hidden="true" />
                      {formatDate(item.date)}
                    </time>
                    <p className={styles.logText}>{tr(`log.${item.key}`, item.text)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subprocessors;