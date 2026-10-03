/**
 * Neon border trigger (NeonBorder.astro): plays one burst the first time a
 * [data-neon] card scrolls into view, by setting [data-neon-play] until the
 * animation ends. Hover and keyboard focus replay it through CSS alone.
 * Reduced motion: nothing to do (the CSS hides the effect).
 */
import { onFirstView } from '../../lib/in-view';

let controller: AbortController | null = null;
let disconnect: (() => void) | null = null;

export function init(): void {
  destroy();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  controller = new AbortController();
  const cards = [...document.querySelectorAll<HTMLElement>('[data-neon]')];

  for (const card of cards) {
    card.addEventListener(
      'animationend',
      (event) => {
        if (event.animationName === 'neon-burst') delete card.dataset.neonPlay;
      },
      { signal: controller.signal },
    );
  }

  disconnect = onFirstView(cards, (batch) => {
    for (const card of batch) card.dataset.neonPlay = '';
  }, { start: 80 });
}

export function destroy(): void {
  controller?.abort();
  controller = null;
  disconnect?.();
  disconnect = null;
}
