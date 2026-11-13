import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX } from 'react-icons/fi';
import gsap from 'gsap';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import usePricingAnimations from '../../hooks/usePricingAnimations';
import styles from './Pricing.module.css';

import ctaCommonImg from '../../assets/common/cta.png';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES (Safely resolves assets from src/assets/home if present)
   ===================================================================== */
const homeImgContext = require.context('../../assets/core', false, /\.(png|jpe?g|webp|avif|svg)$/i);
const findHomeImage = (name) => {
  const key = homeImgContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = homeImgContext(key);
  return (mod && mod.default) || mod;
};

const IMAGES = {
  hero: findHomeImage('pricing-hero') || findHomeImage('hero'),
  devBg: findHomeImage('workflow') || findHomeImage('storage'),
  roi: findHomeImage('roi'), // <-- Picks up src/assets/home/roi.(png|jpg|webp|avif|svg)
  cta: findHomeImage('cta') || ctaCommonImg,
};

const bg = (src) => (src ? { '--img': `url("${src}")` } : undefined);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Words = ({ text, className = '', a = 'word' }) => {
  const words = String(text).split(' ').filter(Boolean);
  return words.map((word, i) => (
    <React.Fragment key={`${word}-${i}`}>
      <span className={styles.w}>
        <span className={`${styles.wi} ${className}`} data-p={a}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ));
};

/* =====================================================================
   PRICING PLANS DATA (Matches Pricing_3.jpg & Home.jsx)
   ===================================================================== */
const YEARLY_DISCOUNT = 0.2;
const SAVE_LABEL = 'Save 20%';

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    tab: 'Basic',
    dot: false,
    desc: 'Perfect for individuals and early exploration.',
    cta: 'Try Free',
    btnStyle: 'outline',
    price: { USD: 0, INR: 0 },
    features: [
      { label: 'No credit card', on: true },
      { label: '3 Monthly Envelopes', on: true },
      { label: 'Google Drive Auto-Sync', on: true },
      { label: 'Mobile-Friendly Signing', on: true },
      { label: 'Basic Tamper-Evident', on: true },
      { label: 'Tamper-Evident Delivery', on: false },
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
    cta: 'Start Free Trial',
    btnStyle: 'red',
    price: { USD: 9, INR: 749 },
    features: [
      { label: 'Everything in Free', on: true },
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
    tab: 'Extras',
    dot: true,
    desc: 'Built for growing teams and businesses.',
    cta: 'Upgrade to Business',
    btnStyle: 'dark',
    price: { USD: 19, INR: 1599 },
    features: [
      { label: 'Everything in Starter', on: true },
      { label: 'Unlimited Envelopes & Templates', on: true },
      { label: 'Team Workspaces & Role-Based Access (RBAC)', on: true },
      { label: 'Nexgn AI Suite (Agreement Summary & Builder)', on: true },
      { label: 'Custom Branding & White-Label Emails', on: true },
      { label: 'Tamper-Evident Delivery', on: true },
      { label: 'Mobile-Optimized Signing', on: true },
      { label: 'Instant Status Alerts', on: true },
      { label: 'Global ESIGN Compliance', on: true },
    ],
  },
];

// INR first, then USD (exact order in design)
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

const priceInfo = (monthly, billing) => {
  if (monthly === 0 || billing === 'monthly') return { perMonth: monthly, yearlyTotal: null };
  const yearlyTotal = Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT));
  return { perMonth: Math.round(yearlyTotal / 12), yearlyTotal };
};

const FAQS = [
  {
    q: 'Do my signers need a Nexgn account to sign?',
    a: 'No. Signers receive a secure, encrypted link via email and can sign from any device without ever creating an account or paying a cent.',
  },
  {
    q: 'What happens if I hit my envelope limit on the Starter plan?',
    a: 'We never block a live business deal mid-flight. You will receive an alert before reaching your cap and can seamlessly upgrade to Business for unlimited envelopes at any time.',
  },
  {
    q: 'Are Nexgn signatures legally binding?',
    a: 'Yes. Every agreement signed on Nexgn generates a cryptographic SHA-256 audit trail compliant with the Indian IT Act 2000, US ESIGN Act, UETA, and EU eIDAS.',
  },
];

/* =====================================================================
   PRICING PAGE COMPONENT
   ===================================================================== */
