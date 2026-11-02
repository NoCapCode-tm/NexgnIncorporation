

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Help Center animations (GSAP + ScrollTrigger). Same motion language as the Legal Hub pages:
 *   - hero title + search rise in
 *   - every category fades/slides in on scroll (both directions)
 *   - the active category is full strength, the others fade back (desktop), hover brings one forward
 *   - sidebar indicator slides to the active category, the "01 / 08" counter flips
 *   - categories and questions open/close as accordions (height tween)
 *   - hovers on buttons, nav items and links
 *
 * Markup contract (data-h = element role, data-hv = hover behaviour):
 *   rise search          hero pieces
 *   article block[data-cat]   category wrapper / the part that fades when inactive
 *   collapse[data-open]  accordion body (category body or answer)
 *   chev[data-open]      chevron badge
 *   indicator navitem[data-cat] counter     sidebar
 *   hv: lift link clear dark catbtn qbtn navitem
 *
 * Reduced motion: no tweens at all. The CSS has instant fallbacks keyed on data-open.
 */

const MQ_REDUCED = '(prefers-reduced-motion: reduce)';
const MQ_DESK = '(min-width: 900px)';
const reduced = () => typeof window !== 'undefined' && window.matchMedia(MQ_REDUCED).matches;

let refreshTimer = 0;
const refreshSoon = () => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 80);
};

