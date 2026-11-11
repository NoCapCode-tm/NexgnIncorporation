import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import useProductAnimations from '../../hooks/useProductAnimations';
import styles from './ProductLayout.module.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Words = ({ text }) => {
  const lines = String(text).split('\n');
  return lines.map((line, lIdx) => {
    const words = line.split(' ').filter(Boolean);
    return (
      <React.Fragment key={`line-${lIdx}`}>
        {words.map((word, wIdx) => (
          <React.Fragment key={`${word}-${wIdx}`}>
            <span className={styles.w}>
              <span className={styles.wi} data-pl="hero-word">
                {word}
              </span>
            </span>
            {wIdx < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
        {lIdx < lines.length - 1 ? <br /> : null}
      </React.Fragment>
    );
  });
};

/* =====================================================================
   Reusable Product & Solution Section Primitives
   ===================================================================== */

export const ProductText = ({ children, strong = false }) => (
  <p className={`${styles.bodyText} ${strong ? styles.bodyTextStrong : ''}`}>{children}</p>
);

export const ProductSubSection = ({ title, children, noBorder = false }) => (
  <div
    className={`${styles.subSection} ${noBorder ? styles.subSectionNoBorder : ''}`}
    data-pl="sub"
  >
    {title && <h3 className={styles.subTitle}>{title}</h3>}
    {children}
  </div>
);

export const ProductDarkBanner = ({ icon, children }) => (
  <div className={styles.darkBanner} data-pl="banner">
    <span className={styles.darkBannerIcon} data-pl="banner-icon" aria-hidden="true">
      {icon}
    </span>
    <p className={styles.darkBannerText}>{children}</p>
  </div>
);

export const SignatureStylesGrid = ({ items = [] }) => (
  <div className={styles.sigGrid} data-pl="sig-grid">
    {items.map((item) => (
      <div key={item.label} className={styles.sigCard} data-pl="sig-card">
        <span className={styles.sigLabel}>{item.label}</span>
        <p className={`${styles.sigSample} ${styles[item.fontClass] || ''}`}>{item.sample}</p>
      </div>
    ))}
  </div>
);

export const StatusTrackRow = ({ steps = [] }) => (
  <ul className={styles.statusRow} data-pl="status-row">
    {steps.map((step) => (
      <li key={step.label} className={styles.statusItem} data-pl="status-item">
        <span className={styles.statusIconBox} data-pl="status-box" aria-hidden="true">
          {step.icon}
        </span>
        <span className={styles.statusLabel}>{step.label}</span>
      </li>
    ))}
  </ul>
);

export const WidgetPillsGrid = ({ widgets = [] }) => (
  <ul className={styles.widgetGrid} data-pl="widget-grid">
    {widgets.map((w) => (
      <li key={w.label} className={styles.widgetPill} data-pl="widget-pill">
        <span className={styles.widgetIcon} aria-hidden="true">
          {w.icon}
        </span>
        <span className={styles.widgetLabel}>{w.label}</span>
      </li>
    ))}
  </ul>
);


/* Icon cards (Before/After: Payment Terms, Termination Clauses, ...) */
export const FeatureCardsGrid = ({ items = [], columns = 3 }) => (
  <ul className={styles.featGrid} data-pl="feat-grid" data-cols={columns}>
    {items.map((item) => (
      <li key={item.label} className={styles.featCard} data-pl="feat-card">
        <span className={styles.featIcon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.featLabel}>{item.label}</span>
      </li>
    ))}
  </ul>
);

/* Row of round flags + labels (Global Legality) */
export const FlagList = ({ items = [] }) => (
  <ul className={styles.flagList} data-pl="flag-list">
    {items.map((item) => (
      <li key={item.label} className={styles.flagItem} data-pl="flag-item">
        <span className={styles.flag} aria-hidden="true">
          {item.flag}
        </span>
        <span className={styles.flagLabel}>{item.label}</span>
      </li>
    ))}
  </ul>
);

/* Red call-to-action button (router link) */
export const ProductCta = ({ to, icon, children }) => (
  <Link to={to} className={styles.cta} data-pl="note">
    <span>{children}</span>
    {icon && (
      <span className={styles.ctaIcon} aria-hidden="true">
        {icon}
      </span>
    )}
  </Link>
);

/* Light note / disclaimer banner */
export const ProductNote = ({ icon, children }) => (
  <div className={styles.note} data-pl="note">
    <span className={styles.noteIcon} data-pl="note-icon" aria-hidden="true">
      {icon}
    </span>
    <p className={styles.noteText}>{children}</p>
  </div>
);

/* Chat example: alternating "USER" / "NEXGN AI" bubbles */
export const ChatExampleGrid = ({ messages = [] }) => (
  <div className={styles.chatGrid} data-pl="chat-grid">
    {messages.map((m, i) => (
      <div key={i} className={styles.chatCard} data-pl="chat-card">
        <span className={styles.chatIcon} aria-hidden="true">
          {m.icon}
        </span>
        <div className={styles.chatBody}>
          <p className={styles.chatRole}>{m.role}</p>
          <p className={styles.chatText}>{m.text}</p>
        </div>
      </div>
    ))}
  </div>
);


/* Plain bullet list (Template Highlight) */
export const ProductBulletList = ({ items = [] }) => (
  <ul className={styles.bulletList} data-pl="check-list">
    {items.map((text) => (
      <li key={text} className={styles.bulletItem} data-pl="check-item">
        {text}
      </li>
    ))}
  </ul>
);

/* Horizontal process flow: pill -> pill -> pill (stacks on phones) */
export const FlowSteps = ({ steps = [] }) => (
  <ol className={styles.flow} data-pl="flow">
    {steps.map((step, i) => (
      <React.Fragment key={step.label}>
        <li className={styles.flowStep} data-pl="flow-step">
          <span className={styles.flowIcon} aria-hidden="true">
            {step.icon}
          </span>
          <span className={styles.flowLabel}>{step.label}</span>
        </li>
        {i < steps.length - 1 && (
          <li className={styles.flowArrow} data-pl="flow-arrow" aria-hidden="true">
            <FiArrowRight />
          </li>
        )}
      </React.Fragment>
    ))}
  </ol>
);

export const ProductStepList = ({ steps = [] }) => (
  <ol className={styles.stepList} data-pl="step-list">
    {steps.map((s, idx) => (
      <li key={s.title} className={styles.stepItem} data-pl="step-item">
        <span className={styles.stepSquare} aria-hidden="true">
          {s.icon}
        </span>
        <div className={styles.stepBody}>
          {s.step !== false && (
            <p className={styles.stepEyebrow}>{s.step || `STEP ${String(idx + 1).padStart(2, '0')}`}</p>
          )}
          <p className={styles.stepTitle}>{s.title}</p>
        </div>
      </li>
    ))}
  </ol>
);

export const ProductCheckList = ({ items = [] }) => (
  <ul className={styles.checkList} data-pl="check-list">
    {items.map((item, idx) => {
      const text = typeof item === 'string' ? item : item.text;
      const icon = typeof item === 'object' && item.icon ? item.icon : null;
      return (
        <li key={idx} className={styles.checkItem} data-pl="check-item">
          <span className={styles.checkDot} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.checkText}>{text}</span>
        </li>
      );
    })}
  </ul>
);

export const ProductHero = ({ eyebrow, title, titleAccent, lead, align = 'center', children }) => (
  <section
    className={`${styles.hero} ${align === 'center' ? styles.heroCenter : ''}`}
    data-pl="hero"
  >
    <div className={styles.heroGlow} data-pl="hero-glow" aria-hidden="true" />
    <div className={styles.container}>
      {eyebrow && (
        <p className={styles.eyebrow} data-pl="hero-eyebrow">
          {eyebrow}
        </p>
      )}
      <h1 className={styles.heroTitle}>
        <Words text={title} />
        {titleAccent && (
          <>
            <br />
            <span className={styles.heroAccent}>
              <Words text={titleAccent} />
            </span>
          </>
        )}
      </h1>
      {lead && (
        <p className={styles.heroLead} data-pl="hero-lead">
          {lead}
        </p>
      )}
      {children}
    </div>
  </section>
);

/* =====================================================================
   Helper: Resolve target section ID from current URL pathname or #hash
   ===================================================================== */
const resolveTargetSectionId = (pathname, hash, sectionsList) => {
  if (!sectionsList || !sectionsList.length) return null;

  // 1. Check #hash first (e.g. /en/products#document-editor)
  const cleanHash = (hash || '').replace(/^#/, '').toLowerCase();
  if (cleanHash) {
    const byHash = sectionsList.find(
      (s) =>
        s.id.toLowerCase() === cleanHash ||
        (s.routeSlug && s.routeSlug.toLowerCase() === cleanHash) ||
        (Array.isArray(s.aliases) && s.aliases.some((a) => a.toLowerCase() === cleanHash))
    );
    if (byHash) return byHash.id;
  }

  // 2. Check URL path slug (e.g. /en/products/document-editor)
  const parts = (pathname || '').split('/').filter(Boolean);
  const lastSlug = (parts[parts.length - 1] || '').toLowerCase();

  // Bare hub path (/en/products or /en/solutions) -> stay at top of page
  if (!lastSlug || lastSlug === 'products' || lastSlug === 'solutions') {
    return null;
  }

  const bySlug = sectionsList.find(
    (s) =>
      s.id.toLowerCase() === lastSlug ||
      (s.routeSlug && s.routeSlug.toLowerCase() === lastSlug) ||
      (Array.isArray(s.aliases) && s.aliases.some((a) => a.toLowerCase() === lastSlug))
  );

  return bySlug ? bySlug.id : null;
};

/* =====================================================================
   Master Product / Solution Scroll-Spy Layout
   ===================================================================== */

const ProductLayout = ({
  eyebrow = 'PRODUCTS',
  title,
  titleAccent,
  lead,
  align = 'center',
  navHeader = 'ON THIS PAGE',
  sections = [],
}) => {
  const location = useLocation();
  const { lng } = useParams();
  const rootRef = useRef(null);
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  const [activeSection, setActiveSection] = useState(() => {
    const matched = resolveTargetSectionId(location.pathname, location.hash, sections);
    return matched || sections[0]?.id || '';
  });

  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const sectionRefs = useRef({});
  const navRefs = useRef({});
  const navListRef = useRef(null);
  const isClickScrolling = useRef(false);
  const clickTimer = useRef(null);
  const stopScrollWatch = useRef(null);

  useProductAnimations(rootRef, [lng]);

  // Compute exact scrollY for a section ID
  const getTargetScrollY = (id) => {
    const element = sectionRefs.current[id] || document.getElementById(id);
    if (!element) return null;
    const offset =
      parseFloat(getComputedStyle(element).getPropertyValue('scroll-margin-top')) || 110;
    return Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
  };

  // Sidebar click handler: smooth scroll to section + update URL hash
  const handleSidebarClick = useCallback((id) => {
    const y = getTargetScrollY(id);
    if (y === null) return;

    stopScrollWatch.current?.();
    isClickScrolling.current = true;
    setActiveSection(id);
    window.history.replaceState(null, '', `#${id}`);

    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

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
    clickTimer.current = setTimeout(done, 600);
  }, []);

  // Scroll spy: section crossing upper viewport becomes active during manual user scroll
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !sectionsRef.current.length) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-12% 0px -45% 0px', threshold: 0.05 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Deep-link & Navbar/Footer Sub-route Scroll Handler
  // Beats <ScrollToTop /> and GSAP ScrollTrigger.refresh() by enforcing the scroll target across frames
  useEffect(() => {
    const targetId = resolveTargetSectionId(
      location.pathname,
      location.hash,
      sectionsRef.current
    );

    if (!targetId) {
      if (sectionsRef.current[0]) {
        setActiveSection(sectionsRef.current[0].id);
      }
      return undefined;
    }

    // Lock scroll-spy immediately so IntersectionObserver cannot override activeSection
    stopScrollWatch.current?.();
    isClickScrolling.current = true;
    setActiveSection(targetId);

    const scrollNow = (behavior) => {
      const y = getTargetScrollY(targetId);
      if (y !== null && Math.abs(window.scrollY - y) > 8) {
        window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : behavior });
      }
    };

    // Stage 1: After <ScrollToTop /> finishes on the current tick
    const t1 = setTimeout(() => scrollNow('smooth'), 40);
    // Stage 2: After lazy chunk / GSAP ScrollTrigger initial measurement (200ms)
    const t2 = setTimeout(() => scrollNow('smooth'), 240);
    // Stage 3: Final verification & unlock scroll-spy
    const t3 = setTimeout(() => {
      scrollNow('auto');
      isClickScrolling.current = false;
    }, 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      isClickScrolling.current = false;
    };
  }, [location.pathname, location.hash, location.key]);

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

  const index = Math.max(
    0,
    sections.findIndex((s) => s.id === activeSection)
  );
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.progress} data-pl="progress" aria-hidden="true" />
      <ProductHero eyebrow={eyebrow} title={title} titleAccent={titleAccent} lead={lead} align={align} />

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Sticky Left Sidebar (Chip bar on mobile) */}
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
                      className={`${styles.navItem} ${
                        activeSection === section.id ? styles.activeNav : ''
                      }`}
                      aria-current={activeSection === section.id ? 'true' : undefined}
                      onClick={() => handleSidebarClick(section.id)}
                    >
                      {section.navLabel}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className={styles.mainContent}>
              {sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className={styles.article}
                >
                  <div
                    className={`${styles.productBlock} ${
                      activeSection === section.id ? styles.activeBlock : styles.inactiveBlock
                    }`}
                  >
                    <header className={styles.sectionHeader} data-pl="head">
                      <h2 className={styles.sectionTitle}>{section.title}</h2>
                      {section.subtitle && (
                        <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                      )}
                    </header>
                    {section.body}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductLayout;