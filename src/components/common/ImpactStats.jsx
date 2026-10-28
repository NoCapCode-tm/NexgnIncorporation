import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from './Reveal';
import { useInView, prefersReducedMotion } from '../../hooks/useInView';
import styles from './ImpactStats.module.css';

/* =====================================================================
   ImpactStats: the three black "impact" cards (2L+ / 150+ / 1000+).
   Used on Home and on /sustainability.  <ImpactStats />
   Pass `items` to override the numbers or labels on a page.
   g1/g2 = position of the two red glows, bx/by = offset of the big cropped number.
   ===================================================================== */

export const DEFAULT_STATS = [
  {
    key: 'paper',
    big: '2L+',
    value: 2,
    suffix: 'L+',
    label: 'Estimated paper sheets saved',
    vars: { '--g1x': '28%', '--g1y': '8%', '--g2x': '86%', '--g2y': '92%', '--bx': '46cqw', '--by': '-13cqw' },
  },
  {
    key: 'hours',
    big: '150+',
    value: 150,
    suffix: '+',
    label: 'Admin Hours Reclaimed',
    vars: { '--g1x': '2%', '--g1y': '10%', '--g2x': '-10%', '--g2y': '110%', '--bx': '9cqw', '--by': '-11cqw' },
  },
  {
    key: 'co2',
    big: '1000+',
    value: 1000,
    suffix: '+',
    label: 'Kg CO₂ Mitigated',
    vars: { '--g1x': '6%', '--g1y': '30%', '--g2x': '100%', '--g2y': '84%', '--bx': '6cqw', '--by': '-12cqw' },
  },
];

// Number that counts up when it scrolls into view
const CountUp = ({ to, suffix = '', duration = 1800 }) => {
  const [ref, inView] = useInView(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setValue(to);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
};

const ImpactStats = ({ items = DEFAULT_STATS, className = '' }) => {
  const { t } = useTranslation();

  return (
    <ul className={`${styles.stats} ${className}`}>
      {items.map((stat, i) => (
        <Reveal
          as="li"
          key={stat.key}
          delay={i * 100}
          className={styles.stat}
          style={stat.vars}
        >
          <span className={styles.big} aria-hidden="true">
            {stat.big}
          </span>
          <p className={styles.value}>
            <CountUp to={stat.value} suffix={stat.suffix} />
          </p>
          <p className={styles.label}>{t(`common.impact.${stat.key}`, stat.label)}</p>
        </Reveal>
      ))}
    </ul>
  );
};

export default ImpactStats;