const Pricing = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`pricing.${key}`, fallback);

  // Default to USD so the initial cards show $0 / $9 / $19 just like the design
  const [billing, setBilling] = useState('monthly');
  const [currency, setCurrency] = useState('USD');
  const [docsPerMonth, setDocsPerMonth] = useState(100);
  const [openFaq, setOpenFaq] = useState(0);

  const rootRef = useRef(null);
  const priceReady = useRef(false);
  const savingsNodeRef = useRef(null);
  const animatedSavings = useRef({ val: 0 });

  usePricingAnimations(rootRef, [currentLng]);

  // Roll the card prices when billing or currency toggles
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
      { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', overwrite: true }
    );
  }, [billing, currency]);

  // ROI Calculator Math (Matches design: at 100 docs -> ₹3,000/mo vs ₹1,333/mo -> ₹20,000/yr savings)
  const legacyMonthly =
    currency === 'INR' ? Math.round(docsPerMonth * 30) : Math.round(docsPerMonth * 0.36);
  const nexgnMonthly =
    currency === 'INR'
      ? Math.max(749, Math.round(docsPerMonth * 13.3333))
      : Math.max(9, Math.round(docsPerMonth * 0.16));
  const annualSavings = Math.max(0, Math.round((legacyMonthly - nexgnMonthly) * 12));

  // Smooth GSAP counter for the ROI annual savings readout
  useEffect(() => {
    const el = savingsNodeRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      animatedSavings.current.val = annualSavings;
      el.textContent = formatMoney(annualSavings, currency);
      return;
    }
    gsap.to(animatedSavings.current, {
      val: annualSavings,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        if (savingsNodeRef.current) {
          savingsNodeRef.current.textContent = formatMoney(
            Math.round(animatedSavings.current.val),
            currency
          );
        }
      },
    });
  }, [annualSavings, currency]);

  const sliderPercent = (docsPerMonth / 500) * 100;

  // Product Schema for Google Rich Results
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nexgn Starter Plan',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '900.00',
      priceCurrency: 'INR',
    },
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.progress} data-p="progress" aria-hidden="true" />
      <SEOHead
        title={tr('seo.title', 'Pricing')}
        description={tr(
          'seo.description',
          'Transparent, affordable pricing for startups and enterprise. Start sending legally binding documents for free.'
        )}
        url="/pricing"
        schema={pricingSchema}
      />

      {/* ============ 1. TOP DARK HERO BANNER ("Pricing Details") ============ */}
      <section
        className={styles.heroBanner}
        style={bg(IMAGES.hero)}
        aria-labelledby="pricing-banner-title"
        data-p="hero"
      >
        <div className={styles.heroPhoto} data-p="hero-photo" aria-hidden="true" />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.container}>
          <h1 id="pricing-banner-title" className={styles.bannerTitle}>
            <Words text={tr('banner.title', 'Pricing Details')} a="hero-word" />
          </h1>
        </div>
      </section>

      {/* ============ 2. LIGHT GREY INTRO BAND + TOGGLES ============ */}
      <section className={styles.introBand} data-p="intro" aria-labelledby="pricing-main-heading">
        <div className={styles.container}>
          <h2 id="pricing-main-heading" className={styles.introTitle}>
            <span className={styles.introLine}>
              <Words text={tr('intro.line1', 'Simple Pricing.')} a="intro-word" />
            </span>
            <span className={styles.introLine}>
              <Words text={tr('intro.line2', 'No surprise “envelope')} a="intro-word" />
            </span>
            <span className={styles.introLine}>
              <Words text={tr('intro.line3', 'taxes”')} a="intro-word" />
            </span>
          </h2>

          <p className={styles.introSub} data-p="intro-fade">
            {tr(
              'intro.sub',
              'Choose the plan that fits your workflow. Upgrade, downgrade, or cancel at any time with zero lock-in.'
            )}
          </p>

          <div className={styles.toggles} data-p="intro-fade">
            <div className={styles.toggle} role="group" aria-label={tr('billing', 'Billing period')}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleOn : ''}`}
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
              >
                {tr('monthly', 'Monthly')}
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${billing === 'yearly' ? styles.toggleOn : ''}`}
                aria-pressed={billing === 'yearly'}
                onClick={() => setBilling('yearly')}
              >
                {tr('yearly', 'Yearly, save 20%')}
              </button>
            </div>

            <div className={styles.toggle} role="group" aria-label={tr('currency', 'Currency')}>
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
        </div>
      </section>

      {/* ============ 3. PRICING CARDS (Exact cqw architecture from Home) ============ */}
      <section className={styles.plansSection} aria-label={tr('plans.label', 'Subscription plans')}>
        <div className={styles.container}>
          <ul className={styles.plans}>
            {PLANS.map((plan) => {
              const { perMonth, yearlyTotal } = priceInfo(plan.price[currency], billing);
              const isFree = plan.price[currency] === 0;
              return (
                <li
                  key={plan.key}
                  data-p="plan"
                  className={`${styles.plan} ${
                    plan.key === 'free'
                      ? styles.planFree
                      : plan.key === 'starter'
                        ? styles.planStarter
                        : styles.planBusiness
                  }`}
                >
                  <div className={styles.planCard}>
                    <h3 className={styles.pill}>{tr(`${plan.key}.name`, plan.name)}</h3>

                    <span className={styles.notch}>
                      <span className={styles.notchText}>
                        {plan.dot && <i className={styles.dot} aria-hidden="true" />}
                        {plan.key === 'starter'
                          ? tr('save', plan.tab)
                          : tr(`${plan.key}.tag`, plan.tab)}
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
                          <span>/ {tr('month', 'month')}</span>
                          {!isFree && (
                            <span>
                              {yearlyTotal
                                ? `${formatMoney(yearlyTotal, currency)} ${tr('billedYearly', 'billed yearly')}`
                                : tr('billedMonthly', 'billed monthly')}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className={styles.planDesc}>{tr(`${plan.key}.desc`, plan.desc)}</p>

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

                      <a
                        href={`${SIGNUP_URL}?plan=${plan.key}`}
                        className={`${styles.planBtn} ${
                          plan.btnStyle === 'outline'
                            ? styles.planBtnOutline
                            : plan.btnStyle === 'dark'
                              ? styles.planBtnDark
                              : styles.planBtnRed
                        }`}
                      >
                        {tr(`${plan.key}.cta`, plan.cta)}
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ 4. BUILDING INTO YOUR OWN APP (Developer Split Box) ============ */}
      <section className={styles.devSection}>
        <div className={styles.container}>
          <div className={styles.devBox} data-p="dev-box">
            <div className={styles.devCopy} data-p="up">
              <p className={styles.devEyebrow}>
                {tr('dev.eyebrow', 'PAY-AS-YOU-GO & ENTERPRISE ADD-ONS')}
              </p>
              <h2 className={styles.devTitle}>
                <span className={styles.red}>{tr('dev.titleRed', 'Building')}</span>{' '}
                {tr('dev.titleRest', 'into your own app?')}
              </h2>
              <p className={styles.devText}>
                {tr(
                  'dev.text',
                  'Pay only for what you use with our API and advanced identity verification tools.'
                )}
              </p>
            </div>

            <div
              className={styles.devVisual}
              style={bg(IMAGES.devBg)}
              data-p="dev-visual"
            >
              <div className={styles.devFloatGrid}>
                <article className={`${styles.floatCard} ${styles.floatCardTop}`} data-p="float-card">
                  <h3 className={styles.floatCardTitle}>
                    {tr('dev.card1.title', 'Developer API Tier')}
                  </h3>
                  <p className={styles.floatCardText}>
                    {tr(
                      'dev.card1.text',
                      'Generate API keys, test for free in our developer sandbox, and pay a flat metered rate per completed signature request in production.'
                    )}
                  </p>
                </article>

                <article
                  className={`${styles.floatCard} ${styles.floatCardBottom}`}
                  data-p="float-card"
                >
                  <h3 className={styles.floatCardTitle}>
                    {tr('dev.card2.title', 'Biometric & ID Verification Credits')}
                  </h3>
                  <p className={styles.floatCardText}>
                    {tr(
                      'dev.card2.text',
                      'Pre-purchase non-expiring credits for high-assurance SMS OTPs, government ID checks, or biometric liveness verification.'
                    )}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. ROI CALCULATOR (Wood Texture + Live Slider) ============ */}
      {/* ============ 5. ROI CALCULATOR (Wood Texture + Live Slider) ============ */}
      <section
        className={styles.roiSection}
        style={bg(IMAGES.roi)}
        data-p="roi"
        aria-labelledby="roi-heading"
      >
        <div className={styles.roiBg} data-p="roi-bg" aria-hidden="true" />
        <div className={styles.roiShade} aria-hidden="true" />
        <div className={styles.roiBg} data-p="roi-bg" aria-hidden="true" />
        <div className={styles.roiShade} aria-hidden="true" />

        <div className={styles.container}>
          <header className={styles.roiHeader}>
            <h2 id="roi-heading" className={styles.roiTitle} data-p="title">
              <Words text={tr('roi.title', 'ROI Calculator')} />
            </h2>
            <p className={styles.roiLead} data-p="up">
              {tr(
                'roi.lead',
                'See how much you can save by switching from legacy platforms to Nexgn.'
              )}
            </p>
          </header>

          <div className={styles.roiGrid}>
            {/* Left Card: Your Usage */}
            <div className={styles.roiCard} data-p="roi-panel">
              <h3 className={styles.roiCardTitle}>{tr('roi.usage.title', 'Your Usage')}</h3>
              <p className={styles.roiCardSub}>{tr('roi.usage.sub', 'Monthly Volume')}</p>

              <div className={styles.usageInputRow}>
                <label htmlFor="roi-docs-range" className={styles.usageLabel}>
                  {tr('roi.usage.question', 'How many documents do you send a month?')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={docsPerMonth}
                  onChange={(e) =>
                    setDocsPerMonth(Math.min(500, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className={styles.usageNumberBox}
                  aria-label="Monthly documents count"
                />
              </div>

              <div
                className={styles.sliderArea}
                style={{ '--pct': `${sliderPercent}%` }}
              >
                <input
                  id="roi-docs-range"
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={docsPerMonth}
                  onChange={(e) => setDocsPerMonth(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeEndpoints}>
                  <span>0</span>
                  <span>500+</span>
                </div>
                <div className={styles.rangeThumbPill} aria-hidden="true">
                  {docsPerMonth}
                </div>
              </div>

              <p className={styles.roiFootNote}>
                {tr(
                  'roi.usage.note',
                  '* Adjust the slider to match your team’s monthly agreement volume.'
                )}
              </p>
            </div>

            {/* Right Card: Your Potential Savings */}
            <div className={styles.roiCard} data-p="roi-panel">
              <h3 className={styles.roiCardTitle}>
                {tr('roi.savings.title', 'Your Potential Savings')}
              </h3>

              <div className={styles.compareRows}>
                <div className={styles.compareRow}>
                  <span className={styles.compareLabel}>
                    {tr('roi.savings.legacy', 'With Legacy Platform “D”')}
                  </span>
                  <span className={styles.comparePill}>
                    {formatMoney(legacyMonthly, currency)}/mo
                  </span>
                </div>

                <div className={styles.compareRow}>
                  <span className={styles.compareLabel}>
                    {tr('roi.savings.nexgn', 'With Nexgn')}
                  </span>
                  <span className={styles.comparePill}>
                    {formatMoney(nexgnMonthly, currency)}/mo
                  </span>
                </div>
              </div>

              <div className={styles.savingsBlock}>
                <p className={styles.savingsEyebrow}>
                  {tr('roi.savings.estimated', 'Your estimated annual savings')}
                </p>
                <div className={styles.savingsAmountBox}>
                  <span ref={savingsNodeRef} className={styles.savingsAmount}>
                    {formatMoney(annualSavings, currency)}
                  </span>
                </div>
              </div>

              <p className={styles.roiFootNote}>
                {tr(
                  'roi.savings.disclaimer',
                  '* Based on standard per-envelope overage rates of legacy providers.'
                )}
              </p>

              <a href={SIGNUP_URL} className={styles.roiCtaBtn} data-p="magnet">
                {tr('roi.savings.cta', 'Start saving now')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. TOP FREQUENT QUESTIONS ============ */}
      <section className={styles.faqSection} aria-labelledby="faq-heading">
        <div className={styles.container}>
          <div className={styles.faqInner}>
            <h2 id="faq-heading" className={styles.faqHeading} data-p="up">
              {tr('faq.title', 'Top Frequent Questions')}
            </h2>

            <div className={styles.faqList}>
              {FAQS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={item.q} className={styles.faqItem} data-p="up">
                    <button
                      type="button"
                      className={styles.faqTrigger}
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    >
                      <span className={styles.faqSign} aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                      <span className={styles.faqQuestion}>
                        {tr(`faq.q${i + 1}`, item.q)}
                      </span>
                    </button>

                    <div className={styles.faqAnswerClip} data-open={isOpen}>
                      <div className={styles.faqAnswerInner}>
                        <p className={styles.faqAnswer}>
                          {tr(`faq.a${i + 1}`, item.a)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. FINAL CTA BANNER ============ */}
      <div data-p="expand">
        <CtaBanner
          image={IMAGES.cta}
          title={t('cta.title', 'Start signing documents')}
          highlight={t('cta.highlight', 'signing')}
          text={t(
            'cta.text',
            'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
          )}
          primary={{ label: t('cta.primary', 'Create your free account'), href: SIGNUP_URL }}
          secondary={{ label: t('cta.secondary', 'Login'), href: LOGIN_URL }}
        />
      </div>
    </div>
  );
};

export default Pricing;