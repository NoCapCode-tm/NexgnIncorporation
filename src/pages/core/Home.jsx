import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileEdit, ShieldCheck, Zap, Globe, CheckCircle } from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import styles from './Home.module.css';

const Home = () => {
  const { t, i18n } = useTranslation();
  const langPrefix = i18n.resolvedLanguage === 'en' ? '' : `/${i18n.resolvedLanguage}`;

  // JSON-LD Organization Schema for Google Knowledge Graph
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexgn",
    "url": "https://nexgn.cloud",
    "logo": "https://nexgn.cloud/favicon.ico"
  };

  return (
    <div>
      <SEOHead 
        title="Electronic Signatures & Document Automation" 
        description="Replace DocuSign with a faster, more secure platform. Create, sign, and automate agreements instantly."
        url="/" 
        schema={organizationSchema}
      />

      {/* ==========================================
          HERO SECTION 
          ========================================== */}
      <section className={styles.heroSection}>
        <motion.div className={styles.eyebrow} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {t('home.eyebrow', 'Introducing Nexgn 2.0')}
        </motion.div>

        <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {t('home.hero_title', 'Every agreement.')}<br />
          {t('home.hero_title_2', 'One intelligent workspace.')}
        </motion.h1>

        <motion.p className={styles.heroSubtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {t('home.hero_subtitle', 'Stop bouncing between Word, email, and legacy eSignature apps. Create, send, and securely sign legally binding contracts in seconds.')}
        </motion.p>

        <motion.div className={styles.buttonGroup} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/register">
            <button className={styles.btnPrimary}>{t('home.cta_primary', 'Start sending for free')}</button>
          </Link>
          <Link to={`${langPrefix}/pricing`}>
            <button className={styles.btnSecondary}>{t('home.cta_secondary', 'View Pricing')}</button>
          </Link>
        </motion.div>

        <motion.div className={styles.dashboardPreview} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {/* Ensure you have a placeholder image or actual UI screenshot at public/assets/dashboard-mockup.png */}
          <OptimizedImage 
            src="/assets/dashboard-mockup.png" 
            webpSrc="/assets/dashboard-mockup.webp" 
            alt="Nexgn Dashboard Preview"
            width="100%" 
            height="100%" 
            loading="eager" 
          />
        </motion.div>
      </section>

      {/* ==========================================
          SOCIAL PROOF LOGO TICKER
          ========================================== */}
      <section className={styles.socialProof}>
        <p>Trusted by innovative teams globally</p>
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {/* We duplicate the ticker content to create a seamless infinite scroll loop */}
          <div className={styles.logoTicker}>
            <h3>ACME Corp</h3>
            <h3>GlobalTech</h3>
            <h3>Stark Industries</h3>
            <h3>Wayne Enterprises</h3>
            <h3>Umbrella Corp</h3>
            {/* Duplicates */}
            <h3>ACME Corp</h3>
            <h3>GlobalTech</h3>
            <h3>Stark Industries</h3>
            <h3>Wayne Enterprises</h3>
            <h3>Umbrella Corp</h3>
          </div>
        </div>
      </section>

      {/* ==========================================
          BENTO BOX FEATURES SECTION 
          ========================================== */}
      <section className={styles.featuresSection}>
        <motion.div 
          className={styles.featuresHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Replace multiple tools with one intelligent platform.</h2>
        </motion.div>

        <div className={styles.bentoGrid}>
          {/* Large Card: Document Editor */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.cardLarge}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div className={styles.bentoIcon}><FileEdit size={24} /></div>
            <h3>Drag & Drop Document Editor</h3>
            <p>Upload any PDF and place signature, text, and date fields anywhere on the document. No more printing, signing, and scanning.</p>
          </motion.div>

          {/* Small Card: Automation */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.cardSmall}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            <div className={styles.bentoIcon}><Zap size={24} /></div>
            <h3>Smart Reminders</h3>
            <p>Automate follow-ups so you never have to manually chase a client for a signature again.</p>
          </motion.div>

          {/* Small Card: Global Compliance */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.cardSmall}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <div className={styles.bentoIcon}><Globe size={24} /></div>
            <h3>Global Legal Validity</h3>
            <p>Fully compliant with US ESIGN, EU eIDAS, and the India IT Act 2000. Contracts hold up in court.</p>
          </motion.div>

          {/* Large Card: Security & Audit Trail */}
          <motion.div 
            className={`${styles.bentoCard} ${styles.cardLarge}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            <div className={styles.bentoIcon}><ShieldCheck size={24} /></div>
            <h3>Cryptographic Audit Trails</h3>
            <p>Every signature generates a non-repudiable audit certificate tracking IP address, browser metadata, and a SHA-256 cryptographic hash.</p>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA SECTION 
          ========================================== */}
      <section className={styles.ctaSection}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2>Ready to upgrade your workflow?</h2>
          <p>Join thousands of businesses sending legally binding documents faster and cheaper than ever before.</p>
          
          <div className={styles.buttonGroup} style={{ marginBottom: 0 }}>
            <Link to="/register">
              <button className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Create Free Account <CheckCircle size={18} />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;