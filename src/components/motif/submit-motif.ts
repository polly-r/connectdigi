/**
 * Submit button states for SubmitButton.astro (and, from Phase 7, the
 * ContactForm island, which calls setSubmitState on its button).
 *
 *   submitting  nodes pulse in turn (scale), connectors brighten (opacity); loops
 *   success     the check draws in: node, connector, ring, connector, node
 *
 * Transform and opacity only. Reduced motion: no animation; the loader and
 * check show in their final, static form (the markup's default state).
 */
import { gsap, MOTION, REDUCED_MOTION } from '../../lib/gsap';

export type SubmitState = 'idle' | 'submitting' | 'success';

const active = new Map<HTMLElement, gsap.MatchMedia>();

function parts(button: HTMLElement, layer: string) {
  const root = button.querySelector<HTMLElement>(`[data-layer="${layer}"]`);
  return {
    nodes: [...(root?.querySelectorAll<SVGElement>('[data-nn-node]') ?? [])],
    links: [...(root?.querySelectorAll<SVGElement>('[data-nn-link]') ?? [])],
  };
}

function pulse(button: HTMLElement): void {
  const { nodes, links } = parts(button, 'submitting');
  gsap.to(nodes, {
    scale: 1.4,
    transformOrigin: '50% 50%',
    duration: 0.35,
    ease: 'sine.inOut',
    stagger: { each: 0.18, repeat: -1, yoyo: true },
  });
  gsap.fromTo(
    links,
    { opacity: 0.4 },
    { opacity: 1, duration: 0.35, ease: 'sine.inOut', stagger: { each: 0.18, repeat: -1, yoyo: true } },
  );
}

function drawCheck(button: HTMLElement): void {
  const { nodes, links } = parts(button, 'success');
  gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(links, { scaleX: 0, transformOrigin: '0% 50%' });
  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
  nodes.forEach((node, i) => {
    timeline.to(node, { scale: 1, duration: 0.2, ease: 'back.out(2)' }, i === 0 ? 0 : '>-0.04');
    const link = links[i];
    if (link) timeline.to(link, { scaleX: 1, duration: 0.2 }, '<0.08');
  });
}

/** Switch the button's visible state and run that state's animation. */
export function setSubmitState(button: HTMLElement, state: SubmitState): void {
  active.get(button)?.revert();
  button.dataset.state = state;
  button.setAttribute('aria-disabled', String(state !== 'idle'));

  const mm = gsap.matchMedia();
  mm.add(MOTION, () => {
    if (state === 'submitting') pulse(button);
    if (state === 'success') drawCheck(button);
  });
  // Reduced motion: nothing to animate; the static loader / check is shown.
  mm.add(REDUCED_MOTION, () => {});
  active.set(button, mm);
}

/** Stop all running button animations (e.g. before the page is swapped). */
export function destroy(): void {
  for (const mm of active.values()) mm.revert();
  active.clear();
}
