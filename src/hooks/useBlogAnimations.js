import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TA = 'play reverse play reverse';
const U = () => gsap.utils.clamp(14, 90, window.innerWidth / 45);

export default function useBlogAnimations(rootRef, { lng } = {}) {
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

        const sel = (s, scope = root) => gsap.utils.toArray(scope.querySelectorAll(s));
        const on = (el, type, fn) => el.addEventListener(type, fn);
        const off = (el, type, fn) => el.removeEventListener(type, fn);

        /* ================= HERO ================= */
        const hero = root.querySelector('[data-b="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-b="photo"]');
          const [eyebrow, title, lead, form] = sel('[data-b~="hr"]', hero);

          gsap.set(photo, { scale: 1.15 });
          gsap.set([eyebrow, title, lead, form], { autoAlpha: 0, y: () => U() * 0.8 });

          gsap
            .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
            .to(photo, { scale: 1, duration: 2.5, ease: 'power3.out' }, 0)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
            .to(title, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.3)
            .to(lead, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.45)
            .to(form, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.6);

          const drift = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
          gsap.to(photo, { yPercent: 12, ease: 'none', scrollTrigger: drift });
        }

        /* ================= SECTION HEADS ================= */
        sel('[data-b="head"]').forEach((head) => {
          gsap.set(head, { autoAlpha: 0, y: () => U() * 0.6 });
          gsap.to(head, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: head, start: 'top 88%', toggleActions: TA },
          });
        });

        /* ================= GRID ITEMS (Batch Stagger) ================= */
        const items = sel('[data-b~="item"]');
        gsap.set(items, { autoAlpha: 0, y: () => U() * 1.2 });

        const showItems = (els) => {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, overwrite: 'auto' });
        };
        const hideItems = (els) => {
          gsap.to(els, { autoAlpha: 0, y: U() * 1.2, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
        };

        if (items.length) {
          const apply = (els, trigs) => {
            const active = els.filter((_, i) => trigs[i].isActive);
            const inactive = els.filter((_, i) => !trigs[i].isActive);
            if (active.length) showItems(active);
            if (inactive.length) hideItems(inactive);
          };
          ScrollTrigger.batch(items, {
            start: 'top 92%',
            interval: 0.12,
            onEnter: apply,
            onEnterBack: apply,
            onLeave: apply,
            onLeaveBack: apply,
          });
        }

        /* ================= HOVERS (fine pointers) ================= */
        if (fine) {
          // Blog Cards & Press Cards Image Zoom
          sel('[data-hv~="card"]').forEach((el) => {
            const img = el.querySelector('img');
            const link = el.querySelector('[data-hv="arrow"]');
            
            const enter = () => {
              if (img) gsap.to(img, { scale: 1.04, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
              if (link) gsap.to(link, { x: 5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            };
            const leave = () => {
              if (img) gsap.to(img, { scale: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
              if (link) gsap.to(link, { x: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            };
            
            on(el, 'pointerenter', enter);
            on(el, 'pointerleave', leave);
            return () => { off(el, 'pointerenter', enter); off(el, 'pointerleave', leave); };
          });
          
          // Primary Buttons
          sel('[data-hv~="btn"]').forEach((btn) => {
            const enter = () => gsap.to(btn, { scale: 1.02, backgroundColor: '#d1030d', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            const leave = () => gsap.to(btn, { scale: 1, backgroundColor: '#ed040f', duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            on(btn, 'pointerenter', enter);
            on(btn, 'pointerleave', leave);
            return () => { off(btn, 'pointerenter', enter); off(btn, 'pointerleave', leave); };
          });
        }
      }
    );

    return () => mm.revert();
  }, [rootRef, lng]);
}