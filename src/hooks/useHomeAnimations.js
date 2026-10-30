import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* =====================================================================
   Home page motion (GSAP + ScrollTrigger)

   Animations:
   - Hero entrance and photo zoom
   - Reading progress
   - Cycling signature typography
   - Parallax photos
   - Scroll-triggered reveals
   - Workflow panel
   - Compliance cards
   - Pricing card animations
   - Final CTA expansion
   - Trusted-by marquee
   - Magnetic buttons

   Signature sequence:
   1. DM Sans
   2. Allison
   3. Alex Brush
   4. Sacramento
   5. Herr Von Muellerhoff
   ===================================================================== */

const TOGGLE = 'play reverse play reverse';
const SIGN_HOLD = 2.3;

const $$ = (root, sel) =>
  gsap.utils.toArray(root.querySelectorAll(sel));

/* ---------------------------------------------------------------------
   SIGNATURE FONT HELPERS
   --------------------------------------------------------------------- */

// Measure the actual rendered width of the active font.
const signWidth = (variants, index) => {
  if (!variants[index]) return 0;

  return Math.ceil(
    variants[index].getBoundingClientRect().width
  );
};

// Explicitly load all five fonts before starting the animation.
const loadSignatureFonts = async (variants) => {
  if (!document.fonts?.load || !variants.length) return;

  await document.fonts.ready;

  const requests = variants.map((variant) => {
    const family = variant.dataset.signFont;

    if (!family) return Promise.resolve();

    const fontSize =
      window.getComputedStyle(variant).fontSize || '100px';

    return document.fonts.load(
      `400 ${fontSize} "${family}"`,
      'Sign.'
    );
  });

  await Promise.allSettled(requests);
  await document.fonts.ready;
};

/* =====================================================================
   MAIN HOOK
   ===================================================================== */