export default function useHelpCenterAnimations(rootRef, { activeCategory, isSearching, catKey }) {
  const live = useRef({ activeCategory, isSearching });
  live.current = { activeCategory, isSearching };

  const lastKey = useRef(null);
  const lastOrient = useRef(null);
  const indicatorSeen = useRef(false);
  const lastCounter = useRef(null);
  const navColors = useRef(new Map());

  /* ---------- hero entrance, search focus, delegated hovers ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine)',
        desk: MQ_DESK,
      },
      (ctx) => {
        const { motion, fine, desk } = ctx.conditions;
        if (!motion) return undefined;

        const cs = getComputedStyle(root);
        const v = (n, f) => cs.getPropertyValue(n).trim() || f;
        const C = {
          ink: v('--ink', '#0d1017'),
          soft: v('--soft', '#7a8296'),
          grey: v('--grey', '#f2f4f6'),
          dark: v('--dark', '#0d1017'),
        };
        const off = [];
        const on = (el, type, fn) => {
          el.addEventListener(type, fn);
          off.push(() => el.removeEventListener(type, fn));
        };

        /* hero */
        const rise = gsap.utils.toArray(root.querySelectorAll('[data-h~="rise"]'));
        gsap.set(rise, { autoAlpha: 0, y: 16 });
        gsap.to(rise, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.05 });

        /* search bar lifts when focused */
        const search = root.querySelector('[data-h~="search"]');
        if (search) {
          const rest = '0 20px 50px 0 rgba(0,0,0,0.28), 0 0 0 2px rgba(255,255,255,0)';
          const focus = '0 24px 60px 0 rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.25)';
          gsap.set(search, { boxShadow: rest });
          on(search, 'focusin', () =>
            gsap.to(search, { y: -1, boxShadow: focus, duration: 0.35, ease: 'power3.out', overwrite: 'auto' }),
          );
          on(search, 'focusout', () =>
            gsap.to(search, { y: 0, boxShadow: rest, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }),
          );
        }

        /* hover table (event delegation, so it also covers elements that mount later) */
        const SHADOW0 = '0 0 0 0 rgba(13,16,23,0)';
        const HV = {
          lift: {
            init: { boxShadow: SHADOW0 },
            enter: { y: -2, backgroundColor: '#1c2230', boxShadow: '0 10px 24px -8px rgba(13,16,23,0.45)' },
            leave: { y: 0, backgroundColor: C.dark, boxShadow: SHADOW0 },
            clear: 'y,backgroundColor',
          },
          link: { enter: { color: C.ink }, leave: { color: C.soft }, clear: 'color' },
          clear: {
            enter: { backgroundColor: '#e2e5e9', color: C.ink },
            leave: { backgroundColor: C.grey, color: C.soft },
            clear: 'backgroundColor,color',
          },
          dark: { enter: { backgroundColor: '#1c2230' }, leave: { backgroundColor: C.dark }, clear: 'backgroundColor' },
          catbtn: {
            target: (el) => el.querySelector('[data-h="chev"]'),
            enter: { backgroundColor: '#e5e8ec' },
            leave: { backgroundColor: C.grey },
            clear: 'backgroundColor',
          },
          qbtn: {
            target: (el) => el.querySelector('[data-h="qicon"]'),
            enter: { color: C.ink },
            leave: { color: C.soft },
            clear: 'color',
          },
          navitem: {
            deskOnly: true,
            enter: { x: 3, color: C.ink },
            leave: (el) => ({ x: 0, color: el.hasAttribute('aria-current') ? C.ink : C.soft }),
            clear: 'x,color',
          },
        };

        const runHover = (el, dir) => {
          const spec = HV[el.dataset.hv];
          if (!spec || (spec.deskOnly && !desk)) return;
          const target = spec.target ? spec.target(el) : el;
          if (!target) return;
          if (dir === 'enter') {
            if (spec.init && !target.__hvInit) {
              gsap.set(target, spec.init);
              target.__hvInit = true;
            }
            if (el.hasAttribute('aria-current') && el.dataset.hv === 'navitem') return;
            gsap.to(target, { ...spec.enter, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
          } else {
            const vars = typeof spec.leave === 'function' ? spec.leave(el) : spec.leave;
            gsap.to(target, {
              ...vars,
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => gsap.set(target, { clearProps: spec.clear }),
            });
          }
        };

        const fadeTo = (block, opacity) =>
          gsap.to(block, { opacity, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });

        if (fine) {
          const onOver = (e) => {
            const hv = e.target.closest?.('[data-hv]');
            if (hv && root.contains(hv) && !hv.contains(e.relatedTarget)) runHover(hv, 'enter');
            const block = e.target.closest?.('[data-h="block"]');
            if (block && desk && block.dataset.fade === 'off' && !block.contains(e.relatedTarget)) fadeTo(block, 0.65);
          };
          const onOut = (e) => {
            const hv = e.target.closest?.('[data-hv]');
            if (hv && root.contains(hv) && !hv.contains(e.relatedTarget)) runHover(hv, 'leave');
            const block = e.target.closest?.('[data-h="block"]');
            if (block && desk && block.dataset.fade === 'off' && !block.contains(e.relatedTarget)) fadeTo(block, 0.3);
          };
          on(root, 'pointerover', onOver);
          on(root, 'pointerout', onOut);
        }

        // keyboard focus also brings a faded category forward
        on(root, 'focusin', (e) => {
          const block = e.target.closest?.('[data-h="block"]');
          if (block && desk && block.dataset.fade === 'off') fadeTo(block, 0.65);
        });
        on(root, 'focusout', (e) => {
          const block = e.target.closest?.('[data-h="block"]');
          if (block && desk && block.dataset.fade === 'off' && !block.contains(e.relatedTarget)) fadeTo(block, 0.3);
        });

        return () => off.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, [rootRef]);

  /* ---------- category reveal on scroll (plays in both directions) ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray(root.querySelectorAll('[data-h="article"]')).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play reverse play reverse' },
          },
        );
      });
    });

    return () => mm.revert();
  }, [rootRef, catKey]);

  /* ---------- focus-fade: active category full strength, others fade back (desktop) ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mq = window.matchMedia(MQ_DESK);

    const apply = (force) => {
      const instant = force || lastKey.current !== catKey;
      lastKey.current = catKey;
      const blocks = gsap.utils.toArray(root.querySelectorAll('[data-h="block"]'));
      const fade = mq.matches && !reduced();
      blocks.forEach((b) => {
        const on = !fade || live.current.isSearching || b.dataset.cat === live.current.activeCategory;
        b.dataset.fade = on ? 'on' : 'off';
        if (!fade) {
          gsap.set(b, { clearProps: 'opacity,x,transform' });
          return;
        }
        const vars = on ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -10 };
        if (instant) gsap.set(b, vars);
        else gsap.to(b, { ...vars, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      });
    };

    apply(false);
    const onChange = () => apply(true);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [rootRef, activeCategory, isSearching, catKey]);

  /* ---------- sidebar: sliding indicator, nav colour, counter flip ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const ind = root.querySelector('[data-h="indicator"]');
    const list = ind?.parentElement;
    if (!ind || !list) return undefined;

    const move = (forceInstant) => {
      const item = root.querySelector(`[data-h="navitem"][data-cat="${live.current.activeCategory}"]`);
      if (!item) return;
      const horizontal = getComputedStyle(list).flexDirection === 'row';
      const orient = horizontal ? 'h' : 'v';
      let instant = forceInstant || !indicatorSeen.current || reduced();
      if (lastOrient.current !== orient) {
        gsap.set(ind, { clearProps: 'x,y,width,height,transform' });
        lastOrient.current = orient;
        instant = true;
      }
      indicatorSeen.current = true;
      const vars = horizontal
        ? { x: item.offsetLeft, width: item.offsetWidth }
        : { y: item.offsetTop, height: item.offsetHeight };
      if (instant) gsap.set(ind, vars);
      else gsap.to(ind, { ...vars, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    };

    move(false);

    /* nav label colours cross-fade between active and inactive */
    if (!reduced()) {
      root.querySelectorAll('[data-h="navitem"]').forEach((item) => {
        const now = getComputedStyle(item).color;
        const prev = navColors.current.get(item);
        navColors.current.set(item, now);
        if (prev && prev !== now) {
          gsap.fromTo(item, { color: prev }, { color: now, duration: 0.3, clearProps: 'color', overwrite: 'auto' });
        }
      });

      const counter = root.querySelector('[data-h="counter"]');
      if (counter && lastCounter.current !== null && lastCounter.current !== live.current.activeCategory) {
        gsap.fromTo(counter, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
      }
    }
    lastCounter.current = live.current.activeCategory;

    const onResize = () => move(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [rootRef, activeCategory]);

  /* ---------- accordions: runs after every render, diffs against what each node last showed ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced()) return;

    root.querySelectorAll('[data-h="collapse"]').forEach((el) => {
      const open = el.dataset.open === 'true';
      if (el.__open === undefined) {
        el.__open = open;
        gsap.set(el, open ? { height: 'auto', autoAlpha: 1 } : { height: 0, autoAlpha: 0 });
        return;
      }
      if (el.__open === open) return;
      el.__open = open;
      gsap.to(
        el,
        open
          ? { height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'power3.out', overwrite: true, onComplete: refreshSoon }
          : { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.inOut', overwrite: true, onComplete: refreshSoon },
      );
    });

    root.querySelectorAll('[data-h="chev"]').forEach((el) => {
      const open = el.dataset.open === 'true';
      if (el.__open === undefined) {
        el.__open = open;
        gsap.set(el, { rotation: open ? 180 : 0 });
        return;
      }
      if (el.__open === open) return;
      el.__open = open;
      gsap.to(el, {
        rotation: open ? 180 : 0,
        duration: 0.45,
        ease: open ? 'back.out(1.6)' : 'power3.out',
        overwrite: 'auto',
      });
    });
  });

  /* ---------- web fonts change heights: re-measure trigger positions ---------- */
  useLayoutEffect(() => {
    document.fonts?.ready?.then(refreshSoon).catch(() => {});
  }, []);
}