/**
 * The one place GSAP plugins are registered. Import GSAP from here, never
 * from 'gsap' directly, so plugins are always registered first.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Media queries for gsap.matchMedia(): every animation has a reduced-motion branch. */
export const MOTION = '(prefers-reduced-motion: no-preference)';
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export { gsap, ScrollTrigger, SplitText };
