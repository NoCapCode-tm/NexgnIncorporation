import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import CtaBanner from '../../components/common/CtaBanner';
import styles from './Contact.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const LANGS = ['en', 'es', 'hi'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// The contact form. Leave '' to open the visitor's email app addressed to FORM_FALLBACK_EMAIL.
// When set, the form POSTs JSON { name, email, message } to it.
const FORM_URL = '';
const FORM_FALLBACK_EMAIL = 'help@nexgn.cloud';

/* =====================================================================
   IMAGES
   Drop files into  src/assets/contact/  (the folder already exists). Picked up by NAME with any
   extension (png / jpg / jpeg / webp / avif / svg); a missing file never breaks the build.
   Restart the dev server after adding a file.

     hero       black typewriter photo behind "Let's Talk"
     paper      crumpled black paper behind the form section
     map-us     small map picture next to the Santa Fe address
     map-india  small map picture next to the Jaipur address
     (the bottom CTA photo is shared: src/assets/common/cta.*)
   ===================================================================== */
const imageContext = require.context('../../assets/contact', false, /\.(png|jpe?g|webp|avif|svg)$/i);

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
  paper: findImage('paper'),
  mapUs: findImage('map-us'),
  mapIn: findImage('map-india'),
};

const bg = (src) => (src ? { '--img': `url("${src}")` } : undefined);

// ---------- Content ----------

const CHANNELS = [
  {
    key: 'support',
    no: '01',
    title: 'Customer Service & Support',
    text: 'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.',
    emails: ['gateway@nexgn.cloud', 'help@nexgn.cloud'],
  },
  {
    key: 'enterprise',
    no: '02',
    title: 'Enterprise & Security',
    text: 'For vulnerability disclosures, data privacy requests, or enterprise SLA compliance',
    emails: ['security@nexgn.cloud', 'privacy@nexgn.cloud'],
  },
];

const OFFICES = [
  { key: 'us', name: 'Nexgn Inc.', lines: ['Santa Fe, NM 87501,', 'United States'], query: 'Santa Fe, NM 87501, United States', image: IMAGES.mapUs },
  { key: 'in', name: 'Nexgn Inc.', lines: ['Jaipur, Rajasthan 302021,', 'India'], query: 'Jaipur, Rajasthan 302021, India', image: IMAGES.mapIn },
];

const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// ---------- Page ----------

