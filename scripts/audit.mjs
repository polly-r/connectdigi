// Dev tool: Lighthouse audit (performance, accessibility, best practices,
// SEO) of every page, on mobile and desktop, using the installed Microsoft
// Edge. Run it against the production build:
//
//   npm run build && npm run preview      (in one terminal)
//   npm run audit                          (in another; default http://localhost:4321)
//   node scripts/audit.mjs <base-url> [--json out.json]
//
// Prints each page's scores and every audit that didn't pass.
// Note: performance on localhost has no real network latency, so treat it as
// a check for regressions, not a field measurement.

import lighthouse from 'lighthouse';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values, positionals } = parseArgs({ allowPositionals: true, options: { json: { type: 'string' } } });
const base = (positionals[0] ?? 'http://localhost:4321').replace(/\/$/, '');
const pages = ['/', '/about/', '/services/', '/pricing/', '/connect/', '/faq/', '/privacy/', '/terms/', '/work/harbour-and-hide/'];
// Edge via playwright-core (chrome-launcher can't find Edge's debugging port), with a fixed port for Lighthouse.
const PORT = 9333;
const browser = await chromium.launch({ channel: 'msedge', args: [`--remote-debugging-port=${PORT}`] });
const results = [];

for (const formFactor of ['mobile', 'desktop']) {
  for (const path of pages) {
    const config =
      formFactor === 'desktop'
        ? {
            extends: 'lighthouse:default',
            settings: {
              formFactor: 'desktop',
              screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
              throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
            },
          }
        : undefined;
    const run = await lighthouse(`${base}${path}`, { port: PORT, output: 'json', logLevel: 'error' }, config);
    const { categories, audits } = run.lhr;
    const scores = Object.fromEntries(Object.entries(categories).map(([id, c]) => [id, Math.round(c.score * 100)]));
    const failed = Object.values(audits)
      .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual')
      .map((a) => ({ id: a.id, title: a.title, score: a.score, value: a.displayValue ?? '' }));
    const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift']
      .map((id) => `${id.split('-').map((w) => w[0]).join('').toUpperCase()} ${audits[id].displayValue}`)
      .join(' · ');
    results.push({ formFactor, path, scores, metrics, failed });
    console.log(`\n${formFactor.padEnd(7)} ${path}`);
    console.log(`  ${Object.entries(scores).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    console.log(`  ${metrics}`);
    for (const f of failed) console.log(`  ✗ ${f.title}${f.value ? ` (${f.value})` : ''} [${f.id}]`);
  }
}

await browser.close();
if (values.json) writeFileSync(values.json, JSON.stringify(results, null, 2));
