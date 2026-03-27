/**
 * useScrollAnimations
 * ───────────────────
 * • Boots Lenis smooth-scrolling once and ties it to GSAP's ticker
 * • Uses GSAP ScrollTrigger for scroll-reveal (not CSS opacity:0)
 *   so elements are NEVER invisible unless GSAP explicitly hides them.
 * • Waits two rAF frames before scanning the DOM so React has finished
 *   rendering all components.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Expose the Lenis instance so other modules can call lenis.scrollTo() */
export function getLenis() { return lenisInstance; }

// Track our own ScrollTrigger instances so cleanup doesn't
// kill the Services panel (which has its own GSAP setup).
const ourTriggers: ScrollTrigger[] = [];

export function useScrollAnimations() {
  useEffect(() => {
    // ── 1. Lenis smooth scroll (init once) ─────────────────
    if (!lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        smoothWheel: true,
      });

      gsap.ticker.add((time) => {
        lenisInstance?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      lenisInstance.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (value !== undefined) {
            lenisInstance?.scrollTo(value, { immediate: true });
          }
          return lenisInstance?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0, left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
    }

    // ── 2. Wait 2 rAF frames so React finishes painting ────
    let rafId1: number;
    let rafId2: number;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        setupReveal();
        // Refresh after a short delay to pick up Lenis proxy
        setTimeout(() => ScrollTrigger.refresh(), 100);
      });
    });

    function setupReveal() {
      // ── Single elements: [data-reveal] ──────────────────
      const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');

      revealEls.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? '0');
        const dir   = el.dataset.revealDir ?? 'up';

        const fromY = dir === 'up'    ?  40 : dir === 'down'  ? -40 : 0;
        const fromX = dir === 'left'  ?  50 : dir === 'right' ? -50 : 0;

        // GSAP sets initial state — CSS never hides these
        gsap.set(el, { opacity: 0, y: fromY, x: fromX });

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 96%',   // generous — catches elements near the fold
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.85,
              delay,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
        });

        // If already past the trigger point when page loads → animate immediately
        if (st.progress === 1) {
          gsap.set(el, { opacity: 1, y: 0, x: 0 });
        }

        ourTriggers.push(st);
      });

      // ── Stagger groups: [data-reveal-group] ─────────────
      const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]');

      groups.forEach((group) => {
        const children = group.querySelectorAll<HTMLElement>('[data-reveal-item]');

        // GSAP sets initial state
        gsap.set(children, { opacity: 0, y: 36 });

        const st = ScrollTrigger.create({
          trigger: group,
          start: 'top 94%',
          once: true,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.11,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
        });

        // Already visible on load
        if (st.progress === 1) {
          gsap.set(children, { opacity: 1, y: 0 });
        }

        ourTriggers.push(st);
      });
    }

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);

      // Only kill OUR triggers, not Services GSAP
      ourTriggers.forEach(st => st.kill());
      ourTriggers.length = 0;

      // Make sure hidden elements become visible on unmount/re-render
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-item]')
        .forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
    };
  }, []);
}
