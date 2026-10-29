import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import ImpactStats from '../../components/common/ImpactStats';
import CtaBanner from '../../components/common/CtaBanner';
import styles from './Sustainability.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const LANGS = ['en', 'es', 'hi'];

/* =====================================================================
   IMAGES
   Drop photos into  src/assets/sustainability/  (the folder must exist). Files are picked up by
   NAME, any extension (png / jpg / jpeg / webp / avif / svg). A missing file never breaks the build.

     hero       dark photo behind the hero (hands holding a seedling)
     intro      picture next to "The paperwork doesn't end..." (grey box until added)
     practice-1  photo on the "We Measure & Disclose" card (paper + calculator)
     practice-2  picture on the "We Optimize Our Code" card (code editor)
     practice-3  photo on the "We Build for the Long Term" card (globe on grass)
     (the bottom CTA photo is shared: src/assets/common/cta.*)
   ===================================================================== */
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

const Sustainability = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`sustainability.${key}`, fallback);

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
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/sustainability" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section
        className={styles.hero}
        style={IMAGES.hero ? { '--img': `url("${IMAGES.hero}")` } : undefined}
        aria-labelledby="sus-title"
      >
        <div className={styles.photo} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.rise}`}>
            {tr('hero.eyebrow', 'The Nexgn Sustainability Pledge')}
          </p>
          <h1 id="sus-title" className={styles.heroTitle}>
            <span className={styles.heroLine} style={{ '--d': '100ms' }}>
              {tr('hero.line1', 'Better agreements.')}
            </span>
            <span className={styles.heroLine} style={{ '--d': '220ms' }}>
              {tr('hero.line2a', 'A lighter')} <span className={styles.red}>{tr('hero.line2b', 'footprint')}</span>.
            </span>
          </h1>
          <p className={`${styles.heroText} ${styles.rise}`} style={{ '--d': '360ms' }}>
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
          <Reveal className={styles.introText}>
            <h2 className={styles.introTitle}>
              {tr('intro.title', 'The paperwork doesn’t end when the deal is done.')}
            </h2>
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
          </Reveal>

          <Reveal delay={120} className={styles.introMedia}>
            {IMAGES.intro && <img src={IMAGES.intro} alt="" loading="lazy" />}
          </Reveal>
        </div>
      </section>

      {/* ============ 3. IMPACT ============ */}
      <section className={`${styles.section} ${styles.impact}`}>
        <div className={styles.container}>
          <Reveal className={styles.head}>
            <h2 className={styles.title}>
              <span className={styles.line}>{tr('impact.title1', 'Every Agreement Leaves a Smaller')}</span>{' '}
              <span className={`${styles.line} ${styles.red}`}>{tr('impact.title2', 'Footprint')}</span>
            </h2>
          </Reveal>
          <ImpactStats />
        </div>
      </section>

      {/* ============ 4. PLEDGE IN PRACTICE ============ */}
      <section className={`${styles.section} ${styles.practice}`}>
        <div className={styles.container}>
          <Reveal className={styles.head}>
            <p className={`${styles.eyebrow} ${styles.eyebrowSlate}`}>
              {tr('practice.eyebrow', 'Our pledge in practice')}
            </p>
            <h2 className={styles.title}>
              <span className={styles.line}>{tr('practice.title1', 'Responsibility isn’t a tagline.')}</span>{' '}
              <span className={styles.line}>{tr('practice.title2', 'It’s a practice.')}</span>
            </h2>
            <p className={styles.lead}>
              {tr(
                'practice.text',
                'We’re focusing on three areas where Nexgn can make meaningful improvements as our platform grows.'
              )}
            </p>
          </Reveal>
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
                <Reveal as="li" key={p.key} delay={i * 120} className={styles.pillar}>
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
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ 5. CTA (CtaBanner: shared photo from src/assets/common/cta.*) ============ */}
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