import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCode, FiShield, FiEye, FiArrowRight } from 'react-icons/fi';
import { FaLinkedinIn } from 'react-icons/fa';
import { SEOHead } from '../../components/seo/SEOHead';
import useAboutAnimations from '../../hooks/useAboutAnimations';
import styles from './About.module.css';

const LANGS = ['en', 'es', 'hi'];

/* Images live in src/assets/about/ and are matched by file name (any of png/jpg/jpeg/webp/avif/svg):
     hero.jpg, odin.jpg, noar.jpg, robert.jpg, nia.jpg
   A missing file is fine: the hero falls back to the dark background, a team card to a grey tile. */
const imageContext = require.context('../../assets/company', false, /\.(png|jpe?g|webp|avif|svg)$/i);
const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};

const IMAGES = {
  hero: findImage('about-hero'),
  odin: findImage('null'), // intentionally missing, will fall back to grey tile
  noar: findImage('null'), // intentionally missing, will fall back to grey tile
  robert: findImage('null'), // intentionally missing, will fall back to grey tile
  nia: findImage('null'), // intentionally missing, will fall back to grey tile
};

/* Add `linkedin` (profile URL) to a member when available. */
const TEAM = [
  { key: 'odin', name: 'Odin O.', role: 'Founder, Product Lead & Chief Executive Officer (CEO)' },
  { key: 'noar', name: 'Noar Z.', role: 'Chief Technology Officer (CTO) | Vice President, Engineering' },
  { key: 'robert', name: 'Robert Y.', role: 'Chief Design Officer (CDO) | Head of Design' },
  { key: 'nia', name: 'Nia P.', role: 'Chief Strategy and Sustainability Officer | Strategy & Innovation Lead' },
];

