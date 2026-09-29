/**
 * The one place GSAP plugins are registered. Import GSAP from here, never
 * from 'gsap' directly, so plugins are always registered first.
 *
 * ScrollTrigger is registered up front (most pages use it). SplitText is only
 * needed by the headline reveal (Home, About), so it's loaded on demand with
 * `loadSplitText()`: other pages never download it, and Home/About parse it
 * after the fonts are ready instead of during start-up.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Media queries for gsap.matchMedia(): every animation has a reduced-motion branch. */
export const MOTION = '(prefers-reduced-motion: no-preference)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

let splitText: Promise<typeof import('gsap/SplitText').SplitText> | null = null;

/** Load and register SplitText once; later calls reuse the same promise. */
export function loadSplitText() {
  splitText ??= import('gsap/SplitText').then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return splitText;
}

export { gsap, ScrollTrigger };
