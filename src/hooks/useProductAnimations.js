import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOGGLE = 'play reverse play reverse';
const $$ = (root, sel) => gsap.utils.toArray(root.querySelectorAll(sel));

export default function useProductAnimations(rootRef, deps = []) {
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

        /* =============================================================
           0. READING PROGRESS BAR
           ============================================================= */
        const progress = root.querySelector('[data-pl="progress"]');
        if (progress) {
          gsap.fromTo(
            progress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
            }
          );
        }

        /* =============================================================
           1. HERO ENTRANCE + PARALLAX GLOW
           ============================================================= */
        const hero = root.querySelector('[data-pl="hero"]');
        if (hero) {
          const glow = hero.querySelector('[data-pl="hero-glow"]');
          const eyebrow = hero.querySelector('[data-pl="hero-eyebrow"]');
          const words = $$(hero, '[data-pl="hero-word"]');
          const lead = hero.querySelector('[data-pl="hero-lead"]');

          gsap.set(words, { yPercent: 120 });
          if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
          if (lead) gsap.set(lead, { autoAlpha: 0, y: 22 });

          const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.06 });
          if (glow) {
            tl.fromTo(
              glow,
              { scale: 0.85, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1.8, ease: 'power3.out' },
              0
            );
          }
          if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.08);
          if (words.length) tl.to(words, { yPercent: 0, duration: 1.05, stagger: 0.06 }, 0.15);
          if (lead) tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.38);

          if (glow) {
            gsap.to(glow, {
              yPercent: 20,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          }
        }

        /* =============================================================
           2. SECTION HEADERS & SUB-SECTIONS REVEAL
           ============================================================= */
        $$(root, '[data-pl="head"]').forEach((head) => {
          gsap.from(head.children, {
            y: 28,
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: head,
              start: 'top 89%',
              toggleActions: TOGGLE,
            },
          });
        });

        $$(root, '[data-pl="sub"]').forEach((sub) => {
          gsap.from(sub, {
            y: 30,
            autoAlpha: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sub,
              start: 'top 90%',
              toggleActions: TOGGLE,
            },
          });
        });

        /* =============================================================
           3. DARK BANNER REVEAL + ICON POP
           ============================================================= */
        $$(root, '[data-pl="banner"]').forEach((banner) => {
          const icon = banner.querySelector('[data-pl="banner-icon"]');
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: banner,
              start: 'top 90%',
              toggleActions: TOGGLE,
            },
          });

          tl.from(banner, {
            y: 26,
            scale: 0.97,
            autoAlpha: 0,
            duration: 0.85,
            ease: 'expo.out',
          });

          if (icon) {
            tl.from(
              icon,
              { scale: 0.5, rotation: -12, duration: 0.7, ease: 'back.out(2)' },
              0.15
            );
          }
        });

        /* =============================================================
           4. SIGNATURE STYLE CARDS (Stagger + 3D Pointer Tilt)
           ============================================================= */
        $$(root, '[data-pl="sig-grid"]').forEach((grid) => {
          const cards = $$(grid, '[data-pl="sig-card"]');
          if (!cards.length) return;

          gsap.from(cards, {
            y: 36,
            scale: 0.95,
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 88%',
              toggleActions: TOGGLE,
            },
          });

          if (fine) {
            cards.forEach((card) => {
              const rx = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3.out' });
              const ry = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3.out' });
              gsap.set(card, { transformPerspective: 900 });

              const move = (e) => {
                const r = card.getBoundingClientRect();
                ry(((e.clientX - r.left) / r.width - 0.5) * 9);
                rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
              };
              const leave = () => {
                rx(0);
                ry(0);
              };

              card.addEventListener('pointermove', move);
              card.addEventListener('pointerleave', leave);
              ctx.add(() => () => {
                card.removeEventListener('pointermove', move);
                card.removeEventListener('pointerleave', leave);
              });
            });
          }
        });

        /* =============================================================
           5. STATUS TRACKING PIPELINE (Sequential Pop-In)
           ============================================================= */
        $$(root, '[data-pl="status-row"]').forEach((row) => {
          const items = $$(row, '[data-pl="status-item"]');
          const boxes = $$(row, '[data-pl="status-box"]');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              toggleActions: TOGGLE,
            },
          });

          tl.fromTo(
            items,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              stagger: 0.09,
              ease: 'power3.out',
            },
            0
          );

          if (boxes.length) {
            tl.fromTo(
              boxes,
              { scale: 0.75 },
              {
                scale: 1,
                duration: 0.65,
                stagger: 0.09,
                ease: 'back.out(2)',
                clearProps: 'transform',
              },
              0
            );
          }
        });

        /* =============================================================
           6. DOCUMENT EDITOR WIDGET PILLS (Stagger + Magnetic Lift)
           ============================================================= */
        $$(root, '[data-pl="widget-grid"]').forEach((grid) => {
          const pills = $$(grid, '[data-pl="widget-pill"]');
          if (!pills.length) return;

          gsap.from(pills, {
            y: 26,
            scale: 0.94,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.065,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 89%',
              toggleActions: TOGGLE,
            },
          });

          if (fine) {
            pills.forEach((pill) => {
              const x = gsap.quickTo(pill, 'x', { duration: 0.4, ease: 'power3.out' });
              const y = gsap.quickTo(pill, 'y', { duration: 0.4, ease: 'power3.out' });

              const move = (e) => {
                const r = pill.getBoundingClientRect();
                x((e.clientX - (r.left + r.width / 2)) * 0.18);
                y((e.clientY - (r.top + r.height / 2)) * 0.25 - 2);
              };
              const leave = () => {
                x(0);
                y(0);
              };

              pill.addEventListener('pointermove', move);
              pill.addEventListener('pointerleave', leave);
              ctx.add(() => () => {
                pill.removeEventListener('pointermove', move);
                pill.removeEventListener('pointerleave', leave);
              });
            });
          }
        });

        /* =============================================================
           7. STEP LIST & CHECK LIST REVEALS
           ============================================================= */
        $$(root, '[data-pl="step-list"]').forEach((list) => {
          const steps = $$(list, '[data-pl="step-item"]');
          if (!steps.length) return;

          gsap.from(steps, {
            x: -20,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: list,
              start: 'top 89%',
              toggleActions: TOGGLE,
            },
          });
        });

        $$(root, '[data-pl="check-list"]').forEach((list) => {
          const checks = $$(list, '[data-pl="check-item"]');
          if (!checks.length) return;

          gsap.from(checks, {
            y: 16,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: list,
              start: 'top 91%',
              toggleActions: TOGGLE,
            },
          });
        });

        /* =============================================================
           8. FEATURE CARDS, NOTE BANNER, CHAT EXAMPLE
           ============================================================= */
        $$(root, '[data-pl="feat-grid"]').forEach((grid) => {
          const cards = $$(grid, '[data-pl="feat-card"]');
          if (!cards.length) return;
          gsap.from(cards, {
            y: 28,
            scale: 0.95,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: grid, start: 'top 89%', toggleActions: TOGGLE },
          });
          if (fine) {
            cards.forEach((card) => {
              const y = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' });
              const enter = () => y(-4);
              const leave = () => y(0);
              card.addEventListener('pointerenter', enter);
              card.addEventListener('pointerleave', leave);
              ctx.add(() => () => {
                card.removeEventListener('pointerenter', enter);
                card.removeEventListener('pointerleave', leave);
              });
            });
          }
        });

        $$(root, '[data-pl="note"]').forEach((note) => {
          const icon = note.querySelector('[data-pl="note-icon"]');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: note, start: 'top 90%', toggleActions: TOGGLE },
          });
          tl.from(note, { y: 24, autoAlpha: 0, duration: 0.8, ease: 'expo.out' });
          if (icon) tl.from(icon, { scale: 0.5, rotation: -10, duration: 0.65, ease: 'back.out(2)' }, 0.12);
        });

        $$(root, '[data-pl="chat-grid"]').forEach((grid) => {
          const cards = $$(grid, '[data-pl="chat-card"]');
          if (!cards.length) return;
          gsap.from(cards, {
            y: 26,
            x: (i) => (i % 2 ? 18 : -18),
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: grid, start: 'top 89%', toggleActions: TOGGLE },
          });
        });

        $$(root, '[data-pl="flag-list"]').forEach((list) => {
          const items = $$(list, '[data-pl="flag-item"]');
          if (!items.length) return;
          gsap.from(items, {
            y: 18,
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: list, start: 'top 90%', toggleActions: TOGGLE },
          });
        });

        $$(root, '[data-pl="flow"]').forEach((flow) => {
          const steps = $$(flow, '[data-pl="flow-step"]');
          const arrows = $$(flow, '[data-pl="flow-arrow"]');
          if (!steps.length) return;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: flow, start: 'top 90%', toggleActions: TOGGLE },
          });
          steps.forEach((step, i) => {
            tl.from(step, { y: 18, scale: 0.94, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, i * 0.28);
            if (arrows[i]) {
              tl.from(arrows[i], { x: -10, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, i * 0.28 + 0.22);
            }
          });
        });
      },
      root
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    let ro;
    let timer;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(refresh, 200);
      });
      ro.observe(root);
    }

    return () => {
      window.removeEventListener('load', refresh);
      ro?.disconnect();
      clearTimeout(timer);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}