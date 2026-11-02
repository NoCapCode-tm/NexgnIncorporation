import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer animations (GSAP + ScrollTrigger).
 *
 * What it does
 *   - top hairline draws outward from the centre
 *   - every link column reveals on its own scroll trigger (so on mobile, rows reveal as you reach
 *     them): headings rise, links slide up out of a mask, left to right
 *   - the wordmark letters rise out of the baseline, the whole wordmark drifts with the scroll,
 *     a soft red glow sweeps across it with the scroll (and follows the mouse on desktop),
 *     letters lift gently near the pointer, the red x breathes while it is on screen
 *   - divider draws left to right, bottom bar items cascade, social icons pop in
 *   - hovers: underline draws + nudge + the other links in the column dim, social icons are
 *     magnetic with the glyph moving a little further than the button, language globe spins
 *
 * All distances are percentages of the element itself (yPercent / xPercent) or measured from the
 * element's own size, so the motion scales from a 320px phone to 4K without media-query tuning.
 * Every reveal uses "play reverse play reverse": it plays scrolling down and scrolling back up.
 *
 * Markup contract (data-f is a space separated list, matched with ~=):
 *   edge  col  letter[data-accent]  word  spot  rule  bottom  pop
 *   link  social  built  lang
 *
 * Nothing is hidden in CSS. GSAP sets the start states before paint, so reduced-motion users
 * (no GSAP at all) just see the finished footer.
 */

const TOGGLE = 'play reverse play reverse';
// links are revealed through this window: the top and sides stay open, the bottom edge is the mask
const MASK = 'inset(-0.6em -2em 0em -2em)';

