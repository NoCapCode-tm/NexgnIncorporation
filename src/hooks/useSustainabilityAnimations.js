import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TA = 'play reverse play reverse';
const U = () => gsap.utils.clamp(14, 90, window.innerWidth / 45);

export default function useSustainabilityAnimations(rootRef, { lng } = {}) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { motion } = ctx.conditions;
        if (!motion) return undefined;

        const sel = (s, scope = root) => gsap.utils.toArray(scope.querySelectorAll(s));

        /* ================= HERO ================= */
        const hero = root.querySelector('[data-sus="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-sus="photo"]');
          const lines = sel('[data-sus="line"]', hero);
          const [eyebrow, text] = sel('[data-sus~="hr"]', hero);

          gsap.set(photo, { scale: 1.14 });
          gsap.set(lines, { yPercent: 125 });
          gsap.set([eyebrow, text], { autoAlpha: 0, y: () => U() * 0.6 });

          gsap
            .timeline({ defaults: { ease: 'expo.out' }, delay: 0.05 })
            .to(photo, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
            .to(lines, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.3)
            .to(text, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.7);

          const drift = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
          gsap.to(photo, { yPercent: 9, ease: 'none', scrollTrigger: drift });
        }

        /* ================= SECTION HEADS ================= */
        sel('[data-sus="head"]').forEach((head) => {
          const r = sel('[data-sus~="r"]', head);
          const w = sel('[data-sus="w"]', head);
          const [first, ...others] = r;
          
          gsap.set(r, { autoAlpha: 0, y: () => U() * 0.6 });
          gsap.set(w, { yPercent: 125 });
          
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: TA },
          });
          
          if (first) tl.to(first, { autoAlpha: 1, y: 0, duration: 0.9 }, 0);
          if (w.length) tl.to(w, { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.08);
          if (others.length) tl.to(others, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.35);
        });

        /* ================= MEDIA SLOTS (Artwork) ================= */
        sel('[data-sus="media"]').forEach((m) => {
          gsap.set(m, { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 60%' });
          gsap.to(m, {
            autoAlpha: 1,
            scale: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: m, start: 'top 88%', toggleActions: TA },
          });
        });

        /* ================= GRID ITEMS / CARDS ================= */
        const items = sel('[data-sus~="item"]');
        gsap.set(items, { autoAlpha: 0, y: () => U() * 1.4 });

        const showItems = (els) => {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, overwrite: 'auto' });
        };
        const hideItems = (els) => {
          gsap.to(els, { autoAlpha: 0, y: U() * 1.4, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
        };

        if (items.length) {
          const apply = (els, trigs) => {
            const on = els.filter((_, i) => trigs[i].isActive);
            const off = els.filter((_, i) => !trigs[i].isActive);
            if (on.length) showItems(on);
            if (off.length) hideItems(off);
          };
          ScrollTrigger.batch(items, {
            start: 'top 90%',
            interval: 0.12,
            onEnter: apply,
            onEnterBack: apply,
            onLeave: apply,
            onLeaveBack: apply,
          });
        }
      }
    );

    return () => mm.revert();
  }, [rootRef, lng]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let t = 0;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refresh) : null;
    if (ro) ro.observe(root);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      window.removeEventListener('load', refresh);
    };
  }, [rootRef, lng]);
}