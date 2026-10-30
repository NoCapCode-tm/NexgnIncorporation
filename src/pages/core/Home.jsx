import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiCheckCircle, FiCommand, FiEdit2, FiFileText, FiShield, FiStar, FiX } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import ImpactStats from '../../components/common/ImpactStats';
import useHomeAnimations from '../../hooks/useHomeAnimations';
import gsap from 'gsap';
import styles from './Home.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';

const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES
   Drop your photos into  src/assets/home/  (the folder must exist). Any of png / jpg / jpeg /
   webp / avif / svg works, and the extension does not matter: files are picked up by NAME.
   A missing file never breaks the build, that spot just shows a dark gradient placeholder.

     hero          dark photo behind the hero (hand on keyboard)
     workflow      concrete wall / stairs
     pricing       dark curved ribbons
     cta           woman signing
     totp, hash, law, storage     the four compliance cards (4:3)
   ===================================================================== */
const imageContext = require.context('../../assets/home', false, /\.(png|jpe?g|webp|avif|svg)$/i);

const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const IMAGES = {
  hero: findImage('hero'),
  workflow: findImage('workflow'),
  pricing: findImage('pricing'),
  cta: findImage('cta'),
  totp: findImage('totp'),
  hash: findImage('hash'),
  law: findImage('law'),
  storage: findImage('storage'),
};

const bg = (src) => (src ? { '--img': `url("${src}")` } : undefined);

/* =====================================================================
   Small hooks / helpers
   ===================================================================== */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Splits a headline into words, each inside its own mask, so GSAP can slide them up one by one.
// (Done in JSX, not by editing the DOM, so React and translations keep working.)
const Words = ({ text, className = '', a = 'word' }) => {
  const words = String(text).split(' ').filter(Boolean);
  return words.map((word, i) => (
    <React.Fragment key={`${word}-${i}`}>
      <span className={styles.w}>
        <span className={`${styles.wi} ${className}`} data-a={a}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ));
};

// The red "Sign." cycles through five signature typefaces (see useHomeAnimations + .signV* in the CSS).
// Variants 2-4 are drawn with CSS (data-text), so crawlers and screen readers see "Sign." only once.
const SIGNATURE_FONTS = [
  'DM Sans',
  'Allison',
  'Alex Brush',
  'Sacramento',
  'Herr Von Muellerhoff',
];

const SignCycle = ({ text }) => (
  <span className={`${styles.sign} ${styles.red}`} data-a="hero-sign">
    <span
      className={`${styles.signV} ${styles.signV0}`}
      data-sign-v
      data-sign-font={SIGNATURE_FONTS[0]}
    >
      {text}
    </span>
    {[1, 2, 3, 4].map((n) => (
      <span
        key={n}
        className={`${styles.signV} ${styles[`signV${n}`]}`}
        data-sign-v
        data-sign-font={SIGNATURE_FONTS[n]}
        data-text={text}
        aria-hidden="true"
      />
    ))}
  </span>
);

/* =====================================================================
   Content (every string has an i18n key + English default)
   ===================================================================== */

const TRUST_TAGS = ['IT Act 2000', 'ESIGN and UETA', 'eIDAS', 'AES-256 encrypted'];

// TODO: drop real logo files into src/assets/logos and set `src`. Until then the name is shown as text.
// Only show logos of companies that have given you permission.
const LOGOS = [
  { key: 'amazon', name: 'amazon', src: null }, // Example: src/assets/logos/amazon.png
  { key: 'cme', name: 'CME Group', src: null }, // Example: src/assets/logos/cme.png
  { key: 'entergy', name: 'entergy', src: null }, // Example: src/assets/logos/entergy.png
  { key: 'everest', name: 'everest', src: null }, // Example: src/assets/logos/everest.png
  { key: 'orbit', name: 'orbit', src: null }, // Example: src/assets/logos/orbit.png
];

