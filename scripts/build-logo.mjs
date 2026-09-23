// Builds the themeable logo and the favicons from the supplied original.
// Run with `npm run logo` after the original or the colour tokens change;
// the outputs are committed.
//
//   in:  public/logo/logo-full-colour.svg   (original, never modified)
//        src/styles/global.css              (colour tokens, for the favicons)
//   out: src/assets/logo/logo-mark.svg      (#logo-upper = currentColor,
//                                            #logo-lower = var(--color-logo-lower):
//                                            accent in light, white in dark)
//        public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { optimize } from 'svgo';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const write = (path, data) => writeFileSync(new URL(path, root), data);

// Colour tokens, read from the single source rather than repeated here.
const css = read('src/styles/global.css');
const token = (name, selector = '@theme static') => {
  const body = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  const hex = body.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6});`, 'i'))?.[1];
  if (!hex) throw new Error(`Token --color-${name} not found in ${selector}`);
  return hex;
};
const NAVY = token('fg');
const ACCENT = token('accent');
const WHITE = token('bg');
const DARK_FG = token('fg', '\\.dark');

// The original is four filled compound paths: two navy (upper half), two
// blue (lower half). Its clipPaths only trim sub-pixel slivers (verified:
// zero pixels differ at 1620px), so they are dropped.
const original = read('public/logo/logo-full-colour.svg');
const paths = [...original.matchAll(/<path fill="(#[0-9a-f]{6})" d="([^"]+)"/gi)].map(([, fill, d]) => ({
  fill: fill.toLowerCase(),
  d,
}));
const upper = paths.filter((p) => p.fill === NAVY.toLowerCase()).map((p) => p.d);
const lower = paths.filter((p) => p.fill === ACCENT.toLowerCase()).map((p) => p.d);
if (upper.length !== 2 || lower.length !== 2) {
  throw new Error(`Expected 2 navy + 2 blue paths, found ${upper.length} + ${lower.length}. Has the original changed?`);
}

// Measure the artwork's bounds by rendering it. The mark gets a tight viewBox
// (2% padding); the favicons get a square one centred on the same artwork.
const [, , vbW] = original.match(/viewBox="([\d.\s]+)"/)[1].split(/\s+/).map(Number);
const scale = 2;
const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbW}" width="${vbW * scale}" height="${vbW * scale}">${paths
  .map((p) => `<path d="${p.d}"/>`)
  .join('')}</svg>`;
const { info } = await sharp(Buffer.from(probe)).trim({ threshold: 0 }).toBuffer({ resolveWithObject: true });
const x0 = -info.trimOffsetLeft / scale;
const y0 = -info.trimOffsetTop / scale;
const w = info.width / scale;
const h = info.height / scale;
const round = (n) => Math.round(n * 100) / 100;
const pad = Math.max(w, h) * 0.02;
const viewBox = [x0 - pad, y0 - pad, w + 2 * pad, h + 2 * pad].map(round).join(' ');
const side = Math.max(w, h) + 2 * pad;
const squareViewBox = [x0 + w / 2 - side / 2, y0 + h / 2 - side / 2, side, side].map(round).join(' ');

const group = (id, attrs, ds) => `<g id="${id}" ${attrs}>${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`;

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          collapseGroups: false,
          mergePaths: false,
          // Keeps the favicon's <style> (and its dark-mode media query) intact.
          inlineStyles: false,
        },
      },
    },
  ],
};

// Working copy: themeable through CSS, for inlining via Logo.astro.
// The fallback keeps the file viewable on its own (e.g. in an <img>).
const mark = optimize(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${group('logo-upper', 'fill="currentColor"', upper)}${group(
    'logo-lower',
    `style="fill:var(--color-logo-lower, ${ACCENT})"`,
    lower,
  )}</svg>`,
  svgoConfig,
).data;
mkdirSync(new URL('src/assets/logo/', root), { recursive: true });
write('src/assets/logo/logo-mark.svg', mark + '\n');

// Favicon SVG: browser tabs don't see page CSS, so it carries its own
// colours and turns fully white (the mono white logo) on dark browser chrome.
const faviconSvg = optimize(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${squareViewBox}"><style>.u{fill:${NAVY}}.l{fill:${ACCENT}}@media (prefers-color-scheme:dark){.u,.l{fill:${DARK_FG}}}</style>${group(
    'logo-upper',
    'class="u"',
    upper,
  )}${group('logo-lower', 'class="l"', lower)}</svg>`,
  svgoConfig,
).data;
write('public/favicon.svg', faviconSvg + '\n');

// Raster fallbacks use the light-theme colours.
const flat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${squareViewBox}">${group('u', `fill="${NAVY}"`, upper)}${group(
  'l',
  `fill="${ACCENT}"`,
  lower,
)}</svg>`;
const png = (size) => sharp(Buffer.from(flat), { density: 72 * (size / side) * 4 }).resize(size, size).png().toBuffer();

// favicon.ico: an ICO header wrapping 16px and 32px PNGs (supported by every
// browser since Vista-era ICO spec), so no extra package is needed.
const icons = await Promise.all([16, 32].map(async (size) => ({ size, data: await png(size) })));
const header = Buffer.alloc(6 + 16 * icons.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icons.length, 4);
let offset = header.length;
icons.forEach(({ size, data }, i) => {
  const at = 6 + 16 * i;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt16LE(1, at + 4); // colour planes
  header.writeUInt16LE(32, at + 6); // bits per pixel
  header.writeUInt32LE(data.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
write('public/favicon.ico', Buffer.concat([header, ...icons.map((i) => i.data)]));

// Apple touch icon: iOS ignores transparency, so the mark sits on the light
// background with room for the rounded-corner mask.
const touchMark = await sharp(Buffer.from(flat), { density: 300 }).resize(136, 136).png().toBuffer();
const touch = await sharp({ create: { width: 180, height: 180, channels: 4, background: WHITE } })
  .composite([{ input: touchMark, gravity: 'center' }])
  .png()
  .toBuffer();
write('public/apple-touch-icon.png', touch);

console.log(`viewBox ${viewBox} (favicon ${squareViewBox})`);
console.log(`logo-mark.svg ${Buffer.byteLength(mark)} B, favicon.svg ${Buffer.byteLength(faviconSvg)} B`);
