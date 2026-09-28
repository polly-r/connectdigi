// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { readdirSync, readFileSync } from 'node:fs';

import { SITE_URL } from './src/data/site.ts';
import devLab from './integrations/dev-lab.ts';

// Case studies with `placeholder: true` (sample projects) stay out of the
// sitemap; their pages also carry noindex. Flipping the flag re-includes them.
const WORK_DIR = './src/content/work';
const sampleWork = readdirSync(WORK_DIR)
  .filter((file) => file.endsWith('.md') && /^placeholder:\s*true\s*$/m.test(readFileSync(`${WORK_DIR}/${file}`, 'utf8')))
  .map((file) => `/work/${file.replace(/\.md$/, '')}`);

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    react(),
    sitemap({ filter: (page) => !sampleWork.includes(new URL(page).pathname.replace(/\/$/, '')) }),
    devLab(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