// Hover (or tap / focus) a step on the left and the panel on the right switches to it.
// To show a product screenshot in the white box, set `img` (imported image) on a step.
const FLOW = [
  {
    key: 'prepare',
    label: 'Prepare',
    icon: FiFileText,
    img: null,
    title: 'Make every document ready to sign.',
    text: 'Place fields visually, assign them to the right signers, and reuse templates for agreements you send often.',
    bullets: ['Flexible field placement', 'Reusable PDF and HTML templates', 'Drag-and-drop PDF editor'],
  },
  {
    key: 'sign',
    label: 'Sign',
    icon: FiEdit2,
    img: null,
    title: 'Signing should be the easy part.',
    text: 'Send recipients a clear, mobile-friendly signing link. They can complete the signing flow without creating a Nexgn account.',
    bullets: ['Mobile-friendly experience', 'Draw, type or upload signatures', 'Explicit consent before signing'],
  },
  {
    key: 'automate',
    label: 'Automate',
    icon: FiCommand,
    img: null,
    title: 'Stop chasing signatures.',
    text: 'Keep agreements moving with configured workflows, expiration settings, and reminders when supported by your plan.',
    bullets: ['Multi-signer routing', 'Smart reminders', 'Expiry and workflow controls'],
  },
  {
    key: 'prove',
    label: 'Prove',
    icon: FiShield,
    img: null,
    title: 'Keep the evidence with the agreement.',
    text: 'Generate a completion certificate and maintain an activity record for the actions captured by the platform.',
    bullets: ['Timestamped activity records', 'Document integrity hash', 'Completion certificate'],
  },
];

const COMPLIANCE = [
  {
    key: 'totp',
    title: 'TOTP Two-Factor Authentication',
    text: 'Protect your workspace with TOTP two-factor authentication, adding another layer of security beyond your password.',
    alt: 'Authenticator app asking to approve a sign-in request',
  },
  {
    key: 'hash',
    title: 'SHA-256 Hashing',
    text: 'SHA-256 hashing helps verify document integrity, making changes to document content detectable through hash comparison.',
    alt: 'Lines of code glowing red on a dark screen',
  },
  {
    key: 'law',
    title: 'eIDAS/ESIGN/IT Act alignment',
    text: 'Explore the electronic-signature frameworks relevant to your agreements, including the US ESIGN Act, EU eIDAS and India’s IT Act.',
    alt: 'A judge’s gavel on a desk',
  },
  {
    key: 'storage',
    title: 'Storage you control',
    text: 'Sync completed agreements to your connected Google Drive, helping your team keep signed documents organized alongside its existing files.',
    alt: 'Rows of server racks in a data centre',
  },
];

/* PLACEHOLDER PRICES: USD monthly prices match the design ($0 / $9 / $19).
   INR prices are estimates. Yearly prices are derived: monthly x 12 minus YEARLY_DISCOUNT.
   Replace with your real pricing (and keep in sync with the /pricing page). */
const YEARLY_DISCOUNT = 0.2;
const SAVE_LABEL = 'Save 20%';

const FEATURES = [
  'No credit card',
  'Multi-Signer Routing',
  'Automated Email Reminders',
  'Reusable Contract Templates',
  'Multi-Format Support',
  'Tamper-Evident Delivery',
  'Mobile-Optimized Signing',
  'Instant Status Alerts',
  'Global ESIGN Compliance',
];

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    tab: 'Basic',
    dot: false,
    desc: 'Perfect for individuals and early exploration.',
    cta: 'Try Now',
    price: { USD: 0, INR: 0 },
    features: [
      { label: 'No credit card', on: true },
      { label: '10 Monthly Envelopes', on: true },
      { label: 'Zero Signer Accounts', on: true },
      { label: 'AES-256 Level Encryption', on: true },
      { label: 'Multi-Format Support', on: true },
      { label: 'Tamper-Evident Delivery', on: false },
      { label: 'Mobile-Optimized Signing', on: false },
      { label: 'Instant Status Alerts', on: false },
      { label: 'Global ESIGN Compliance', on: false },
    ],
  },
  {
    key: 'starter',
    name: 'Starter',
    tab: SAVE_LABEL,
    dot: true,
    featured: true,
    desc: 'Built for freelancers and small businesses.',
    cta: 'Choose Plan',
    price: { USD: 9, INR: 749 },
    features: FEATURES.map((label, i) => ({ label, on: i < 7 })),
  },
  {
    key: 'business',
    name: 'Business',
    tab: 'Extras',
    dot: true,
    desc: 'Built for growing teams and businesses.',
    cta: 'Choose Plan',
    price: { USD: 19, INR: 1599 },
    features: FEATURES.map((label) => ({ label, on: true })),
  },
];

