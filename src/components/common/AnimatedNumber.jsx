import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A number that counts to its new value instead of jumping (prices, savings, calculator results).
 *
 * - While counting it shows whole numbers; the last frame is always the exact `format(value)`.
 * - React renders the final text, so the first paint, SSR and reduced-motion users get the right
 *   number with no animation at all.
 */
const AnimatedNumber = ({ value, format = (v) => String(Math.round(v)), duration = 0.8, className }) => {
  const ref = useRef(null);
  const shown = useRef(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (reduced() || shown.current === value) {
      shown.current = value;
      return undefined;
    }

    const o = { v: shown.current };
    el.textContent = format(Math.round(o.v)); // undo React's final text before the first frame
    const tween = gsap.to(o, {
      v: value,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        shown.current = o.v;
        el.textContent = format(Math.round(o.v));
      },
      onComplete: () => {
        shown.current = value;
        el.textContent = format(value);
      },
    });
    return () => {
      tween.kill();
      shown.current = value;
      el.textContent = format(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
};

export default AnimatedNumber;
