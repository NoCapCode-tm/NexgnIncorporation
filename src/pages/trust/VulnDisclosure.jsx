import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import styles from './VulnDisclosure.module.css';

// TODO: confirm before launch
const SECURITY_EMAIL = 'security@nexgn.cloud';
const PGP_KEY_URL = '/pgp.txt'; // already in public/

const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES
   Drop files into  src/assets/trust/  (same folder as Privacy / Legality). Picked up by NAME with
   any extension; a missing file never breaks the build (grey box / gradient shows instead).
   Restart the dev server after adding a file.

     vuln-hero         photo behind the hero (hands on a laptop)
     vuln-safe-harbor  wide picture under "Safe Harbor Authorization"
     vuln-hof-1        Hall of Fame card 1 (Security Swag)
     vuln-hof-2        Hall of Fame card 2 (Hall of Fame listing)
     vuln-hof-3        Hall of Fame card 3 (Letter of recommendation)
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

const IMAGES = {
  hero: findImage('vuln-hero'),
  safeHarbor: findImage('vuln-safe-harbor'),
  hof: [findImage('vuln-hof-1'), findImage('vuln-hof-2'), findImage('vuln-hof-3')],
};

const bg = (src) => (src ? { '--img': `url("${src}")` } : undefined);

// ---------- Content (every string has an i18n key + English default) ----------

const DOS = [
  'Provide detailed reports with reproducible steps.',
  'Submit one vulnerability per report (unless chained for impact).',
  'Use your own test accounts (e.g., researcher+1@email.com) when evaluating the platform.',
  'Delete any test data upon completion of your research.',
];

const DONTS = [
  'Do not attempt Denial of Service (DoS/DDoS) attacks.',
  'Do not interact with, access, or modify data belonging to other users.',
  'Do not perform social engineering, phishing, or physical attacks against Nexgn employees or facilities.',
  'Do not use automated vulnerability scanners that generate excessive traffic.',
];

const SCOPE = [
  { key: 'app', asset: 'app.nexgn.cloud', inScope: true, text: 'The primary frontend application.' },
  { key: 'api', asset: 'api.nexgn.cloud', inScope: true, text: 'The backend Node.js REST API.' },
  { key: 'wild', asset: '*.nexgn.cloud', inScope: true, text: 'Subdomains actively hosting Nexgn infrastructure.' },
  { key: 'blog', asset: 'blog.nexgn.cloud', inScope: false, text: 'Marketing/CMS sites with no customer data.' },
  {
    key: 'third',
    asset: 'Third-Party Services',
    inScope: false,
    text: 'Razorpay, Resend, Google Drive integrations (report directly to vendors).',
  },
];

const STEPS = [
  {
    key: 'reported',
    title: 'Reported',
    bullets: [
      'A description of the vulnerability and its potential impact.',
      'Clear, step-by-step instructions to reproduce the issue.',
      'A Proof of Concept (PoC) video or screenshots (highly appreciated).',
    ],
  },
  { key: 'acknowledged', title: 'Acknowledged', text: 'Within 48 business hours.' },
  { key: 'triaged', title: 'Triaged', text: 'Within 5 business days.' },
  {
    key: 'remediated',
    title: 'Remediated',
    text: 'We aim to deploy fixes for critical vulnerabilities within 24 hours of triage, and non-critical issues within our standard sprint cycles.',
  },
];

const REWARDS = [
  { key: 'swag', text: 'Exclusive Nexgn Security Swag (shipped globally).' },
  { key: 'fame', text: 'Public recognition on our Security Hall of Fame (if desired).' },
  { key: 'letter', text: 'A formal letter of recommendation from our Engineering leadership.' },
];

// ---------- Page ----------

