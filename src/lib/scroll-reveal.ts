/**
 * Scroll reveal: elements marked [data-reveal] fade and rise gently the first
 * time they enter the viewport. Opacity and transform only; opacity (not
 * visibility) so the content stays available to assistive tech throughout.
 *
 * Reduced motion: nothing is hidden or moved. The CSS pre-hide (global.css)
 * has a failsafe, so content appears even if this script never runs.
 */
import { gsap, MOTION, REDUCED_MOTION, ScrollTrigger } from './gsap';

let mm: gsap.MatchMedia | null = null;

export function init(): void {
  destroy();
  mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    gsap.set(elements, { opacity: 0, y: 24 });
    for (const el of elements) el.dataset.revealReady = '';

    ScrollTrigger.batch(elements, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }),
    });

    return () => {
      for (const el of elements) delete el.dataset.revealReady;
    };
  });

  mm.add(REDUCED_MOTION, () => {
    for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) el.dataset.revealReady = '';
  });
}

export function destroy(): void {
  mm?.revert();
  mm = null;
}
