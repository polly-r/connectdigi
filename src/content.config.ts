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
 *
 * REAL projects (`placeholder: false`) never carry invented figures, charts
 * or quotes (CLAUDE.md, Case studies). Until everything is in, they set
 * `complete: false`: the page stays noindex and out of the sitemap, missing
 * screenshots (`coverShot` / `detailShot`), "[TBC: …]" results and a
 * testimonial awaiting approval (`awaitingTestimonial`) show as visible
 * placeholders, and the build warns.
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
      // Real project still missing content (screenshots, figures, approved quote).
      complete: z.boolean().default(true),
      // The client's live site, for real projects.
      liveUrl: z.url().optional(),
      duration: z.string(),
      deliverables: z.array(z.string()).min(1),
      // Values may be written as bare YAML numbers (12, 4.7); they're kept as text.
      // "[TBC: …]" renders as a visible placeholder.
      results: z.array(z.object({ value: z.coerce.string(), label: z.string() })).max(4),
      // Images. While one is missing, its *Shot field says exactly what
      // screenshot to capture and the page shows a placeholder in its place.
      cover: image().optional(),
      coverShot: z.string().optional(),
      coverAlt: z.string(),
      detail: image().optional(),
      detailShot: z.string().optional(),
      detailAlt: z.string(),
      detailCaption: z.string(),
      // Client quote, attributed by role and company (no personal name
      // without the person's consent). Labelled "Sample testimonial" while
      // placeholder is true.
      testimonial: z.object({ quote: z.string(), role: z.string() }).optional(),
      // Real project: a testimonial from this role is drafted and awaiting the
      // client's written approval of the exact words. Shown as a placeholder;
      // drafts are kept out of the repo (drafts/, gitignored).
      awaitingTestimonial: z.string().optional(),
      // Results chart. Captioned "Illustrative data" while placeholder is true.
      chart: z
        .object({
          type: z.enum(['line', 'bars']),
          title: z.string(),
          points: z.array(z.object({ label: z.coerce.string(), value: z.number() })).min(2).max(12),
          // Marks a change point, e.g. launch: drawn at (line) or before (bars) this point.
          marker: z.object({ index: z.number().int().min(1), label: z.string() }).optional(),
          // Real (measured) data: where and when it was measured. Required on real projects.
          source: z.string().optional(),
          // Heading for the x values in the screen-reader table (default "Period").
          xLabel: z.string().optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.cover && !data.coverShot) ctx.addIssue({ code: 'custom', message: 'Add cover, or coverShot describing the screenshot needed.' });
      if (!data.detail && !data.detailShot) ctx.addIssue({ code: 'custom', message: 'Add detail, or detailShot describing the screenshot needed.' });
      if (!data.placeholder && data.chart && !data.chart.source) {
        ctx.addIssue({ code: 'custom', message: 'A real project chart needs chart.source (what was measured, how and when).' });
      }
    }),
});

export const collections = { work };
