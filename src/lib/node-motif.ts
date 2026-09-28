/**
 * The node motif's proportions, measured from the logo
 * (public/logo/logo-full-colour.svg) and expressed in connector widths ("w").
 *
 *   connectors and arcs  1w thick (14.1 units in the logo artwork)
 *   node radii           s 0.85w · m 1.7w · l 2.2w · xl 3w
 *   ring nodes           same outer radii; the band is half the outer radius
 *
 * Components pass a `unit` (px per w) and derive every size from here, so the
 * motif keeps the logo's proportions at any scale.
 */

export type NodeSize = 's' | 'm' | 'l' | 'xl';
export type NodeKind = 'solid' | 'ring';

export const NODE_RADIUS: Record<NodeSize, number> = { s: 0.85, m: 1.7, l: 2.2, xl: 3 };
export const RING_BAND_RATIO = 0.5;

/** Outer radius, band width, and the radius to stroke a ring at (all in w). */
export function ringGeometry(size: NodeSize): { outer: number; band: number; mid: number } {
  const outer = NODE_RADIUS[size];
  const band = outer * RING_BAND_RATIO;
  return { outer, band, mid: outer - band / 2 };
}

export interface MotifNode {
  id: string;
  x: number;
  y: number;
  size?: NodeSize;
  kind?: NodeKind;
}

export interface MotifArc {
  from: string;
  to: string;
  /** Radius of the circle the arc lies on, in w. */
  radius: number;
  /** SVG sweep flag: 0 bends one way, 1 the other. */
  sweep?: 0 | 1;
}

export interface MotifNetwork {
  nodes: MotifNode[];
  links?: Array<[string, string]>;
  arcs?: MotifArc[];
}

/** Submitting state: three nodes on a line; the script pulses them in turn. */
export const LOADER: MotifNetwork = {
  nodes: [
    { id: 'a', x: 0, y: 0, size: 'm' },
    { id: 'b', x: 6, y: 0, size: 'l', kind: 'ring' },
    { id: 'c', x: 12, y: 0, size: 'm' },
  ],
  links: [
    ['a', 'b'],
    ['b', 'c'],
  ],
};

/** Success state: a check mark drawn in nodes, ring at the corner. */
export const CHECK: MotifNetwork = {
  nodes: [
    { id: 'start', x: 0, y: 4.5, size: 'm' },
    { id: 'corner', x: 4.5, y: 9, size: 'l', kind: 'ring' },
    { id: 'end', x: 13, y: 0, size: 'm' },
  ],
  links: [
    ['start', 'corner'],
    ['corner', 'end'],
  ],
};
