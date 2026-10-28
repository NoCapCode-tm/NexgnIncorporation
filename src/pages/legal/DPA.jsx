import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDownload } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './DPA.module.css';

  //  Scroll & Animation Helpers

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
      { threshold, rootMargin: '0px 0px -10% 0px' }
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


 //  Page Component

const DPA = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.dpa.${key}`, fallback);

  const seoTitle = tr('seo.title', 'Data Processing Addendum (DPA) | Nexgn Legal Hub');
  const seoDescription = tr(
    'seo.description',
    'Review and download the Nexgn Data Processing Addendum (DPA). Outlining our GDPR, UK GDPR, and India DPDP Act commitments to data security and privacy.'
  );

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/dpa" />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Reveal delay={0}>
            <p className={styles.eyebrow}>{tr('hero.eyebrow', 'LEGAL HUB')}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className={styles.heroTitle}>
              {tr('hero.title', 'Data Processing Addendum\n(DPA)')}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ============ CONTENT GRID ============ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Left Column: Massive Headline */}
            <div className={styles.leftCol}>
              <Reveal delay={200}>
                <h2 className={styles.headline}>
                  {tr('content.headline', 'EU and Indian Enterprise Clients.')}
                </h2>
              </Reveal>
            </div>

            {/* Right Column: Details & Action */}
            <div className={styles.rightCol}>
              <Reveal delay={300}>
                <p className={styles.paragraph}>
                  {tr(
                    'content.p1',
                    'For customers subject to the General Data Protection Regulation (GDPR), the UK GDPR, or the India Digital Personal Data Protection (DPDP) Act, Nexgn provides a comprehensive Data Processing Addendum. This document outlines our commitments to data security, breach notification timelines, and our lawful basis for international data transfers.'
                  )}
                </p>
              </Reveal>

              <Reveal delay={400}>
                <a 
                  href="/assets/legal/Nexgn_DPA_PreSigned.pdf" 
                  download="Nexgn_DPA_PreSigned.pdf"
                  className={styles.downloadBtn}
                >
                  <span className={styles.btnIconWrapper}>
                    <FiDownload className={styles.btnIcon} />
                  </span>
                  {tr('content.button', 'Download Pre-Signed Nexgn DPA (PDF)')}
                </a>
              </Reveal>

              <Reveal delay={500}>
                <p className={styles.note}>
                  <strong>{tr('content.noteLabel', 'Note:')}</strong>{' '}
                  {tr('content.noteText', 'Download the PDF, counter-sign it via Nexgn, and retain it for your compliance records.')}
                </p>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DPA;