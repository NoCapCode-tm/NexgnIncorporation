import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_AT = 24;

/**
 * Navbar animations (GSAP). No CSS transitions or keyframes anywhere.
 *
 * DESKTOP (>= 1024px)
 *   - top of page: full-width transparent bar, logo mark + wordmark
 *   - on scroll: the bar contracts into a floating glass pill (width, height, top gap, radius),
 *     the glass fades in, the wordmark folds away (no progress line: pages own that)
 *   - hover: a highlight pill glides between items; chevrons turn; links nudge
 *   - dropdown: frosted panel rises in, columns then links cascade; switching menus crossfades
 *   - CTA: magnetic pull, colour shift, light sweep; "Log in" underline draws
 * MOBILE (< 1024px)
 *   - plain three dots; on tap they burst out and an X draws in
 *   - the bar grows into the menu card (height tween), wordmark unfolds, items cascade
 *   - sections are accordions (height + fade, chevron turns, links cascade)
 *
 * React owns the STATE (`openKey`, `mobileOpen`); this hook reacts to it. Reduced-motion users
 * get the same end states applied instantly (no tweens, no idle loops).
 *
 * Markup contract (data-n): scrim bar glass row logo mark word menu hl trigger chev
 *   panel[data-k] group plink login loginLine cta sheen burger dot xl drawer mitem acc[data-k]
 *   mchev mlink mactions mcta
 */
