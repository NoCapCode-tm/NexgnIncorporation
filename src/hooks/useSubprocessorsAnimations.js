import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TA = 'play reverse play reverse';
const U = () => gsap.utils.clamp(14, 90, window.innerWidth / 45);

export default function useSubprocessorsAnimations(rootRef, { lng } = {}) {
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

       // Hero
        const hero = root.querySelector('[data-sub="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-sub="photo"]');
          const card = hero.querySelector('[data-sub="card"]');
          const line = hero.querySelector('[data-sub="cardline"]');
          const words = sel('[data-sub="w"]', hero);
          const [eyebrow, lead, actions] = sel('[data-sub~="hr"]', hero);

          gsap.set(photo, { scale: 1.14 });
          gsap.set(card, { autoAlpha: 0, y: () => U() * 1.6, scale: 0.97 });
          gsap.set(line, { scaleX: 0 });
          gsap.set(words, { yPercent: 125 });
          gsap.set([eyebrow, lead, actions], { autoAlpha: 0, y: () => U() * 0.6 });

          gsap
            .timeline({ defaults: { ease: 'expo.out' }, delay: 0.05 })
            .to(photo, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
            .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 }, 0.1)
            .to(line, { scaleX: 1, duration: 1.9 }, 0.5)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 1 }, 0.4)
            .to(words, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0.5)
            .to(lead, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.0)
            .to(actions, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.15);

          const drift = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
          gsap.to(photo, { yPercent: 9, ease: 'none', scrollTrigger: drift });
          gsap.to(card, { yPercent: -7, ease: 'none', scrollTrigger: drift });
        }

        // HEADERS
        sel('[data-sub="head"]').forEach((head) => {
          const r = sel('[data-sub~="r"]', head);
          const w = sel('[data-sub="w"]', head);
          const [first, ...others] = r;
          gsap.set(r, { autoAlpha: 0, y: () => U() * 0.6 });
          gsap.set(w, { yPercent: 125 });
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: TA },
          });
          if (first) tl.to(first, { autoAlpha: 1, y: 0, duration: 0.9 }, 0);
          tl.to(w, { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.08);
          if (others.length) tl.to(others, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.35);
        });

        // GRID ITEMS / CARDS 
        const items = sel('[data-sub~="item"]');
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