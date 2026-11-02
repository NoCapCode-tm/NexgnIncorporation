import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import ImpactStats from '../../components/common/ImpactStats';
import CtaBanner from '../../components/common/CtaBanner';
import useSustainabilityAnimations from '../../hooks/useSustainabilityAnimations';
import styles from './Sustainability.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const LANGS = ['en', 'es', 'hi'];

const imageContext = require.context('../../assets/sustainability', false, /\.(png|jpe?g|webp|avif|svg)$/i);
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
  intro: findImage('intro'),
  practice: [findImage('practice-1'), findImage('practice-2'), findImage('practice-3')],
};

const PILLARS = [
  {
    key: 'measure',
    tilt: -4,
    title: 'We Measure & Disclose',
    text: 'We track the avoided environmental impact of digital workflows from paper sheets saved to transit avoided. We openly publish the methodology behind our Live Impact Tracker and refuse to use "greenwashing" estimates.',
  },
  {
    key: 'code',
    tilt: 0,
    textFirst: true,
    title: 'We Optimize Our Code',
    text: 'Heavy software requires heavy servers. We build Nexgn using optimized React and Node.js architectures to ensure low latency, reduced server load, and minimized carbon emissions from our data centers.',
  },
  {
    key: 'longterm',
    tilt: 4,
    title: 'We Build for the Long Term.',
    text: 'We pledge to align our operations with global sustainability frameworks (like GHG Protocol) as we scale, continually auditing our digital footprint.',
  },
];

const Words = ({ text }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className={styles.wMask}>
        <span className={styles.wIn} data-sus="w">
          {w}
        </span>
      </span>
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

const Sustainability = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`sustainability.${key}`, fallback);

  const rootRef = useRef(null);
  useSustainabilityAnimations(rootRef, { lng: currentLng });

  const seoTitle = tr('seo.title', 'Sustainability Pledge | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Better agreements, a lighter footprint. See how Nexgn measures and reduces the environmental cost of agreements, optimizes its code and builds for the long term.'
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    url: 'https://nexgn.cloud/sustainability',
    inLanguage: currentLng,
    isPartOf: { '@id': 'https://nexgn.cloud/#website' },
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/sustainability" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section
        className={styles.hero}
        style={IMAGES.hero ? { '--img': `url("${IMAGES.hero}")` } : undefined}
        aria-labelledby="sus-title"
        data-sus="hero"
      >
        <div className={styles.photo} data-sus="photo" aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight}`} data-sus="hr">
            {tr('hero.eyebrow', 'The Nexgn Sustainability Pledge')}
          </p>
          <h1 id="sus-title" className={styles.heroTitle}>
            <span className={styles.heroLineMask}>
              <span className={styles.heroLine} data-sus="line">
                {tr('hero.line1', 'Better agreements.')}
              </span>
            </span>
            <span className={styles.heroLineMask}>
              <span className={styles.heroLine} data-sus="line">
                {tr('hero.line2a', 'A lighter')} <span className={styles.red}>{tr('hero.line2b', 'footprint')}</span>.
              </span>
            </span>
          </h1>
          <p className={styles.heroText} data-sus="hr">
            {tr(
              'hero.text',
              'We’re building a more efficient way to manage agreements with a commitment to measuring our impact, improving our technology and being transparent about our progress.'
            )}
          </p>
        </div>
      </section>

      {/* ============ 2. INTRO ============ */}
      <section className={`${styles.section} ${styles.intro}`}>
        <div className={`${styles.container} ${styles.introGrid}`}>
          <header className={styles.introText} data-sus="head">
            <h2 className={styles.introTitle}>
              <Words text={tr('intro.title', 'The paperwork doesn’t end when the deal is done.')} />
            </h2>
            <div data-sus="r">
              <p>
                {tr(
                  'intro.p1',
                  'Traditional agreement workflows can involve printing, scanning, couriering, storing and manually tracking documents. Each step adds work and can carry an environmental cost.'
                )}
              </p>
              <p>
                {tr(
                  'intro.p2',
                  'Nexgn helps teams move these processes into a connected digital workflow. Our responsibility is to make that workflow more efficient while understanding and reducing the footprint of the technology behind it.'
                )}
              </p>
            </div>
          </header>

          <div className={styles.introMedia} data-sus="media">
            {IMAGES.intro && <img src={IMAGES.intro} alt="" loading="lazy" />}
          </div>
        </div>
      </section>

      {/* ============ 3. IMPACT ============ */}
      <section className={`${styles.section} ${styles.impact}`}>
        <div className={styles.container}>
          <header className={styles.head} data-sus="head">
            <h2 className={styles.title}>
              <span className={styles.lineMask}>
                <span className={styles.line} data-sus="w">{tr('impact.title1', 'Every Agreement Leaves a Smaller')}</span>
              </span>{' '}
              <span className={styles.lineMask}>
                <span className={`${styles.line} ${styles.red}`} data-sus="w">{tr('impact.title2', 'Footprint')}</span>
              </span>
            </h2>
          </header>
          <div data-sus="item">
            <ImpactStats />
          </div>
        </div>
      </section>

      {/* ============ 4. PLEDGE IN PRACTICE ============ */}
      <section className={`${styles.section} ${styles.practice}`}>
        <div className={styles.container}>
          <header className={styles.head} data-sus="head">
            <p className={`${styles.eyebrow} ${styles.eyebrowSlate}`} data-sus="r">
              {tr('practice.eyebrow', 'Our pledge in practice')}
            </p>
            <h2 className={styles.title}>
              <span className={styles.lineMask}>
                <span className={styles.line} data-sus="w">{tr('practice.title1', 'Responsibility isn’t a tagline.')}</span>
              </span>{' '}
              <span className={styles.lineMask}>
                <span className={styles.line} data-sus="w">{tr('practice.title2', 'It’s a practice.')}</span>
              </span>
            </h2>
            <p className={styles.lead} data-sus="r">
              {tr(
                'practice.text',
                'We’re focusing on three areas where Nexgn can make meaningful improvements as our platform grows.'
              )}
            </p>
          </header>
        </div>
      </section>

      <section className={`${styles.section} ${styles.pledges}`}>
        <div className={styles.container}>
          <ul className={styles.pillars}>
            {PILLARS.map((p, i) => {
              const media = (
                <div
                  className={styles.pledgeMedia}
                  style={IMAGES.practice[i] ? { '--img': `url("${IMAGES.practice[i]}")` } : undefined}
                  aria-hidden="true"
                />
              );
              const copy = (
                <div className={styles.pledgeCopy}>
                  <h3 className={styles.pillarTitle}>{tr(`pillars.${p.key}.title`, p.title)}</h3>
                  <p className={styles.pillarText}>{tr(`pillars.${p.key}.text`, p.text)}</p>
                </div>
              );
              return (
                <li key={p.key} className={styles.pillar} data-sus="item">
                  <article className={styles.pledge} style={{ '--r': `${p.tilt}deg` }}>
                    {p.textFirst ? (
                      <>
                        {copy}
                        {media}
                      </>
                    ) : (
                      <>
                        {media}
                        {copy}
                      </>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ 5. CTA ============ */}
      <CtaBanner
        imagePosition="center 40%"
        height="max(28rem, 40.7vw)"
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
  );
};

export default Sustainability;