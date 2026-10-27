import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './AlternativeCompare.module.css';

const COMPETITOR_DATA = {
  'docusign': {
    name: 'DocuSign',
    weakness: 'strict envelope quotas and aggressive overage fees',
    pricing: 'Expensive base tiers with hidden overages',
    envelopes: 'Strictly capped (usually 100/yr)',
    techStack: 'Legacy XML/SOAP API',
  },
  'adobe-sign': {
    name: 'Adobe Sign',
    weakness: 'bloated PDF-viewer dependencies and slow mobile rendering',
    pricing: 'Expensive enterprise minimums',
    envelopes: 'Strictly capped',
    techStack: 'Heavy Acrobat Web dependencies',
  },
  'pandadoc': {
    name: 'PandaDoc',
    weakness: 'aggressive per-seat pricing that punishes company-wide deployment',
    pricing: 'High per-seat licensing fees',
    envelopes: 'Limited by seat count',
    techStack: 'Sales-focused CPQ platform',
  },
  'dropbox-sign': {
    name: 'Dropbox Sign',
    weakness: 'expensive white-labeling and missing native AI features',
    pricing: 'High premiums for API white-labeling',
    envelopes: 'Capped allocations',
    techStack: 'Basic REST API',
  }
};

export const AlternativeCompare = () => {
  const { competitor } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || 'en';
  
  // If the URL slug doesn't exist in our dictionary, redirect home (prevents 404 SEO penalties)
  const compData = COMPETITOR_DATA[competitor.toLowerCase()];
  if (!compData) {
    return <Navigate to={`/${currentLang}`} replace />;
  }

  const seoTitle = `Nexgn vs ${compData.name} | Best Alternative in ${new Date().getFullYear()}`;
  const seoDescription = `Compare Nexgn vs ${compData.name}. Switch to Nexgn for AES-256 encrypted electronic signatures with unlimited envelopes, zero overage fees, and superior API limits.`;

  // Dynamic AEO FAQ Schema for this specific competitor
  const dynamicSchema = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is Nexgn a better alternative to ${compData.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, unlike ${compData.name} which relies on ${compData.weakness}, Nexgn offers unlimited envelopes, AES-256 encryption, and native global compliance (IT Act 2000, eIDAS, ESIGN) at a predictable flat rate.`
        }
      }
    ]
  };

  return (
    <div className={styles.page}>
      <SEOHead 
        title={seoTitle} 
        description={seoDescription} 
        url={`/alternatives/${competitor}`} 
        schema={dynamicSchema}
      />
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.title}>
            The Modern Alternative to <span className={styles.red}>{compData.name}</span>
          </h1>
          <p className={styles.lead}>
            Stop paying for {compData.weakness}. Switch to the platform built with military-grade AES-256 encryption, native IT Act 2000 compliance, and truly unlimited envelopes.
          </p>
          <div className={styles.actions}>
            <a href="https://sign.nexgn.cloud/signup" className={styles.btnPrimary}>
              Start for free
            </a>
            <Link to={`/${currentLang}/pricing`} className={styles.btnGhost}>
              Compare Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE SECTION */}
      <section className={styles.tableSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Head-to-Head Comparison</h2>
          <p className={styles.sectionSubtitle}>See why modern enterprises are switching to Nexgn.</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Enterprise Feature</th>
                  <th className={styles.nexgnColumn}>Nexgn</th>
                  <th className={styles.compColumn}>{compData.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Pricing Architecture</strong></td>
                  <td className={styles.nexgnCell}>Flat-Rate / Unlimited Available</td>
                  <td className={styles.compCell}>{compData.pricing}</td>
                </tr>
                <tr>
                  <td><strong>Envelope Limits</strong></td>
                  <td className={styles.nexgnCell}><strong>Unlimited (Business Tier)</strong></td>
                  <td className={styles.compCell}>{compData.envelopes}</td>
                </tr>
                <tr>
                  <td><strong>Overage Penalties</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> None</td>
                  <td className={styles.compCell}><FiX className={styles.iconRed} /> High per-document fees</td>
                </tr>
                <tr>
                  <td><strong>Cryptographic Audit Trail</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> SHA-256 Embedded</td>
                  <td className={styles.compCell}>Varies by tier</td>
                </tr>
                <tr>
                  <td><strong>Global Legality (eIDAS, IT Act)</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> Native Inclusion</td>
                  <td className={styles.compCell}><FiCheck className={styles.iconMuted} /> Native Inclusion</td>
                </tr>
                <tr>
                  <td><strong>AI Contract Summarization</strong></td>
                  <td className={styles.nexgnCell}><FiCheck className={styles.iconGreen} /> Native (Nexgn AI)</td>
                  <td className={styles.compCell}><FiX className={styles.iconRed} /> Premium Add-on / None</td>
                </tr>
                <tr>
                  <td><strong>Technology Stack</strong></td>
                  <td className={styles.nexgnCell}>React 19 / Modern REST API</td>
                  <td className={styles.compCell}>{compData.techStack}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.bottomCta}>
             <h3>Ready to eliminate overage fees?</h3>
             <a href="https://sign.nexgn.cloud/signup" className={styles.btnPrimary}>
               Switch to Nexgn today <FiArrowRight />
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlternativeCompare;