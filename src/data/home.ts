/**
 * Home page content.
 *
 * DRAFT COPY: the hero headline and intro are placeholder copy written in the
 * brand's voice, shown unmarked at the client's request (CLAUDE.md, Decisions
 * log, Phase 4). They need the client's final wording before launch; the
 * build warns while `heroDraft` is true. Listed in PLACEHOLDERS.md.
 *
 * Stats are sample figures for now (see `statsSample` below). The count-up
 * runs only when a value is numeric, e.g. "120+", "98%", "R2.5m".
 */

/** Flip to false once the client has approved the hero copy. */
export const heroDraft = true;

export const hero = {
  headline: 'Digital work that connects.',
  intro: 'Web, social, content and apps for startups, local businesses and luxury brands.',
  cta: { label: 'Start a project', href: '/connect' },
};

/**
 * A stat value that can count up: a number with an optional short prefix or
 * suffix of up to 3 characters (currency, unit, "+", "%"), e.g. "120+",
 * "98%", "R2.5m", "1,200". Placeholders like "[STAT 1]" don't match.
 * Groups: prefix, digits, suffix.
 */
export const NUMERIC_STAT = /^([^\d\s[\]]{0,3})(\d[\d,]*(?:\.\d+)?)([^\d\s[\]]{0,3})$/;

export interface Stat {
  value: string;
  label: string;
}

/**
 * SAMPLE FIGURES, NOT REAL. The labels are the client's; the values are
 * plausible stand-ins at the client's request (CLAUDE.md, Decisions log,
 * Phase 4). Each is a factual claim once live, so every value must be
 * replaced with a verified figure before launch; the build warns while
 * `statsSample` is true. Listed in PLACEHOLDERS.md.
 */
export const statsSample = true;

export const stats: Stat[] = [
  { value: '120+', label: 'Projects delivered' },
  { value: '45+', label: 'Startups assisted' },
  { value: 'R25m+', label: 'Revenue generated for clients' },
  { value: '15', label: 'Industries served' },
];
