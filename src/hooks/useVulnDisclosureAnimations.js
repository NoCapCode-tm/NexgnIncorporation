import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TA = 'play reverse play reverse';
const U = () => gsap.utils.clamp(14, 90, window.innerWidth / 45);

export default function useVulnDisclosureAnimations(rootRef, { lng } = {}) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { motion, fine } = ctx.conditions;
        if (!motion) return undefined;

        const cs = getComputedStyle(root);
        const v = (n, f) => cs.getPropertyValue(n).trim() || f;
        const C = {
          ink: v('--ink', '#0d1017'),
          red: v('--red', '#ee0510'),
        };
        const off = [];
        const on = (el, type, fn) => {
          el.addEventListener(type, fn);
          off.push(() => el.removeEventListener(type, fn));
        };
        const sel = (s, scope = root) => gsap.utils.toArray(scope.querySelectorAll(s));

        /* ================= HERO ================= */
        const hero = root.querySelector('[data-v="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-v="photo"]');
          const card = hero.querySelector('[data-v="card"]');
          const line = hero.querySelector('[data-v="cardline"]');
          const words = sel('[data-v="w"]', hero);
          const [eyebrow, lead, actions] = sel('[data-v~="hr"]', hero);

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

        /* ================= SECTION HEADS ================= */
        sel('[data-v="head"]').forEach((head) => {
          const r = sel('[data-v~="r"]', head);
          const w = sel('[data-v="w"]', head);
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

        /* Standalone fade-ins (eyebrow, text blocks) */
        sel('[data-v~="r"]')
          .filter((e) => !e.closest('[data-v="head"]') && !e.closest('[data-v="hero"]'))
          .forEach((el) => {
            gsap.set(el, { autoAlpha: 0, y: () => U() * 0.6 });
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: TA },
            });
          });

        /* ================= GRID ITEMS / TABLES / CARDS ================= */
        const items = sel('[data-v~="item"]');
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

        /* ================= MEDIA SLOTS (Artwork) ================= */
        sel('[data-v="media"]').forEach((m) => {
          gsap.set(m, { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 60%' });
          gsap.to(m, {
            autoAlpha: 1,
            scale: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: m, start: 'top 88%', toggleActions: TA },
          });
        });

        /* ================= TIMELINE STEPS ================= */
        const steps = sel('[data-v~="step"]');
        if (steps.length) {
          gsap.set(steps, { autoAlpha: 0, x: -30 });
          ScrollTrigger.batch(steps, {
            start: 'top 90%',
            interval: 0.12,
            onEnter: (els) => gsap.to(els, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, overwrite: 'auto' }),
            onLeaveBack: (els) => gsap.to(els, { autoAlpha: 0, x: -30, duration: 0.3, ease: 'power2.in', overwrite: 'auto' }),
          });
        }

        /* ================= HOVERS (fine pointers) ================= */
        if (fine) {
          sel('[data-hv~="primary"]').forEach((el) => {
            on(el, 'pointerenter', () =>
              gsap.to(el, { backgroundColor: '#d1040e', borderColor: '#d1040e', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, { backgroundColor: C.red, borderColor: C.red, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            );
          });

          sel('[data-hv~="outline"]').forEach((el) => {
            on(el, 'pointerenter', () =>
              gsap.to(el, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: '#fff', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.32)', duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            );
          });

          sel('[data-v~="spot"]').forEach((el) => {
            const mx = gsap.quickTo(el, '--mx', { duration: 0.45, ease: 'power3' });
            const my = gsap.quickTo(el, '--my', { duration: 0.45, ease: 'power3' });
            on(el, 'pointerenter', () => {
              gsap.to(el, { '--gl': 1, yPercent: -2.5, boxShadow: '0 2.2vw 4vw -2vw rgba(13,16,23,0.28)', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
            });
            on(el, 'pointermove', (e) => {
              const r = el.getBoundingClientRect();
              mx(((e.clientX - r.left) / r.width) * 100);
              my(((e.clientY - r.top) / r.height) * 100);
            });
            on(el, 'pointerleave', () => {
              gsap.to(el, { '--gl': 0, yPercent: 0, boxShadow: '0 0 0 0 rgba(13,16,23,0)', duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
            });
          });
        }

        return () => off.forEach((fn) => fn());
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