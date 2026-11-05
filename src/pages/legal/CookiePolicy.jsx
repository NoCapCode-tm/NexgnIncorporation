import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiBarChart2,
  FiCloud,
  FiCpu,
  FiCreditCard,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiShield,
  FiSliders,
  FiTarget,
  FiToggleRight,
  FiUserCheck,
} from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import LegalLayout, {
  LegalText,
  LegalCards,
  LegalGuarantee,
} from '../../components/legal/LegalLayout';
import styles from './CookiePolicy.module.css';

const COOKIE_CATEGORIES = [
  {
    key: 'essential',
    Icon: FiLock, // can't be switched off
    title: 'Strictly Necessary (Essential) Cookies',
    desc: 'These cookies are essential for the website and application to function and cannot be switched off.',
    blocks: [
      {
        key: 'purpose',
        label: 'PURPOSE',
        text: 'Authenticating users, maintaining secure login sessions, managing workspace permissions, and routing OAuth tokens (e.g., Google Sign-In, Google Drive synchronization) securely.',
      },
      {
        key: 'signer',
        label: 'SIGNER SESSIONS',
        text: 'When a signer opens a document verification link, a strictly necessary session cookie or token is used to maintain document integrity, signature intent, and session continuity during execution.',
      },
    ],
  },
  {
    key: 'functional',
    Icon: FiSliders, // remembered preferences
    title: 'Functional & Preference Cookies',
    desc: 'These cookies allow our platform to remember choices you make to provide enhanced, personalized features.',
    blocks: [
      {
        key: 'examples',
        label: 'EXAMPLES',
        text: 'Remembering your preferred language (English, Español, हिन्दी), timezone settings, or dashboard layout preferences.',
      },
    ],
  },
  {
    key: 'analytics',
    Icon: FiBarChart2, // measurement
    title: 'Analytical & Performance Cookies',
    desc: 'These help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    blocks: [
      {
        key: 'purpose',
        label: 'PURPOSE',
        text: 'Tracking page load speeds, identifying broken links, and measuring feature adoption inside the public marketing site and Help Center.',
      },
    ],
  },
  {
    key: 'marketing',
    Icon: FiTarget, // targeting
    title: 'Marketing & Targeting Cookies',
    desc: 'Used on our public marketing pages to measure the effectiveness of our campaigns and deliver relevant product updates across platforms.',
    blocks: [],
  },
];

const THIRD_PARTIES = [
  {
    key: 'cloudflare',
    Icon: FiCloud,
    title: 'Cloudflare',
    text: 'Used for DDoS mitigation, bot protection, CDN routing, and edge security across all Nexgn domains to distinguish legitimate traffic from automated threats.',
  },
  {
    key: 'razorpay',
    Icon: FiCreditCard,
    title: 'Razorpay',
    text: 'Loaded strictly on billing and checkout views to process subscription payments securely, prevent fraud, and maintain PCI-DSS compliance.',
  },
];

const CHOICES = [
  {
    key: 'consent',
    Icon: FiToggleRight,
    title: 'Consent Manager',
    text: 'When you first visit nexgn.cloud, our consent banner allows you to accept or customize non-essential cookie preferences. You can update these preferences at any time from the footer settings.',
  },
  {
    key: 'browser',
    Icon: FiGlobe,
    title: 'Browser Settings',
    text: 'Most web browsers allow you to control cookies through their settings preferences. Please note that disabling Strictly Necessary cookies will prevent you from logging into your Nexgn workspace or executing agreements.',
  },
];

const LANGS = ['en', 'es', 'hi'];

const CookiePolicy = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`legal.cookies.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Cookie Policy | Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Learn how Nexgn uses cookies and local storage for secure authentication, session continuity, signer verification, and privacy-first analytics.'
  );

  // Same shape as the other pages: language-prefixed URL (the bare path redirects to the homepage)
  const pageUrl = `https://nexgn.cloud/${currentLng}/legal/cookie-policy`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${seoTitle} | Nexgn`,
    description: seoDescription,
    inLanguage: currentLng,
    isPartOf: { '@type': 'WebSite', name: 'Nexgn', url: 'https://nexgn.cloud' },
  };

  const sections = [
    {
      id: 'how-we-use-cookies',
      navLabel: tr('section.how.navLabel', '1. How We Use Cookies'),
      title: tr('how.title', '1. How We Use Cookies'),
      body: (
        <>
          <LegalText>
            {tr(
              'how.desc',
              'Nexgn ("we", "our", or "us") uses cookies, local storage, and similar session technologies to operate our electronic signature infrastructure, authenticate workspace users, and secure agreement execution workflows. This Cookie Policy explains what these technologies are, why we use them, and how you can control your preferences.'
            )}
          </LegalText>
          <LegalCards
            cards={[
              {
                icon: <FiUserCheck />, // the one who decides
                eyebrow: tr('how.card1.eyebrow', 'THE USER (YOU)'),
                title: tr('how.card1.title', 'Data Controller'),
                text: tr(
                  'how.card1.desc',
                  'You decide what documents to upload and who to send them to.'
                ),
              },
              {
                icon: <FiCpu />, // the one who processes
                eyebrow: tr('how.card2.eyebrow', 'NEXGN'),
                title: tr('how.card2.title', 'Data Processor'),
                text: tr(
                  'how.card2.desc',
                  'We process the documents and signer telemetry strictly on your instructions to facilitate the signature workflow.'
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: 'types-of-cookies',
      navLabel: tr('section.types.navLabel', '2. Types of Cookies'),
      title: tr('types.title', '2. Types of Cookies'),
      body: (
        <>
          <LegalText>
            {tr(
              'types.desc',
              'We classify the cookies and session tokens we use into the following categories:'
            )}
          </LegalText>

          <div className={styles.categoryStack}>
            {COOKIE_CATEGORIES.map((cat) => (
              <div key={cat.key} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryIcon} aria-hidden="true">
                    <cat.Icon />
                  </span>
                  <h3 className={styles.categoryTitle}>
                    {tr(`types.${cat.key}.title`, cat.title)}
                  </h3>
                </div>
                <p className={styles.categoryDesc}>
                  {tr(`types.${cat.key}.desc`, cat.desc)}
                </p>

                {cat.blocks.map((b) => (
                  <div key={b.key} className={styles.subBlock}>
                    <p className={styles.subEyebrow}>
                      {tr(`types.${cat.key}.${b.key}.label`, b.label)}
                    </p>
                    <p className={styles.subText}>
                      {tr(`types.${cat.key}.${b.key}.text`, b.text)}
                    </p>
                  </div>
                ))}
              </div>
            ))}

            <div className={styles.darkPledgeCard}>
              <span className={styles.darkPledgeIcon} aria-hidden="true">
                <FiEyeOff />
              </span>
              <div className={styles.darkPledgeBody}>
                <p className={styles.darkPledgeEyebrow}>
                  {tr('types.pledge.eyebrow', 'WORKSPACE ISOLATION')}
                </p>
                <p className={styles.darkPledgeTitle}>
                  {tr(
                    'types.pledge.title',
                    'We never deploy third-party advertising cookies inside the logged-in Nexgn application (sign.nexgn.cloud) or within the document signing portal.'
                  )}
                </p>
                <p className={styles.darkPledgeSub}>
                  {tr(
                    'types.pledge.sub',
                    'Your signers are never tracked by ad networks while reviewing or executing agreements.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'artificial-intelligence',
      navLabel: tr('section.ai.navLabel', '3. Artificial Intelligence & Data Isolation'),
      title: tr('ai.title', '3. Artificial Intelligence & Data Isolation'),
      body: (
        <>
          <LegalText>
            {tr(
              'ai.desc',
              'If a Workspace Admin opts into Nexgn AI features (e.g., AI Agreement Summary), document text is securely transmitted to our AI sub-processors via zero-retention enterprise APIs.'
            )}
          </LegalText>
          <LegalGuarantee icon={<FiShield />}>
            {tr(
              'ai.guarantee',
              'Nexgn explicitly guarantees that customer documents, templates, and signatures are never used to train public or foundational AI models.'
            )}
          </LegalGuarantee>
        </>
      ),
    },
    {
      id: 'third-party-cookies',
      navLabel: tr('section.thirdParty.navLabel', '4. Third-Party Cookies'),
      title: tr('thirdParty.title', '4. Third-Party Cookies'),
      body: (
        <>
          <LegalText>
            {tr(
              'thirdParty.desc',
              'To deliver our secure infrastructure and billing services, trusted third-party providers may set cookies:'
            )}
          </LegalText>
          <ul className={styles.featureList}>
            {THIRD_PARTIES.map((item) => (
              <li key={item.key} className={styles.featureItem}>
                <span className={styles.featureSquare} aria-hidden="true">
                  <item.Icon />
                </span>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>
                    {tr(`thirdParty.${item.key}.title`, item.title)}
                  </h3>
                  <p className={styles.featureText}>
                    {tr(`thirdParty.${item.key}.text`, item.text)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'your-choices',
      navLabel: tr('section.choices.navLabel', '5. Your Choices and Controls'),
      title: tr('choices.title', '5. Your Choices and Controls'),
      body: (
        <>
          <LegalText>
            {tr(
              'choices.desc',
              'You have the right to decide whether to accept or reject non-essential cookies:'
            )}
          </LegalText>
          <ul className={styles.featureList}>
            {CHOICES.map((item) => (
              <li key={item.key} className={styles.featureItem}>
                <span className={styles.featureSquare} aria-hidden="true">
                  <item.Icon />
                </span>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>
                    {tr(`choices.${item.key}.title`, item.title)}
                  </h3>
                  <p className={styles.featureText}>
                    {tr(`choices.${item.key}.text`, item.text)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url="/legal/cookie-policy"
        schema={schema}
      />
      <LegalLayout
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Cookie Policy')}
        align="center"
        navHeader={tr('nav.header', 'ON THIS PAGE')}
        sections={sections}
      />
    </>
  );
};

export default CookiePolicy;