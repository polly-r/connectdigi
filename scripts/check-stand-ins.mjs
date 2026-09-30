// Runs before every build. Prints a warning (does not fail the build) while
// stand-in content that must not go live is still in place:
//   - brand logos used as stand-in clients (src/data/clients.ts)
//   - example contact details (src/data/site.ts)
//   - draft hero copy and sample stats (src/data/home.ts)
//   - draft About manifesto (src/data/about.ts)
//   - draft Services copy (src/data/services.ts) and sample case studies (src/content/work/)
//   - draft FAQ copy (src/data/faq.ts)
//   - the contact form's MOCK adapter (PUBLIC_FORM_ADAPTER not "http")
// See PLACEHOLDERS.md.

import { readdirSync, readFileSync } from 'node:fs';

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
const missingFacts = (site.match(/tbc\('/g) ?? []).length;
if (missingFacts > 0) {
  warnings.push(`${missingFacts} company facts in src/data/site.ts are still [TBC] (legal pages, providers, retention, social links).`);
}
if (/example\.com|000 0000/.test(site)) {
  warnings.push('Footer contact details are EXAMPLE values (example.com, 000 number). Replace in src/data/site.ts.');
}

const home = read('src/data/home.ts');
if (/export const heroDraft = true/.test(home)) {
  warnings.push('Home hero headline and intro are DRAFT copy. Replace in src/data/home.ts, then set heroDraft = false.');
}
if (/export const statsSample = true/.test(home)) {
  const values = [...home.matchAll(/\{ value: '([^']+)', label: '([^']+)' \}/g)].map((m) => `${m[1]} ${m[2].toLowerCase()}`);
  warnings.push(
    `Home stats are SAMPLE figures, not real (${values.join('; ')}).`,
    '  Replace with verified figures in src/data/home.ts, then set statsSample = false.',
  );
}

const services = read('src/data/services.ts');
if (/export const servicesDraft = true/.test(services)) {
  warnings.push('Services descriptions and "What\'s included" lists are DRAFT copy. Replace in src/data/services.ts, then set servicesDraft = false.');
}

const workDir = new URL('../src/content/work/', import.meta.url);
const samples = readdirSync(workDir)
  .filter((f) => f.endsWith('.md') && /^placeholder:\s*true\s*$/m.test(readFileSync(new URL(f, workDir), 'utf8')))
  .map((f) => f.replace(/\.md$/, ''));
if (samples.length) {
  warnings.push(
    `Case studies are SAMPLE projects with fictional clients (${samples.join(', ')}).`,
    '  Their testimonials (also shown on Home) and results charts are SAMPLE data too.',
    '  Replace with real projects, consented quotes and verified figures in src/content/work/, then set placeholder: false.',
  );
}

const about = read('src/data/about.ts');
if (/export const aboutDraft = true/.test(about)) {
  warnings.push('About manifesto is DRAFT copy. Replace in src/data/about.ts, then set aboutDraft = false.');
}

const faq = read('src/data/faq.ts');
if (/export const faqDraft = true/.test(faq)) {
  const gaps = (faq.match(/\{ tbc: '/g) ?? []).length;
  warnings.push(`FAQ questions and answers are DRAFT copy, with ${gaps} answers still [TBC]. Replace in src/data/faq.ts, then set faqDraft = false.`);
}

// Contact form adapter: from the environment, or .env / .env.production.
const envFiles = ['.env', '.env.production']
  .map((name) => {
    try {
      return read(name);
    } catch {
      return '';
    }
  })
  .join('\n');
const adapter = process.env.PUBLIC_FORM_ADAPTER ?? envFiles.match(/^PUBLIC_FORM_ADAPTER=(.*)$/m)?.[1]?.trim() ?? 'mock';
if (adapter !== 'http') {
  warnings.push('Contact form uses the MOCK adapter: messages go NOWHERE. Set PUBLIC_FORM_ADAPTER=http and PUBLIC_FORM_ENDPOINT (see .env.example).');
}

if (warnings.length) {
  const bar = '='.repeat(72);
  console.warn(`\n\x1b[33m${bar}\nNOT READY FOR LAUNCH\n${warnings.join('\n')}\n${bar}\x1b[0m\n`);
}