const VulnDisclosure = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`vuln.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Vulnerability Disclosure Program');
  const seoDescription = tr(
    'seo.description',
    'Report a security vulnerability to Nexgn. Read our safe harbor policy, program guidelines, scope, reporting timelines and Security Hall of Fame.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/trust/vulnerability-disclosure`;
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
          { '@type': 'ListItem', position: 3, name: 'Vulnerability Disclosure', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/trust/vulnerability-disclosure" schema={schema} />

      {/* ============ 1. HERO (photo + frosted card) ============ */}
      <section className={styles.hero}>
        <div className={styles.heroPhoto} style={bg(IMAGES.hero)} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.rise}`}>
              {tr('hero.eyebrow', 'Nexgn Security')}
            </p>
            <h1 className={`${styles.heroTitle} ${styles.rise}`} style={{ '--d': '100ms' }}>
              {tr('hero.title1', 'Securing Nexgn,')}{' '}
              <span className={styles.muted}>{tr('hero.title2', 'Together.')}</span>
            </h1>
            <p className={`${styles.lead} ${styles.leadLight} ${styles.rise}`} style={{ '--d': '200ms' }}>
              {tr(
                'hero.text',
                'The safety of our users’ agreements is our highest priority. We deeply value the global security research community and actively encourage ethical hackers to help us identify and remediate potential vulnerabilities.'
              )}
            </p>
            <div className={`${styles.actions} ${styles.rise}`} style={{ '--d': '300ms' }}>
              <a
                href={`mailto:${SECURITY_EMAIL}?subject=${encodeURIComponent('Vulnerability report')}`}
                className={styles.btnPrimary}
              >
                {tr('hero.report', 'Report a Vulnerability')}
              </a>
              <a href={PGP_KEY_URL} className={styles.btnGlass} download>
                {tr('hero.pgp', 'Download PGP Key')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. SAFE HARBOR (light, left aligned) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <Reveal className={styles.headLeft}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLeft}`}>{tr('harbor.eyebrow', 'Safe Harbor')}</p>
            <h2 className={`${styles.title} ${styles.titleLeft}`}>
              {tr('harbor.title', 'Safe Harbor Authorization')}
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className={`${styles.media} ${styles.mediaHarbor}`} style={bg(IMAGES.safeHarbor)} aria-hidden="true" />
          </Reveal>

          <Reveal delay={150}>
            <p className={styles.harborText}>
              {tr(
                'harbor.text',
                'We consider security research conducted in accordance with this policy to be “authorized” conduct. We will not initiate legal action or law enforcement investigations against researchers who make a good faith effort to comply with these guidelines. If legal action is initiated by a third party against you for activities conducted under this policy, we will take steps to make it known that your actions were conducted in compliance with this policy.'
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. PROGRAM GUIDELINES (light) ============ */}
      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={styles.eyebrow}>{tr('guidelines.eyebrow', 'Rules of Engagement')}</p>
            <h2 className={styles.title}>{tr('guidelines.title', 'Program Guidelines')}</h2>
            <p className={styles.lead}>
              {tr(
                'guidelines.text',
                'To protect our customers and infrastructure, we require all researchers to adhere to the following rules:'
              )}
            </p>
          </Reveal>

          <div className={styles.twoCol}>
            <Reveal className={`${styles.ruleCard} ${styles.ruleDo} ${styles.lift}`}>
              <h3 className={styles.ruleTitle}>{tr('guidelines.doTitle', 'Do')}</h3>
              <ul className={styles.ruleList}>
                {DOS.map((text, i) => (
                  <li key={i} className={styles.ruleItem}>
                    <span className={`${styles.mark} ${styles.markYes}`} aria-hidden="true">
                      <FiCheck />
                    </span>
                    <span>{tr(`guidelines.do${i + 1}`, text)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className={`${styles.ruleCard} ${styles.ruleDont} ${styles.lift}`}>
              <h3 className={styles.ruleTitle}>{tr('guidelines.dontTitle', 'Do Not')}</h3>
              <ul className={styles.ruleList}>
                {DONTS.map((text, i) => (
                  <li key={i} className={styles.ruleItem}>
                    <span className={`${styles.mark} ${styles.markNo}`} aria-hidden="true">
                      <FiX />
                    </span>
                    <span>{tr(`guidelines.dont${i + 1}`, text)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 4. SCOPE (tint) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={styles.eyebrow}>{tr('scope.eyebrow', 'Scope Matrix')}</p>
            <h2 className={styles.title}>{tr('scope.title', 'In Scope vs. Out of Scope')}</h2>
          </Reveal>

          <Reveal delay={100} className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{tr('scope.colAsset', 'Asset / Endpoint')}</th>
                  <th scope="col">{tr('scope.colStatus', 'Status')}</th>
                  <th scope="col">{tr('scope.colDesc', 'Description')}</th>
                </tr>
              </thead>
              <tbody>
                {SCOPE.map((row) => (
                  <tr key={row.key}>
                    <th scope="row" className={styles.rowLabel}>
                      {tr(`scope.${row.key}.asset`, row.asset)}
                    </th>
                    <td data-label={tr('scope.colStatus', 'Status')}>
                      <span className={`${styles.badge} ${row.inScope ? styles.badgeIn : styles.badgeOut}`}>
                        <span className={styles.badgeDot} aria-hidden="true" />
                        {row.inScope ? tr('scope.in', 'In Scope') : tr('scope.out', 'Out of Scope')}
                      </span>
                    </td>
                    <td data-label={tr('scope.colDesc', 'Description')} className={styles.cellDesc}>
                      {tr(`scope.${row.key}.text`, row.text)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ============ 5. HOW TO SUBMIT (dark, timeline) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <Reveal className={styles.headLeft}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLeft} ${styles.eyebrowLight}`}>
              {tr('submit.eyebrow', 'Reporting Guidelines & Timelines')}
            </p>
            <h2 className={`${styles.title} ${styles.titleLeft}`}>{tr('submit.title', 'How to Submit a Report')}</h2>
            <p className={`${styles.lead} ${styles.leadLeft} ${styles.leadLight}`}>
              {tr('submit.text1', 'Send your findings via email to')}{' '}
              <a className={styles.mailLink} href={`mailto:${SECURITY_EMAIL}`}>
                {SECURITY_EMAIL}
              </a>
              {'. '}
              {tr(
                'submit.text2',
                'If you are sharing sensitive Proof of Concept (PoC) code, please encrypt your email using our public PGP key.'
              )}
            </p>
          </Reveal>

          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.key} delay={i * 120} className={styles.step}>
                <span className={`${styles.stepDot} ${i === 0 ? styles.stepDotActive : ''}`} aria-hidden="true" />
                <h3 className={styles.stepTitle}>{tr(`submit.${step.key}.title`, step.title)}</h3>
                {step.bullets ? (
                  <ul className={styles.stepBullets}>
                    {step.bullets.map((b, n) => (
                      <li key={n} className={styles.stepBullet}>
                        <FiCheck aria-hidden="true" />
                        <span>{tr(`submit.${step.key}.b${n + 1}`, b)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.stepText}>{tr(`submit.${step.key}.text`, step.text)}</p>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 6. HALL OF FAME (light) ============ */}
      <section className={`${styles.section} ${styles.white} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <Reveal as="header" className={styles.head}>
            <p className={styles.eyebrow}>{tr('fame.eyebrow', 'Recognition & Rewards')}</p>
            <h2 className={styles.title}>{tr('fame.title', 'The Nexgn Security Hall of Fame')}</h2>
            <p className={styles.lead}>
              {tr(
                'fame.text',
                'While we do not currently operate a paid bug bounty program, we believe in recognizing the hard work of the infosec community. Valid, critical, and high-severity reports that lead to a code change will be rewarded with:'
              )}
            </p>
          </Reveal>

          <ul className={styles.threeCol}>
            {REWARDS.map(({ key, text }, i) => (
              <Reveal as="li" key={key} delay={i * 110} className={`${styles.card} ${styles.lift}`}>
                <div className={`${styles.media} ${styles.mediaReward}`} style={bg(IMAGES.hof[i])} aria-hidden="true" />
                <p className={styles.rewardText}>{tr(`fame.${key}`, text)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default VulnDisclosure;