import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCheck, FiMinus, FiStar } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './Home.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';

const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   Small hooks / helpers
   ===================================================================== */

// Fires once when an element scrolls into view (used for reveals + count-up)
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fade + rise when scrolled into view
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-in={inView}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Number that counts up when it scrolls into view
const CountUp = ({ to, suffix = '', duration = 1800 }) => {
  const [ref, inView] = useInView(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
};

/* =====================================================================
   Content (every string has an i18n key + English default)
   ===================================================================== */

const TRUST_TAGS = ['IT Act 2000', 'ESIGN and UETA', 'eIDAS', 'AES-256 encrypted'];

// TODO: drop real logo files into src/assets/logos and set `src`. Until then the name is shown as text.
// Only show logos of companies that have given you permission.
const LOGOS = [
  { key: 'amazon', name: 'amazon' },
  { key: 'cme', name: 'CME Group' },
  { key: 'entergy', name: 'entergy' },
  { key: 'everest', name: 'everest' },
  { key: 'orbit', name: 'orbit' },
];

const STATS = [
  { key: 'paper', big: '2L+', value: 2, suffix: 'L+', label: 'Estimated paper sheets saved' },
  { key: 'hours', big: '150+', value: 150, suffix: '+', label: 'Admin Hours Reclaimed' },
  { key: 'co2', big: '1000+', value: 1000, suffix: '+', label: 'Kg CO₂ Mitigated' },
];

// NOTE: copy for Sign / Automate / Prove is written by us (the design only shows Prepare). Review it.
const FLOW = [
  {
    key: 'prepare',
    label: 'Prepare',
    title: 'Make every document ready to sign.',
    text: 'Place fields visually, assign them to the right signers, and reuse templates for agreements you send often.',
    bullets: ['Drag-and-drop PDF editor', 'Reusable PDF and HTML templates', 'Flexible field placement'],
  },
  {
    key: 'sign',
    label: 'Sign',
    title: 'Sign from any device, in seconds.',
    text: 'Signers open a secure link, review the document and sign on any screen. No app and no account needed.',
    bullets: ['Draw, type or upload a signature', 'Mobile-optimized signing', 'Instant status alerts'],
  },
  {
    key: 'automate',
    label: 'Automate',
    title: 'Let workflows do the chasing.',
    text: 'Route agreements through multiple signers, schedule sends and let smart reminders follow up for you.',
    bullets: ['Multi-signer routing', 'Automated email reminders', 'Scheduled sending'],
  },
  {
    key: 'prove',
    label: 'Prove',
    title: 'Evidence that stands up.',
    text: 'Every completed agreement is sealed with a SHA-256 hash and an audit certificate recording who signed, when and from where.',
    bullets: ['Tamper-evident documents', 'Audit certificate on every PDF', 'Agreement verification'],
  },
];

// NOTE: the design used placeholder text for these cards, so the copy below is written for the topic. Review it.
const COMPLIANCE = [
  {
    key: 'totp',
    title: 'TOTP Two-Factor Authentication',
    text: 'Protect every workspace with authenticator-app 2FA, brute-force lockouts and actively monitored session tokens.',
    to: '/trust/security',
  },
  {
    key: 'hash',
    title: 'SHA-256 Hashing',
    text: 'Every completed agreement is sealed with a cryptographic hash. If a single character changes, the seal breaks and all parties are alerted.',
    to: '/trust/security',
  },
  {
    key: 'law',
    title: 'eIDAS / ESIGN / IT Act alignment',
    text: 'Built to support the US ESIGN Act and UETA, EU eIDAS and India’s IT Act, with a court-admissible audit certificate.',
    to: '/trust/legality',
  },
];

/* PLACEHOLDER PRICES: USD matches the design; INR and the monthly-billing prices are estimates.
   Replace with your real pricing (and keep in sync with the /pricing page). */
const PLANS = [
  {
    key: 'free',
    name: 'Free',
    tag: 'Basic',
    desc: 'Perfect for individuals and early exploration.',
    cta: 'Try Now',
    price: { USD: { monthly: 0, yearly: 0 }, INR: { monthly: 0, yearly: 0 } },
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
    featured: true,
    desc: 'Built for freelancers and small businesses.',
    cta: 'Choose Plan',
    price: { USD: { monthly: 11, yearly: 9 }, INR: { monthly: 899, yearly: 749 } },
    features: [
      { label: 'No credit card', on: true },
      { label: 'Multi-Signer Routing', on: true },
      { label: 'Automated Email Reminders', on: true },
      { label: 'Reusable Contract Templates', on: true },
      { label: 'Multi-Format Support', on: true },
      { label: 'Tamper-Evident Delivery', on: true },
      { label: 'Mobile-Optimized Signing', on: true },
      { label: 'Instant Status Alerts', on: true },
      { label: 'Global ESIGN Compliance', on: true },
    ],
  },
  {
    key: 'business',
    name: 'Business',
    tag: '+Extras',
    desc: 'Built for growing teams and businesses.',
    cta: 'Choose Plan',
    price: { USD: { monthly: 24, yearly: 19 }, INR: { monthly: 1999, yearly: 1599 } },
    features: [
      { label: 'No credit card', on: true },
      { label: 'Multi-Signer Routing', on: true },
      { label: 'Automated Email Reminders', on: true },
      { label: 'Reusable Contract Templates', on: true },
      { label: 'Multi-Format Support', on: true },
      { label: 'Tamper-Evident Delivery', on: true },
      { label: 'Mobile-Optimized Signing', on: true },
      { label: 'Instant Status Alerts', on: true },
      { label: 'Global ESIGN Compliance', on: true },
      { label: 'Team Workspace & RBAC', on: true },
      { label: 'Google Drive Storage Sync', on: true },
    ],
  },
];

const CURRENCIES = {
  USD: { locale: 'en-US' },
  INR: { locale: 'en-IN' },
};

const formatMoney = (amount, currency) =>
  new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

/* =====================================================================
   Page
   ===================================================================== */

const Home = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path}`;
  const tr = (key, fallback) => t(`home.${key}`, fallback);

  const [activeTab, setActiveTab] = useState(FLOW[0].key);
  const [billing, setBilling] = useState('yearly');
  const [currency, setCurrency] = useState('USD');
  const tabRefs = useRef([]);

  const activeFlow = FLOW.find((f) => f.key === activeTab) || FLOW[0];

  const scrollToFlow = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  };

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
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="home-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.container}>
          <h1 id="home-title" className={styles.heroTitle}>
            <span className={styles.heroLine} style={{ '--d': '80ms' }}>
              {tr('hero.line1a', 'Create.')} <span className={styles.red}>{tr('hero.line1b', 'Sign.')}</span>
            </span>
            <span className={styles.heroLine} style={{ '--d': '200ms' }}>
              {tr('hero.line2', 'Automate. Trust.')}
            </span>
          </h1>

          <p className={`${styles.heroText} ${styles.rise}`} style={{ '--d': '340ms' }}>
            {tr(
              'hero.text',
              'Send, sign and track legally binding documents from any device. Built in India, compliant worldwide, free to start.'
            )}
          </p>

          <div className={`${styles.actions} ${styles.rise}`} style={{ '--d': '460ms' }}>
            <a href={SIGNUP_URL} className={styles.btnPrimary}>
              {tr('hero.cta', 'Start for free')}
            </a>
            <a href="#how-it-works" className={styles.btnGhost} onClick={scrollToFlow}>
              {tr('hero.secondary', 'See how it works')}
            </a>
          </div>

          <p className={`${styles.note} ${styles.rise}`} style={{ '--d': '560ms' }}>
            {tr('hero.note', 'No credit card required. Signers don’t need an account.')}
          </p>

          <div className={`${styles.legalStrip} ${styles.rise}`} style={{ '--d': '680ms' }}>
            <span className={styles.legalLead}>
              {tr('hero.legal', 'Legally valid in India, the US and the EU')}
            </span>
            <ul className={styles.tags}>
              {TRUST_TAGS.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 2. TRUSTED BY ============ */}
      <section className={`${styles.trusted}`} aria-label={tr('trusted.label', 'Trusted by')}>
        <div className={styles.container}>
          <Reveal className={styles.trustedRow}>
            <p className={styles.trustedLabel}>{tr('trusted.label', 'Trusted By')}</p>
            <div className={styles.marquee}>
              <ul className={styles.marqueeTrack}>
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
          </Reveal>
        </div>
      </section>

      {/* ============ 3. SUSTAINABILITY ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <Reveal className={styles.head}>
            <p className={styles.eyebrow}>{tr('impact.eyebrow', 'Sustainability & Efficiency')}</p>
            <h2 className={styles.title}>
              {tr('impact.title', 'Every Agreement Leaves a Smaller Footprint')}
            </h2>
          </Reveal>

          <ul className={styles.stats}>
            {STATS.map((stat, i) => (
              <Reveal as="li" key={stat.key} delay={i * 100} className={styles.stat}>
                <span className={styles.statGlow} aria-hidden="true" />
                <span className={styles.statBig} aria-hidden="true">
                  {stat.big}
                </span>
                <div className={styles.statBottom}>
                  <p className={styles.statValue}>
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className={styles.statLabel}>{tr(`impact.${stat.key}`, stat.label)}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className={styles.centerLink}>
            <Link to={withLng('/sustainability')} className={styles.textLink}>
              {tr('impact.link', 'Read our Sustainability Pledge')}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 4. WORKFLOW ============ */}
      <section id="how-it-works" className={`${styles.section} ${styles.black}`}>
        <div className={styles.container}>
          <Reveal className={`${styles.head} ${styles.headLight}`}>
            <h2 className={styles.title}>
              {tr('flow.title1', 'More than a signature.')}
              <br />
              {tr('flow.title2a', 'A complete')} <span className={styles.red}>{tr('flow.title2b', 'workflow.')}</span>
            </h2>
          </Reveal>

          <div className={styles.flow}>
            <Reveal className={styles.flowIntro}>
              <p className={styles.flowLead}>
                {tr('flow.lead1', 'Everything your agreements need.')}
                <br />
                {tr('flow.lead2', 'Nothing they don’t.')}
              </p>
            </Reveal>

            <div
              className={styles.tabs}
              role="tablist"
              aria-label={tr('flow.tabs', 'Workflow steps')}
              onKeyDown={onTabKeyDown}
            >
              {FLOW.map((step, i) => {
                const selected = step.key === activeTab;
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
                    onClick={() => setActiveTab(step.key)}
                  >
                    <span className={styles.radio} aria-hidden="true" />
                    <span>{tr(`flow.${step.key}.label`, step.label)}</span>
                  </button>
                );
              })}
            </div>

            <div
              key={activeFlow.key}
              role="tabpanel"
              id={`panel-${activeFlow.key}`}
              aria-labelledby={`tab-${activeFlow.key}`}
              className={styles.flowPanel}
            >
              {/* Product screenshot slot: swap for an <img> or SVG when the artwork is ready */}
              <div className={styles.flowMedia} aria-hidden="true" />
              <div className={styles.flowBody}>
                <h3 className={styles.flowTitle}>
                  {tr(`flow.${activeFlow.key}.title`, activeFlow.title)}
                </h3>
                <p className={styles.flowText}>{tr(`flow.${activeFlow.key}.text`, activeFlow.text)}</p>
                <ul className={styles.bullets}>
                  {activeFlow.bullets.map((b, i) => (
                    <li key={b}>{tr(`flow.${activeFlow.key}.b${i + 1}`, b)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Reveal as="figure" className={styles.quote}>
              <div className={styles.rating} aria-label="4.8 out of 5">
                <span className={styles.stars} aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <FiStar key={s} />
                  ))}
                </span>
                <span>4.8/5</span>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 5. COMPLIANCE ============ */}
      <section className={`${styles.section} ${styles.light}`}>
        <div className={styles.container}>
          <Reveal className={styles.head}>
            <h2 className={styles.title}>
              {tr('law.title1', 'Designed for')} <span className={styles.red}>{tr('law.title2', 'global')}</span>{' '}
              {tr('law.title3', 'legal compliance.')}
            </h2>
            <p className={styles.lead}>
              {tr(
                'law.text',
                'Your contracts are only as good as the evidence behind them. Nexgn is built to support legally meaningful electronic agreements worldwide.'
              )}
            </p>
          </Reveal>

          <ul className={styles.cards}>
            {COMPLIANCE.map((card, i) => (
              <Reveal as="li" key={card.key} delay={i * 100} className={styles.card}>
                <span className={styles.index}>#{i + 1}</span>
                {/* Illustration slot */}
                <div className={styles.cardMedia} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{tr(`law.${card.key}.title`, card.title)}</h3>
                <p className={styles.cardText}>{tr(`law.${card.key}.text`, card.text)}</p>
                <Link to={withLng(card.to)} className={styles.textLink}>
                  {tr('law.more', 'Learn more')}
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 6. PRICING ============ */}
      <section className={`${styles.section} ${styles.charcoal}`} aria-labelledby="home-pricing">
        <div className={styles.container}>
          <Reveal className={`${styles.head} ${styles.headLight}`}>
            <h2 id="home-pricing" className={styles.title}>
              {tr('pricing.title1', 'Simple pricing.')}{' '}
              <span className={styles.nowrapGroup}>
                {tr('pricing.title2a', 'Start')} <span className={styles.red}>{tr('pricing.title2b', 'free')}</span>
                {tr('pricing.title2c', ', scale when you’re ready.')}
              </span>
            </h2>
            <p className={styles.mono}>{tr('pricing.note', 'No credit card to start. Cancel anytime.')}</p>
          </Reveal>

          <Reveal className={styles.toggles}>
            <div className={styles.segment} role="group" aria-label={tr('pricing.billing', 'Billing period')}>
              <button
                type="button"
                className={`${styles.segBtn} ${billing === 'monthly' ? styles.segOn : ''}`}
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
              >
                {tr('pricing.monthly', 'Monthly')}
              </button>
              <button
                type="button"
                className={`${styles.segBtn} ${billing === 'yearly' ? styles.segOn : ''}`}
                aria-pressed={billing === 'yearly'}
                onClick={() => setBilling('yearly')}
              >
                {tr('pricing.yearly', 'Yearly, save 20%')}
              </button>
            </div>

            <div className={styles.segment} role="group" aria-label={tr('pricing.currency', 'Currency')}>
              {Object.keys(CURRENCIES).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`${styles.segBtn} ${currency === code ? styles.segOn : ''}`}
                  aria-pressed={currency === code}
                  onClick={() => setCurrency(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </Reveal>

          <ul className={styles.plans}>
            {PLANS.map((plan, i) => {
              const amount = plan.price[currency][billing];
              const isFree = amount === 0;
              return (
                <Reveal
                  as="li"
                  key={plan.key}
                  delay={i * 100}
                  className={`${styles.plan} ${plan.featured ? styles.planFeatured : ''}`}
                >
                  {plan.featured && billing === 'yearly' && (
                    <span className={styles.ribbon}>{tr('pricing.save', 'Save 20%')}</span>
                  )}

                  <div className={styles.planHead}>
                    <h3 className={styles.planName}>{tr(`pricing.${plan.key}.name`, plan.name)}</h3>
                    {plan.tag && <span className={styles.planTag}>{tr(`pricing.${plan.key}.tag`, plan.tag)}</span>}
                  </div>

                  <p className={styles.price}>
                    <span className={styles.amount}>{formatMoney(amount, currency)}</span>
                    <span className={styles.per}> {tr('pricing.perMonth', '/month')}</span>
                  </p>
                  <p className={styles.billed}>
                    {isFree
                      ? tr('pricing.noCard', 'No credit card required')
                      : billing === 'yearly'
                        ? `${formatMoney(amount * 12, currency)} ${tr('pricing.billedYearly', 'billed yearly')}`
                        : tr('pricing.billedMonthly', 'Billed monthly')}
                  </p>
                  <p className={styles.planDesc}>{tr(`pricing.${plan.key}.desc`, plan.desc)}</p>

                  <ul className={styles.features}>
                    {plan.features.map((f) => (
                      <li key={f.label} className={`${styles.feature} ${f.on ? '' : styles.featureOff}`}>
                        <span className={`${styles.tick} ${f.on ? styles.tickOn : ''}`} aria-hidden="true">
                          {f.on ? <FiCheck /> : <FiMinus />}
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
                </Reveal>
              );
            })}
          </ul>

          <Reveal className={styles.centerLink}>
            <Link to={withLng('/pricing')} className={`${styles.textLink} ${styles.textLinkLight}`}>
              {tr('pricing.compare', 'Compare all plans')}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 7. FINAL CTA ============ */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.container}>
          <Reveal className={styles.ctaPanel}>
            <h2 className={styles.ctaTitle}>{tr('cta.title', 'Start signing')}</h2>
            <p className={styles.ctaText}>
              {tr(
                'cta.text',
                'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
              )}
            </p>
            <div className={styles.actions}>
              <a href={SIGNUP_URL} className={styles.btnPrimary}>
                {tr('cta.primary', 'Create your free account')}
              </a>
              <a href={LOGIN_URL} className={styles.btnOutlineDark}>
                {tr('cta.secondary', 'Login')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;