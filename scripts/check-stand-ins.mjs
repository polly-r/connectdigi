// Runs before every build. Prints a warning (does not fail the build) while
// stand-in content that must not go live is still in place:
//   - brand logos used as stand-in clients (src/data/clients.ts)
//   - example contact details (src/data/site.ts)
// See PLACEHOLDERS.md.

import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const warnings = [];

const clients = read('src/data/clients.ts');
if (/export const standIn = true/.test(clients)) {
  const names = [...clients.matchAll(/name: '([^']+)'/g)].map((m) => m[1]);
  warnings.push(
    `Client logo strip shows STAND-IN brand logos (${names.join(', ')}).`,
    '  None of these companies is a client. Replace them in src/data/clients.ts before launch.',
  );
}

const site = read('src/data/site.ts');
if (/example\.com|000 0000/.test(site)) {
  warnings.push('Footer contact details are EXAMPLE values (example.com, 000 number). Replace in src/data/site.ts.');
}

if (warnings.length) {
  const bar = '='.repeat(72);
  console.warn(`\n\x1b[33m${bar}\nNOT READY FOR LAUNCH\n${warnings.join('\n')}\n${bar}\x1b[0m\n`);
}
