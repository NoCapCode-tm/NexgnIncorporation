import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import DottedMap from 'dotted-map';
import { FiChevronDown, FiHelpCircle, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import useContactAnimations from '../../hooks/useContactAnimations';
import styles from './Contact.module.css';

const SIGNUP_URL = 'https://sign.nexgn.cloud/signup';
const LOGIN_URL = 'https://sign.nexgn.cloud/login';
const LANGS = ['en', 'es', 'hi'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Leave '' to open the visitor's email app addressed to FORM_FALLBACK_EMAIL.
// When set, the form POSTs JSON { name, email, subject, message } to it.
const FORM_URL = '';
const FORM_FALLBACK_EMAIL = 'help@nexgn.cloud';

/* Images: drop hero.* (typewriter photo) into src/assets/contact/. A missing file never breaks the build. */
const imageContext = require.context('../../assets/contact', false, /\.(png|jpe?g|webp|avif|svg)$/i);
const findImage = (name) => {
  const key = imageContext
    .keys()
    .find((k) => k.replace(/^\.\//, '').replace(/\.[^.]+$/, '').toLowerCase() === name);
  if (!key) return null;
  const mod = imageContext(key);
  return (mod && mod.default) || mod;
};
const HERO_IMG = findImage('hero');

/* ---------- Content ---------- */

const CHANNELS = [
  {
    key: 'support',
    no: '01',
    title: 'Customer Service & Support',
    text: 'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.',
    emails: [
      { address: 'gateway@nexgn.cloud', Icon: FiMail },
      { address: 'help@nexgn.cloud', Icon: FiHelpCircle },
    ],
  },
  {
    key: 'enterprise',
    no: '02',
    title: 'Enterprise & Security',
    text: 'For vulnerability disclosures, data privacy requests, or enterprise SLA compliance',
    emails: [
      { address: 'security@nexgn.cloud', Icon: FiShield },
      { address: 'privacy@nexgn.cloud', Icon: FiLock },
    ],
  },
];

const TOPICS = [
  { key: 'tech', label: 'Technical Support' },
  { key: 'api', label: 'API & Developer Help' },
  { key: 'sales', label: 'Sales & Pricing' },
  { key: 'press', label: 'Press & Media' },
];

const OFFICES = [
  { key: 'us', name: 'Nexgn Inc.', lines: ['Santa Fe, NM 87501,', 'United States'], query: 'Santa Fe, NM 87501, United States', flag: 'us', lat: 35.687, lng: -105.938, fx: 21.5, fy: 36 },
  { key: 'in', name: 'Nexgn Inc.', lines: ['Jaipur, Rajasthan 302021,', 'India'], query: 'Jaipur, Rajasthan 302021, India', flag: 'in', lat: 26.912, lng: 75.787, fx: 69, fy: 45 },
];

const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/* ---------- Dotted world map (built once) ---------- */
const map = new DottedMap({ height: 60, grid: 'diagonal' });
const points = map.getPoints();
const maxX = Math.max(...points.map((p) => p.x)) + 1;
const maxY = Math.max(...points.map((p) => p.y)) + 1;

const pinPosition = (o) => {
  try {
    const p = map.getPin({ lat: o.lat, lng: o.lng });
    if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
      return { left: ((p.x + 0.5) / maxX) * 100, top: ((p.y + 0.5) / maxY) * 100 };
    }
  } catch {
    /* fall through */
  }
  return { left: o.fx, top: o.fy };
};
const PINS = OFFICES.map((o) => ({ ...o, pos: pinPosition(o) }));

const Words = ({ text }) =>
  text.split(' ').map((w, i, all) => (
    <React.Fragment key={`${w}-${i}`}>
      <span className={styles.wMask}>
        <span className={styles.wIn} data-ct="word">
          {w}
        </span>
      </span>
      {i < all.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

/* ---------- Custom subject dropdown ---------- */
const TopicSelect = ({ id, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const selected = options.find((o) => o.key === value);

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || !listRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    gsap.fromTo(
      listRef.current,
      { autoAlpha: 0, y: -10, scaleY: 0.94, transformOrigin: 'top center' },
      { autoAlpha: 1, y: 0, scaleY: 1, duration: 0.28, ease: 'power3.out' }
    );
    gsap.fromTo(
      listRef.current.children,
      { autoAlpha: 0, y: -6 },
      { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out', delay: 0.05, clearProps: 'opacity,visibility,transform' }
    );
  }, [open]);

  const choose = (key) => {
    onChange(key);
    close();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(Math.max(0, options.findIndex((o) => o.key === value)));
        return;
      }
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setActive((a) => (a + d + options.length) % options.length);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && open && active >= 0) {
      e.preventDefault();
      choose(options[active].key);
    }
  };

  return (
    <div className={styles.select} ref={wrapRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        id={id}
        className={`${styles.input} ${styles.selectBtn} ${open ? styles.selectOpen : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? styles.selectValue : styles.selectPh}>{selected ? selected.label : placeholder}</span>
        <FiChevronDown className={`${styles.chevron} ${open ? styles.chevronUp : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <ul id={`${id}-list`} className={styles.options} role="listbox" ref={listRef}>
          {options.map((o, i) => (
            <li
              key={o.key}
              role="option"
              aria-selected={o.key === value}
              className={`${styles.option} ${i === active ? styles.optionActive : ''} ${o.key === value ? styles.optionSel : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o.key)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ---------- Page ---------- */

const Contact = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const tr = (key, fallback) => t(`contact.${key}`, fallback);

  const rootRef = useRef(null);
  useContactAnimations(rootRef);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' }); // company = honeypot
  const [state, setState] = useState('idle'); // idle | invalid | sending | done | error

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (state !== 'idle') setState('idle');
  };
  const setSubject = (key) => {
    setForm((f) => ({ ...f, subject: key }));
    if (state !== 'idle') setState('idle');
  };

  const topics = TOPICS.map((o) => ({ key: o.key, label: tr(`form.topics.${o.key}`, o.label) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.company) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    const topic = topics.find((o) => o.key === form.subject);
    if (!name || !EMAIL_RE.test(email) || !topic || !message) {
      setState('invalid');
      return;
    }
    setState('sending');
    try {
      if (FORM_URL) {
        const res = await fetch(FORM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject: topic.label, message }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const subject = encodeURIComponent(`${topic.label} - ${name}`);
        const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
        window.location.href = `mailto:${FORM_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      }
      setState('done');
      setForm({ name: '', email: '', subject: '', message: '', company: '' });
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
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/contact" schema={schema} />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div
          className={styles.heroPhoto}
          data-ct="photo"
          style={HERO_IMG ? { '--img': `url("${HERO_IMG}")` } : undefined}
          aria-hidden="true"
        />
        <div className={styles.container}>
          <p className={styles.eyebrow} data-ct="hero-fade">
            {tr('hero.eyebrow', 'Contact Us')}
          </p>
          <h1 className={styles.heroTitle}>
            <span className={styles.wMask}>
              <span className={styles.wIn} data-ct="word">
                {tr('hero.title1', 'Let’s')}
              </span>
            </span>{' '}
            <span className={styles.wMask}>
              <span className={`${styles.wIn} ${styles.red}`} data-ct="word">
                {tr('hero.title2', 'Talk')}
              </span>
            </span>
          </h1>
          <p className={styles.heroText} data-ct="hero-fade">
            {tr('hero.text', 'Our global support and engineering teams are ready to assist you.')}
          </p>
        </div>
      </section>

      {/* ============ 2. GET IN TOUCH + FORM ============ */}
      <section className={`${styles.section} ${styles.touch}`}>
        <div className={`${styles.container} ${styles.touchGrid}`}>
          <div className={styles.card} data-ct="card">
            <h2 className={styles.cardTitle}>{tr('touch.title', 'Get in Touch')}</h2>
            <div data-ct="channels" className={styles.channels}>
              {CHANNELS.map((c) => (
                <div key={c.key} className={styles.channel} data-ct="channel">
                  <p className={styles.channelNo}>{c.no}</p>
                  <h3 className={styles.channelTitle}>{tr(`touch.${c.key}.title`, c.title)}</h3>
                  <p className={styles.channelText}>{tr(`touch.${c.key}.text`, c.text)}</p>
                  <ul className={styles.emails}>
                    {c.emails.map(({ address, Icon }) => (
                      <li key={address}>
                        <a href={`mailto:${address}`} className={styles.email}>
                          <Icon className={styles.emailIcon} aria-hidden="true" />
                          <span className={styles.emailText}>{address}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formWrap} data-ct="card">
            <form className={styles.form} onSubmit={onSubmit} noValidate data-ct="form">
              <div className={styles.field} data-ct="field">
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

              <div className={styles.field} data-ct="field">
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

              <div className={styles.field} data-ct="field">
                <label htmlFor="ct-subject" className={styles.label}>
                  {tr('form.subject', 'Subject')}
                </label>
                <TopicSelect
                  id="ct-subject"
                  value={form.subject}
                  onChange={setSubject}
                  placeholder={tr('form.subjectPh', 'Select a topic')}
                  options={topics}
                />
              </div>

              <div className={styles.field} data-ct="field">
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

              <div className={styles.formFoot} data-ct="field">
                <button type="submit" className={styles.send} disabled={state === 'sending'}>
                  {state === 'sending' ? tr('form.sending', 'Sending…') : tr('form.send', 'Send Message')}
                </button>
                <p
                  className={`${styles.status} ${state === 'invalid' || state === 'error' ? styles.statusError : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {state === 'invalid' && tr('form.invalid', 'Please enter your name, a valid email, a topic and a message.')}
                  {state === 'error' && tr('form.error', 'Something went wrong. Please try again or email us directly.')}
                  {state === 'done' &&
                    (FORM_URL
                      ? tr('form.done', 'Thank you! We will get back to you soon.')
                      : tr('form.doneMail', 'Almost done: send the email that just opened to reach us.'))}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============ 3. HEADQUARTERS ============ */}
      <section className={`${styles.section} ${styles.hq}`}>
        <div className={`${styles.container} ${styles.hqGrid}`}>
          <div className={styles.hqCard} data-ct="card">
            <div data-ct="hq-card">
              <h2 className={styles.hqTitle} data-ct="hq">
                {tr('hq.title', 'Corporate Headquarters')}
              </h2>
              <p className={styles.hqText} data-ct="hq">
                {tr(
                  'hq.text',
                  'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.'
                )}
              </p>
              <ul className={styles.offices}>
                {OFFICES.map((o) => (
                  <li key={o.key} className={styles.office} data-ct="hq">
                    <a href={mapsUrl(o.query)} target="_blank" rel="noopener noreferrer" className={styles.officeAddress}>
                      <span className={styles.officeName}>{tr(`hq.${o.key}.name`, o.name)}</span>
                      <span>{tr(`hq.${o.key}.line1`, o.lines[0])}</span>
                      <span>{tr(`hq.${o.key}.line2`, o.lines[1])}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.mapCard} data-ct="card">
            <div className={styles.mapBox} data-ct="map" style={{ aspectRatio: `${maxX} / ${maxY}` }}>
              <svg
                className={styles.mapSvg}
                viewBox={`-0.5 -0.5 ${maxX} ${maxY}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={0.3} fill="#aab2bb" />
                ))}
              </svg>
              {PINS.map((o) => (
                <a
                  key={o.key}
                  href={mapsUrl(o.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pin}
                  data-ct="pin"
                  style={{ left: `${o.pos.left}%`, top: `${o.pos.top}%` }}
                  aria-label={`${tr('hq.openMap', 'Open map')}: ${o.query}`}
                >
                  <span className={styles.pinPulse} data-ct="pulse" aria-hidden="true" />
                  <span className={styles.pinFlag} aria-hidden="true">
                    <img src={`https://flagcdn.com/${o.flag}.svg`} alt="" loading="lazy" />
                  </span>
                  <span className={styles.pinTip}>{tr('hq.clickMap', 'Click to view on map')}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. CTA ============ */}
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