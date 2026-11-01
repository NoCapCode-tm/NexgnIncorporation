import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer animations (GSAP + ScrollTrigger).
 *
 * Markup contract (data-f attributes inside the footer root):
 *   col      one link column (heading + links animate as a group)
 *   rule     the 1px divider above the bottom bar
 *   letter   one wordmark character (wordmark has overflow: hidden)
 *   bottom   an item in the bottom bar
 *   link     footer text link          (hover: nudge + colour)
 *   social   social icon button        (hover: magnet + lift)
 *   built    "NoCapCode Inc." link      (hover: animated underline)
 *   lang     language picker label      (hover: colour + globe spin)
 *
 * Every reveal uses toggleActions "play reverse play reverse", so it plays
 * scrolling down AND scrolling back up. Nothing is hidden in CSS: initial states
 * are set by GSAP before paint, so reduced-motion users just see static content.
 */
export default function useFooterAnimations(rootRef, routeKey) {
  /* ---------- scroll reveals ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = (name) => gsap.utils.toArray(root.querySelectorAll(`[data-f="${name}"]`));
      const toggle = 'play reverse play reverse';

      /* 1. link columns: heading drops in, links cascade */
      const cols = q('col');
      const colTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          toggleActions: toggle,
          invalidateOnRefresh: true,
        },
      });
      // Set the hidden state explicitly: staggered "from" tweens only pre-render
      // their first target, so the later ones would flash visible before the trigger.
      gsap.set(cols.map((c) => c.querySelector('h3')), { autoAlpha: 0, y: 18 });
      gsap.set(cols.flatMap((c) => [...c.querySelectorAll('li')]), { autoAlpha: 0, y: 22 });
      cols.forEach((col, i) => {
        const at = i * 0.08;
        colTl.to(col.querySelector('h3'), { autoAlpha: 1, y: 0, duration: 0.7 }, at);
        colTl.to(
          col.querySelectorAll('li'),
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.055 },
          at + 0.12,
        );
      });

      /* 2. wordmark: letters rise out of the baseline */
      const letters = q('letter');
      const word = root.querySelector('[data-f="word"]');
      if (letters.length && word) {
        const wordTl = gsap.timeline({
          scrollTrigger: {
            trigger: word,
            start: 'top 94%',
            toggleActions: toggle,
            invalidateOnRefresh: true,
          },
        });
        // one tween owns yPercent + rotation; the red x spins in from further back
        gsap.set(letters, {
          yPercent: 115,
          rotation: (i, el) => (el.dataset.accent === 'true' ? -120 : 6),
          transformOrigin: '0% 100%',
        });
        wordTl.to(letters, {
          yPercent: 0,
          rotation: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
        });
        // ...and a separate tween owns the x's scale (different property, no clash)
        const accent = letters.find((l) => l.dataset.accent === 'true');
        if (accent) {
          gsap.set(accent, { scale: 0.55 });
          wordTl.to(accent, { scale: 1, duration: 1.1, ease: 'back.out(1.6)' }, 0.1);
        }

        /* subtle scroll-linked drift so the wordmark never feels static */
        gsap.fromTo(
          word,
          { y: '-6%' },
          {
            y: '0%',
            ease: 'none',
            scrollTrigger: {
              trigger: word,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /* 3. divider draws left to right, bottom bar fades up */
      const rule = root.querySelector('[data-f="rule"]');
      const bottoms = q('bottom');
      if (rule) {
        const bottomTl = gsap.timeline({
          scrollTrigger: {
            trigger: rule,
            start: 'top 98%',
            toggleActions: toggle,
            invalidateOnRefresh: true,
          },
        });
        gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' });
        bottomTl.to(rule, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' });
        if (bottoms.length) {
          gsap.set(bottoms, { autoAlpha: 0, y: 16 });
          bottomTl.to(
            bottoms,
            { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
            0.25,
          );
        }
      }
    });

    return () => mm.revert();
  }, [rootRef]);

  /* ---------- hover micro-interactions (mouse / trackpad only) ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
      () => {
        const cs = getComputedStyle(root);
        const muted = cs.getPropertyValue('--muted').trim() || '#9aa0a9';
        const text = cs.getPropertyValue('--text').trim() || '#fafbfb';
        const line = cs.getPropertyValue('--line').trim() || '#262a33';
        const q = (name) => gsap.utils.toArray(root.querySelectorAll(`[data-f="${name}"]`));
        const off = [];
        const on = (el, type, fn) => {
          el.addEventListener(type, fn);
          off.push(() => el.removeEventListener(type, fn));
        };

        /* text links: slide right and brighten */
        q('link').forEach((el) => {
          on(el, 'pointerenter', () =>
            gsap.to(el, { x: 6, color: text, duration: 0.35, ease: 'power3.out', overwrite: 'auto' }),
          );
          on(el, 'pointerleave', () =>
            gsap.to(el, {
              x: 0,
              color: muted,
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(el, { clearProps: 'color,x,transform' }),
            }),
          );
        });

        /* social buttons: magnet + lift */
        q('social').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
          on(el, 'pointerenter', () =>
            gsap.to(el, {
              scale: 1.1,
              color: text,
              borderColor: muted,
              backgroundColor: 'rgba(255,255,255,0.06)',
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto',
            }),
          );
          on(el, 'pointermove', (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.28 - 3);
          });
          on(el, 'pointerleave', () => {
            xTo(0);
            yTo(0);
            gsap.to(el, {
              scale: 1,
              color: muted,
              borderColor: line,
              backgroundColor: 'rgba(255,255,255,0)',
              duration: 0.5,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(el, { clearProps: 'color,borderColor,backgroundColor,scale' }),
            });
          });
        });

        /* NoCapCode link: colour + underline that draws in */
        q('built').forEach((el) => {
          gsap.set(el, { '--u': '0%' });
          on(el, 'pointerenter', () =>
            gsap.to(el, { color: text, '--u': '100%', duration: 0.45, ease: 'power3.out', overwrite: 'auto' }),
          );
          on(el, 'pointerleave', () =>
            gsap.to(el, {
              color: muted,
              '--u': '0%',
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(el, { clearProps: 'color' }),
            }),
          );
        });

        /* language picker: brighten + globe spin */
        q('lang').forEach((el) => {
          const globe = el.querySelector('svg');
          on(el, 'pointerenter', () => {
            gsap.to(el, { color: text, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            if (globe) gsap.to(globe, { rotation: '+=360', duration: 0.9, ease: 'power3.inOut' });
          });
          on(el, 'pointerleave', () =>
            gsap.to(el, {
              color: muted,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(el, { clearProps: 'color' }),
            }),
          );
        });

        // returned function runs when the media query stops matching or on revert
        return () => off.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, [rootRef]);

  /* ---------- keep trigger positions right when the page height changes ---------- */
  useLayoutEffect(() => {
    let raf = 0;
    let timer = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = requestAnimationFrame(() => {
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
    };

    refresh(); // route changed: lazy page content is mounting

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(refresh);
      ro.observe(document.body);
    }
    // webfonts (MuseoModerno, DM Sans) change the wordmark and column heights
    document.fonts?.ready?.then(refresh).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro?.disconnect();
    };
  }, [routeKey]);
}