const Contact = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`contact.${key}`, fallback);

  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' }); // company = honeypot
  const [state, setState] = useState('idle'); // idle | invalid | sending | done | error

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (state !== 'idle') setState('idle');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.company) return; // bots fill the hidden field
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !EMAIL_RE.test(email) || !message) {
      setState('invalid');
      return;
    }
    setState('sending');
    try {
      if (FORM_URL) {
        const res = await fetch(FORM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const subject = encodeURIComponent(`Website enquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
        window.location.href = `mailto:${FORM_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      }
      setState('done');
      setForm({ name: '', email: '', message: '', company: '' });
    } catch {
      setState('error');
    }
  };

  const seoTitle = tr('seo.title', 'Contact Us | Nexgn');
  const seoDescription = tr(
    'seo.description',
    'Contact the Nexgn support, security and enterprise teams, send us a message, or find our offices in the United States and India.'
  );

  const pageUrl = `https://nexgn.cloud/${currentLng}/contact`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: currentLng,
    isPartOf: { '@type': 'WebSite', name: 'Nexgn', url: 'https://nexgn.cloud' },
  };

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/contact" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroPhoto} style={bg(IMAGES.hero)} aria-hidden="true" />
        <div className={styles.container}>
          <p className={`${styles.eyebrow} ${styles.rise}`}>{tr('hero.eyebrow', 'Contact Us')}</p>
          <h1 className={`${styles.heroTitle} ${styles.rise}`} style={{ '--d': '100ms' }}>
            {tr('hero.title1', 'Let’s')} <span className={styles.red}>{tr('hero.title2', 'Talk')}</span>
          </h1>
          <p className={`${styles.heroText} ${styles.rise}`} style={{ '--d': '220ms' }}>
            {tr('hero.text', 'Our global support and engineering teams are ready to assist you.')}
          </p>
        </div>
      </section>

      {/* ============ 2. GET IN TOUCH + FORM ============ */}
      <section className={`${styles.section} ${styles.touch}`}>
        <div className={styles.touchPaper} style={bg(IMAGES.paper)} aria-hidden="true" />
        <div className={`${styles.container} ${styles.touchGrid}`}>
          <Reveal className={styles.card}>
            <h2 className={styles.cardTitle}>{tr('touch.title', 'Get in Touch')}</h2>

            {CHANNELS.map((c) => (
              <div key={c.key} className={styles.channel}>
                <p className={styles.channelNo}>{c.no}</p>
                <h3 className={styles.channelTitle}>{tr(`touch.${c.key}.title`, c.title)}</h3>
                <p className={styles.channelText}>{tr(`touch.${c.key}.text`, c.text)}</p>
                <ul className={styles.emails}>
                  {c.emails.map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className={styles.email}>
                        <span className={styles.emailIcon} aria-hidden="true">
                          <FiArrowRight />
                        </span>
                        <span className={styles.emailText}>{email}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          <Reveal delay={120} className={styles.formWrap}>
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="ct-name" className={styles.label}>
                  {tr('form.name', 'Name')}
                </label>
                <input
                  id="ct-name"
                  className={styles.input}
                  type="text"
                  autoComplete="name"
                  placeholder={tr('form.namePh', 'Enter your Name')}
                  value={form.name}
                  onChange={set('name')}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ct-email" className={styles.label}>
                  {tr('form.email', 'Email')}
                </label>
                <input
                  id="ct-email"
                  className={styles.input}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={tr('form.emailPh', 'johndoe@mail')}
                  value={form.email}
                  onChange={set('email')}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ct-message" className={styles.label}>
                  {tr('form.message', 'Message')}
                </label>
                <textarea
                  id="ct-message"
                  className={`${styles.input} ${styles.textarea}`}
                  rows={5}
                  placeholder={tr('form.messagePh', 'We would like to hear you')}
                  value={form.message}
                  onChange={set('message')}
                />
              </div>

              {/* honeypot: hidden from people, filled by bots */}
              <input
                className={styles.trap}
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.company}
                onChange={set('company')}
              />

              <div className={styles.formFoot}>
                <button type="submit" className={styles.send} disabled={state === 'sending'}>
                  {state === 'sending' ? tr('form.sending', 'Sending…') : tr('form.send', 'Send Message')}
                </button>
                <p
                  className={`${styles.status} ${state === 'invalid' || state === 'error' ? styles.statusError : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {state === 'invalid' && tr('form.invalid', 'Please enter your name, a valid email and a message.')}
                  {state === 'error' && tr('form.error', 'Something went wrong. Please try again or email us directly.')}
                  {state === 'done' &&
                    (FORM_URL
                      ? tr('form.done', 'Thank you! We will get back to you soon.')
                      : tr('form.doneMail', 'Almost done: send the email that just opened to reach us.'))}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. HEADQUARTERS ============ */}
      <section className={`${styles.section} ${styles.hq}`}>
        <div className={styles.container}>
          <Reveal className={styles.hqCard}>
            <div className={styles.hqIntro}>
              <h2 className={styles.hqTitle}>{tr('hq.title', 'Corporate Headquarters')}</h2>
              <p className={styles.hqText}>
                {tr(
                  'hq.text',
                  'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.'
                )}
              </p>
            </div>

            <ul className={styles.offices}>
              {OFFICES.map((o) => (
                <li key={o.key} className={styles.office}>
                  <a
                    href={mapsUrl(o.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.officeAddress}
                  >
                    <span className={styles.officeName}>{tr(`hq.${o.key}.name`, o.name)}</span>
                    <span>{tr(`hq.${o.key}.line1`, o.lines[0])}</span>
                    <span>{tr(`hq.${o.key}.line2`, o.lines[1])}</span>
                  </a>
                  <a
                    href={mapsUrl(o.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.officeMap}
                    style={bg(o.image)}
                    aria-label={`${tr('hq.openMap', 'Open map')}: ${o.query}`}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ 4. CTA (shared photo from src/assets/common/cta.*) ============ */}
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

export default Contact;