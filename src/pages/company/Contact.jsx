import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import styles from './Contact.module.css';

// Import images from your assets folder
import ctaOtherImg from '../../assets/home/cta_other.png';
import phonesBgImg from '../../assets/contact/phones-bg.png'; // <-- 1. Import your phones image here

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

/* =====================================================================
   Page Component
   ===================================================================== */
const Contact = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`contact.${key}`, fallback);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out. Our team will contact you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  const seoTitle = tr('seo.title', 'Contact Us | Nexgn Support & Sales');
  const seoDescription = tr(
    'seo.description',
    'Get in touch with Nexgn. Our global support and engineering teams are ready to assist you with eSignatures, API integrations, and enterprise SLAs.'
  );

  // Helper style variable to safely pass the imported image to CSS inline
  const bgStyle = phonesBgImg ? { backgroundImage: `url("${phonesBgImg}")` } : undefined;

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/contact" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>{tr('hero.eyebrow', 'CONTACT US')}</p>
            <h1 className={styles.heroTitle}>
              {tr('hero.title1', 'Let’s ')} <span className={styles.red}>{tr('hero.title2', 'Talk')}</span>
            </h1>
            <p className={styles.heroLead}>
              {tr('hero.lead', 'Our global support and engineering teams are ready to assist you.')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 2. FORM SECTION ============ */}
      <section className={styles.formSection}>
        {/* 2. Passed the dynamic background image style here */}
        <div className={styles.formBg} style={bgStyle} aria-hidden="true" />
        
        <div className={styles.container}>
          <Reveal className={styles.formWrapper} delay={100}>
            <h2 className={styles.formTitle}>{tr('form.title', 'Get in Touch')}</h2>
            
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.srOnly}>{tr('form.name', 'Name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder={tr('form.name', 'Name')} 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.srOnly}>{tr('form.email', 'Email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder={tr('form.email', 'Email')} 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.srOnly}>{tr('form.message', 'Message')}</label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder={tr('form.message', 'Message')} 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  rows={5}
                  className={styles.textarea}
                />
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                {tr('form.submit', 'Send Message')}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. CONTACT INFO CARDS ============ */}
      <section className={styles.infoSection}>
        <div className={styles.container}>
          <Reveal className={styles.infoHead}>
            <p className={styles.eyebrowDark}>{tr('info.eyebrow', 'CONTACT INFORMATION')}</p>
          </Reveal>

          <div className={styles.cardsGrid}>
            <Reveal className={styles.infoCard} delay={100}>
              <span className={styles.cardNumber}>01</span>
              <h3 className={styles.cardTitle}>{tr('info.card1.title', 'Customer Service & Support')}</h3>
              <p className={styles.cardDesc}>
                {tr('info.card1.desc', 'Need help with your account, billing, or a technical issue? Our team is available to keep your workflows moving.')}
              </p>
              <ul className={styles.linkList}>
                <li>
                  <a href="mailto:gateway@nexgn.cloud" className={styles.contactLink}>
                    <span className={styles.iconCircle}><FiArrowRight /></span>
                    gateway@nexgn.cloud
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@nexgn.cloud" className={styles.contactLink}>
                    <span className={styles.iconCircle}><FiArrowRight /></span>
                    hello@nexgn.cloud
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal className={styles.infoCard} delay={200}>
              <span className={styles.cardNumber}>02</span>
              <h3 className={styles.cardTitle}>{tr('info.card2.title', 'Enterprise & Security')}</h3>
              <p className={styles.cardDesc}>
                {tr('info.card2.desc', 'For vulnerability disclosures, data privacy requests, or enterprise SLA compliance.')}
              </p>
              <ul className={styles.linkList}>
                <li>
                  <a href="mailto:security@nexgn.cloud" className={styles.contactLink}>
                    <span className={styles.iconCircle}><FiArrowRight /></span>
                    security@nexgn.cloud
                  </a>
                </li>
                <li>
                  <a href="mailto:privacy@nexgn.cloud" className={styles.contactLink}>
                    <span className={styles.iconCircle}><FiArrowRight /></span>
                    privacy@nexgn.cloud
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* ============ HQ BLOCK ============ */}
          <Reveal className={styles.hqBlock} delay={300}>
            <div className={styles.hqContent}>
              <h3 className={styles.hqTitle}>{tr('info.hq.title', 'Corporate Headquarters')}</h3>
              <p className={styles.hqDesc}>
                {tr('info.hq.desc', 'Looking for partnership opportunities, media inquiries, or investor relations? Connect with our corporate office.')}
              </p>
            </div>
            <div className={styles.hqAddress}>
              <p><strong>Nexgn Inc.</strong></p>
              <p>Santa Fe, New Mexico</p>
              <p>United States</p>
            </div>
            <div className={styles.hqAction}>
              <a href="https://maps.google.com/?q=Santa+Fe,+New+Mexico" target="_blank" rel="noreferrer" className={styles.iconCircleLarge} aria-label="View on Map">
                <FiArrowRight />
              </a>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ============ 4. CTA BANNER ============ */}
      <CtaBanner
        image={ctaOtherImg}
        title={tr('cta.title', 'Start signing documents')}
        highlight={tr('cta.highlight', 'signing')}
        text={tr('cta.text', 'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.')}
        primary={{ label: tr('cta.primary', 'Create your free account'), href: 'https://sign.nexgn.cloud/signup' }}
        secondary={{ label: tr('cta.secondary', 'Login'), href: 'https://sign.nexgn.cloud/login' }}
      />
    </div>
  );
};

export default Contact;