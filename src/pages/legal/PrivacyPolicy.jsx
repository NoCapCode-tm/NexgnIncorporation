import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './PrivacyPolicy.module.css';

const SECTIONS = [
  { id: 'role', navLabel: '1. Our Role in Your Privacy' },
  { id: 'telemetry', navLabel: '2. Collection of Signer Telemetry' },
  { id: 'ai', navLabel: '3. Artificial Intelligence & Data Isolation' }
];

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.privacy.${key}`, fallback);

  // Scroll Spy State
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});
  const isClickScrolling = useRef(false);

  // Intersection Observer for highlighting sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler for sidebar links
  const scrollToSection = (id) => {
    isClickScrolling.current = true;
    setActiveSection(id);
    
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 120; // Offset for sticky nav
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const seoTitle = tr('seo.title', 'Privacy Policy | Nexgn Legal Hub');
  const seoDescription = tr('seo.description', 'Review the Nexgn Privacy Policy to understand our role as a data processor, telemetry collection, and strict AI data isolation guarantees.');

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/privacy-policy" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{tr('hero.eyebrow', 'LEGAL HUB')}</p>
          <h1 className={styles.heroTitle}>
            {tr('hero.title', 'Privacy Policy')}
          </h1>
        </div>
      </section>

      {/* ============ 2. CONTENT GRID ============ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Sidebar (Sticky) */}
            <aside className={styles.sidebar}>
              <div className={styles.stickyNav}>
                <p className={styles.navHeader}>{tr('nav.header', 'ON THIS PAGE')}</p>
                <nav className={styles.navList}>
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      className={`${styles.navItem} ${activeSection === section.id ? styles.activeNav : ''}`}
                      onClick={() => scrollToSection(section.id)}
                    >
                      {tr(`section.${section.id}.navLabel`, section.navLabel)}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
              
              {/* SECTION 1: Our Role in Your Privacy */}
              <article
                id="role"
                ref={(el) => (sectionRefs.current['role'] = el)}
                className={`${styles.policyBlock} ${activeSection === 'role' ? styles.activeBlock : styles.inactiveBlock}`}
              >
                <h2 className={styles.policyTitle}>{tr('role.title', '1. Our Role in Your Privacy')}</h2>
                <p className={styles.policyText}>
                  {tr('role.desc', 'Under global data protection laws, including the GDPR and India’s DPDP Act:')}
                </p>
                
                <div className={styles.roleCardsGrid}>
                  <div className={styles.roleCard}>
                    <div className={styles.iconSquarePlaceholder} aria-hidden="true" />
                    <p className={styles.cardEyebrow}>{tr('role.card1.eyebrow', 'THE USER (YOU)')}</p>
                    <h3 className={styles.cardTitle}>{tr('role.card1.title', 'Data Controller')}</h3>
                    <p className={styles.cardDesc}>
                      {tr('role.card1.desc', 'You decide what documents to upload and who to send them to.')}
                    </p>
                  </div>
                  <div className={styles.roleCard}>
                    <div className={styles.iconSquarePlaceholder} aria-hidden="true" />
                    <p className={styles.cardEyebrow}>{tr('role.card2.eyebrow', 'NEXGN')}</p>
                    <h3 className={styles.cardTitle}>{tr('role.card2.title', 'Data Processor')}</h3>
                    <p className={styles.cardDesc}>
                      {tr('role.card2.desc', 'We process the documents and signer telemetry strictly on your instructions to facilitate the signature workflow.')}
                    </p>
                  </div>
                </div>
              </article>

              {/* SECTION 2: Collection of Signer Telemetry */}
              <article
                id="telemetry"
                ref={(el) => (sectionRefs.current['telemetry'] = el)}
                className={`${styles.policyBlock} ${activeSection === 'telemetry' ? styles.activeBlock : styles.inactiveBlock}`}
              >
                <h2 className={styles.policyTitle}>{tr('telemetry.title', '2. Collection of Signer Telemetry')}</h2>
                <p className={styles.policyText}>
                  {tr('telemetry.desc', 'To generate a legally binding Audit Certificate, Nexgn automatically collects the following information from individuals who view or sign a document:')}
                </p>

                <ul className={styles.telemetryList}>
                  <li className={styles.telemetryItem}>
                    <div className={styles.bulletSquare} aria-hidden="true" />
                    <span>{tr('telemetry.bullet1', 'IPv4 and IPv6 network addresses.')}</span>
                  </li>
                  <li className={styles.telemetryItem}>
                    <div className={styles.bulletSquare} aria-hidden="true" />
                    <span>{tr('telemetry.bullet2', 'Cryptographic UTC timestamps of viewing and signing actions.')}</span>
                  </li>
                  <li className={styles.telemetryItem}>
                    <div className={styles.bulletSquare} aria-hidden="true" />
                    <span>{tr('telemetry.bullet3', 'Browser and Operating System User-Agent strings.')}</span>
                  </li>
                </ul>

                <div className={styles.noteCard}>
                  <p className={styles.cardEyebrow}>{tr('telemetry.note.eyebrow', 'NOTE')}</p>
                  <p className={styles.noteDesc}>
                    {tr('telemetry.note.desc', 'This data is permanently embedded into the cryptographic Audit Certificate and stored in the Data Controller’s connected storage.')}
                  </p>
                </div>
              </article>

              {/* SECTION 3: Artificial Intelligence & Data Isolation */}
              <article
                id="ai"
                ref={(el) => (sectionRefs.current['ai'] = el)}
                className={`${styles.policyBlock} ${activeSection === 'ai' ? styles.activeBlock : styles.inactiveBlock}`}
              >
                <h2 className={styles.policyTitle}>{tr('ai.title', '3. Artificial Intelligence & Data Isolation')}</h2>
                <p className={styles.policyText}>
                  {tr('ai.desc', 'If a Workspace Admin opts into Nexgn AI features (e.g., AI Agreement Summary), document text is securely transmitted to our AI sub-processors via zero-retention enterprise APIs.')}
                </p>

                <div className={styles.aiGuaranteeCard}>
                  <div className={styles.aiIconSquare} aria-hidden="true" />
                  <p className={styles.aiGuaranteeText}>
                    {tr('ai.guarantee', 'Nexgn explicitly guarantees that customer documents, templates, and signatures are never used to train public or foundational AI models.')}
                  </p>
                </div>
              </article>

            </main>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;