/**
 * One-time draw-in for a NodeNetwork marked [data-draw-network] (used by the
 * 404 page): nodes pop in and connectors draw (scaleX from their start) in
 * document order, once, on load. Transform only.
 * Reduced motion: nothing animates; the network shows fully drawn.
 */
import { gsap, MOTION, REDUCED_MOTION } from '../../lib/gsap';

let mm: gsap.MatchMedia | null = null;

export function init(): void {
  destroy();
  mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    for (const svg of document.querySelectorAll<SVGSVGElement>('[data-draw-network]')) {
      const nodes = [...svg.querySelectorAll<SVGElement>('[data-nn-node]')];
      const links = [...svg.querySelectorAll<SVGElement>('[data-nn-link]')];
      gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(links, { scaleX: 0, transformOrigin: '0% 50%' });
      const timeline = gsap.timeline({ delay: 0.2, defaults: { ease: 'power2.out' } });
      timeline.to(nodes, { scale: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.08 });
      timeline.to(links, { scaleX: 1, duration: 0.35, stagger: 0.08 }, '<0.15');
    }
  });

  // Reduced motion: no start state is set, so the network stays fully drawn.
  mm.add(REDUCED_MOTION, () => {});
}

export function destroy(): void {
  mm?.revert();
  mm = null;
}
