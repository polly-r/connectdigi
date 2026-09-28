/**
 * Hero reveal: once, on load. The headline is split into lines (SplitText),
 * each sliding up out of its own mask; then the intro and CTA fade up. The
 * split is reverted when the animation ends, leaving plain text.
 *
 * Screen readers: SplitText's aria "auto" labels the heading with its full
 * text while split. Reduced motion: nothing moves, text shows at once.
 * The CSS pre-hide (global.css) has a failsafe, so the text appears even if
 * this script never runs.
 */
import { gsap, MOTION, REDUCED_MOTION, SplitText } from '../../lib/gsap';

let mm: gsap.MatchMedia | null = null;

export function init(): void {
  destroy();
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;
  const after = [...document.querySelectorAll<HTMLElement>('[data-hero-after]')];
  const show = () => {
    title.dataset.heroReady = '';
    for (const el of after) el.dataset.heroReady = '';
  };

  mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    let split: SplitText | null = null;
    let cancelled = false;

    // Split after fonts load, so line breaks match the final typeface.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'auto' });
      // Room for descenders inside each line's mask (display line-height is tight).
      gsap.set(split.masks, { paddingBottom: '0.12em', marginBottom: '-0.12em' });
      gsap.set(after, { opacity: 0, y: 16 });
      show();

      gsap
        .timeline({ onComplete: () => split?.revert() })
        .from(split.lines, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.09 })
        .to(after, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.6');
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  });

  mm.add(REDUCED_MOTION, () => {
    show();
  });
}

export function destroy(): void {
  mm?.revert();
  mm = null;
}
