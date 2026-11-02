import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Security page animations (GSAP + ScrollTrigger). Same motion language as Footer / Help Center:
 *   - hero: photo settles in, frosted card rises, headline words slide up out of a mask,
 *     hairline draws across the card top, photo + card drift at different speeds on scroll
 *   - section heads: eyebrow, headline words (mask), lead
 *   - grids (features, pillars, telemetry, checks, certs, resources): rows reveal as they are
 *     reached (ScrollTrigger.batch), rules draw, icons pop
 *   - media slots: scale-in + one light sweep (placeholders) / scroll parallax (real images)
 *   - quote band: words light up as you scroll (scrubbed)
 *   - hovers (fine pointers only): magnetic buttons, cursor spotlight + lift on cards,
 *     resource arrow, telemetry icon, certification logo
 * Every reveal plays in both scroll directions.
 *
 * Markup contract (data-s = role, data-hv = hover behaviour):
 *   hero photo card cardline hr(eyebrow,lead,actions in DOM order)
 *   head r w          section header: r = fade-up pieces (first one = eyebrow), w = headline words
 *   r                 standalone fade-up piece (eyebrow outside a head)
 *   item line pop     grid items / hairline inside an item / icon inside an item
 *   media mediaImg sheen
 *   quote qw          quote band + its words
 *   rule              hr that draws
 *   magnet            button magnet     spot   card spotlight + lift
 *   hv: primary outline res tele cert
 *
 * Reduced motion: no tweens at all. The CSS has instant fallbacks.
 */

const TA = 'play reverse play reverse';
/* One distance unit that grows with the viewport: ~14px on a phone, ~32px at 1440, ~85px at 4K. */
const U = () => gsap.utils.clamp(14, 90, window.innerWidth / 45);

