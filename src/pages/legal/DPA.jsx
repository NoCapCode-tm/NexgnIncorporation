import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiDownload } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import Reveal from '../../components/common/Reveal';
import { LegalHero } from '../../components/legal/LegalLayout';
import styles from './DPA.module.css';

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

      <LegalHero
        align="center"
        eyebrow={tr('hero.eyebrow', 'LEGAL HUB')}
        title={tr('hero.title', 'Data Processing Addendum\n(DPA)')}
      />

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.leftCol}>
              <Reveal delay={0}>
                <h2 className={styles.headline}>{tr('content.headline', 'EU and Indian Enterprise Clients.')}</h2>
              </Reveal>
            </div>

            <div className={styles.rightCol}>
              <Reveal delay={100}>
                <p className={styles.paragraph}>
                  {tr(
                    'content.p1',
                    'For customers subject to the General Data Protection Regulation (GDPR), the UK GDPR, or the India Digital Personal Data Protection (DPDP) Act, Nexgn provides a comprehensive Data Processing Addendum. This document outlines our commitments to data security, breach notification timelines, and our lawful basis for international data transfers.'
                  )}
                </p>
              </Reveal>

              <Reveal delay={200}>
                <a
                  href="/assets/legal/Nexgn_DPA_PreSigned.pdf"
                  download="Nexgn_DPA_PreSigned.pdf"
                  className={styles.downloadBtn}
                >
                  <span className={styles.btnIconWrapper}>
                    <FiDownload className={styles.btnIcon} aria-hidden="true" />
                  </span>
                  {tr('content.button', 'Download Pre-Signed Nexgn DPA (PDF)')}
                </a>
              </Reveal>

              <Reveal delay={300}>
                <p className={styles.note}>
                  <strong>{tr('content.noteLabel', 'Note:')}</strong>{' '}
                  {tr(
                    'content.noteText',
                    'Download the PDF, counter-sign it via Nexgn, and retain it for your compliance records.'
                  )}
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