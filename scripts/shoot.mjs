// Dev tool: screenshots a page at several widths and colour schemes and
// reports console errors. Drives the locally installed Microsoft Edge through
// playwright-core, so no browser download is needed.
//
//   node scripts/shoot.mjs <url> [--out dir] [--widths 360,768,1280]
//        [--schemes light,dark] [--reduced] [--full]

import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: 'string', default: 'screenshots' },
    widths: { type: 'string', default: '360,768,1280' },
    schemes: { type: 'string', default: 'light,dark' },
    reduced: { type: 'boolean', default: false },
    full: { type: 'boolean', default: false },
  },
});

const url = positionals[0];
if (!url) throw new Error('Usage: node scripts/shoot.mjs <url> [options]');
mkdirSync(values.out, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const slug = new URL(url).pathname.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home';
let errors = 0;

for (const scheme of values.schemes.split(',')) {
  for (const width of values.widths.split(',').map(Number)) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: scheme,
      reducedMotion: values.reduced ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors++;
        console.log(`  console error [${scheme} ${width}]: ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      errors++;
      console.log(`  page error [${scheme} ${width}]: ${err.message}`);
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Astro's dev toolbar floats over content in dev; keep it out of shots.
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.log(`  horizontal overflow [${scheme} ${width}]: ${overflow}px`);
    const file = `${values.out}/${slug}-${width}-${scheme}${values.reduced ? '-reduced' : ''}.png`;
    await page.screenshot({ path: file, fullPage: values.full });
    console.log(file);
    await context.close();
  }
}

await browser.close();
console.log(errors ? `${errors} console error(s)` : 'No console errors');
