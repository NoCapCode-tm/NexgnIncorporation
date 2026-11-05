import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Reveal from '../common/Reveal';
import styles from './LegalLayout.module.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const LegalText = ({ children }) => <p className={styles.policyText}>{children}</p>;

export const LegalBullets = ({ items = [] }) => (
  <ul className={styles.bulletList}>
    {items.map((item, index) => {
      // Handle both string arrays (Privacy Policy) and object arrays (AUP with icons)
      const text = typeof item === 'string' ? item : item.text;
      const icon = typeof item === 'object' && item.icon ? item.icon : null;
      
      return (
        <li key={index} className={styles.bulletItem}>
          <span className={styles.bulletSquare} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.bulletText}>{text}</span>
        </li>
      );
    })}
  </ul>
);

export const LegalCallout = ({ eyebrow, icon, children }) => (
  <div className={styles.callout}>
    {(eyebrow || icon) && (
      <div className={styles.calloutHead}>
        {icon && (
          <span className={styles.calloutIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        {eyebrow && <p className={styles.calloutEyebrow}>{eyebrow}</p>}
      </div>
    )}
    <p className={styles.calloutText}>{children}</p>
  </div>
);

export const LegalCards = ({ cards = [] }) => (
  <div className={styles.cardGrid}>
    {cards.map((card) => (
      <div key={card.title} className={styles.infoCard}>
        <span className={styles.infoIcon} aria-hidden="true">
          {card.icon}
        </span>
        <p className={styles.infoEyebrow}>{card.eyebrow}</p>
        <h3 className={styles.infoTitle}>{card.title}</h3>
        <p className={styles.infoText}>{card.text}</p>
      </div>
    ))}
  </div>
);

export const LegalGuarantee = ({ icon, children }) => (
  <div className={styles.guarantee}>
    <span className={styles.guaranteeIcon} aria-hidden="true">
      {icon}
    </span>
    <p className={styles.guaranteeText}>{children}</p>
  </div>
);

export const LegalHero = ({ eyebrow, title, lead, align = 'left', children }) => (
  <section className={`${styles.hero} ${align === 'center' ? styles.heroCenter : ''}`}>
    <div className={styles.container}>
      {eyebrow && <p className={`${styles.eyebrow} ${styles.rise}`}>{eyebrow}</p>}
      <h1 className={`${styles.heroTitle} ${styles.rise}`} style={{ '--d': '100ms' }}>
        {title}
      </h1>
      {lead && (
        <p className={`${styles.heroLead} ${styles.rise}`} style={{ '--d': '200ms' }}>
          {lead}
        </p>
      )}
      {children}
    </div>
  </section>
);

const LegalLayout = ({ eyebrow, title, lead, align = 'left', navHeader = 'ON THIS PAGE', sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const sectionRefs = useRef({});
  const navRefs = useRef({});
  const navListRef = useRef(null);
  const isClickScrolling = useRef(false);
  const clickTimer = useRef(null);
  const stopScrollWatch = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -40% 0px', threshold: 0.05 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.some((s) => s.id === hash)) {
      setActiveSection(hash);
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveIndicator = useCallback(() => {
    const item = navRefs.current[activeSection];
    const list = navListRef.current;
    if (!item || !list) return;
    const horizontal = getComputedStyle(list).flexDirection === 'row';
    setIndicator(
      horizontal
        ? { left: item.offsetLeft, width: item.offsetWidth }
        : { top: item.offsetTop, height: item.offsetHeight }
    );
    if (horizontal) {
      list.scrollTo({
        left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  }, [activeSection]);

  useLayoutEffect(() => {
    moveIndicator();
    window.addEventListener('resize', moveIndicator);
    // webfonts change the width/height of the nav items after first paint
    let alive = true;
    document.fonts?.ready?.then(() => alive && moveIndicator()).catch(() => {});
    return () => {
      alive = false;
      window.removeEventListener('resize', moveIndicator);
    };
  }, [moveIndicator]);

  useEffect(
    () => () => {
      clearTimeout(clickTimer.current);
      stopScrollWatch.current?.();
    },
    []
  );

  const scrollToSection = (id) => {
    stopScrollWatch.current?.();
    isClickScrolling.current = true;
    setActiveSection(id);
    window.history.replaceState(null, '', `#${id}`);

    const element = document.getElementById(id);
    if (element) {
      const offset = parseFloat(getComputedStyle(element).getPropertyValue('scroll-margin-top')) || 120;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }

    // Keep the scroll-spy paused until the smooth scroll has really stopped. A fixed timeout is too short
    // on long pages: the observer would start flipping through every section on the way down.
    const done = () => {
      clearTimeout(clickTimer.current);
      window.removeEventListener('scroll', onScroll);
      stopScrollWatch.current = null;
      isClickScrolling.current = false;
    };
    const onScroll = () => {
      clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(done, 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    stopScrollWatch.current = done;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(done, 400); // no scroll event at all: already in place
  };

  const index = Math.max(
    0,
    sections.findIndex((s) => s.id === activeSection)
  );
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.page}>
      <LegalHero eyebrow={eyebrow} title={title} lead={lead} align={align} />

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <aside className={styles.sidebar}>
              <div className={styles.stickyNav}>
                <div className={styles.navTop}>
                  <p className={styles.navHeader}>{navHeader}</p>
                  <p className={styles.counter} aria-hidden="true">
                    {pad(index + 1)} / {pad(sections.length)}
                  </p>
                </div>

                <nav className={styles.navList} ref={navListRef} aria-label={navHeader}>
                  <span
                    className={styles.indicator}
                    aria-hidden="true"
                    style={
                      indicator.width !== undefined
                        ? { '--x': `${indicator.left}px`, '--w': `${indicator.width}px` }
                        : { '--y': `${indicator.top}px`, '--h': `${indicator.height}px` }
                    }
                  />
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      ref={(el) => {
                        navRefs.current[section.id] = el;
                      }}
                      type="button"
                      className={`${styles.navItem} ${activeSection === section.id ? styles.activeNav : ''}`}
                      aria-current={activeSection === section.id ? 'true' : undefined}
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.navLabel}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* a div, not <main>: AppRouter already wraps every page in <main> */}
            <div className={styles.mainContent}>
              {sections.map((section, i) => (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className={styles.article}
                >
                  <Reveal delay={Math.min(i, 3) * 80}>
                    <div
                      className={`${styles.policyBlock} ${
                        activeSection === section.id ? styles.activeBlock : styles.inactiveBlock
                      }`}
                    >
                      <h2 className={styles.policyTitle}>{section.title}</h2>
                      {section.body}
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalLayout;