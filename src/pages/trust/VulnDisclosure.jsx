import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './VulnDisclosure.module.css';

const SECURITY_EMAIL = 'security@nexgn.cloud';
const PGP_URL = '/pgp.txt'; // served from public/pgp.txt

const LANGS = ['en', 'es', 'hi'];

// ---------- Content (each string has an i18n key + English default) ----------

const DO = [
  { key: 'd1', text: 'Provide detailed reports with reproducible steps.' },
  { key: 'd2', text: 'Submit one vulnerability per report (unless chained for impact).' },
  { key: 'd3', text: 'Use your own test accounts (e.g., researcher+1@email.com) when evaluating the platform.' },
  { key: 'd4', text: 'Delete any test data upon completion of your research.' },
];

const DONT = [
  { key: 'n1', text: 'Do not attempt Denial of Service (DoS/DDoS) attacks.' },
  { key: 'n2', text: 'Do not interact with, access, or modify data belonging to other users.' },
  { key: 'n3', text: 'Do not perform social engineering, phishing, or physical attacks against Nexgn employees or facilities.' },
  { key: 'n4', text: 'Do not use automated vulnerability scanners that generate excessive traffic.' },
];

const REPORT_INCLUDES = [
  { key: 'i1', text: 'A description of the vulnerability and its potential impact.' },
  { key: 'i2', text: 'Clear, step-by-step instructions to reproduce the issue.' },
  { key: 'i3', text: 'A Proof of Concept (PoC) video or screenshots (highly appreciated).' },
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
    'Found a security issue? Read Nexgn’s safe harbor policy, program rules, scope and response timelines, and report vulnerabilities to security@nexgn.cloud.'
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
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url="/trust/vulnerability-disclosure"
        schema={schema}
      />

      {/* ============ 1. HERO (dark) ============ */}
      <section className={`${styles.section} ${styles.dark} ${styles.hero}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.eyebrowCenter}`}>
            {tr('hero.eyebrow', 'Nexgn Security')}
          </p>
          <h1 className={styles.heroTitle}>
            {tr('hero.title1', 'Securing Nexgn,')}{' '}
            <span className={styles.muted}>{tr('hero.title2', 'Together.')}</span>
          </h1>
          <p className={`${styles.lead} ${styles.leadLight}`}>
            {tr(
              'hero.text',
              'The safety of our users’ agreements is our highest priority. We deeply value the global security research community and actively encourage ethical hackers to help us identify and remediate potential vulnerabilities.'
            )}
          </p>
          <div className={styles.actions}>
            <a href={`mailto:${SECURITY_EMAIL}`} className={styles.btnPrimary}>
              {tr('hero.report', 'Report a Vulnerability')}
            </a>
            <a href={PGP_URL} className={styles.btnOutline} download>
              {tr('hero.pgp', 'Download PGP Key')}
            </a>
          </div>
        </div>
      </section>

      {/* ============ 2. SAFE HARBOR (tint) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>{tr('safe.eyebrow', 'Safe Harbor Policy')}</p>
          <h2 className={`${styles.title} ${styles.titleLeft}`}>
            {tr('safe.title', 'Safe Harbor Authorization')}
          </h2>

          {/* Illustration slot: swap for an <img> or SVG when the artwork is ready */}
          <div className={`${styles.media} ${styles.mediaSafe}`} aria-hidden="true" />

          <p className={styles.statement}>
            {tr(
              'safe.text',
              'We consider security research conducted in accordance with this policy to be “authorized” conduct. We will not initiate legal action or law enforcement investigations against researchers who make a good faith effort to comply with these guidelines. If legal action is initiated by a third party against you for activities conducted under this policy, we will take steps to make it known that your actions were conducted in compliance with this policy.'
            )}
          </p>
        </div>
      </section>

      {/* ============ 3. PROGRAM GUIDELINES (light) ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <header className={styles.head}>
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>
              {tr('rules.eyebrow', 'Rules of Engagement')}
            </p>
            <h2 className={styles.title}>{tr('rules.title', 'Program Guidelines')}</h2>
            <p className={styles.lead}>
              {tr(
                'rules.text',
                'To protect our customers and infrastructure, we require all researchers to adhere to the following rules:'
              )}
            </p>
          </header>

          <div className={styles.rules}>
            <div className={`${styles.ruleCard} ${styles.ruleDo}`}>
              <h3 className={styles.ruleTitle}>{tr('rules.doTitle', 'Do')}</h3>
              <ul className={styles.ruleList}>
                {DO.map((item) => (
                  <li key={item.key} className={styles.ruleItem}>
                    <span className={`${styles.ruleIcon} ${styles.iconDo}`} aria-hidden="true">
                      <FiCheck />
                    </span>
                    <span>{tr(`rules.do.${item.key}`, item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.ruleCard} ${styles.ruleDont}`}>
              <h3 className={styles.ruleTitle}>{tr('rules.dontTitle', 'Do Not')}</h3>
              <ul className={styles.ruleList}>
                {DONT.map((item) => (
                  <li key={item.key} className={styles.ruleItem}>
                    <span className={`${styles.ruleIcon} ${styles.iconDont}`} aria-hidden="true">
                      <FiX />
                    </span>
                    <span>{tr(`rules.dont.${item.key}`, item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. SCOPE MATRIX (tint) ============ */}
      <section className={`${styles.section} ${styles.tint}`}>
        <div className={styles.container}>
          <header className={`${styles.head} ${styles.headTight}`}>
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>
              {tr('scope.eyebrow', 'Scope Matrix')}
            </p>
            <h2 className={styles.title}>{tr('scope.title', 'In Scope vs. Out of Scope')}</h2>
          </header>

          {/* Scope table slot: replace with a real table or illustration */}
          <div className={`${styles.media} ${styles.mediaScope}`} aria-hidden="true" />
        </div>
      </section>

      {/* ============ 5. HOW TO SUBMIT (dark) ============ */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight}`}>
            {tr('submit.eyebrow', 'Reporting Guidelines & Timelines')}
          </p>
          <h2 className={`${styles.title} ${styles.titleLeft}`}>
            {tr('submit.title', 'How to Submit a Report')}
          </h2>
          <p className={`${styles.lead} ${styles.leadLeft} ${styles.leadLight}`}>
            {tr('submit.text1', 'Send your findings via email to')}{' '}
            <a href={`mailto:${SECURITY_EMAIL}`} className={styles.inlineLink}>
              {SECURITY_EMAIL}
            </a>
            {tr(
              'submit.text2',
              '. If you are sharing sensitive Proof of Concept (PoC) code, please encrypt your email using our public PGP key.'
            )}
          </p>

          <ol className={styles.timeline}>
            <li className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.dot} aria-hidden="true" />
              <h3 className={styles.stepTitle}>{tr('submit.reported', 'Reported')}</h3>
              <ul className={styles.stepList}>
                {REPORT_INCLUDES.map((item) => (
                  <li key={item.key} className={styles.stepItem}>
                    <FiCheck className={styles.stepCheck} aria-hidden="true" />
                    <span>{tr(`submit.includes.${item.key}`, item.text)}</span>
                  </li>
                ))}
              </ul>
            </li>

            <li className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <h3 className={styles.stepTitle}>{tr('submit.acknowledged', 'Acknowledged')}</h3>
              <p className={styles.stepText}>
                {tr('submit.acknowledgedText', 'Within 48 business hours.')}
              </p>
            </li>

            <li className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <h3 className={styles.stepTitle}>{tr('submit.triaged', 'Triaged')}</h3>
              <p className={styles.stepText}>
                {tr('submit.triagedText', 'Within 5 business days.')}
              </p>
            </li>

            <li className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <h3 className={styles.stepTitle}>{tr('submit.remediated', 'Remediated')}</h3>
              <p className={styles.stepText}>
                {tr(
                  'submit.remediatedText',
                  'We aim to deploy fixes for critical vulnerabilities within 24 hours of triage, and non-critical issues within our standard sprint cycles.'
                )}
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ============ 6. HALL OF FAME (light) ============ */}
      <section className={`${styles.section} ${styles.light} ${styles.sectionLast}`}>
        <div className={styles.container}>
          <header className={styles.head}>
            <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>
              {tr('fame.eyebrow', 'Recognition & Rewards')}
            </p>
            <h2 className={styles.title}>{tr('fame.title', 'The Nexgn Security Hall of Fame')}</h2>
            <p className={styles.lead}>
              {tr(
                'fame.text',
                'While we do not currently operate a paid bug bounty program, we believe in recognizing the hard work of the infosec community. Valid, critical, and high-severity reports that lead to a code change will be rewarded with:'
              )}
            </p>
          </header>

          <ul className={styles.rewards}>
            {REWARDS.map((r) => (
              <li key={r.key} className={styles.reward}>
                <div className={`${styles.media} ${styles.mediaReward}`} aria-hidden="true" />
                <p className={styles.rewardText}>{tr(`fame.${r.key}`, r.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default VulnDisclosure;