import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CtaBanner.module.css';

/* =====================================================================
   CtaBanner: full-width photo call-to-action, reusable on any page.

   <CtaBanner
     image={ctaImg}                        // photo for THIS page (import it, or pass a URL). Optional.
     imagePosition="center 30%"            // CSS background-position (default "center")
     overlay={0.5}                         // 0 to 1, how dark the photo is (default 0.5)
     title="Start signing documents"
     highlight="signing"                   // optional word(s) of the title shown in red
     text="Start signing documents the simpler way..."
     primary={{ label: 'Create your free account', href: 'https://sign.nexgn.cloud/signup' }}
     secondary={{ label: 'Login', href: 'https://sign.nexgn.cloud/login' }}
   />

   primary / secondary accept either  href  (external link) or  to  (in-app route, uses <Link>).
   Everything except `title` is optional, so a page can show just a headline + one button.
   ===================================================================== */

const useInView = () => {
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
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
};

const ActionLink = ({ action, className }) => {
  if (!action || !action.label) return null;
  const { label, href, to, onClick } = action;
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  );
};

// Wraps `highlight` inside `title` in a red span
const renderTitle = (title, highlight) => {
  if (!highlight || typeof title !== 'string') return title;
  const index = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <span className={styles.red}>{title.slice(index, index + highlight.length)}</span>
      {title.slice(index + highlight.length)}
    </>
  );
};

const CtaBanner = ({
  image,
  imagePosition = 'center',
  overlay = 0.5,
  title,
  highlight,
  text,
  primary,
  secondary,
  className = '',
}) => {
  const [ref, inView] = useInView();
  const vars = {
    '--shade': Math.min(Math.max(overlay, 0), 1),
    '--pos': imagePosition,
    ...(image ? { '--img': `url("${image}")` } : {}),
  };

  return (
    <section className={`${styles.cta} ${className}`} style={vars}>
      <div className={styles.photo} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.container}>
        <div ref={ref} className={styles.inner} data-in={inView}>
          <h2 className={styles.title}>{renderTitle(title, highlight)}</h2>
          {text && <p className={styles.text}>{text}</p>}
          {(primary || secondary) && (
            <div className={styles.actions}>
              <ActionLink action={primary} className={styles.btnPrimary} />
              <ActionLink action={secondary} className={styles.btnGhost} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;