// INR first, then USD (same order as the design)
const CURRENCIES = {
  INR: { locale: 'en-IN' },
  USD: { locale: 'en-US' },
};

const formatMoney = (amount, currency) =>
  new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

// Monthly: show the monthly price. Yearly: show the discounted per-month price + the yearly total.
const priceInfo = (monthly, billing) => {
  if (monthly === 0 || billing === 'monthly') return { perMonth: monthly, yearlyTotal: null };
  const yearlyTotal = Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT));
  return { perMonth: Math.round(yearlyTotal / 12), yearlyTotal };
};

/* =====================================================================
   Page
   ===================================================================== */

const Home = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`home.${key}`, fallback);

  const [activeTab, setActiveTab] = useState(FLOW[0].key);
  const [billing, setBilling] = useState('monthly');
  const [currency, setCurrency] = useState('USD');
  const tabRefs = useRef([]);
  const rootRef = useRef(null);
  const flowReady = useRef(false);
  const priceReady = useRef(false);

  // All page motion (GSAP + ScrollTrigger) lives in this hook
  useHomeAnimations(rootRef, [currentLng]);

  // Workflow: when a step changes, its text, bullets and image come in one after another
  useEffect(() => {
    if (!flowReady.current) {
      flowReady.current = true;
      return;
    }
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const body = root.querySelector(`#panel-${activeTab}`);
    if (body) {
      gsap.fromTo(
        body.children,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', overwrite: true }
      );
    }
  }, [activeTab]);

  // Pricing: the numbers roll in when the billing period or currency changes
  useEffect(() => {
    if (!priceReady.current) {
      priceReady.current = true;
      return;
    }
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.fromTo(
      root.querySelectorAll('[data-price]'),
      { yPercent: 40, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out', overwrite: true }
    );
  }, [billing, currency]);

  const scrollToFlow = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  // Arrow keys move between steps (focus also selects the step, see onFocus below)
  const onTabKeyDown = (e) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const index = FLOW.findIndex((f) => f.key === activeTab);
    let next = index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % FLOW.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + FLOW.length) % FLOW.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = FLOW.length - 1;
    setActiveTab(FLOW[next].key);
    tabRefs.current[next]?.focus();
  };

  const seoTitle = tr('seo.title', 'Free eSignature Software for India & Worldwide');
  const seoDescription = tr(
    'seo.description',
    'Create, sign and automate legally binding documents from any device. Nexgn is built in India, compliant with IT Act, ESIGN, UETA and eIDAS, with AES-256 encryption. Free to start.'
  );

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://nexgn.cloud/#organization',
        name: 'Nexgn',
        url: 'https://nexgn.cloud',
        sameAs: ['https://www.linkedin.com/company/nexgncloud', 'https://x.com/nexgncloud', 'https://www.facebook.com/nexgncloud', 'https://instagram.com/nexgn.cloud/'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://nexgn.cloud/#website',
        url: 'https://nexgn.cloud',
        name: 'Nexgn',
        inLanguage: currentLng,
        publisher: { '@id': 'https://nexgn.cloud/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Nexgn eSignature',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: seoDescription,
        publisher: { '@id': 'https://nexgn.cloud/#organization' },
      },
    ],
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.progress} data-a="progress" aria-hidden="true" />
      <SEOHead title={seoTitle} description={seoDescription} url="/" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section
        className={`${styles.hero} ${styles.photoSection}`}
        style={bg(IMAGES.hero)}
        aria-labelledby="home-title"
        data-a="hero"
      >
        <div className={`${styles.photo} ${styles.photoHero}`} data-a="hero-photo" aria-hidden="true" />
        <div className={`${styles.shade} ${styles.shadeHero}`} aria-hidden="true" />

        <div className={styles.container} data-a="hero-content">
          <h1 id="home-title" className={styles.heroTitle}>
            <span className={styles.heroLine}>
              <Words text={tr('hero.line1a', 'Create.')} a="hero-word" />{' '}
              <SignCycle text={tr('hero.line1b', 'Sign.')} />
            </span>
            <span className={styles.heroLine}>
              <Words text={tr('hero.line2', 'Automate. Trust.')} a="hero-word" />
            </span>
          </h1>

          <p className={styles.heroText} data-a="hero-fade">
            <span>{tr('hero.text1', 'Send, sign and track legally binding documents from any device.')}</span>{' '}
            <span>{tr('hero.text2', 'Built in India, compliant worldwide, free to start.')}</span>
          </p>

          <div className={styles.actions} data-a="hero-fade">
            <a href={SIGNUP_URL} className={styles.btnPrimary} data-a="magnet">
              {tr('hero.cta', 'Start for free')}
            </a>
            <a href="#how-it-works" className={styles.btnGhost} onClick={scrollToFlow} data-a="magnet">
              {tr('hero.secondary', 'See how it works')}
            </a>
          </div>

          <p className={styles.note} data-a="hero-fade">
            {tr('hero.note', 'No credit card. Signers don’t need an account.')}
          </p>

          <div className={styles.legalStrip} data-a="hero-fade">
            <span className={styles.legalLead}>
              {tr('hero.legal', 'Legally valid in India, the US and the EU')}
            </span>
            <ul className={styles.tags}>
              {TRUST_TAGS.map((tag) => (
                <li key={tag} className={styles.tag} data-a="hero-tag">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 2. TRUSTED BY ============ */}
      <section className={styles.trusted} aria-label={tr('trusted.label', 'Trusted by')}>
        <div className={styles.container}>
          <div className={styles.trustedRow} data-a="up">
            <p className={styles.trustedLabel}>{tr('trusted.label', 'Trusted By')}</p>
            <div className={styles.marquee}>
              <ul className={styles.marqueeTrack} data-a="marquee">
                {[...LOGOS, ...LOGOS].map((logo, i) => (
                  <li
                    key={`${logo.key}-${i}`}
                    className={styles.logoItem}
                    aria-hidden={i >= LOGOS.length ? 'true' : undefined}
                  >
                    {logo.src ? (
                      <img src={logo.src} alt={i < LOGOS.length ? logo.name : ''} loading="lazy" />
                    ) : (
                      <span className={styles.logoWord}>{logo.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. SUSTAINABILITY ============ */}
      <section className={`${styles.section} ${styles.impact}`}>
        <div className={styles.container}>
          <div className={styles.head}>
            <p className={styles.eyebrow} data-a="up">
              {tr('impact.eyebrow', 'Sustainability & Efficiency')}
            </p>
            <h2 className={styles.title} data-a="title">
              <Words text={tr('impact.title1', 'Every Agreement Leaves a Smaller')} />{' '}
              <Words text={tr('impact.title2', 'Footprint')} className={styles.red} />
            </h2>
          </div>

          <div data-a="up">
            <ImpactStats />
          </div>
        </div>
      </section>

      {/* ============ 4. WORKFLOW ============ */}
      <section
        id="how-it-works"
        className={`${styles.flowSection} ${styles.photoSection}`}
        style={bg(IMAGES.workflow)}
      >
        <div className={`${styles.photo} ${styles.photoFlow}`} data-a="parallax" data-speed="7" aria-hidden="true" />
        <div className={`${styles.shade} ${styles.shadeFlow}`} aria-hidden="true" />

        <div className={styles.container}>
          <div className={`${styles.head} ${styles.headLight}`}>
            <h2 className={styles.title} data-a="title">
              <Words text={tr('flow.title1', 'More than a signature.')} />
              <br />
              <Words text={tr('flow.title2a', 'A complete')} />{' '}
              <Words text={tr('flow.title2b', 'workflow.')} className={styles.red} />
            </h2>
          </div>

          <div className={styles.flow}>
            <div className={styles.flowIntro} data-a="up">
              <p className={styles.flowLead}>
                {tr('flow.lead1', 'Everything your agreements need.')}
                <br />
                {tr('flow.lead2', 'Nothing they don’t.')}
              </p>
            </div>

            <div
              className={styles.tabs}
              data-a="stagger"
              role="tablist"
              aria-orientation="vertical"
              aria-label={tr('flow.tabs', 'Workflow steps')}
              onKeyDown={onTabKeyDown}
            >
              {FLOW.map((step, i) => {
                const selected = step.key === activeTab;
                const Icon = step.icon;
                return (
                  <button
                    key={step.key}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${step.key}`}
                    aria-selected={selected}
                    aria-controls={`panel-${step.key}`}
                    tabIndex={selected ? 0 : -1}
                    className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
                    onMouseEnter={() => setActiveTab(step.key)}
                    onFocus={() => setActiveTab(step.key)}
                    onClick={() => setActiveTab(step.key)}
                  >
                    <Icon className={styles.tabIcon} aria-hidden="true" />
                    <span>{tr(`flow.${step.key}.label`, step.label)}</span>
                  </button>
                );
              })}
            </div>

            {/* All four panels sit in the same grid cell and cross-fade, so the card never changes size */}
            <div className={styles.flowPanel} data-a="panel">
              <div className={styles.flowMedia}>
                {FLOW.map((step) => (
                  <div
                    key={step.key}
                    className={styles.mediaSlide}
                    data-active={step.key === activeTab}
                    aria-hidden="true"
                  >
                    {/* Product screenshot slot: set `img` on the step in FLOW */}
                    {step.img && <img src={step.img} alt="" loading="lazy" />}
                  </div>
                ))}
              </div>

              <div className={styles.flowBodies}>
                {FLOW.map((step) => {
                  const active = step.key === activeTab;
                  return (
                    <div
                      key={step.key}
                      role="tabpanel"
                      id={`panel-${step.key}`}
                      aria-labelledby={`tab-${step.key}`}
                      aria-hidden={!active}
                      className={styles.flowBody}
                      data-active={active}
                    >
                      <h3 className={styles.flowTitle}>{tr(`flow.${step.key}.title`, step.title)}</h3>
                      <p className={styles.flowText}>{tr(`flow.${step.key}.text`, step.text)}</p>
                      <ul className={styles.bullets}>
                        {step.bullets.map((b, i) => (
                          <li key={b}>
                            <FiCheckCircle aria-hidden="true" />
                            <span>{tr(`flow.${step.key}.b${i + 1}`, b)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <figure className={styles.quote} data-a="up">
              <div className={styles.rating} aria-label="5.0 out of 5">
                <span className={styles.stars} aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <FiStar key={s} />
                  ))}
                </span>
                <span>5.0/5</span>
              </div>
              <blockquote className={styles.quoteText}>
                {tr(
                  'flow.quote',
                  '“We went from chasing signatures over email to getting agreements signed in minutes. It’s a game-changer.”'
                )}
              </blockquote>
              <figcaption className={styles.quoteBy}>
                {tr('flow.quoteBy', 'Sales Manager, Orbit.')}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ 5. COMPLIANCE ============ */}
      <section className={`${styles.section} ${styles.law}`}>
        <div className={styles.container}>
          <div className={styles.head}>
            <h2 className={`${styles.title} ${styles.lawTitle}`} data-a="title">
              <Words text={tr('law.title1', 'Designed for')} />{' '}
              <Words text={tr('law.title2', 'global')} className={styles.red} />{' '}
              <Words text={tr('law.title3', 'legal compliance.')} />
            </h2>
            <p className={styles.lead} data-a="up">
              {tr(
                'law.text',
                'Your contracts are only as good as the evidence behind them. Nexgn is built to support legally meaningful electronic agreements worldwide.'
              )}
            </p>
          </div>

          <ul className={styles.cards}>
            {COMPLIANCE.map((card) => (
              <li key={card.key} className={styles.card} data-a="card">
                <div className={styles.cardFrame} data-a="frame">
                  {IMAGES[card.key] ? (
                    <img
                      className={styles.cardMedia}
                      src={IMAGES[card.key]}
                      alt={card.alt}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.cardMedia} data-k={card.key} role="img" aria-label={card.alt} />
                  )}
                </div>
                <h3 className={styles.cardTitle} data-a="card-text">
                  {tr(`law.${card.key}.title`, card.title)}
                </h3>
                <p className={styles.cardText} data-a="card-text">
                  {tr(`law.${card.key}.text`, card.text)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. PRICING ============ */}
      <section
        className={`${styles.pricing} ${styles.photoSection}`}
        style={bg(IMAGES.pricing)}
        aria-labelledby="home-pricing"
      >
        <div className={`${styles.photo} ${styles.photoPricing}`} data-a="parallax" data-speed="7" aria-hidden="true" />
        <div className={`${styles.shade} ${styles.shadePricing}`} aria-hidden="true" />

        <div className={styles.container}>
          <div className={`${styles.head} ${styles.headLight}`}>
            <h2 id="home-pricing" className={styles.title} data-a="title">
              <span className={styles.pLine}>
                <Words text={tr('pricing.title1', 'Simple pricing.')} />
              </span>
              <span className={`${styles.pLine} ${styles.pWrap}`}>
                <Words text={tr('pricing.title2a', 'Start')} />{' '}
                <Words text={tr('pricing.title2b', 'free')} className={styles.red} />
                <Words text={tr('pricing.title2c', ', scale when you’re ready.')} />
              </span>
            </h2>
            <p className={styles.pricingNote} data-a="up">
              {tr('pricing.note', 'No credit card to start. Cancel anytime.')}
            </p>
          </div>

          <div className={styles.toggles} data-a="up">
            <div className={styles.toggle} role="group" aria-label={tr('pricing.billing', 'Billing period')}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleOn : ''}`}
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
              >
                {tr('pricing.monthly', 'Monthly')}
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${billing === 'yearly' ? styles.toggleOn : ''}`}
                aria-pressed={billing === 'yearly'}
                onClick={() => setBilling('yearly')}
              >
                {tr('pricing.yearly', 'Yearly, save 20%')}
              </button>
            </div>

            <div className={styles.toggle} role="group" aria-label={tr('pricing.currency', 'Currency')}>
              {Object.keys(CURRENCIES).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`${styles.toggleBtn} ${currency === code ? styles.toggleOn : ''}`}
                  aria-pressed={currency === code}
                  onClick={() => setCurrency(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <ul className={styles.plans}>
            {PLANS.map((plan) => {
              const { perMonth, yearlyTotal } = priceInfo(plan.price[currency], billing);
              const isFree = plan.price[currency] === 0;
              return (
                <li
                  key={plan.key}
                  data-a="plan"
                  className={`${styles.plan} ${
                    plan.key === 'free'
                      ? styles.planFree
                      : plan.key === 'starter'
                        ? styles.planStarter
                        : styles.planBusiness
                  }`}
                >
                  <div className={styles.planCard}>
                    <h3 className={styles.pill}>{tr(`pricing.${plan.key}.name`, plan.name)}</h3>

                    <span className={styles.notch}>
                      <span className={styles.notchText}>
                        {plan.dot && <i className={styles.dot} aria-hidden="true" />}
                        {plan.key === 'starter'
                          ? tr('pricing.save', plan.tab)
                          : tr(`pricing.${plan.key}.tag`, plan.tab)}
                      </span>
                    </span>

                    <div className={styles.panel}>
                      <div className={styles.priceRow}>
                        <span className={styles.amountMask}>
                          <span className={styles.amount} data-price>
                            {formatMoney(perMonth, currency)}
                          </span>
                        </span>
                        <span className={styles.priceMeta}>
                          <span>/ {tr('pricing.month', 'month')}</span>
                          {!isFree && (
                            <span>
                              {yearlyTotal
                                ? `${formatMoney(yearlyTotal, currency)} ${tr('pricing.billedYearly', 'billed yearly')}`
                                : tr('pricing.billedMonthly', 'billed monthly')}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className={styles.planDesc}>{tr(`pricing.${plan.key}.desc`, plan.desc)}</p>

                      <hr className={styles.divider} />

                      <ul className={styles.features}>
                        {plan.features.map((f) => (
                          <li key={f.label} className={styles.feature}>
                            <span
                              className={`${styles.tick} ${f.on ? styles.tickOn : styles.tickOff}`}
                              aria-hidden="true"
                            >
                              {f.on ? <FiCheck /> : <FiX />}
                            </span>
                            <span>
                              {f.label}
                              {!f.on && <span className={styles.srOnly}> (not included)</span>}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a href={`${SIGNUP_URL}?plan=${plan.key}`} className={styles.planBtn}>
                        {tr(`pricing.${plan.key}.cta`, plan.cta)}
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ 7. FINAL CTA (reusable: src/components/common/CtaBanner) ============ */}
      <div data-a="expand">
        <CtaBanner
          image={IMAGES.cta}
        title={tr('cta.title', 'Start signing documents')}
        highlight={tr('cta.highlight', 'signing')}
        text={tr(
          'cta.text',
          'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
        )}
          primary={{ label: tr('cta.primary', 'Create your free account'), href: SIGNUP_URL }}
          secondary={{ label: tr('cta.secondary', 'Login'), href: LOGIN_URL }}
        />
      </div>
    </div>
  );
};

export default Home;