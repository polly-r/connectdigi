/**
 * Services page copy, one entry per service line (slugs from src/data/site.ts).
 *
 * DRAFT COPY: descriptions and "What's included" lists are placeholder copy
 * in the brand's voice, shown unmarked at the client's request (CLAUDE.md,
 * Decisions log, Phase 6). They describe the service only, with no claims.
 * The build warns while `servicesDraft` is true. Listed in PLACEHOLDERS.md.
 */
import type { ServiceSlug } from './site';

/** Flip to false once the client has approved the Services copy. */
export const servicesDraft = true;

export const serviceDetails: Record<ServiceSlug, { description: string; included: string[] }> = {
  web: {
    description:
      'Websites that load fast, read clearly and turn visitors into enquiries. We design and build marketing sites and online stores that your team can update without calling us.',
    included: [
      'UX and interface design',
      'Responsive build for every screen',
      'Content management (CMS) setup',
      'Online stores and payments',
      'Performance, accessibility and SEO foundations',
      'Hosting setup and handover',
    ],
  },
  social: {
    description:
      'Social channels with a point of view. We plan, create and run content that sounds like you, then use what we learn each month to make the next month better.',
    included: [
      'Channel strategy and content calendar',
      'Posts, reels and stories',
      'Community management',
      'Paid social campaigns',
      'Monthly reporting and recommendations',
    ],
  },
  content: {
    description:
      'Words, images and video that explain what you do and why it matters, built to work across your website, your socials and your sales conversations.',
    included: [
      'Copywriting and tone of voice',
      'Photography and art direction',
      'Short-form and explainer video',
      'Blog and article programmes',
      'Brand and product guides',
    ],
  },
  apps: {
    description:
      'Mobile and web apps for bookings, loyalty, internal tools and new products. We scope tightly, ship early and improve from real use.',
    included: [
      'Product discovery and scoping',
      'iOS, Android and web apps',
      'Prototypes and user testing',
      'Integrations with the tools you already use',
      'Launch, support and updates',
    ],
  },
  tech: {
    description:
      'The plumbing behind a modern business: the right tools, connected properly. We audit what you have, fix what slows you down and automate the repetitive work.',
    included: [
      'Tech and tooling audits',
      'Automation and integrations',
      'Dashboards and reporting',
      'Cloud, domain and email setup',
      'Ongoing support',
    ],
  },
};
