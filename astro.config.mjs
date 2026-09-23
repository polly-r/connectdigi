// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/data/site.ts';
import devLab from './integrations/dev-lab.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [react(), sitemap(), devLab()],

  vite: {
    plugins: [tailwindcss()],
  },
});
