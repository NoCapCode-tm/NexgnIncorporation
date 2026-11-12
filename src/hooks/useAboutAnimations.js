import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOGGLE = 'play none none reverse';
const $$ = (root, sel) => gsap.utils.toArray(root.querySelectorAll(sel));

/** About page motion. Reduced motion = no GSAP at all, content simply shows. */
export default function useAboutAnimations(rootRef) {
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

        /* 1. Hero: image settles + parallax, title words rise */
        const hero = root.querySelector('[data-ab="hero"]');
        if (hero) {
          const media = hero.querySelector('[data-ab="hero-media"]');
          const words = $$(hero, '[data-ab="word"]');
          gsap.set(words, { yPercent: 125 });
          const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.05 });
          if (media) tl.fromTo(media, { scale: 1.14 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
          tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.25);
          if (media) {
            gsap.to(media, {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
            });
          }
        }

        /* 2. Generic reveals */
        $$(root, '[data-ab="fade"]').forEach((el) =>
          gsap.from(el, {
            autoAlpha: 0,
            y: 14,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: TOGGLE },
          })
        );
        $$(root, '[data-ab="rise"]').forEach((el) =>
          gsap.from(el, {
            autoAlpha: 0,
            y: 36,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: TOGGLE },
          })
        );

        /* 3. Callout arrow nudges on hover */
        if (fine) {
          $$(root, '[data-ab="link"]').forEach((link) => {
            const arrow = link.querySelector('svg');
            if (!arrow) return;
            const to = gsap.quickTo(arrow, 'x', { duration: 0.35, ease: 'power3.out' });
            link.addEventListener('mouseenter', () => to(6));
            link.addEventListener('mouseleave', () => to(0));
          });
        }

        /* 4. Card grids: staggered entrance, icon pop / photo reveal, hover lift */
        $$(root, '[data-ab="cards"]').forEach((grid) => {
          const cards = $$(grid, '[data-ab="card"]');
          const icons = $$(grid, '[data-ab="icon"]');
          const photos = $$(grid, '[data-ab="photo"]');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: TOGGLE },
          });
          tl.from(cards, { autoAlpha: 0, y: 44, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0);
          if (icons.length) tl.from(icons, { scale: 0.5, rotation: -12, duration: 0.7, stagger: 0.12, ease: 'back.out(2)' }, 0.2);
          if (photos.length) {
            tl.from(photos, { clipPath: 'inset(0 0 100% 0 round 12px)', duration: 1, stagger: 0.12, ease: 'power3.inOut' }, 0.1);
          }

          if (fine) {
            cards.forEach((card) => {
              const y = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' });
              card.addEventListener('mouseenter', () => y(-8));
              card.addEventListener('mouseleave', () => y(0));
            });
          }
        });

        return undefined;
      }
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [rootRef]);
}