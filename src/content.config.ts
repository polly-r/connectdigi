/**
 * Content collections.
 *
 * `work`: case studies, one Markdown file per project in src/content/work/.
 * Route: /work/<file name>.
 *
 * `placeholder: true` marks a SAMPLE project (fictional client, illustrative
 * figures and imagery; CLAUDE.md, Decisions log, Phase 6). Such pages show a
 * visible "Sample project" tag, get `noindex`, are left out of the sitemap
 * (astro.config.mjs) and trigger a build warning. Setting it to false with
 * real content removes all of that automatically.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      service: z.enum(['web', 'social', 'content', 'apps', 'tech']),
      client: z.string(),
      sector: z.string(),
      summary: z.string(),
      placeholder: z.boolean(),
      duration: z.string(),
      deliverables: z.array(z.string()).min(1),
      // Values may be written as bare YAML numbers (12, 4.7); they're kept as text.
      results: z.array(z.object({ value: z.coerce.string(), label: z.string() })).max(4),
      cover: image(),
      coverAlt: z.string(),
      detail: image(),
      detailAlt: z.string(),
      detailCaption: z.string(),
    }),
});

export const collections = { work };
