import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // 1. Disable browser automatic scroll restoration so GSAP & React Router stay in control
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. If the URL has a #hash (e.g. /legal/terms#api), let the target section scroll into view
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
        ScrollTrigger.refresh();
        return undefined;
      }
    }

    // 3. Immediately snap to the top BEFORE browser paint and BEFORE GSAP calculates triggers
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    // 4. Wipe GSAP ScrollTrigger's cached scroll memory so refresh() doesn't jump back to footer
    ScrollTrigger.clearScrollMemory('manual');
    ScrollTrigger.update();

    // 5. Run once more on next frame + after lazy chunks mount so ScrollTrigger recalculates at y=0
    const rafId = requestAnimationFrame(() => {
      resetScroll();
      ScrollTrigger.refresh();
    });

    const timerId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 180);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;