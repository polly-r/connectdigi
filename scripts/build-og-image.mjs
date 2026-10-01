// Builds the social sharing image (public/og-image.png, 1200 × 630), shown
// when a page is shared on WhatsApp, LinkedIn, Facebook and X. Rendered from
// HTML in the installed Microsoft Edge (playwright-core, as scripts/shoot.mjs):
// navy background, the mono white logo, the name and the Home headline.
// Provisional until the client supplies their own (PLACEHOLDERS.md).
//
//   npm run og-image

import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const font = (path) => `data:font/woff2;base64,${readFileSync(new URL(`node_modules/${path}`, root)).toString('base64')}`;
const logo = readFileSync(new URL('public/logo/logo-mono-white.svg', root), 'utf8');

// Colours from the tokens in src/styles/global.css (dark theme).
const NAVY = '#051D40';
const WHITE = '#FFFFFF';
const ACCENT = '#1976D2';

const html = `<!doctype html>
<html><head><style>
  @font-face { font-family: Fraunces; src: url(${font('@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2')}) format('woff2-variations'); font-weight: 100 900; }
  @font-face { font-family: Inter; src: url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}) format('woff2-variations'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${NAVY}; color: ${WHITE}; padding: 72px 80px;
         display: flex; flex-direction: column; justify-content: space-between; font-family: Inter; }
  .brand { display: flex; align-items: center; gap: 24px; }
  .brand svg { width: 96px; height: 96px; }
  .name { font-family: Fraunces; font-size: 40px; font-weight: 500; }
  h1 { font-family: Fraunces; font-variation-settings: 'opsz' 144; font-weight: 500; font-size: 104px;
       line-height: 0.95; letter-spacing: -0.02em; max-width: 10ch; }
  .foot { display: flex; align-items: center; gap: 16px; font-size: 26px; }
  .node { width: 14px; height: 14px; border-radius: 50%; background: ${ACCENT}; }
</style></head><body>
  <div class="brand">${logo}<span class="name">The Connect Digital</span></div>
  <h1>Digital work that connects.</h1>
  <div class="foot"><span class="node"></span>Digital marketing agency · South Africa · Working worldwide</div>
</body></html>`;

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL('public/og-image.png', root)) });
await browser.close();
console.log('Wrote public/og-image.png');
