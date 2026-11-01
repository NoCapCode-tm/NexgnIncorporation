import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShield } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import styles from './Subprocessors.module.css';

// TODO: confirm before launch
const PRIVACY_EMAIL = 'privacy@nexgn.cloud';
// Newsletter endpoint. Leave '' to fall back to an email to PRIVACY_EMAIL.
// When set, the form POSTs JSON { email, list: 'subprocessors' } to it.
const SUBSCRIBE_URL = '';

const LANGS = ['en', 'es', 'hi'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* =====================================================================
   IMAGES
   Drop the hero photo into  src/assets/trust/  as  subprocessors-hero.(png|jpg|webp...)
   (same folder as Privacy / Legality). Picked up by NAME; a missing file never breaks the build.
   Restart the dev server after adding it.
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

const HERO_IMAGE = findImage('subprocessors-hero');

/* ---------------------------------------------------------------------
   THE REGISTRY.
   Confirm each provider, production data flow, contractual role, data category,
   and processing location against live configuration and signed agreements
   before treating the public registry as final.
   --------------------------------------------------------------------- */
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

// No optional AI provider is listed until a production integration and its
// contractual/data-processing scope have been verified.
const OPTIONAL = [
  { key: 'ai', name: 'AI model provider (zero-retention enterprise API)', purpose: 'AI Agreement Summary and AI features (opt-in only)', data: 'Document text, processed and not retained', location: 'To be confirmed' },
];

const CHANGELOG = [
  // ISO dates, newest first. These entries document registry history and
  // evidence reviews; they do not backdate vendor onboarding without proof.
  {
    key: 'inventory-review',
    date: '2026-11-02',
    text: 'Reviewed the provider inventory against available Nexgn product and infrastructure records. MongoDB Atlas and Razorpay are documented in the product architecture; their precise production data flows, contractual roles, and processing locations remain subject to verification.',
  },
  {
    key: 'cloudflare-assessment',
    date: '2026-11-02',
    text: 'Added Cloudflare to the infrastructure assessment for DNS, CDN, proxy, and security services. Its status as a subprocessor depends on confirming actual Nexgn traffic routing and the data Cloudflare processes on Nexgn’s behalf.',
  },
  {
    key: 'managed-infrastructure',
    date: '2026-11-02',
    text: 'Clarified the classification of Nexgn-managed server infrastructure. A server operated directly by Nexgn is internal infrastructure, not a separate third-party subprocessor; external hosting or backup providers are assessed separately.',
  },
  {
    key: 'ai-provider-exclusion',
    date: '2026-11-02',
    text: 'Removed OpenAI and Anthropic from the proposed subprocessor inventory because the available records do not establish a confirmed production integration or the applicable processing arrangements.',
  },
  {
    key: 'byos-classification-review',
    date: '2026-11-02',
    text: 'Reviewed the Google Drive BYOS disclosure. Google Drive remains documented as a customer-connected storage integration; its formal subprocessor classification must be determined from the actual contract, authorization flow, and data-processing roles.',
  },
  {
    key: 'hosting-placeholder-review',
    date: '2026-11-02',
    text: 'Flagged the generic AWS / Google Cloud hosting placeholder for confirmation. No specific cloud-hosting provider or onboarding date is asserted until the deployed hosting arrangement is verified.',
  },
  {
    key: 'initial',
    date: '2026-10-30',
    text: 'Initial publication of the Nexgn Subprocessor Registry, establishing a public record for provider identity, processing purpose, data categories, and processing location.',
  },
  {
    key: 'architecture-snapshot',
    date: '2026-10-14',
    text: 'The internal Nexgn product and architecture reference recorded MongoDB Atlas, Razorpay subscription billing, and Google Drive OAuth / file synchronization as platform components. This is a documentation snapshot, not a verified provider onboarding date.',
  },
  {
    key: 'mongodb-documentation',
    date: '2026-10-14',
    text: 'MongoDB Atlas was identified in the internal architecture reference as the cloud database component. The production environment, data categories, and processing region require confirmation.',
  },
  {
    key: 'razorpay-documentation',
    date: '2026-10-14',
    text: 'Razorpay subscription billing was recorded in Nexgn product and codebase notes. The effective service date and exact payment-data flow require confirmation.',
  },
  {
    key: 'google-drive-documentation',
    date: '2026-10-14',
    text: 'Google Drive OAuth and document synchronization were documented as part of Nexgn’s BYOS workflow. This records the documented integration, not a determination that Google Drive is a Nexgn subprocessor.',
  },
  {
    key: 'beta-baseline',
    date: '2026-09-20',
    text: 'Nexgn public beta commenced. This marks the beginning of the historical review period; it does not establish that any particular vendor was first engaged on this date.',
  },
];

// ---------- Registry table ----------

const RegistryTable = ({ rows, tr, group, emptyText }) => (
  <Reveal delay={100} className={styles.tableCard}>
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
  </Reveal>
);

// ---------- Page ----------

const Subprocessors = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`subprocessors.${key}`, fallback);

  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | invalid | sending | done | error

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
        // No endpoint yet: hand the request to the visitor's email app
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
          { '@type': 'ListItem', position: 3, name: 'Subprocessors', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/subprocessors" schema={schema} />

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
              {tr('hero.eyebrow', 'Nexgn Trust Center')}
            </p>
            <h1 className={`${styles.heroTitle} ${styles.rise}`} style={{ '--d': '100ms' }}>
              {tr('hero.title', 'Subprocessor Registry')}
            </h1>
            <p className={`${styles.lead} ${styles.leadLight} ${styles.rise}`} style={{ '--d': '200ms' }}>
              {tr(
                'hero.text',
                'At Nexgn, transparency is our baseline. To provide our secure agreement platform, we engage certain third-party service providers to process customer data on our behalf. Below is the official list of authorized Nexgn Subprocessors.'
              )}
            </p>
            <div className={`${styles.actions} ${styles.rise}`} style={{ '--d': '300ms' }}>
              <a href="#subscribe" className={styles.btnPrimary}>
                {tr('hero.subscribe', 'Subscribe to Updates')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. UNDERSTANDING (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <Reveal className={styles.splitHead}>
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`}>{tr('about.eyebrow', 'What is a Subprocessor?')}</p>
              <h2 className={styles.splitTitle}>{tr('about.title', 'Understanding Our Vendor Ecosystem')}</h2>
            </Reveal>

            <Reveal delay={120} className={styles.splitBody}>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 3. REGISTRY (tint) ============ */}
      <section className={`${styles.section} ${styles.tint}`} id="registry">
        <div className={styles.container}>
          <div className={styles.registryBlock}>
            <Reveal className={styles.registryHead}>
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`}>{tr('core.eyebrow', 'Authorized Subprocessors')}</p>
              <h2 className={`${styles.title} ${styles.titleLeft}`}>{tr('core.title', 'Current Subprocessors')}</h2>
            </Reveal>
            <RegistryTable
              rows={CORE}
              tr={tr}
              group="core"
              emptyText={tr('registry.empty', 'No subprocessors to list at this time.')}
            />
          </div>

          <div className={styles.registryBlock}>
            <Reveal className={`${styles.split} ${styles.registryHead}`}>
              <h2 className={styles.splitTitleSmall}>
                {tr('optional.title', 'Optional / Feature-Specific Subprocessors')}
              </h2>
              <p className={styles.copySmall}>
                {tr(
                  'optional.text',
                  'Feature-specific subprocessors will be listed here only after the relevant production integration, data flow, and contractual processing role have been verified. No optional AI provider is currently included in this registry.'
                )}
              </p>
            </Reveal>
            <RegistryTable
              rows={OPTIONAL}
              tr={tr}
              group="optional"
              emptyText={tr('registry.empty', 'No subprocessors to list at this time.')}
            />
          </div>
        </div>
      </section>

      {/* ============ 4. BYOS NOTE (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <Reveal className={styles.note}>
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
          </Reveal>
        </div>
      </section>

      {/* ============ 5. STAY INFORMED (dark) ============ */}
      <section className={`${styles.section} ${styles.dark}`} id="subscribe">
        <div className={styles.container}>
          <div className={styles.split}>
            <Reveal className={styles.splitHead}>
              <p className={`${styles.eyebrow} ${styles.eyebrowLeft} ${styles.eyebrowLight}`}>
                {tr('inform.eyebrow', 'Notification of Changes')}
              </p>
              <h2 className={`${styles.splitTitle} ${styles.splitTitleLight}`}>{tr('inform.title', 'Stay Informed')}</h2>
              <p className={`${styles.copy} ${styles.copyLight}`}>
                {tr(
                  'inform.text',
                  'As our business grows, we may occasionally partner with new service providers. In accordance with global data protection laws (including the GDPR), we will notify all subscribed users at least 30 days prior to authorizing any new subprocessor to process Customer Data.'
                )}
              </p>
            </Reveal>

            <Reveal delay={120} className={styles.form}>
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

                <p
                  className={`${styles.status} ${state === 'invalid' || state === 'error' ? styles.statusError : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {state === 'invalid' && tr('inform.invalid', 'Please enter a valid email address.')}
                  {state === 'error' && tr('inform.error', 'Something went wrong. Please try again or email us.')}
                  {state === 'done' &&
                    (SUBSCRIBE_URL
                      ? tr('inform.done', 'Thanks! You are subscribed.')
                      : tr('inform.doneMail', 'Almost done: send the email that just opened to confirm.'))}
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 6. CHANGELOG (light) ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <Reveal className={styles.registryHead}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`}>{tr('log.eyebrow', 'Recent Updates Log')}</p>
            <h2 className={`${styles.title} ${styles.titleLeft}`}>{tr('log.title', 'Subprocessor Changelog')}</h2>
          </Reveal>

          <Reveal delay={100}>
            <p className={styles.logHint} id="subprocessor-log-hint">
              {tr('log.scrollHint', 'Showing the latest updates first. Scroll within this panel to review older records.')}
            </p>
            <div
              className={styles.logViewport}
              role="region"
              aria-label={tr('log.regionLabel', 'Subprocessor changelog entries')}
              aria-describedby="subprocessor-log-hint"
              tabIndex={0}
            >
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
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Subprocessors;