export default function useHomeAnimations(rootRef, deps = []) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return undefined;

    /* -----------------------------------------------------------------
       SIGNATURE INITIALIZATION
       ----------------------------------------------------------------- */

    const sign = root.querySelector('[data-a="hero-sign"]');

    const variants = sign
      ? $$(sign, '[data-sign-v]')
      : [];

    let activeSign = 0;

    // Resize the wrapper to match the currently active font.
    const fitSign = () => {
      if (sign && variants.length) {
        gsap.set(sign, {
          width: signWidth(variants, activeSign),
        });
      }
    };

    // Load the real fonts before allowing the signature to cycle.
    const fontsReady = loadSignatureFonts(variants).then(() => {
      fitSign();
      ScrollTrigger.refresh();
    });

    fitSign();

    window.addEventListener('resize', fitSign);

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
           0. READING PROGRESS
           ============================================================= */

        const bar = root.querySelector('[data-a="progress"]');

        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                start: 0,
                end: 'max',
                scrub: 0.2,
              },
            }
          );
        }

        /* =============================================================
           1. HERO ENTRANCE
           ============================================================= */

        const hero = root.querySelector('[data-a="hero"]');

        if (hero) {
          const words = $$(hero, '[data-a="hero-word"]');
          const fades = $$(hero, '[data-a="hero-fade"]');
          const tags = $$(hero, '[data-a="hero-tag"]');

          const photo = hero.querySelector(
            '[data-a="hero-photo"]'
          );

          gsap.set(words, {
            yPercent: 118,
          });

          if (sign) {
            gsap.set(sign, {
              opacity: 0,
              y: 46,
              filter: 'blur(14px)',
            });
          }

          gsap.set(fades, {
            opacity: 0,
            y: 30,
          });

          gsap.set(tags, {
            opacity: 0,
            y: 12,
          });

          const intro = gsap.timeline({
            defaults: {
              ease: 'power4.out',
            },
            delay: 0.1,
          });

          if (photo) {
            intro.fromTo(
              photo,
              { scale: 1.18 },
              {
                scale: 1,
                duration: 2.6,
                ease: 'power3.out',
              },
              0
            );
          }

          intro
            .to(
              words,
              {
                yPercent: 0,
                duration: 1.15,
                stagger: 0.1,
              },
              0.1
            )

            .to(
              sign,
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.1,
              },
              0.3
            )

            .to(
              fades,
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
              },
              0.65
            )

            .to(
              tags,
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.07,
              },
              1.15
            )

            .set(sign, {
              clearProps: 'filter,transform',
            });

          // Hero scroll exit animation.
          const content = hero.querySelector(
            '[data-a="hero-content"]'
          );

          const exit = {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          };

          if (photo) {
            gsap.to(photo, {
              yPercent: 9,
              ease: 'none',
              scrollTrigger: exit,
            });
          }

          if (content) {
            gsap.to(content, {
              yPercent: -9,
              opacity: 0.15,
              ease: 'none',
              scrollTrigger: exit,
            });
          }
        }

        /* =============================================================
           2. CYCLING SIGNATURE
           ============================================================= */

        let signTimer = null;
        let signVisible = true;
        let signCycleActive = true;

        if (sign && variants.length > 1) {
          // First font (DM Sans) is visible.
          // All other fonts start hidden.
          gsap.set(variants.slice(1), {
            autoAlpha: 0,
          });

          const next = () => {
            if (!signCycleActive) return;

            // Pause switching while the hero is outside the viewport.
            if (!signVisible) {
              signTimer = gsap.delayedCall(0.5, next);
              return;
            }

            const from = variants[activeSign];

            activeSign = (activeSign + 1) % variants.length;

            const to = variants[activeSign];

            const nextWidth = signWidth(
              variants,
              activeSign
            );

            gsap
              .timeline({
                onComplete: () => {
                  gsap.set(from, {
                    clearProps: 'clipPath,filter,transform',
                    y: 0,
                  });

                  if (signCycleActive) {
                    signTimer = gsap.delayedCall(
                      SIGN_HOLD,
                      next
                    );
                  }
                },
              })

              // Previous font fades and lifts away.
              .to(
                from,
                {
                  autoAlpha: 0,
                  y: -10,
                  filter: 'blur(6px)',
                  duration: 0.35,
                  ease: 'power2.in',
                },
                0
              )

              // Wrapper smoothly adjusts to the new font width.
              .to(
                sign,
                {
                  width: nextWidth,
                  duration: 0.7,
                  ease: 'power3.inOut',
                },
                0
              )

              // New font reveals from left to right.
              .fromTo(
                to,
                {
                  autoAlpha: 1,
                  y: 8,
                  filter: 'blur(0px)',
                  clipPath: 'inset(-25% 100% -25% -10%)',
                },
                {
                  y: 0,
                  clipPath: 'inset(-25% -12% -25% -10%)',
                  duration: 0.8,
                  ease: 'power3.out',
                },
                0.22
              );
          };

          // Start cycling only after the actual font files are loaded.
          fontsReady.then(() => {
            if (!signCycleActive) return;

            fitSign();

            signTimer = gsap.delayedCall(
              SIGN_HOLD + 1.6,
              next
            );
          });

          // Detect whether the hero is visible.
          ScrollTrigger.create({
            trigger: hero,
            start: 'top bottom',
            end: 'bottom top',

            onToggle: (self) => {
              signVisible = self.isActive;
            },
          });
        }

        /* =============================================================
           3. PARALLAX PHOTOS
           ============================================================= */

        $$(root, '[data-a="parallax"]').forEach((el) => {
          const speed = parseFloat(
            el.dataset.speed || '8'
          );

          gsap.fromTo(
            el,
            { yPercent: -speed },
            {
              yPercent: speed,
              ease: 'none',

              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        /* =============================================================
           4. GENERIC REVEALS
           ============================================================= */

        $$(root, '[data-a="up"]').forEach((el) => {
          gsap.from(el, {
            y: 56,
            opacity: 0,
            duration: 0.95,
            ease: 'power3.out',

            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: TOGGLE,
            },
          });
        });

        // Heading word animations.
        $$(root, '[data-a="title"]').forEach((heading) => {
          const words = $$(
            heading,
            '[data-a="word"]'
          );

          gsap.from(words, {
            yPercent: 118,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.07,

            scrollTrigger: {
              trigger: heading,
              start: 'top 86%',
              toggleActions: TOGGLE,
            },
          });
        });

        // Staggered children.
        $$(root, '[data-a="stagger"]').forEach((group) => {
          gsap.from(group.children, {
            y: 46,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.09,

            scrollTrigger: {
              trigger: group,
              start: 'top 88%',
              toggleActions: TOGGLE,
            },
          });
        });

        /* =============================================================
           5. WORKFLOW PANEL
           ============================================================= */

        $$(root, '[data-a="panel"]').forEach((el) => {
          gsap.fromTo(
            el,
            {
              scale: 0.9,
              y: 90,
              opacity: 0.15,
            },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              ease: 'none',

              scrollTrigger: {
                trigger: el,
                start: 'top 96%',
                end: 'top 52%',
                scrub: 0.6,
              },
            }
          );
        });

        /* =============================================================
           6. COMPLIANCE CARDS
           ============================================================= */

        $$(root, '[data-a="card"]').forEach((card, i) => {
          const frame = card.querySelector(
            '[data-a="frame"]'
          );

          const media = frame?.firstElementChild;

          const texts = $$(
            card,
            '[data-a="card-text"]'
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              toggleActions: TOGGLE,
            },

            delay: (i % 2) * 0.12,
          });

          if (frame) {
            tl.from(
              frame,
              {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 1.1,
                ease: 'power4.inOut',
              },
              0
            );
          }

          if (media) {
            tl.from(
              media,
              {
                scale: 1.35,
                duration: 1.5,
                ease: 'power3.out',
              },
              0
            );
          }

          if (texts.length) {
            tl.from(
              texts,
              {
                y: 28,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
              },
              0.4
            );
          }
        });

        /* =============================================================
           7. PRICING CARDS
           ============================================================= */

        const plans = $$(root, '[data-a="plan"]');

        plans.forEach((plan, i) => {
          gsap.from(plan, {
            y: 120,
            rotationX: 16,
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

          // Card tilt on pointer movement.
          const card = plan.firstElementChild;

          if (fine && card) {
            const rx = gsap.quickTo(
              card,
              'rotationX',
              {
                duration: 0.5,
                ease: 'power3.out',
              }
            );

            const ry = gsap.quickTo(
              card,
              'rotationY',
              {
                duration: 0.5,
                ease: 'power3.out',
              }
            );

            gsap.set(card, {
              transformPerspective: 1100,
            });

            const move = (e) => {
              const r = plan.getBoundingClientRect();

              ry(
                ((e.clientX - r.left) / r.width - 0.5) * 8
              );

              rx(
                -((e.clientY - r.top) / r.height - 0.5) * 6
              );
            };

            const leave = () => {
              rx(0);
              ry(0);
            };

            plan.addEventListener('pointermove', move);
            plan.addEventListener('pointerleave', leave);

            ctx.add(() => {
              plan.removeEventListener('pointermove', move);
              plan.removeEventListener('pointerleave', leave);
            });
          }
        });

        /* =============================================================
           8. FINAL CTA EXPANSION
           ============================================================= */

        $$(root, '[data-a="expand"]').forEach((el) => {
          gsap.fromTo(
            el,
            {
              clipPath: 'inset(9% 6% 9% 6% round 36px)',
            },
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
           9. TRUSTED-BY MARQUEE
           ============================================================= */

        const track = root.querySelector(
          '[data-a="marquee"]'
        );

        if (track) {
          const tween = gsap.to(track, {
            xPercent: -50,
            duration: 38,
            ease: 'none',
            repeat: -1,
          });

          let hovering = false;
          let dir = 1;

          const settle = gsap.delayedCall(0.18, () => {
            if (!hovering) {
              gsap.to(tween, {
                timeScale: dir,
                duration: 1.1,
                ease: 'power2.out',
                overwrite: true,
              });
            }
          });

          settle.pause();

          ScrollTrigger.create({
            start: 0,
            end: 'max',

            onUpdate: (self) => {
              if (hovering) return;

              dir = self.direction;

              const boost = gsap.utils.clamp(
                0,
                9,
                Math.abs(self.getVelocity()) / 450
              );

              gsap.to(tween, {
                timeScale: dir * (1 + boost),
                duration: 0.25,
                overwrite: true,
              });

              settle.restart(true);
            },
          });

          const over = () => {
            hovering = true;

            gsap.to(tween, {
              timeScale: 0,
              duration: 0.5,
              overwrite: true,
            });
          };

          const out = () => {
            hovering = false;

            gsap.to(tween, {
              timeScale: dir,
              duration: 0.8,
              overwrite: true,
            });
          };

          const holder = track.parentElement;

          holder.addEventListener('mouseenter', over);
          holder.addEventListener('mouseleave', out);

          ctx.add(() => {
            holder.removeEventListener('mouseenter', over);
            holder.removeEventListener('mouseleave', out);
          });
        }

        /* =============================================================
           10. MAGNETIC BUTTONS
           ============================================================= */

        if (fine) {
          $$(root, '[data-a="magnet"]').forEach((btn) => {
            const x = gsap.quickTo(btn, 'x', {
              duration: 0.5,
              ease: 'power3.out',
            });

            const y = gsap.quickTo(btn, 'y', {
              duration: 0.5,
              ease: 'power3.out',
            });

            const move = (e) => {
              const r = btn.getBoundingClientRect();

              x(
                (e.clientX - (r.left + r.width / 2)) * 0.28
              );

              y(
                (e.clientY - (r.top + r.height / 2)) * 0.4 - 2
              );
            };

            const leave = () => {
              x(0);
              y(0);
            };

            btn.addEventListener('pointermove', move);
            btn.addEventListener('pointerleave', leave);

            ctx.add(() => {
              btn.removeEventListener('pointermove', move);
              btn.removeEventListener('pointerleave', leave);
            });
          });
        }

        /* =============================================================
           CLEANUP
           ============================================================= */

        return () => {
          signCycleActive = false;

          if (signTimer) {
            signTimer.kill();
          }

          activeSign = 0;

          if (sign && variants.length) {
            gsap.set(variants, {
              clearProps: 'all',
            });

            fitSign();
          }
        };
      },
      root
    );

    /* ===============================================================
       GLOBAL LAYOUT REFRESH
       =============================================================== */

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

    /* ===============================================================
       FINAL HOOK CLEANUP
       =============================================================== */

    return () => {
      window.removeEventListener('resize', fitSign);
      window.removeEventListener('load', refresh);

      ro?.disconnect();

      clearTimeout(timer);

      mm.revert();

      void fontsReady;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}