import { useEffect, useId, useMemo, useState } from "react";
import styles from "./NexgnLoader.module.css";

/**
 * NexgnLoader
 * Hollow "Nexgn" wordmark (MuseoModerno) with a layered red wave that rises inside the letters.
 *
 * Props
 *  - progress     number 0-100. Drives how high the wave fills. Default 0.
 *  - show         boolean. true = overlay visible, false = fades out. Default true.
 *  - showPercent  boolean. Show the "Loading 42%" label. Default true.
 *
 * Font: add this once to your index.html / layout <head>
 *  <link rel="preconnect" href="https://fonts.googleapis.com">
 *  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 *  <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@300;400&display=swap" rel="stylesheet">
 */

const EMPTY_Y = 215; // wave sits below the descender of the "g"
const FULL_Y = 8; // wave crests clear the top of the letters

// One full wavelength per slide step, so the loop is seamless.
function wavePath(amp, wl, phase, closed = true, width = 1280) {
  let d = `M0 ${(amp * Math.sin(phase)).toFixed(2)}`;
  for (let x = 8; x <= width; x += 8) {
    d += ` L${x} ${(amp * Math.sin((2 * Math.PI * x) / wl + phase)).toFixed(2)}`;
  }
  return closed ? `${d} L${width} 400 L0 400 Z` : d;
}

export default function NexgnLoader({ progress = 0, show = true, showPercent = true }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `nx-clip-${uid}`;
  const brightId = `nx-bright-${uid}`;
  const deepId = `nx-deep-${uid}`;

  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontReady(true);
    if (document.fonts && document.fonts.load) {
      Promise.race([
        document.fonts.load('400 150px "MuseoModerno"'),
        new Promise((r) => setTimeout(r, 2500)),
      ]).then(done, done);
    } else {
      done();
    }
    return () => {
      alive = false;
    };
  }, []);

  const paths = useMemo(
    () => ({
      back: wavePath(11, 320, 2.4),
      mid: wavePath(8, 256, 0.9),
      front: wavePath(7, 320, 0),
      crest: wavePath(7, 320, 0, false),
    }),
    []
  );

  const p = Math.min(100, Math.max(0, progress));
  const y = EMPTY_Y + ((FULL_Y - EMPTY_Y) * p) / 100;

  return (
    <div
      className={`${styles.overlay} ${show ? "" : styles.leaving} ${fontReady ? styles.ready : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Nexgn"
    >
      <svg className={styles.svg} viewBox="0 0 640 220" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <text className={styles.word} x="320" y="140" textAnchor="middle">
              Nexgn
            </text>
          </clipPath>

          {/* Bright liquid: light crest, brand red, then a deeper body */}
          <linearGradient id={brightId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF5159" />
            <stop offset="0.08" stopColor="#ED040F" />
            <stop offset="0.5" stopColor="#C4000B" />
            <stop offset="1" stopColor="#8E0008" />
          </linearGradient>

          {/* Back layer: darker so it reads as depth */}
          <linearGradient id={deepId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C4000B" />
            <stop offset="1" stopColor="#5E0005" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <g className={styles.level} style={{ transform: `translateY(${y}px)` }}>
            <g className={`${styles.wave} ${styles.back}`}>
              <path d={paths.back} fill={`url(#${deepId})`} fillOpacity="0.75" />
            </g>
            <g className={`${styles.wave} ${styles.mid}`}>
              <path d={paths.mid} fill={`url(#${brightId})`} fillOpacity="0.7" />
            </g>
            <g className={`${styles.wave} ${styles.front}`}>
              <path d={paths.front} fill={`url(#${brightId})`} />
              {/* soft highlight along the crest */}
              <path d={paths.crest} className={styles.crest} />
            </g>
          </g>
        </g>

        <text className={`${styles.word} ${styles.outline}`} x="320" y="140" textAnchor="middle">
          Nexgn
        </text>
      </svg>

      {showPercent && <div className={styles.status}>Loading {Math.round(p)}%</div>}
    </div>
  );
}
