import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOGGLE = 'play none none reverse';
const $$ = (root, sel) => gsap.utils.toArray(root.querySelectorAll(sel));

/**
 * Contact page motion. Everything is GSAP; hover is highlight-only (CSS colour), nothing moves.
 * Hooks: data-ct="photo | word | fade | card | channel | field | hq | map | pin | pulse"
 */
export default function useContactAnimations(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      if (!ctx.conditions.motion) return undefined;

      const c = gsap.context(() => {
        // Hero: words rise out of a mask, then the supporting copy fades in
        const words = $$(root, '[data-ct="word"]');
        const heroFade = $$(root, '[data-ct="hero-fade"]');
        gsap.set(words, { yPercent: 115 });
        gsap.set(heroFade, { autoAlpha: 0, y: 18 });
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .to(words, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.1)
          .to(heroFade, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.35);

        // Hero photo parallax
        const photo = root.querySelector('[data-ct="photo"]');
        if (photo) {
          gsap.fromTo(
            photo,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 8,
              scale: 1.12,
              ease: 'none',
              scrollTrigger: { trigger: photo.parentElement, start: 'top top', end: 'bottom top', scrub: true },
            }
          );
        }

        // Cards
        $$(root, '[data-ct="card"]').forEach((el, i) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 56,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: TOGGLE },
          });
        });

        // Channels and form fields stagger inside their cards
        const stagger = (sel, trigger, opts = {}) => {
          const items = $$(root, sel);
          if (!items.length) return;
          gsap.from(items, {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: root.querySelector(trigger) || items[0], start: 'top 80%', toggleActions: TOGGLE },
            ...opts,
          });
        };
        stagger('[data-ct="channel"]', '[data-ct="channels"]');
        stagger('[data-ct="field"]', '[data-ct="form"]', { delay: 0.15 });

        // Headquarters rows
        stagger('[data-ct="hq"]', '[data-ct="hq-card"]');

        // Map: dots fade in, then pins drop, then pins pulse
        const map = root.querySelector('[data-ct="map"]');
        if (map) {
          const pins = $$(map, '[data-ct="pin"]');
          gsap.set(pins, { autoAlpha: 0, y: -28 });
          gsap.from(map.querySelector('svg'), {
            autoAlpha: 0,
            scale: 0.96,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: map, start: 'top 85%', toggleActions: TOGGLE },
          });
          gsap.to(pins, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'bounce.out',
            stagger: 0.25,
            scrollTrigger: { trigger: map, start: 'top 75%', toggleActions: TOGGLE },
          });
          gsap.to($$(map, '[data-ct="pulse"]'), {
            scale: 2.4,
            autoAlpha: 0,
            duration: 1.8,
            ease: 'power1.out',
            repeat: -1,
            stagger: 0.6,
          });
        }
      }, root);

      return () => c.revert();
    });

    return () => mm.revert();
  }, [rootRef]);
}
