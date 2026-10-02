// Runs before every build. Prints a warning (does not fail the build) while
// stand-in content that must not go live is still in place:
//   - brand logos used as stand-in clients (src/data/clients.ts)
//   - example contact details (src/data/site.ts)
//   - draft hero copy and sample stats (src/data/home.ts)
//   - draft About manifesto (src/data/about.ts)
//   - draft Services copy (src/data/services.ts) and sample case studies (src/content/work/)
//   - real case studies still incomplete (complete: false): screenshots, [TBC] figures, testimonial approval
//   - draft FAQ copy (src/data/faq.ts)
//   - draft Pricing copy and the launch offer's manual switch (src/data/pricing.ts)
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
if (/export const homeDraft = true/.test(home)) {
  warnings.push('Home sections (services overview, why us, how we work, closing CTA) are DRAFT copy. Replace in src/data/home.ts, then set homeDraft = false.');
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

for (const file of readdirSync(workDir).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(new URL(file, workDir), 'utf8');
  if (!/^complete:\s*false\s*$/m.test(text)) continue;
  const missing = [
    ...[...text.matchAll(/^(cover|detail)Shot:\s*(.+)$/gm)].map((m) => `screenshot (${m[1]}): ${m[2].trim()}`),
    // A [TBC] result is named by its label; any other [TBC] by its own text.
    ...[...text.matchAll(/value: "\[TBC: [^\]]+\]"\s*\n\s*label: (.+)/g)].map((m) => `[TBC] result: ${m[1].trim()}`),
    ...[...text.replace(/value: "\[TBC: [^\]]+\]"/g, '').matchAll(/\[TBC: ([^\]]+)\]/g)].map((m) => `[TBC] ${m[1]}`),
    ...[...text.matchAll(/^awaitingTestimonial:\s*(.+)$/gm)].map((m) => `testimonial from the ${m[1].trim()}, awaiting the client's written approval`),
  ];
  warnings.push(
    `Real case study ${file.replace(/\.md$/, '')} is INCOMPLETE (noindex, not in the sitemap). Missing:`,
    ...missing.map((m) => `  - ${m}`),
    '  Fill these in src/content/work/, then set complete: true.',
  );
}

const about = read('src/data/about.ts');
if (/export const aboutDraft = true/.test(about)) {
  warnings.push('About manifesto is DRAFT copy. Replace in src/data/about.ts, then set aboutDraft = false.');
}

const faq = read('src/data/faq.ts');
if (/export const faqDraft = true/.test(faq)) {
  const gaps = (faq.match(/\{ tbc: '/g) ?? []).length;
  const tbcNote = gaps ? `, with ${gaps} answers still [TBC]` : '';
  warnings.push(`FAQ answers are DRAFT copy${tbcNote}. Once the client has approved them in src/data/faq.ts, set faqDraft = false.`);
}

const pricing = read('src/data/pricing.ts');
if (/export const pricingDraft = true/.test(pricing)) {
  warnings.push('Pricing hero, notes and closing CTA (pricingCopy) and the revision-rounds explainer are DRAFT copy. Approve in src/data/pricing.ts, then set pricingDraft = false.');
}
const offerActive = /^\s*active: true,/m.test(pricing);
const offerEnds = pricing.match(/endsAt: '([^']+)'/)?.[1];
if (offerActive && offerEnds) {
  if (Date.now() >= Date.parse(offerEnds)) {
    warnings.push(`Launch offer ENDED (${offerEnds}) but launchOffer.active is still true. This build shows full prices; set active: false in src/data/pricing.ts.`);
  } else {
    warnings.push(`Launch offer is LIVE until ${offerEnds}. Set launchOffer.active to false once three clients sign; rebuild and redeploy after it ends.`);
  }
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
