import React, { useEffect, useState } from 'react';
import NexgnLoader from './NexgnLoader';

/* Suspense fallback: shows the Nexgn loader while a lazy page (or the i18n file) is loading.
   It has no real download progress, so the fill eases towards 92% and the page replaces it
   the moment it is ready. Nothing is shown for the first `delay` ms, so fast loads don't flash. */
const PageLoader = ({ delay = 150 }) => {
  const [visible, setVisible] = useState(delay === 0);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    const tick = setInterval(() => {
      // each step covers 12% of the remaining distance to 92
      setProgress((p) => p + (92 - p) * 0.12);
    }, 180);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, [delay]);

  if (!visible) return null;
  return <NexgnLoader progress={progress} show />;
};

export default PageLoader;