// Asserts the WCAG 2.x contrast pairs from CLAUDE.md against the tokens in
// src/styles/global.css. Runs before every `npm run build`; any failing pair,
// or any token it cannot read, exits non-zero.

import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function block(selectorPattern) {
  const match = css.match(new RegExp(`${selectorPattern}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Could not find block matching ${selectorPattern}`);
  return match[1];
}

function hexTokens(body) {
  const tokens = {};
  for (const [, name, hex] of body.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6});/gi)) {
    tokens[name] = hex;
  }
  return tokens;
}

function mixTokens(body) {
  const mixes = {};
  const re = /--color-([\w-]+):\s*color-mix\(in srgb,\s*var\(--color-([\w-]+)\)\s*(\d+(?:\.\d+)?)%,\s*var\(--color-([\w-]+)\)\);/g;
  for (const [, name, a, pct, b] of body.matchAll(re)) mixes[name] = { a, pct: Number(pct) / 100, b };
  return mixes;
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (x, y) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((m, n) => n - m);
  return (hi + 0.05) / (lo + 0.05);
};

const light = hexTokens(block('@theme static'));
const darkOverrides = hexTokens(block('\\.dark'));
const mixes = mixTokens(block('@theme inline'));

function palette(base) {
  const resolve = (name) => {
    if (base[name]) return toRgb(base[name]);
    const mix = mixes[name];
    if (!mix) throw new Error(`Unknown colour token --color-${name}`);
    // color-mix(in srgb) interpolates the gamma-encoded channels.
    const [a, b] = [resolve(mix.a), resolve(mix.b)];
    return a.map((c, i) => c * mix.pct + b[i] * (1 - mix.pct));
  };
  return resolve;
}

const themes = {
  light: palette(light),
  dark: palette({ ...light, ...darkOverrides }),
};

// [theme, foreground, background, minimum, what it is used for]
const pairs = [
  ['light', 'fg', 'bg', 4.5, 'body text'],
  ['dark', 'fg', 'bg', 4.5, 'body text'],
  ['light', 'muted', 'bg', 4.5, 'muted text'],
  ['dark', 'muted', 'bg', 4.5, 'muted text'],
  ['light', 'accent', 'bg', 4.5, 'accent text (body size allowed in light mode)'],
  ['dark', 'accent', 'bg', 3, 'accent in dark mode: large text, UI, icons, motif only'],
  ['light', 'on-accent', 'accent', 4.5, 'button text on accent'],
  ['dark', 'on-accent', 'accent', 4.5, 'button text on accent'],
  ['light', 'control', 'bg', 3, 'form control borders'],
  ['dark', 'control', 'bg', 3, 'form control borders'],
  ['light', 'accent', 'bg', 3, 'focus ring'],
  ['dark', 'accent', 'bg', 3, 'focus ring'],
];

let failed = 0;
for (const [theme, fg, bg, min, use] of pairs) {
  const resolve = themes[theme];
  const value = ratio(resolve(fg), resolve(bg));
  const ok = value >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? 'pass' : 'FAIL'}  ${theme.padEnd(5)}  ${fg} on ${bg}`.padEnd(40) +
      `${value.toFixed(2)}:1  (min ${min}:1, ${use})`,
  );
}

if (failed) {
  console.error(`\nContrast check failed: ${failed} pair(s) below minimum. See CLAUDE.md "Contrast rules".`);
  process.exit(1);
}
console.log('\nContrast check passed.');
