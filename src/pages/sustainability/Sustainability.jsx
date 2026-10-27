import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import styles from './Sustainability.module.css';

// Import the specific CTA image
import ctaOtherImg from '../../assets/home/cta_other.png';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';

/* =====================================================================
   Scroll & Animation Helpers
   ===================================================================== */
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
   Data
   ===================================================================== */
const STATS = [
  {
    key: 'paper',
    big: '2L+',
    value: 2,
    suffix: 'L+',
    label: 'Estimated paper sheets saved',
    vars: { '--g1x': '28%', '--g1y': '8%', '--g2x': '86%', '--g2y': '92%', '--bx': '46cqw', '--by': '-13cqw' },
  },
  {
    key: 'hours',
    big: '150+',
    value: 150,
    suffix: '+',
    label: 'Admin Hours Reclaimed',
    vars: { '--g1x': '2%', '--g1y': '10%', '--g2x': '-10%', '--g2y': '110%', '--bx': '9cqw', '--by': '-11cqw' },
  },
  {
    key: 'co2',
    big: '1000+',
    value: 1000,
    suffix: '+',
    label: 'Kg CO₂ Mitigated',
    vars: { '--g1x': '6%', '--g1y': '30%', '--g2x': '100%', '--g2y': '84%', '--bx': '6cqw', '--by': '-12cqw' },
  },
];

const Sustainability = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`sustainability.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Our Sustainability Pledge | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Nexgn is committed to reducing environmental impact. Learn how digital agreements save paper, lower carbon emissions, and reclaim administrative hours.'
  );

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/sustainability" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        
        <div className={styles.container}>
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>{tr('hero.eyebrow', 'THE NEXGN SUSTAINABILITY PLEDGE')}</p>
            <h1 className={styles.heroTitle}>
              {tr('hero.title1', 'Better agreements.')} <br/>
              {tr('hero.title2', 'A lighter ')} <span className={styles.red}>{tr('hero.title3', 'footprint.')}</span>
            </h1>
            <p className={styles.heroLead}>
              {tr('hero.lead', 'We’re building a more efficient way to manage agreements with a commitment to measuring our impact, improving our technology and being transparent about our progress.')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 2. TWO COLUMN INTRO ============ */}
      <section className={styles.introSection}>
        <div className={`${styles.container} ${styles.twoCol}`}>
          <Reveal className={styles.textCol}>
            <h2 className={styles.sectionTitle}>
              {tr('intro.title', 'The paperwork doesn’t end when the deal is done.')}
            </h2>
            <p className={styles.paragraph}>
              {tr('intro.p1', 'Traditional agreement workflows can involve printing, scanning, couriering, storing and manually tracking documents. Each step adds work—and can carry an environmental cost.')}
            </p>
            <p className={styles.paragraph}>
              {tr('intro.p2', 'Nexgn helps teams move those processes into a connected digital workflow. Our responsibility is to make that workflow more efficient while understanding and reducing the footprint of the technology behind it.')}
            </p>
          </Reveal>
          
          <Reveal className={styles.imageCol} delay={200}>
            {/* Placeholder for real image: replace className with <OptimizedImage> later */}
            <div className={styles.placeholderImg} aria-label="Visual of digital workflow vs paper"></div>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. IMPACT STATS ============ */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <Reveal className={styles.headCenter}>
            <h2 className={styles.statsTitle}>
              {tr('stats.title1', 'Every Agreement Leaves a Smaller')} <br/>
              <span className={styles.red}>{tr('stats.title2', 'Footprint')}</span>
            </h2>
          </Reveal>

          <ul className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <Reveal
                as="li"
                key={stat.key}
                delay={i * 150}
                className={styles.statCard}
                style={{ '--d': `${i * 100}ms`, ...stat.vars }}
              >
                <span className={styles.statBig} aria-hidden="true">
                  {stat.big}
                </span>
                <p className={styles.statValue}>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className={styles.statLabel}>{tr(`impact.${stat.key}`, stat.label)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 4. OUR PRACTICE ============ */}
      <section className={styles.practiceSection}>
        <div className={styles.container}>
          <Reveal className={styles.headCenter}>
            <p className={styles.eyebrowDark}>{tr('practice.eyebrow', 'MEASURING OUR PROGRESS')}</p>
            <h2 className={styles.sectionTitle}>
              {tr('practice.title', 'Responsibility isn’t a tagline. It’s a practice.')}
            </h2>
            <p className={styles.practiceLead}>
              {tr('practice.subtitle', 'We’re focusing on three areas where Nexgn can make meaningful improvements as our platform grows.')}
            </p>
          </Reveal>

          <Reveal className={styles.practiceImageWrapper} delay={200}>
             <div className={styles.practiceLargePlaceholder}></div>
          </Reveal>

          <div className={styles.pillarsGrid}>
            <Reveal className={styles.pillar} delay={100}>
              <h3>{tr('practice.pillar1.title', 'We Measure & Disclose')}</h3>
              <p>{tr('practice.pillar1.desc', 'We track the combined environmental impact of digital workflows (vs paper sheets saved by every user). We openly publish the methodology behind our footprint tracker and refine it over time to ensure accuracy.')}</p>
            </Reveal>
            <Reveal className={styles.pillar} delay={200}>
              <h3>{tr('practice.pillar2.title', 'We Optimize Our Code')}</h3>
              <p>{tr('practice.pillar2.desc', 'Heavy software requires heavy servers. We build Nexgn using optimized React and Node.js architectures to ensure low latency, reduced server load, and minimized carbon emissions from our data centers.')}</p>
            </Reveal>
            <Reveal className={styles.pillar} delay={300}>
              <h3>{tr('practice.pillar3.title', 'We Build for the Long Term')}</h3>
              <p>{tr('practice.pillar3.desc', 'We pledge to align our operations with global sustainability frameworks (like GHG Protocol) as we scale, continually auditing our digital footprint.')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 5. CTA BANNER ============ */}
      <CtaBanner
        image={ctaOtherImg}
        title={tr('cta.title', 'Start signing documents')}
        highlight={tr('cta.highlight', 'signing')}
        text={tr('cta.text', 'Start signing documents the simpler way. Join modern businesses reducing their paper trail securely with Nexgn.')}
        primary={{ label: tr('cta.primary', 'Create your free account'), href: SIGNUP_URL }}
        secondary={{ label: tr('cta.secondary', 'Login'), href: LOGIN_URL }}
        // Override overlay positioning to focus on the tablet signing context from the design
        imagePosition="center 70%"
      />
    </div>
  );
};

export default Sustainability;