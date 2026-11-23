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

/* ---------- Email templates ---------- */

const EMAIL_TEMPLATE_GUIDANCE = [
  'Email submission guidelines',
  'Please complete the relevant fields in this template and retain its structure. In the subject line, replace only the final [2–3 word summary] with a brief description of your request. Keep the fixed Nexgn department wording unchanged.',
  'The reference format helps us identify, route, and track your request. Removing or changing it may delay processing and affect response timelines where an SLA applies.',
].join('\n');

const MAIL_TEMPLATES = {
  gateway: {
    subject: 'Nexgn | Gateway Support | [2–3 word summary]',
    body: [
      'Hello Nexgn Gateway Team,',
      '',
      'I am contacting you for assistance with a gateway or transaction-related matter.',
      '',
      'Issue description:',
      '[Please explain what happened, what you expected to happen, and any error message displayed.]',
      '',
      'Transaction / reference ID: [If available]',
      'Date and time (including time zone): [If available]',
      'Amount and currency: [If relevant]',
      'Registered Nexgn account email: [Your account email]',
      'Workspace / organisation: [If applicable]',
      '',
      EMAIL_TEMPLATE_GUIDANCE,
      '',
      'Security note: Do not include passwords, OTPs, CVVs, full card numbers, banking credentials, or other confidential authentication details.',
      '',
      'Regards,',
      '[Your full name]',
    ].join('\n'),
  },
  help: {
    subject: 'Nexgn | Customer Support | [2–3 word summary]',
    body: [
      'Hello Nexgn Support Team,',
      '',
      'I am requesting assistance with the matter described below.',
      '',
      'Issue description:',
      '[Please explain what you were trying to do, what happened, and the result you expected. Include the exact error message, if any.]',
      '',
      'Registered Nexgn account email: [Your account email]',
      'Workspace / organisation: [If applicable]',
      'Affected document / request ID: [If applicable]',
      'Device, browser, and operating system: [If relevant]',
      'Date and time (including time zone): [If relevant]',
      '',
      EMAIL_TEMPLATE_GUIDANCE,
      '',
      'Security note: Never include your password, OTP, authentication code, API key, or other login credentials.',
      '',
      'Regards,',
      '[Your full name]',
    ].join('\n'),
  },
  security: {
    subject: 'Nexgn | Security Disclosure | [2–3 word summary]',
    body: [
      'Hello Nexgn Security Team,',
      '',
      'I am submitting a potential security issue for your assessment.',
      '',
      'Security issue summary:',
      '[Describe the issue, the potential impact, and the conditions under which it may occur.]',
      '',
      'Affected service / URL / component: [Details]',
      'Affected version or environment: [If known]',
      'Steps to reproduce: [Provide concise steps, where safe and authorised]',
      'Date and time observed (including time zone): [Details]',
      'Supporting evidence: [List relevant, safely redacted evidence, if available]',
      'Your contact email: [Your email address]',
      '',
      EMAIL_TEMPLATE_GUIDANCE,
      '',
      'Responsible disclosure: Do not include live credentials, private keys, access tokens, or unnecessary personal data. Do not access, modify, or download data that does not belong to you, or conduct testing beyond what you are authorised to perform.',
      '',
      'Regards,',
      '[Your full name]',
    ].join('\n'),
  },
  privacy: {
    subject: 'Nexgn | Privacy Request | [2–3 word summary]',
    body: [
      'Hello Nexgn Privacy Team,',
      '',
      'I am contacting you regarding a privacy or personal-data request.',
      '',
      'Request type: [Access / Correction / Deletion / Other]',
      'Request details:',
      '[Please describe the information or concern and the action you are requesting.]',
      '',
      'Full name: [Your name]',
      'Registered Nexgn account email: [Your account email, if applicable]',
      'Workspace / organisation: [If applicable]',
      'Relevant document / reference ID: [If applicable]',
      'Country or region: [If relevant]',
      '',
      EMAIL_TEMPLATE_GUIDANCE,
      '',
      'Privacy note: Please provide only the information needed to understand your request. Do not attach identity documents or other sensitive personal information unless our team requests them through an appropriate secure channel. We may contact you if additional information or identity verification is required.',
      '',
      'Regards,',
      '[Your full name]',
    ].join('\n'),
  },
};

const createMailtoLink = (address, templateKey) => {
  const template = MAIL_TEMPLATES[templateKey];
  if (!template) return `mailto:${address}`;

  const subject = encodeURIComponent(template.subject);
  const body = encodeURIComponent(template.body);
  return `mailto:${address}?subject=${subject}&body=${body}`;
};

/* ---------- Content ---------- */

const CHANNELS = [
  {
    key: 'support',
    no: '01',
    title: 'Customer Service & Support',
    text: 'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.',
    emails: [
      { address: 'gateway@nexgn.cloud', template: 'gateway', Icon: FiMail },
      { address: 'help@nexgn.cloud', template: 'help', Icon: FiHelpCircle },
    ],
  },
  {
    key: 'enterprise',
    no: '02',
    title: 'Enterprise & Security',
    text: 'For vulnerability disclosures, data privacy requests, or enterprise SLA compliance',
    emails: [
      { address: 'security@nexgn.cloud', template: 'security', Icon: FiShield },
      { address: 'privacy@nexgn.cloud', template: 'privacy', Icon: FiLock },
    ],
  },
];

const TOPICS = [
  { key: 'tech', label: 'Technical Support' },
  { key: 'api', label: 'API & Developer Help' },
  { key: 'sales', label: 'Sales & Pricing' },
  { key: 'press', label: 'Press & Media' },
  { key: 'other', label: 'Other' },
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
                    {c.emails.map(({ address, template, Icon }) => (
                      <li key={address}>
                        <a
                          href={createMailtoLink(address, template)}
                          className={styles.email}
                          aria-label={`Compose a prefilled ${template} email to ${address}`}
                          title={`Open a prefilled email to ${address}`}
                        >
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