export default function useFooterAnimations(rootRef, routeKey) {
  /* ================= scroll reveals ================= */
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

        const q = (name, scope = root) => gsap.utils.toArray(scope.querySelectorAll(`[data-f~="${name}"]`));
        const one = (name) => root.querySelector(`[data-f~="${name}"]`);
        const clamp = gsap.utils.clamp;
        const off = [];
        const on = (el, type, fn) => {
          el.addEventListener(type, fn);
          off.push(() => el.removeEventListener(type, fn));
        };

        const cs = getComputedStyle(root);
        const v = (n, f) => cs.getPropertyValue(n).trim() || f;
        const C = { text: v('--text', '#fafbfb'), muted: v('--muted', '#9aa0a9'), line: v('--line', '#262a33') };

        /* ---------- 1. top hairline ---------- */
        const edge = one('edge');
        if (edge) {
          gsap.set(edge, { scaleX: 0, opacity: 0, transformOrigin: '50% 50%' });
          gsap.to(edge, {
            scaleX: 1,
            opacity: 1,
            duration: 1.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: root, start: 'top 96%', toggleActions: TOGGLE },
          });
        }

        /* ---------- 2. link columns: one trigger per column ---------- */
        const cols = q('col');
        // columns that share a row get a left-to-right stagger; a new row starts again at 0
        const rowTops = [];
        cols.forEach((col) => {
          const top = Math.round(col.offsetTop);
          let row = rowTops.find((r) => Math.abs(r.top - top) < 4);
          if (!row) rowTops.push((row = { top, n: 0 }));
          col.dataset.fi = row.n++;
        });

        cols.forEach((col) => {
          const heading = col.querySelector('h3');
          const lis = [...col.querySelectorAll('li')];
          const links = lis.map((li) => li.firstElementChild);
          const d = Number(col.dataset.fi) * 0.08;

          gsap.set(heading, { autoAlpha: 0, yPercent: 70 });
          gsap.set(links, { yPercent: 120, autoAlpha: 0 });
          gsap.set(lis, { clipPath: MASK });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: col,
              start: 'top 93%',
              toggleActions: TOGGLE,
              // going back up: close the mask before the links slide down
              onLeaveBack: () => gsap.set(lis, { clipPath: MASK }),
            },
            // revealed: remove the mask so focus rings and hover nudges are never clipped
            onComplete: () => gsap.set(lis, { clearProps: 'clipPath' }),
          });
          tl.to(heading, { autoAlpha: 1, yPercent: 0, duration: 0.9, ease: 'power4.out' }, d);
          tl.to(links, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.055 }, d + 0.08);
          tl.to(links, { autoAlpha: 1, duration: 0.45, ease: 'power2.out', stagger: 0.055 }, d + 0.08);
        });

        /* ---------- 3. wordmark ---------- */
        const word = one('word');
        const letters = q('letter');
        const spot = one('spot');

        if (word && letters.length) {
          gsap.set(letters, { yPercent: 150 });
          const wordTl = gsap.timeline({
            scrollTrigger: { trigger: word, start: 'top 94%', toggleActions: TOGGLE },
          });
          wordTl.to(letters, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.08 });

          // the whole wordmark settles into place as the page reaches its end
          gsap.fromTo(
            word,
            { yPercent: 12 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
            },
          );

          /* red glow: sweeps with the scroll, follows the pointer on desktop */
          if (spot) {
            const W = () => word.clientWidth;
            gsap.set(spot, { xPercent: -50, x: () => W() * 0.18, opacity: 0 });
            wordTl.to(spot, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0.15);

            const xTo = gsap.quickTo(spot, 'x', { duration: 1, ease: 'power3.out' });
            let pointerOver = false;
            let progress = 0;
            ScrollTrigger.create({
              trigger: root,
              start: 'top bottom',
              end: 'bottom bottom',
              onUpdate: (self) => {
                progress = self.progress;
                if (!pointerOver) xTo(W() * (0.18 + 0.64 * progress));
              },
            });

            if (fine) {
              const fontPx = () => parseFloat(getComputedStyle(word).fontSize) || 16;
              const yTos = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3.out' }));

              on(root, 'pointermove', (e) => {
                const r = word.getBoundingClientRect();
                pointerOver = true;
                xTo(clamp(0, W(), e.clientX - r.left));

                // letters near the pointer lift a little; fades out away from the wordmark's height
                const vy = clamp(0, 1, 1 - Math.abs(e.clientY - (r.top + r.height / 2)) / (r.height * 1.1));
                letters.forEach((l, i) => {
                  const lr = l.getBoundingClientRect();
                  const dx = (e.clientX - (lr.left + lr.width / 2)) / (lr.width * 1.3);
                  yTos[i](-Math.exp(-dx * dx) * vy * fontPx() * 0.05);
                });
              });
              on(root, 'pointerleave', () => {
                pointerOver = false;
                xTo(W() * (0.18 + 0.64 * progress));
                yTos.forEach((fn) => fn(0));
              });
            }
          }

          /* the red x breathes while the wordmark is on screen */
          const accent = letters.find((l) => l.dataset.accent === 'true');
          if (accent) {
            gsap.set(accent, { textShadow: '0 0 0em rgba(238,5,16,0)' });
            const breathe = gsap.to(accent, {
              textShadow: '0 0 0.2em rgba(238,5,16,0.5)',
              duration: 2.6,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              paused: true,
            });
            ScrollTrigger.create({
              trigger: word,
              start: 'top 95%',
              end: 'bottom top',
              onToggle: (self) => (self.isActive ? breathe.play() : breathe.pause()),
            });
          }
        }

        /* ---------- 4. divider + bottom bar ---------- */
        const rule = one('rule');
        const bottoms = q('bottom');
        if (rule) {
          gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: rule, start: 'top 99%', toggleActions: TOGGLE },
          });
          tl.to(rule, { scaleX: 1, duration: 1.5, ease: 'power4.inOut' });

          if (bottoms.length) {
            const pops = bottoms.filter((el) => el.dataset.f.split(' ').includes('pop'));
            gsap.set(bottoms, { autoAlpha: 0, yPercent: 60 });
            gsap.set(pops, { scale: 0.6 });
            tl.to(
              bottoms,
              { autoAlpha: 1, yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.09 },
              0.3,
            );
            tl.to(pops, { scale: 1, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.09 }, 0.55);
          }
        }

        /* ---------- 5. hovers (mouse / trackpad only) ---------- */
        if (fine) {
          const px = (el) => parseFloat(getComputedStyle(el).fontSize) || 16;

          /* text links: underline draws, nudge, siblings in the column dim */
          const dimSiblings = (link, dim) => {
            const list = link.closest('ul');
            if (!list) return;
            [...list.children].forEach((li) => {
              const isSelf = li.contains(link);
              gsap.to(li, { opacity: dim && !isSelf ? 0.4 : 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            });
          };
          q('link').forEach((el) => {
            on(el, 'pointerenter', () => {
              gsap.to(el, {
                x: px(el) * 0.28,
                color: C.text,
                '--u': '100%',
                duration: 0.45,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              dimSiblings(el, true);
            });
            on(el, 'pointerleave', (e) => {
              gsap.to(el, {
                x: 0,
                color: C.muted,
                '--u': '0%',
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'color,x,transform' }),
              });
              // moving straight onto another link keeps the dimming; leaving the list restores it
              const next = e.relatedTarget && e.relatedTarget.closest?.('[data-f~="link"]');
              if (!next || next.closest('ul') !== el.closest('ul')) dimSiblings(el, false);
            });
          });

          /* social buttons: magnetic, glyph travels a little further than the button */
          q('social').forEach((el) => {
            const glyph = el.querySelector('svg');
            const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
            const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
            const gx = glyph ? gsap.quickTo(glyph, 'x', { duration: 0.5, ease: 'power3.out' }) : null;
            const gy = glyph ? gsap.quickTo(glyph, 'y', { duration: 0.5, ease: 'power3.out' }) : null;

            on(el, 'pointerenter', () =>
              gsap.to(el, {
                scale: 1.08,
                color: C.text,
                borderColor: C.muted,
                backgroundColor: 'rgba(255,255,255,0.06)',
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
              }),
            );
            on(el, 'pointermove', (e) => {
              const r = el.getBoundingClientRect();
              const dx = e.clientX - (r.left + r.width / 2);
              const dy = e.clientY - (r.top + r.height / 2);
              xTo(dx * 0.25);
              yTo(dy * 0.25 - 2);
              gx?.(dx * 0.18);
              gy?.(dy * 0.18);
            });
            on(el, 'pointerleave', () => {
              xTo(0);
              yTo(0);
              gx?.(0);
              gy?.(0);
              gsap.to(el, {
                scale: 1,
                color: C.muted,
                borderColor: C.line,
                backgroundColor: 'rgba(255,255,255,0)',
                duration: 0.6,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'color,borderColor,backgroundColor,scale' }),
              });
            });
          });

          /* NoCapCode link: colour + underline that draws in */
          q('built').forEach((el) => {
            gsap.set(el, { '--u': '0%' });
            on(el, 'pointerenter', () =>
              gsap.to(el, { color: C.text, '--u': '100%', duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, {
                color: C.muted,
                '--u': '0%',
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'color' }),
              }),
            );
          });

          /* language picker: brighten + globe spin */
          q('lang').forEach((el) => {
            const globe = el.querySelector('svg');
            on(el, 'pointerenter', () => {
              gsap.to(el, { color: C.text, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
              if (globe) gsap.to(globe, { rotation: '+=360', duration: 1, ease: 'power3.inOut' });
            });
            on(el, 'pointerleave', () =>
              gsap.to(el, {
                color: C.muted,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(el, { clearProps: 'color' }),
              }),
            );
          });
        }

        return () => off.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, [rootRef]);

  /* ================= keep trigger positions right when the page height changes ================= */
  useLayoutEffect(() => {
    let raf = 0;
    let timer = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = requestAnimationFrame(() => {
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
    };

    refresh(); // route changed: lazy page content is mounting

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(refresh);
      ro.observe(document.body);
    }
    // webfonts (MuseoModerno, DM Sans) change the wordmark and column heights
    document.fonts?.ready?.then(refresh).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro?.disconnect();
    };
  }, [routeKey]);
}