export default function useNavbarAnimations(rootRef, { openKey, mobileOpen }) {
  const live = useRef({ openKey, mobileOpen });
  live.current = { openKey, mobileOpen };

  const sync = useRef(null);
  const entered = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const q = (name, scope = root) => gsap.utils.toArray(scope.querySelectorAll(`[data-n="${name}"]`));
    const one = (name, scope = root) => scope.querySelector(`[data-n="${name}"]`);

    /* resolve any CSS length (clamp / rem / vw) to px */
    const px = (expr) => {
      const probe = document.createElement('div');
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:${expr};height:0`;
      root.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      root.removeChild(probe);
      return w;
    };

    /* keep --cw exactly equal to the pages' container (same formula, minus the scrollbar) */
    const setCw = () => {
      const W = root.clientWidth || window.innerWidth;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const padX = px('var(--pad-x)');
      root.style.setProperty('--cw', `${Math.min(W - 2 * padX, Math.max(0.76 * W, 60 * rem))}px`);
    };
    setCw();

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desk: '(min-width: 1024px)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { motion, desk, fine } = ctx.conditions;
        const K = motion ? 1 : 0;
        const d = (x) => x * K; // durations collapse to 0 for reduced motion

        const off = [];
        const on = (el, type, fn, opts) => {
          if (!el) return;
          el.addEventListener(type, fn, opts);
          off.push(() => el.removeEventListener(type, fn, opts));
        };
        const set = (t, v) => gsap.set(t, v);
        const go = (t, v, instant) => (instant || !motion ? gsap.set(t, v) : gsap.to(t, v));

        const bar = one('bar');
        const glass = one('glass');
        const row = one('row');
        const word = one('word');
        const scrim = one('scrim');

        /* ---------------- wordmark fold / unfold ---------------- */
        let wordShown = null;
        const setWord = (show, instant) => {
          if (wordShown === show) return;
          wordShown = show;
          gsap.killTweensOf(word);
          if (show) {
            go(word, { width: 'auto', autoAlpha: 1, duration: 0.7, ease: 'expo.out', overwrite: 'auto' }, instant);
          } else {
            go(word, { width: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.inOut', overwrite: 'auto' }, instant);
          }
        };

        /* ---------------- scrim ---------------- */
        let scrimShown = null;
        const setScrim = (show, instant) => {
          if (scrimShown === show) return;
          scrimShown = show;
          go(scrim, { autoAlpha: show ? 1 : 0, duration: show ? 0.5 : 0.35, ease: 'power2.out', overwrite: 'auto' }, instant);
        };

        /* =====================================================================
           DESKTOP
           ===================================================================== */
        let scrolled = window.scrollY > SCROLL_AT;
        let applyScroll = () => {};

        if (desk) {
          applyScroll = (s, instant) => {
            const W = root.clientWidth || window.innerWidth;
            const cw = row.getBoundingClientRect().width;
            const full = px('var(--bar-h)');
            const vars = s
              ? { width: cw + 2 * px('var(--pill-pad)'), height: full * 0.88, marginTop: px('var(--pill-gap)'), borderRadius: px('var(--pill-r)') }
              : { width: W, height: full, marginTop: 0, borderRadius: 0 };
            go(bar, { ...vars, duration: 0.8, ease: 'expo.out', overwrite: 'auto' }, instant);
            go(glass, { autoAlpha: s ? 1 : 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }, instant);
            setWord(!s, instant);
          };
          applyScroll(scrolled, true);

          let ticking = false;
          const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
              ticking = false;
              const now = window.scrollY > SCROLL_AT;
              if (now === scrolled) return;
              scrolled = now;
              applyScroll(scrolled, false);
            });
          };
          on(window, 'scroll', onScroll, { passive: true });

          /* re-measure on resize (width / paddings are px values while animated) */
          let rt = 0;
          const onResize = () => {
            clearTimeout(rt);
            rt = setTimeout(() => {
              setCw();
              applyScroll(scrolled, true);
            }, 80);
          };
          on(window, 'resize', onResize);
          off.push(() => clearTimeout(rt));

        } else {
          /* mobile bar always shows its glass */
          set(glass, { autoAlpha: 1 });
          setWord(false, true);
        }

        /* ---------------- entrance (once per mount) ---------------- */
        if (motion && !entered.current) {
          entered.current = true;
          const items = desk
            ? [one('logo'), ...q('trigger'), ...q('login'), ...q('cta')]
            : [one('logo'), one('burger')];
          set(items, { autoAlpha: 0, y: -12 });
          gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.1 });
          if (!desk) gsap.fromTo(bar, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' });
        }

        /* =====================================================================
           DROPDOWN PANELS (desktop)
           ===================================================================== */
        const panels = desk ? q('panel') : [];
        const showPanel = (p, instant) => {
          const groups = q('group', p);
          const links = q('plink', p);
          if (p.__tl) p.__tl.kill();
          gsap.killTweensOf(p);
          set(p, { autoAlpha: 0, y: -12, scale: 0.985, transformOrigin: '50% 0%' });
          set(groups, { autoAlpha: 0, y: 14 });
          set(links, { autoAlpha: 0, x: -8 });
          if (instant || !motion) {
            set([p, groups, links], { autoAlpha: 1, y: 0, x: 0, scale: 1 });
            return;
          }
          p.__tl = gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(p, { autoAlpha: 1, y: 0, scale: 1, duration: 0.65 }, 0)
            .to(groups, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.07 }, 0.05)
            .to(links, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.022 }, 0.16);
        };
        const hidePanel = (p, instant) => {
          if (p.__tl) p.__tl.kill();
          gsap.killTweensOf(p);
          go(p, { autoAlpha: 0, y: -6, duration: 0.2, ease: 'power2.in', overwrite: 'auto' }, instant);
        };
        panels.forEach((p) => set(p, { autoAlpha: 0 }));

        /* =====================================================================
           MOBILE: drawer, burger, accordions
           ===================================================================== */
        const drawer = one('drawer');
        const burgerDots = q('dot');
        const burgerX = q('xl');
        let drawerOpen = null;
        const setDrawer = (open, instant) => {
          if (drawerOpen === open) return;
          const first = drawerOpen === null;
          drawerOpen = open;
          const items = q('mitem', drawer);
          const acts = q('mactions', drawer);
          gsap.killTweensOf([drawer, items, acts]);

          /* glass + wordmark + burger */
          go(glass, { backgroundColor: open ? 'rgba(13,16,23,0.92)' : 'rgba(13,16,23,0.66)', duration: 0.5, ease: 'power2.out', overwrite: 'auto' }, instant);
          setWord(open, instant);

          if (open) {
            go(burgerDots, { scale: 0, autoAlpha: 0, duration: 0.3, ease: 'back.in(2)', stagger: 0.04, overwrite: 'auto' }, instant);
            go(burgerX, { scaleX: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.07, delay: first ? 0 : 0.18, overwrite: 'auto' }, instant);
            set(drawer, { overflowY: 'hidden', visibility: 'visible' });
            if (instant || !motion) {
              set(drawer, { height: 'auto', autoAlpha: 1, overflowY: 'auto' });
              set([items, acts], { autoAlpha: 1, y: 0 });
            } else {
              set([items, acts], { autoAlpha: 0, y: 16 });
              gsap
                .timeline({ defaults: { ease: 'expo.out' } })
                .to(drawer, { height: 'auto', autoAlpha: 1, duration: 0.8 }, 0)
                .to(items, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.055 }, 0.12)
                .to(acts, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.12 + items.length * 0.055)
                .add(() => set(drawer, { overflowY: 'auto' }));
            }
          } else {
            set(drawer, { overflowY: 'hidden' });
            go(burgerX, { scaleX: 0, duration: 0.25, ease: 'power2.in', stagger: 0.04, overwrite: 'auto' }, instant);
            go(burgerDots, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.07, delay: first ? 0 : 0.15, overwrite: 'auto' }, instant);
            go(drawer, { height: 0, autoAlpha: 0, duration: 0.5, ease: 'power3.inOut', overwrite: 'auto' }, instant);
          }
        };

        const accs = desk ? [] : q('acc');
        const setAcc = (el, open, instant) => {
          if (el.__o === open) return;
          const first = el.__o === undefined;
          el.__o = open;
          const links = q('mlink', el);
          const chev = el.parentElement.querySelector('[data-n="mchev"]');
          gsap.killTweensOf([el, links]);
          if (first || instant || !motion) {
            set(el, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0 });
            set(links, { autoAlpha: 1, x: 0 });
            if (chev) set(chev, { rotation: open ? 180 : 0 });
            return;
          }
          if (chev) gsap.to(chev, { rotation: open ? 180 : 0, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' });
          if (open) {
            set(links, { autoAlpha: 0, x: -10 });
            gsap
              .timeline({ defaults: { ease: 'expo.out' } })
              .to(el, { height: 'auto', autoAlpha: 1, duration: 0.7 }, 0)
              .to(links, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.03 }, 0.08);
          } else {
            gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.inOut' });
          }
        };

        /* ---------------- initial states ---------------- */
        if (!desk) {
          set(burgerX, { scaleX: 0, rotation: (i) => (i === 0 ? 45 : -45) });
          drawerOpen = null;
        }

        /* =====================================================================
           sync(): bring everything in line with React state
           ===================================================================== */
        const syncAll = (instant) => {
          const { openKey: key, mobileOpen: mOpen } = live.current;

          if (desk) {
            panels.forEach((p) => {
              const want = p.dataset.k === key;
              if (p.__o === want) return;
              const first = p.__o === undefined;
              p.__o = want;
              if (want) showPanel(p, instant);
              else if (!first) hidePanel(p, instant);
            });
            q('trigger').forEach((t) => {
              const chev = one('chev', t);
              if (chev) go(chev, { rotation: t.dataset.k === key ? 180 : 0, duration: 0.45, ease: 'back.out(2)', overwrite: 'auto' }, instant);
            });
            setScrim(key !== null, instant);
          } else {
            setDrawer(mOpen, instant);
            accs.forEach((el) => setAcc(el, el.dataset.k === key, instant));
            setScrim(mOpen, instant);
          }
        };
        sync.current = syncAll;
        syncAll(true);

        /* =====================================================================
           HOVERS / PRESS
           ===================================================================== */
        if (desk && fine && motion) {
          /* highlight pill glides between items */
          const menu = one('menu');
          const hl = one('hl');
          if (menu && hl) {
            const xTo = gsap.quickTo(hl, 'x', { duration: 0.55, ease: 'power3' });
            const yTo = gsap.quickTo(hl, 'y', { duration: 0.55, ease: 'power3' });
            const wTo = gsap.quickTo(hl, 'width', { duration: 0.55, ease: 'power3' });
            const hTo = gsap.quickTo(hl, 'height', { duration: 0.55, ease: 'power3' });
            let shown = false;
            on(menu, 'pointerover', (e) => {
              const t = e.target.closest('[data-n="trigger"]');
              if (!t || !menu.contains(t)) return;
              if (!shown) {
                shown = true;
                set(hl, { x: t.offsetLeft, y: t.offsetTop, width: t.offsetWidth, height: t.offsetHeight });
                gsap.to(hl, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
              } else {
                xTo(t.offsetLeft);
                yTo(t.offsetTop);
                wTo(t.offsetWidth);
                hTo(t.offsetHeight);
              }
            });
            on(menu, 'pointerleave', () => {
              shown = false;
              gsap.to(hl, { autoAlpha: 0, duration: 0.35, overwrite: 'auto' });
            });
          }

          /* dropdown links: nudge + brighten */
          q('plink').forEach((l) => {
            on(l, 'pointerenter', () => gsap.to(l, { x: 6, color: '#ffffff', duration: 0.35, ease: 'power3.out', overwrite: 'auto' }));
            on(l, 'pointerleave', () => gsap.to(l, { x: 0, color: 'rgba(255,255,255,0.78)', duration: 0.5, ease: 'power3.out', overwrite: 'auto' }));
          });

          /* Log in: underline draws */
          q('login').forEach((l) => {
            const line = one('loginLine', l);
            on(l, 'pointerenter', () => gsap.to(line, { scaleX: 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' }));
            on(l, 'pointerleave', () => {
              gsap.set(line, { transformOrigin: '100% 50%' });
              gsap.to(line, { scaleX: 0, duration: 0.4, ease: 'expo.out', overwrite: 'auto', onComplete: () => gsap.set(line, { transformOrigin: '0% 50%' }) });
            });
          });

          /* CTA: magnet + colour + light sweep */
          q('cta').forEach((c) => {
            const sheen = one('sheen', c);
            const xTo = gsap.quickTo(c, 'x', { duration: 0.5, ease: 'power3' });
            const yTo = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' });
            on(c, 'pointermove', (e) => {
              const r = c.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.2);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
            });
            on(c, 'pointerenter', () => {
              gsap.to(c, { backgroundColor: '#d1030d', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
              gsap.fromTo(sheen, { xPercent: -130 }, { xPercent: 380, duration: 0.9, ease: 'power2.inOut' });
            });
            on(c, 'pointerleave', () => {
              xTo(0);
              yTo(0);
              gsap.to(c, { backgroundColor: '#ed040f', duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            });
          });

          /* logo mark: tiny tilt */
          // const logo = one('logo');
          // const mark = one('mark');
          // if (logo && mark) {
          //   on(logo, 'pointerenter', () => gsap.to(mark, { rotation: -8, scale: 1.1, duration: 0.5, ease: 'back.out(2.5)', overwrite: 'auto' }));
          //   on(logo, 'pointerleave', () => gsap.to(mark, { rotation: 0, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }));
          // }
        }

        /* press feedback on touch devices */
        if (!desk && motion) {
          [...q('burger'), ...q('mcta')].forEach((el) => {
            on(el, 'pointerdown', () => gsap.to(el, { scale: 0.92, duration: 0.18, ease: 'power2.out', overwrite: 'auto' }));
            const up = () => gsap.to(el, { scale: 1, duration: 0.45, ease: 'back.out(3)', overwrite: 'auto' });
            on(el, 'pointerup', up);
            on(el, 'pointerleave', up);
            on(el, 'pointercancel', up);
          });
        }

        return () => {
          off.forEach((fn) => fn());
          sync.current = null;
        };
      }
    );

    return () => {
      mm.revert();
      sync.current = null;
    };
  }, [rootRef]);

  /* React state -> tweens */
  useLayoutEffect(() => {
    if (sync.current) sync.current(false);
  }, [openKey, mobileOpen]);
}