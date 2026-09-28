/**
 * NodeDivider draw-in: nodes pop in left to right, each connector drawing
 * (scaleX from its start) to the next node. Runs once per divider, when it
 * first scrolls into view. Transform and opacity only.
 * Reduced motion: nothing animates; the divider shows fully drawn.
 */
import { gsap, MOTION, REDUCED_MOTION } from '../../lib/gsap';

let mm: gsap.MatchMedia | null = null;

export function init(): void {
  destroy();
  mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    const dividers = [...document.querySelectorAll<SVGSVGElement>('[data-node-divider]')];

    for (const svg of dividers) {
      const nodes = [...svg.querySelectorAll<SVGElement>('[data-nn-node]')];
      const links = [...svg.querySelectorAll<SVGElement>('[data-nn-link]')];

      gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(links, { scaleX: 0, transformOrigin: '0% 50%' });
      svg.dataset.motifReady = '';

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: svg, start: 'top 90%', once: true },
        defaults: { ease: 'power2.out' },
      });
      // Each node lands as its incoming connector arrives.
      nodes.forEach((node, i) => {
        timeline.to(node, { scale: 1, duration: 0.25, ease: 'back.out(2)' }, i === 0 ? 0 : '>-0.06');
        const link = links[i];
        if (link) timeline.to(link, { scaleX: 1, duration: 0.22 }, '<0.1');
      });
    }

    return () => {
      for (const svg of dividers) delete svg.dataset.motifReady;
    };
  });

  // Reduced motion: no start state is set, so the divider stays fully drawn.
  mm.add(REDUCED_MOTION, () => {});
}

export function destroy(): void {
  mm?.revert();
  mm = null;
}
