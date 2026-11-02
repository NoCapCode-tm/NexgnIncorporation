import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_AT = 8;

/**
 * Navbar animations (GSAP + ScrollTrigger). No CSS transitions or keyframes are used.
 *
 * Markup contract (data-n attributes inside the header):
 *   glass scrim progress          decorative layers
 *   logo mark                     logo link and its svg
 *   nav item trigger pill chevron menu pieces (pill = hover highlight inside a trigger)
 *   panel[data-k] clip inner group plink     dropdown (desktop) / accordion (mobile)
 *   login cta sheen actions drawerActions    buttons
 *   burger burgerBox line         hamburger
 *
 * React keeps owning the STATE (which menu is open, is the drawer open); this hook just
 * reacts to `openKey` and `mobileOpen`. Reduced-motion users get none of this: the CSS
 * has a plain instant fallback driven by the same data-open / aria-expanded attributes.
 */
export default function useNavbarAnimations(rootRef, { openKey, mobileOpen }) {
  const live = useRef({ openKey, mobileOpen });
  live.current.openKey = openKey;
  live.current.mobileOpen = mobileOpen;

  const api = useRef({});
  const entered = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desk: '(min-width: 1024px)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { motion, desk, fine } = ctx.conditions;
        if (!motion) return undefined;

        const q = (name, scope = root) => gsap.utils.toArray(scope.querySelectorAll(`[data-n="${name}"]`));
        const one = (name, scope = root) => scope.querySelector(`[data-n="${name}"]`);

        const cs = getComputedStyle(root);
        const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
        const C = {
          text: v('--text', '#ffffff'),
          muted: v('--muted', '#a3aab6'),
          glass: v('--glass', '#0d1017'),
          glassS: v('--glass-scrolled', '#0a0c10'),
          shadow0: v('--bar-shadow', '0 0 0 rgba(0, 0, 0, 0)'),
          shadowS: v('--bar-shadow-scrolled', '0 10px 40px -12px rgba(0, 0, 0, 0.5)'),
          redHover: v('--red-hover', '#d1030d'),
        };

        const off = [];
        const on = (el, type, fn, opts) => {
          el.addEventListener(type, fn, opts);
          off.push(() => el.removeEventListener(type, fn, opts));
        };

        /* ============ glass: stronger + shorter bar after scrolling ============ */
        const glass = one('glass');
        let scrolled = window.scrollY > SCROLL_AT;

        const applyGlass = (instant) => {
          const strong = scrolled || live.current.mobileOpen;
          const vars = {
            backgroundColor: strong ? C.glassS : C.glass,
            boxShadow: strong ? C.shadowS : C.shadow0,
          };
          if (instant) gsap.set(glass, vars);
          else gsap.to(glass, { ...vars, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        };
        const applyBar = (instant) => {
          const vars = { '--bar-k': scrolled ? 0.88 : 1, '--blur': scrolled ? '24px' : '16px' };
          if (instant) gsap.set(root, vars);
          else gsap.to(root, { ...vars, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        };
        applyGlass(true);
        applyBar(true);

        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const now = self.scroll() > SCROLL_AT;
            if (now === scrolled) return;
            scrolled = now;
            applyGlass(false);
            applyBar(false);
          },
        });

        /* reading-progress hairline along the bottom edge */
        const progress = one('progress');
        if (progress) {
          gsap.to(progress, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
          });
        }

        /* ============ entrance (once per mount) ============ */
        const logo = one('logo');
        const entrance = [logo];
        if (desk) {
          entrance.push(...q('trigger'));
          entrance.push(...root.querySelectorAll('[data-n="actions"] [data-n="login"], [data-n="actions"] [data-n="cta"]'));
        } else {
          entrance.push(one('burger'));
        }
        if (!entered.current) {
          entered.current = true;
          gsap.set(entrance, { autoAlpha: 0, y: 12 });
          gsap.fromTo(glass, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
          gsap.to(entrance, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            delay: 0.1,
          });
        }

        /* ============ menus: desktop dropdown / mobile accordion ============ */
        const panels = q('panel');
        const scrim = one('scrim');
        const menuState = {};

        panels.forEach((p) => {
          gsap.set(q('group', p), { autoAlpha: 0, y: 14 });
          if (desk) {
            gsap.set(one('inner', p), { autoAlpha: 0, y: -10, scale: 0.985, transformOrigin: '50% 0' });
          } else {
            gsap.set(one('clip', p), { height: 0 });
          }
        });

        const pills = new Map();
        const hovered = new Set();
        if (desk) {
          q('trigger').forEach((tr) => {
            const pill = one('pill', tr);
            if (pill) pills.set(tr, pill);
          });
        }
        const syncPill = (tr, instant) => {
          const pill = pills.get(tr);
          if (!pill) return;
          const lit = hovered.has(tr) || tr.getAttribute('aria-expanded') === 'true';
          const vars = { opacity: lit ? 1 : 0, scale: lit ? 1 : 0.9 };
          if (instant) gsap.set(pill, vars);
          else {
            gsap.to(pill, {
              ...vars,
              duration: lit ? 0.35 : 0.25,
              ease: lit ? 'back.out(1.8)' : 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        const syncMenus = (key, instant) => {
          panels.forEach((p) => {
            const k = p.dataset.k;
            const isOpen = k === key;
            if (menuState[k] === isOpen && !instant) return;
            menuState[k] = isOpen;

            const inner = one('inner', p);
            const clip = one('clip', p);
            const groups = q('group', p);
            const trigger = p.parentElement.querySelector('[data-n="trigger"]');
            const chevron = trigger && one('chevron', trigger);

            if (chevron) {
              const cv = { rotation: isOpen ? 180 : 0 };
              if (instant) gsap.set(chevron, cv);
              else {
                gsap.to(chevron, {
                  ...cv,
                  duration: 0.5,
                  ease: isOpen ? 'back.out(1.7)' : 'power3.out',
                  overwrite: 'auto',
                });
              }
            }
            if (trigger) syncPill(trigger, instant);

            if (desk) {
              if (isOpen) {
                gsap.set(p, { visibility: 'visible', pointerEvents: 'auto' });
                if (instant) {
                  gsap.set(inner, { autoAlpha: 1, y: 0, scale: 1 });
                  gsap.set(groups, { autoAlpha: 1, y: 0 });
                } else {
                  gsap.to(inner, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
                  gsap.fromTo(
                    groups,
                    { autoAlpha: 0, y: 14 },
                    { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: 0.08, overwrite: 'auto' },
                  );
                }
              } else {
                gsap.set(p, { pointerEvents: 'none' });
                const hide = () => {
                  gsap.set(p, { visibility: 'hidden' });
                  gsap.set(groups, { autoAlpha: 0, y: 14 });
                };
                if (instant) {
                  gsap.set(inner, { autoAlpha: 0, y: -10, scale: 0.985 });
                  hide();
                } else {
                  gsap.to(inner, {
                    autoAlpha: 0,
                    y: -8,
                    scale: 0.985,
                    duration: 0.22,
                    ease: 'power2.in',
                    overwrite: 'auto',
                    onComplete: hide,
                  });
                }
              }
            } else if (isOpen) {
              gsap.set(p, { visibility: 'visible' });
              if (instant) {
                gsap.set(clip, { height: 'auto' });
                gsap.set(groups, { autoAlpha: 1, y: 0 });
              } else {
                gsap.to(clip, { height: 'auto', duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
                gsap.fromTo(
                  groups,
                  { autoAlpha: 0, y: 10 },
                  { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.055, delay: 0.1, overwrite: 'auto' },
                );
              }
            } else {
              const hide = () => {
                gsap.set(p, { visibility: 'hidden' });
                gsap.set(groups, { autoAlpha: 0, y: 10 });
              };
              if (instant) {
                gsap.set(clip, { height: 0 });
                hide();
              } else {
                gsap.to(clip, { height: 0, duration: 0.4, ease: 'power3.inOut', overwrite: 'auto', onComplete: hide });
                gsap.to(groups, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
              }
            }
          });

          if (desk && scrim) {
            if (instant) gsap.set(scrim, { opacity: key ? 1 : 0 });
            else gsap.to(scrim, { opacity: key ? 1 : 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          }
        };

        /* ============ mobile drawer + burger ============ */
        let drawerOpen = null;
        let syncDrawer = () => {};

        if (!desk) {
          const nav = one('nav');
          const items = q('item');
          const actions = one('drawerActions');
          const lines = q('line');
          const box = one('burgerBox');

          gsap.set(nav, { autoAlpha: 0, y: -12 });
          gsap.set(items, { autoAlpha: 0, y: 14 });
          gsap.set(actions, { autoAlpha: 0, y: 14 });

          // hamburger -> X, one reversible timeline
          const h = box ? box.offsetHeight : 16;
          const burgerTl = gsap.timeline({ paused: true, defaults: { duration: 0.45, ease: 'power3.inOut' } });
          if (lines.length === 3) {
            burgerTl
              .to(lines[0], { y: h / 2 - 1, rotation: 45 }, 0)
              .to(lines[1], { scaleX: 0, autoAlpha: 0, duration: 0.25 }, 0)
              .to(lines[2], { y: -(h / 2 - 1), rotation: -45 }, 0);
          }

          syncDrawer = (isOpen, instant) => {
            if (drawerOpen === isOpen && !instant) return;
            drawerOpen = isOpen;

            if (instant) burgerTl.progress(isOpen ? 1 : 0);
            else if (isOpen) burgerTl.timeScale(1).play();
            else burgerTl.timeScale(1.3).reverse();

            if (isOpen) {
              if (instant) {
                gsap.set(nav, { autoAlpha: 1, y: 0 });
                gsap.set([...items, actions], { autoAlpha: 1, y: 0 });
              } else {
                gsap.to(nav, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(items, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.55,
                  ease: 'power3.out',
                  stagger: 0.045,
                  delay: 0.08,
                  overwrite: 'auto',
                });
                gsap.to(actions, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.5,
                  ease: 'power3.out',
                  delay: 0.08 + items.length * 0.045,
                  overwrite: 'auto',
                });
              }
            } else if (instant) {
              gsap.set(nav, { autoAlpha: 0, y: -12 });
            } else {
              gsap.to(nav, {
                autoAlpha: 0,
                y: -8,
                duration: 0.28,
                ease: 'power2.in',
                overwrite: 'auto',
                onComplete: () => gsap.set([...items, actions], { autoAlpha: 0, y: 14 }),
              });
              gsap.killTweensOf([...items, actions]);
            }
            applyGlass(false);
          };
        }

        /* ============ hover micro-interactions ============ */
        // press feedback works for touch too
        q('cta').forEach((el) => {
          on(el, 'pointerdown', () => gsap.to(el, { scale: 0.97, duration: 0.12, ease: 'power2.out', overwrite: 'auto' }));
          const up = () => gsap.to(el, { scale: 1, duration: 0.4, ease: 'back.out(2)', overwrite: 'auto' });
          on(el, 'pointerup', up);
          on(el, 'pointerleave', up);
        });

        if (desk) {
          // keyboard focus lights the same pill as hover
          q('trigger').forEach((tr) => {
            on(tr, 'focus', () => {
              if (tr.matches(':focus-visible')) hovered.add(tr);
              syncPill(tr);
            });
            on(tr, 'blur', () => {
              hovered.delete(tr);
              syncPill(tr);
            });
          });
        }

        if (fine) {
          if (desk) {
            q('trigger').forEach((tr) => {
              on(tr, 'pointerenter', () => {
                hovered.add(tr);
                syncPill(tr);
              });
              on(tr, 'pointerleave', () => {
                hovered.delete(tr);
                syncPill(tr);
              });
            });
          }

          q('plink').forEach((el) => {
            on(el, 'pointerenter', () =>
              gsap.to(el, { x: 5, color: C.text, duration: 0.35, ease: 'power3.out', overwrite: 'auto' }),
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, {
                x: 0,
                color: C.muted,
                duration: 0.45,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'x,color,transform' }),
              }),
            );
          });

          q('login').forEach((el) => {
            const label = el.querySelector('span');
            if (!label) return;
            gsap.set(label, { '--u': '0%' });
            on(el, 'pointerenter', () => gsap.to(label, { '--u': '100%', duration: 0.45, ease: 'power3.out', overwrite: 'auto' }));
            on(el, 'pointerleave', () => gsap.to(label, { '--u': '0%', duration: 0.4, ease: 'power3.out', overwrite: 'auto' }));
          });

          q('cta').forEach((el) => {
            const sheen = one('sheen', el);
            on(el, 'pointerenter', () => {
              gsap.to(el, {
                y: -1,
                backgroundColor: C.redHover,
                boxShadow: '0 10px 28px -8px rgba(237,4,15,0.6), 0 0 0 0 rgba(237,4,15,0)',
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              if (sheen) gsap.fromTo(sheen, { xPercent: -120 }, { xPercent: 120, duration: 0.8, ease: 'power3.out', overwrite: true });
            });
            on(el, 'pointerleave', () =>
              gsap.to(el, {
                y: 0,
                backgroundColor: v('--red', '#ed040f'),
                boxShadow: '0 1px 2px rgba(0,0,0,0.2), 0 0 0 0 rgba(237,4,15,0)',
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'backgroundColor,boxShadow,y' }),
              }),
            );
          });

          const burger = one('burger');
          if (burger) {
            on(burger, 'pointerenter', () =>
              gsap.to(burger, { backgroundColor: 'rgba(255,255,255,0.09)', duration: 0.25, overwrite: 'auto' }),
            );
            on(burger, 'pointerleave', () =>
              gsap.to(burger, {
                backgroundColor: 'rgba(255,255,255,0)',
                duration: 0.3,
                overwrite: 'auto',
                onComplete: () => gsap.set(burger, { clearProps: 'backgroundColor' }),
              }),
            );
          }

          // const mark = one('mark');
          // if (mark && logo) {
          //   on(logo, 'pointerenter', () =>
          //     gsap.to(mark, { rotation: 12, scale: 1.12, duration: 0.6, ease: 'back.out(2.2)', overwrite: 'auto' }),
          //   );
          //   on(logo, 'pointerleave', () =>
          //     gsap.to(mark, { rotation: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' }),
          //   );
          // }
        }

        /* ============ bring the DOM in line with React state, then expose the API ============ */
        syncMenus(live.current.openKey, true);
        if (!desk) syncDrawer(live.current.mobileOpen, true);
        applyGlass(true);

        api.current = {
          menus: (key) => syncMenus(key, false),
          drawer: (isOpen) => syncDrawer(isOpen, false),
        };

        return () => {
          api.current = {};
          off.forEach((fn) => fn());
        };
      },
    );

    return () => mm.revert();
  }, [rootRef]);

  useLayoutEffect(() => {
    api.current.menus?.(openKey);
  }, [openKey]);

  useLayoutEffect(() => {
    api.current.drawer?.(mobileOpen);
  }, [mobileOpen]);
}