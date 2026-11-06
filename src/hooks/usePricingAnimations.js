import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOGGLE = 'play reverse play reverse';
const $$ = (root, sel) => gsap.utils.toArray(root.querySelectorAll(sel));

export default function usePricingAnimations(rootRef, deps = []) {
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
        const progress = root.querySelector('[data-p="progress"]');
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
           1. TOP HERO BANNER + INTRO BAND ENTRANCE
           ============================================================= */
        const hero = root.querySelector('[data-p="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-p="hero-photo"]');
          const words = $$(hero, '[data-p="hero-word"]');

          gsap.set(words, { yPercent: 120 });

          const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.08 });
          if (photo) {
            tl.fromTo(
              photo,
              { scale: 1.16 },
              { scale: 1, duration: 2.4, ease: 'power3.out' },
              0
            );
          }
          tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.15);

          if (photo) {
            gsap.to(photo, {
              yPercent: 12,
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

        const intro = root.querySelector('[data-p="intro"]');
        if (intro) {
          const introWords = $$(intro, '[data-p="intro-word"]');
          const fades = $$(intro, '[data-p="intro-fade"]');

          gsap.set(introWords, { yPercent: 118 });
          gsap.set(fades, { autoAlpha: 0, y: 24 });

          gsap
            .timeline({
              defaults: { ease: 'power4.out' },
              delay: 0.25,
            })
            .to(introWords, { yPercent: 0, duration: 1.05, stagger: 0.05 }, 0)
            .to(fades, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 }, 0.35);
        }

        /* =============================================================
           2. PRICING CARDS (3D Entrance + Pointer Tilt)
           ============================================================= */
        const plans = $$(root, '[data-p="plan"]');
        plans.forEach((plan, i) => {
          gsap.from(plan, {
            y: 110,
            rotationX: 14,
            scale: 0.92,
            opacity: 0,
            transformOrigin: '50% 100%',
            duration: 1.15,
            ease: 'power4.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: plan,
              start: 'top 92%',
              toggleActions: TOGGLE,
            },
          });

          const card = plan.firstElementChild;
          if (fine && card) {
            const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
            const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
            gsap.set(card, { transformPerspective: 1100 });

            const move = (e) => {
              const r = plan.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 8);
              rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };

            plan.addEventListener('pointermove', move);
            plan.addEventListener('pointerleave', leave);
            ctx.add(() => () => {
              plan.removeEventListener('pointermove', move);
              plan.removeEventListener('pointerleave', leave);
            });
          }
        });

        /* =============================================================
           3. HEADLINE WORD REVEALS & GENERIC FADE-UPS
           ============================================================= */
        $$(root, '[data-p="title"]').forEach((heading) => {
          const words = $$(heading, '[data-p="word"]');
          gsap.from(words, {
            yPercent: 118,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: heading,
              start: 'top 88%',
              toggleActions: TOGGLE,
            },
          });
        });

        $$(root, '[data-p="up"]').forEach((el) => {
          gsap.from(el, {
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 89%',
              toggleActions: TOGGLE,
            },
          });
        });

        /* =============================================================
           4. DEVELOPER SPLIT CARD & FLOATING MINI-CARDS
           ============================================================= */
        const devBox = root.querySelector('[data-p="dev-box"]');
        if (devBox) {
          const floatCards = $$(devBox, '[data-p="float-card"]');
          const visual = devBox.querySelector('[data-p="dev-visual"]');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: devBox,
              start: 'top 85%',
              toggleActions: TOGGLE,
            },
          });

          if (visual) {
            tl.from(
              visual,
              { clipPath: 'inset(100% 0% 0% 0% round 18px)', duration: 1.1, ease: 'power4.inOut' },
              0
            );
          }

          if (floatCards.length) {
            tl.from(
              floatCards,
              {
                y: 40,
                opacity: 0,
                scale: 0.94,
                duration: 0.9,
                stagger: 0.16,
                ease: 'back.out(1.4)',
              },
              0.3
            );
          }
        }

        /* =============================================================
           5. ROI CALCULATOR PARALLAX & PANELS
           ============================================================= */
        const roi = root.querySelector('[data-p="roi"]');
        if (roi) {
          const bg = roi.querySelector('[data-p="roi-bg"]');
          const panels = $$(roi, '[data-p="roi-panel"]');

          if (bg) {
            gsap.fromTo(
              bg,
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                  trigger: roi,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          if (panels.length) {
            gsap.from(panels, {
              y: 60,
              opacity: 0,
              duration: 1,
              stagger: 0.14,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: roi,
                start: 'top 82%',
                toggleActions: TOGGLE,
              },
            });
          }
        }

        /* =============================================================
           6. FINAL CTA CLIP EXPANSION
           ============================================================= */
        $$(root, '[data-p="expand"]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(9% 6% 9% 6% round 36px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 96%',
                end: 'top 30%',
                scrub: 0.5,
              },
            }
          );
        });

        /* =============================================================
           7. MAGNETIC BUTTONS
           ============================================================= */
        if (fine) {
          $$(root, '[data-p="magnet"]').forEach((btn) => {
            const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
            const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

            const move = (e) => {
              const r = btn.getBoundingClientRect();
              x((e.clientX - (r.left + r.width / 2)) * 0.25);
              y((e.clientY - (r.top + r.height / 2)) * 0.35 - 2);
            };
            const leave = () => {
              x(0);
              y(0);
            };

            btn.addEventListener('pointermove', move);
            btn.addEventListener('pointerleave', leave);
            ctx.add(() => () => {
              btn.removeEventListener('pointermove', move);
              btn.removeEventListener('pointerleave', leave);
            });
          });
        }
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