export default function useSecurityAnimations(rootRef, { lng } = {}) {
  /* ---------- reveals + hovers ---------- */
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

        const cs = getComputedStyle(root);
        const v = (n, f) => cs.getPropertyValue(n).trim() || f;
        const C = {
          ink: v('--ink', '#0d1017'),
          soft: v('--ink-soft', '#5b6270'),
          white: v('--white', '#ffffff'),
          red: v('--red', '#ee0510'),
        };
        const off = [];
        const on = (el, type, fn) => {
          el.addEventListener(type, fn);
          off.push(() => el.removeEventListener(type, fn));
        };
        const sel = (s, scope = root) => gsap.utils.toArray(scope.querySelectorAll(s));

        /* ================= HERO ================= */
        const hero = root.querySelector('[data-s="hero"]');
        if (hero) {
          const photo = hero.querySelector('[data-s="photo"]');
          const card = hero.querySelector('[data-s="card"]');
          const line = hero.querySelector('[data-s="cardline"]');
          const words = sel('[data-s="w"]', hero);
          const [eyebrow, lead, actions] = sel('[data-s~="hr"]', hero);

          gsap.set(photo, { scale: 1.14 });
          gsap.set(card, { autoAlpha: 0, y: () => U() * 1.6, scale: 0.97 });
          gsap.set(line, { scaleX: 0 });
          gsap.set(words, { yPercent: 125 });
          gsap.set([eyebrow, lead, actions], { autoAlpha: 0, y: () => U() * 0.6 });

          gsap
            .timeline({ defaults: { ease: 'expo.out' }, delay: 0.05 })
            .to(photo, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
            .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 }, 0.1)
            .to(line, { scaleX: 1, duration: 1.9 }, 0.5)
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 1 }, 0.4)
            .to(words, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0.5)
            .to(lead, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.0)
            .to(actions, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.15);

          /* depth on scroll: photo and card drift at different speeds */
          const drift = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
          gsap.to(photo, { yPercent: 9, ease: 'none', scrollTrigger: drift });
          gsap.to(card, { yPercent: -7, ease: 'none', scrollTrigger: drift });
        }

        /* ================= SECTION HEADS ================= */
        sel('[data-s="head"]').forEach((head) => {
          const r = sel('[data-s~="r"]', head);
          const w = sel('[data-s="w"]', head);
          const [first, ...others] = r;
          gsap.set(r, { autoAlpha: 0, y: () => U() * 0.6 });
          gsap.set(w, { yPercent: 125 });
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: TA },
          });
          if (first) tl.to(first, { autoAlpha: 1, y: 0, duration: 0.9 }, 0);
          tl.to(w, { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.08);
          if (others.length) tl.to(others, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.35);
        });

        /* standalone eyebrows */
        sel('[data-s~="r"]')
          .filter((e) => !e.closest('[data-s="head"]') && !e.closest('[data-s="hero"]'))
          .forEach((el) => {
            gsap.set(el, { autoAlpha: 0, y: () => U() * 0.6 });
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: TA },
            });
          });

        /* ================= GRID ITEMS (rows reveal as reached) ================= */
        const items = sel('[data-s~="item"]');
        const lines = sel('[data-s~="line"]');
        const pops = sel('[data-s~="pop"]');
        gsap.set(items, { autoAlpha: 0, y: () => U() * 1.4 });
        gsap.set(lines, { scaleX: 0, transformOrigin: '0% 50%' });
        gsap.set(pops, { scale: 0.4, autoAlpha: 0 });

        const inside = (els, s) => els.flatMap((e) => sel(s, e));
        const showItems = (els) => {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, overwrite: 'auto' });
          const ln = inside(els, '[data-s~="line"]');
          const pp = inside(els, '[data-s~="pop"]');
          if (ln.length) gsap.to(ln, { scaleX: 1, duration: 1.3, ease: 'expo.out', stagger: 0.1, delay: 0.15, overwrite: 'auto' });
          if (pp.length) gsap.to(pp, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.1, delay: 0.25, overwrite: 'auto' });
        };
        const hideItems = (els) => {
          gsap.to(els, { autoAlpha: 0, y: U() * 1.4, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
          const ln = inside(els, '[data-s~="line"]');
          const pp = inside(els, '[data-s~="pop"]');
          if (ln.length) gsap.to(ln, { scaleX: 0, duration: 0.3, overwrite: 'auto' });
          if (pp.length) gsap.to(pp, { scale: 0.4, autoAlpha: 0, duration: 0.3, overwrite: 'auto' });
        };
        if (items.length) {
          /* Callbacks are batched, so after a big scroll jump (Home key, scrollbar drag, anchor link)
             a trigger can report "enter back" and "leave back" in the same frame and they may run in
             either order. The final state is therefore read from the trigger itself, not from which
             callback happened to fire. */
          const apply = (els, trigs) => {
            const on = els.filter((_, i) => trigs[i].isActive);
            const off = els.filter((_, i) => !trigs[i].isActive);
            if (on.length) showItems(on);
            if (off.length) hideItems(off);
          };
          ScrollTrigger.batch(items, {
            start: 'top 90%',
            interval: 0.12,
            onEnter: apply,
            onEnterBack: apply,
            onLeave: apply,
            onLeaveBack: apply,
          });
        }

        /* ================= RULE ================= */
        sel('[data-s="rule"]').forEach((rule) => {
          gsap.set(rule, { scaleX: 0, transformOrigin: '0% 50%' });
          gsap.to(rule, {
            scaleX: 1,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: rule, start: 'top 92%', toggleActions: TA },
          });
        });

        /* ================= MEDIA SLOTS ================= */
        sel('[data-s="media"]').forEach((m) => {
          const img = m.querySelector('[data-s="mediaImg"]');
          const sheen = m.querySelector('[data-s="sheen"]');
          gsap.set(m, { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 60%' });
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: m, start: 'top 88%', toggleActions: TA },
          });
          tl.to(m, { autoAlpha: 1, scale: 1, duration: 1.4 }, 0);
          if (sheen) {
            gsap.set(sheen, { xPercent: -130 });
            tl.to(sheen, { xPercent: 360, duration: 1.8, ease: 'power2.inOut' }, 0.35);
          }
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
              }
            );
          }
        });

        /* ================= QUOTE BAND (words light up with scroll) ================= */
        const quote = root.querySelector('[data-s="quote"]');
        if (quote) {
          const qw = sel('[data-s="qw"]', quote);
          gsap.set(qw, { opacity: 0.14 });
          gsap.to(qw, {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: quote, start: 'top 78%', end: 'bottom 52%', scrub: 0.4 },
          });
        }

        /* ================= HOVERS (fine pointers) ================= */
        if (fine) {
          /* magnetic buttons */
          sel('[data-s~="magnet"]').forEach((el) => {
            const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
            const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
            on(el, 'pointermove', (e) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
            });
            on(el, 'pointerleave', () => {
              xTo(0);
              yTo(0);
            });
          });

          /* button colours (no CSS transitions) */
          sel('[data-hv~="primary"]').forEach((el) => {
            on(el, 'pointerenter', () =>
              gsap.to(el, { backgroundColor: '#d1040e', borderColor: '#d1040e', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, { backgroundColor: C.red, borderColor: C.red, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            );
          });
          sel('[data-hv~="outline"]').forEach((el) => {
            on(el, 'pointerenter', () =>
              gsap.to(el, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,1)', duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
            );
            on(el, 'pointerleave', () =>
              gsap.to(el, { backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(255,255,255,0.28)', duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            );
          });

          /* cards: cursor spotlight + lift */
          sel('[data-s~="spot"]').forEach((el) => {
            const mx = gsap.quickTo(el, '--mx', { duration: 0.45, ease: 'power3' });
            const my = gsap.quickTo(el, '--my', { duration: 0.45, ease: 'power3' });
            on(el, 'pointerenter', () => {
              gsap.to(el, { '--gl': 1, yPercent: -2.5, boxShadow: '0 2.2vw 4vw -2vw rgba(13,16,23,0.28)', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
            });
            on(el, 'pointermove', (e) => {
              const r = el.getBoundingClientRect();
              mx(((e.clientX - r.left) / r.width) * 100);
              my(((e.clientY - r.top) / r.height) * 100);
            });
            on(el, 'pointerleave', () => {
              gsap.to(el, { '--gl': 0, yPercent: 0, boxShadow: '0 0 0 0 rgba(13,16,23,0)', duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
            });
          });

          /* resource card: arrow badge turns red and nudges */
          sel('[data-hv~="res"]').forEach((el) => {
            const box = el.querySelector('[data-s="arrow"]');
            const ico = el.querySelector('[data-s="arrowIcon"]');
            if (!box) return;
            on(el, 'pointerenter', () => {
              gsap.to(box, { backgroundColor: C.red, scale: 1.1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
              if (ico) gsap.to(ico, { xPercent: 22, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
            });
            on(el, 'pointerleave', () => {
              gsap.to(box, { backgroundColor: C.ink, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
              if (ico) gsap.to(ico, { xPercent: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
            });
          });

          /* telemetry: icon tile inverts */
          sel('[data-hv~="tele"]').forEach((el) => {
            const tile = el.querySelector('[data-s~="icon"]');
            if (!tile) return;
            on(el, 'pointerenter', () =>
              gsap.to(tile, { backgroundColor: C.ink, color: '#ffffff', duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
            );
            on(el, 'pointerleave', () =>
              gsap.to(tile, { backgroundColor: C.white, color: C.soft, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            );
          });

          /* certification logos */
          sel('[data-hv~="cert"]').forEach((el) => {
            const logo = el.querySelector('[data-s="certLogo"]');
            if (!logo) return;
            on(el, 'pointerenter', () => gsap.to(logo, { scale: 1.09, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }));
            on(el, 'pointerleave', () => gsap.to(logo, { scale: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' }));
          });
        }

        return () => off.forEach((fn) => fn());
      }
    );

    return () => mm.revert();
  }, [rootRef, lng]);

  /* ---------- keep ScrollTrigger positions correct as layout settles ---------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let t = 0;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refresh) : null;
    if (ro) ro.observe(root);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    root.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      window.removeEventListener('load', refresh);
    };
  }, [rootRef, lng]);
}