import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import styles from './AUP.module.css';


   // Scroll Reveal Helpers

const useInView = (threshold = 0.1) => {
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


   // Policy Data

const POLICIES = [
  {
    id: 'prohibited',
    navLabel: '1. Prohibited Activities',
    title: '1. Unlawful and Harmful Use',
    content: 'You may not use Nexgn to process, store, or transmit any agreements that:',
    bullets: [
      'Facilitate illegal activities, fraud, or money laundering.',
      'Contain malicious code, malware, or viruses disguised as PDFs.',
      'Involve the sale of illegal goods, weapons, or controlled substances.'
    ]
  },
  {
    id: 'spam',
    navLabel: '2. Spam & Abuse Prevention',
    title: '2. Signature Request Spam',
    content: 'Nexgn relies on a high email deliverability reputation. You may not use the platform to send unsolicited signature requests (spam) or to harass individuals. Accounts found to be mass-emailing unconsenting recipients will be immediately terminated without a refund.',
    bullets: []
  }
];


    // Page Component

const AUP = () => {
  const { t } = useTranslation();
  const tr = (key, fallback) => t(`legal.aup.${key}`, fallback);

  // Scroll Spy State
  const [activeSection, setActiveSection] = useState(POLICIES[0].id);
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
      const y = element.getBoundingClientRect().top + window.scrollY - 120; // 120px offset for sticky nav
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const seoTitle = tr('seo.title', 'Acceptable Use Policy | Nexgn Legal Hub');
  const seoDescription = tr('seo.description', 'Review the Nexgn Acceptable Use Policy outlining prohibited activities, anti-spam rules, and compliance standards.');

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/legal/acceptable-use" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Reveal delay={0}>
            <p className={styles.eyebrow}>{tr('hero.eyebrow', 'LEGAL HUB')}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className={styles.heroTitle}>
              {tr('hero.title', 'Acceptable Use\nPolicy')}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className={styles.heroLead}>
              {tr('hero.lead', 'Our global support and engineering teams\nare ready to assist you.')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 2. CONTENT GRID ============ */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Sidebar (Sticky) */}
            <aside className={styles.sidebar}>
              <Reveal delay={300} className={styles.stickyNav}>
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
              </Reveal>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
              {POLICIES.map((policy, index) => {
                const isActive = activeSection === policy.id;
                
                return (
                  <article
                    key={policy.id}
                    id={policy.id}
                    ref={(el) => (sectionRefs.current[policy.id] = el)}
                    className={styles.articleWrapper}
                  >
                    {/* The Reveal handles the initial load animation, the inner div handles scroll-spy fading */}
                    <Reveal delay={400 + (index * 100)}>
                      <div className={`${styles.policyBlock} ${isActive ? styles.activeBlock : styles.inactiveBlock}`}>
                        <h2 className={styles.policyTitle}>
                          {tr(`policy.${policy.id}.title`, policy.title)}
                        </h2>
                        <p className={styles.policyText}>
                          {tr(`policy.${policy.id}.content`, policy.content)}
                        </p>

                        {/* Render custom bullet points if they exist */}
                        {policy.bullets && policy.bullets.length > 0 && (
                          <ul className={styles.bulletList}>
                            {policy.bullets.map((bullet, i) => (
                              <li key={i} className={styles.bulletItem}>
                                <div className={styles.bulletSquare} aria-hidden="true" />
                                <span className={styles.bulletText}>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Reveal>
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

export default AUP;