const Words = ({ text }) =>
  text
    .split('\n')
    .map((line, l) => (
      <span key={l} className={styles.line}>
        {line
          .split(' ')
          .filter(Boolean)
          .map((word, i, arr) => (
            <React.Fragment key={`${word}-${i}`}>
              <span className={styles.w}>
                <span className={styles.wi} data-ab="word">
                  {word}
                </span>
              </span>
              {i < arr.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
      </span>
    ));

const About = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const rootRef = useRef(null);
  useAboutAnimations(rootRef);

  const k = 'about';
  const tr = (key, fallback) => t(`${k}.${key}`, fallback);
  const withLng = (p) => `/${currentLng}${p}`;

  const seoTitle = tr('seo.title', 'About Nexgn | Building the Infrastructure for Modern Agreements');
  const seoDescription = tr(
    'seo.description',
    'Nexgn is a unified agreement platform built by the NoCapCode team in India: secure digital signatures, automated routing and sustainable infrastructure.'
  );
  const pageUrl = `https://nexgn.cloud/${currentLng}/about`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: currentLng,
    isPartOf: { '@type': 'WebSite', name: 'Nexgn', url: 'https://nexgn.cloud' },
    about: { '@type': 'Organization', name: 'Nexgn', url: 'https://nexgn.cloud' },
  };

  const values = [
    {
      icon: <FiCode />,
      title: tr('values.eng.title', 'Engineering First'),
      desc: tr('values.eng.desc', 'We write optimized, low-latency code. No bloat.'),
    },
    {
      icon: <FiShield />,
      title: tr('values.sec.title', 'Zero Compromise Security'),
      desc: tr('values.sec.desc', 'Privacy and cryptography are built into our foundation, never bolted on.'),
    },
    {
      icon: <FiEye />,
      title: tr('values.trans.title', 'Radical Transparency'),
      desc: tr(
        'values.trans.desc',
        'From our pricing limits to our subprocessor lists, we do not hide behind enterprise sales walls.'
      ),
    },
  ];

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} url="/about" schema={schema} />
      <main className={styles.page} ref={rootRef}>
        {/* ---------- Hero ---------- */}
        <section className={styles.hero} data-ab="hero">
          <div className={styles.heroMedia} data-ab="hero-media" style={IMAGES.hero ? { backgroundImage: `url(${IMAGES.hero})` } : undefined} />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>
              <Words text={tr('hero.title', 'We are building the infrastructure\nfor modern agreements.')} />
            </h1>
          </div>
        </section>

        {/* ---------- About us ---------- */}
        <section className={styles.about}>
          <div className={`${styles.container} ${styles.aboutGrid}`}>
            <p className={styles.eyebrowDark} data-ab="fade">
              {tr('about.eyebrow', 'ABOUT US')}
            </p>
            <div className={styles.aboutBody}>
              <p className={styles.lead} data-ab="rise">
                {tr(
                  'about.lead',
                  'Growing a company introduces an operational problem that many founders completely underestimate: document workflow fragmentation. What starts as a simple process for managing client agreements quickly turns into a maze of emails, disjointed signing apps, and lost local files.'
                )}
              </p>
              <p className={styles.copy} data-ab="rise">
                {tr(
                  'about.copy',
                  'We realized that adding more software to the stack actually worsens the fragmentation. A business doesn’t need another disconnected digital signature app—it needs a unified operational source of truth. We engineered a highly focused prototype that stripped away legacy bloat, concentrating entirely on secure digital signatures and automated routing. The immediate success of those early deployments caught the attention of NoCapCode Inc., whose sponsorship allowed us to scale into the enterprise-grade V2 platform we are launching today.'
                )}
              </p>
              <div className={styles.callout} data-ab="rise">
                <p className={styles.calloutKicker}>
                  {tr('about.calloutKicker', 'Want to know how a simple prototype transformed into an enterprise standard?')}
                </p>
                <Link to={withLng("/blog/nexgn-origin-story")} className={styles.calloutLink} data-ab="link">
                  <span>{tr('about.calloutLink', 'Read the full Nexgn Origin Story on our Blog')}</span>
                  <FiArrowRight aria-hidden="true" className={styles.calloutArrow} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Mission & values ---------- */}
        <section className={styles.mission}>
          <div className={styles.container}>
            <p className={`${styles.eyebrowDark} ${styles.center}`} data-ab="fade">
              {tr('mission.eyebrow', 'OUR MISSION & VALUES')}
            </p>
            <h2 className={styles.missionTitle} data-ab="rise">
              {tr(
                'mission.title',
                'To eliminate the friction of paperwork globally by providing secure, intelligent, and sustainable agreement infrastructure.'
              )}
            </h2>
            <ul className={styles.values} data-ab="cards">
              {values.map((v) => (
                <li key={v.title} className={styles.card} data-ab="card">
                  <span className={styles.cardIcon} data-ab="icon" aria-hidden="true">
                    {v.icon}
                  </span>
                  <h3 className={styles.cardTitle}>{v.title}</h3>
                  <p className={styles.cardDesc}>{v.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <section className={styles.team}>
          <div className={styles.container}>
            <p className={`${styles.eyebrowDark} ${styles.center}`} data-ab="fade">
              {tr('team.eyebrow', 'OUR TEAM')}
            </p>
            <h2 className={styles.teamTitle} data-ab="rise">
              {tr(
                'team.title',
                'Nexgn operates as a remote-first platform anchored by the NoCapCode technical team in India.'
              )}
            </h2>
            <ul className={styles.teamGrid} data-ab="cards">
              {TEAM.map((m) => (
                <li key={m.key} className={styles.member} data-ab="card">
                  <div className={styles.photo} data-ab="photo">
                    {IMAGES[m.key] && <img src={IMAGES[m.key]} alt={m.name} loading="lazy" decoding="async" />}
                  </div>
                  <div className={styles.memberRow}>
                    <div>
                      <h3 className={styles.memberName}>{m.name}</h3>
                      <p className={styles.memberRole}>{tr(`team.${m.key}.role`, m.role)}</p>
                    </div>
                    {m.linkedin ? (
                      <a
                        href={m.linkedin}
                        className={styles.social}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                      >
                        <FaLinkedinIn aria-hidden="true" />
                      </a>
                    ) : (
                      <span className={styles.social} aria-hidden="true">
                        <FaLinkedinIn />
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;