import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './Refunds.module.css';

const POLICIES = [
  {
    id: 'billing',
    navLabel: '1. Subscription Billing (Razorpay)',
    title: '1. Billing Cycles',
    content: 'Nexgn subscriptions are billed in advance on a monthly or annual basis via Razorpay. By upgrading to a paid tier, you authorize Nexgn to automatically charge your payment method at the beginning of each billing cycle.'
  },
  {
    id: 'cancellation',
    navLabel: '2. Cancellations & Proration',
    title: '2. Canceling Your Workspace',
    content: 'You may cancel your subscription at any time from your Workspace Settings. Upon cancellation, your workspace will retain its paid features until the end of your current billing cycle. Nexgn does not provide prorated refunds for partial months of service.'
  },
  {
    id: 'overage',
    navLabel: '3. Envelope Limits & Overage',
    title: '3. Plan Limits & Overage',
    content: 'If you are on the Free (19 envelopes) or Starter (49 envelopes) tier, you will be blocked from sending further requests once your limit is reached. Limits reset on the 1st day of your billing cycle. Unused envelopes do not roll over to the next month. To remove limits immediately, you must upgrade to the Business tier.'
  }
];

const Refunds = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.refunds.${key}`, fallback);

  const [activeSection, setActiveSection] = useState(POLICIES[0].id);
  const sectionRefs = useRef({});
  const isClickScrolling = useRef(false);

  // Intersection Observer to automatically highlight sections as the user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip auto-updating if we are currently smoothly scrolling from a click
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

  // Handle clicking the sidebar links
  const scrollToSection = (id) => {
    isClickScrolling.current = true;
    setActiveSection(id);
    
    const element = document.getElementById(id);
    if (element) {
      // Offset for the sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Re-enable scroll spy after the smooth scroll finishes
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const seoTitle = tr('seo.title', 'Refund & Cancellation Policy | Nexgn Legal Hub');
  const seoDescription = tr('seo.description', 'Read the Nexgn refund, cancellation, and proration policies for our electronic signature platform.');

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/refunds" />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{tr('hero.eyebrow', 'LEGAL HUB')}</p>
          <h1 className={styles.heroTitle}>
            {tr('hero.title', 'Refund & Cancellation\nPolicy')}
          </h1>
        </div>
      </section>

      {/* ============ CONTENT GRID ============ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Sidebar (Sticky) */}
            <aside className={styles.sidebar}>
              <div className={styles.stickyNav}>
                <p className={styles.navHeader}>{tr('nav.header', 'ON THIS PAGE')}</p>
                <nav className={styles.navList}>
                  {POLICIES.map((policy) => (
                    <button
                      key={policy.id}
                      className={`${styles.navItem} ${activeSection === policy.id ? styles.activeNav : ''}`}
                      onClick={() => scrollToSection(policy.id)}
                    >
                      {tr(`policy.${policy.id}.navLabel`, policy.navLabel)}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content (Fading effect applied here) */}
            <main className={styles.mainContent}>
              {POLICIES.map((policy) => {
                const isActive = activeSection === policy.id;
                
                return (
                  <article
                    key={policy.id}
                    id={policy.id}
                    ref={(el) => (sectionRefs.current[policy.id] = el)}
                    className={`${styles.policyBlock} ${isActive ? styles.activeBlock : styles.inactiveBlock}`}
                  >
                    <h2 className={styles.policyTitle}>
                      {tr(`policy.${policy.id}.title`, policy.title)}
                    </h2>
                    <p className={styles.policyText}>
                      {tr(`policy.${policy.id}.content`, policy.content)}
                    </p>
                  </article>
                );
              })}
            </main>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Refunds;