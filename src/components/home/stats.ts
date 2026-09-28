/**
 * Stats count-up: numeric values ([data-count-to]) count from zero to their
 * value once, on first view, keeping any prefix/suffix and the value's
 * number format. The animated text is aria-hidden; a sibling carries the
 * final value for screen readers. Counts as part of "scroll reveal" in the
 * Home interaction budget. Reduced motion: values show as-is.
 */
import { gsap, MOTION } from '../../lib/gsap';
import { NUMERIC_STAT } from '../../data/home';

let mm: gsap.MatchMedia | null = null;

export function init(): void {
  destroy();
  mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    for (const el of document.querySelectorAll<HTMLElement>('[data-count-to]')) {
      const match = NUMERIC_STAT.exec(el.dataset.countTo ?? '');
      if (!match) continue;
      const [, prefix = '', digits = '', suffix = ''] = match;
      const target = Number(digits.replace(/,/g, ''));
      const decimals = digits.split('.')[1]?.length ?? 0;
      const grouped = digits.includes(',');
      const format = (n: number) =>
        prefix +
        n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
        suffix;

      const counter = { value: 0 };
      el.textContent = format(0);
      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => {
          el.textContent = format(counter.value);
        },
        onComplete: () => {
          el.textContent = el.dataset.countTo ?? '';
        },
      });
    }

    return () => {
      for (const el of document.querySelectorAll<HTMLElement>('[data-count-to]')) el.textContent = el.dataset.countTo ?? '';
    };
  });
}

export function destroy(): void {
  mm?.revert();
  mm = null;
}
