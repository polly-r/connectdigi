/**
 * Home page content.
 *
 * DRAFT COPY: the hero headline and intro are placeholder copy written in the
 * brand's voice, shown unmarked at the client's request (CLAUDE.md, Decisions
 * log, Phase 4). They need the client's final wording before launch; the
 * build warns while `heroDraft` is true. Listed in PLACEHOLDERS.md.
 *
 * Stats are sample figures for now (see `statsSample` below). The count-up
 * runs only when a value is numeric, e.g. "120+", "98%", "R2.5m".
 */

/** Flip to false once the client has approved the hero copy. */
export const heroDraft = true;

export const hero = {
  /** Small line above the headline: carries the search terms the headline doesn't. */
  eyebrow: 'Digital marketing agency · South Africa · Working worldwide',
  headline: 'Digital work that connects.',
  intro:
    'Websites, social media, content and apps for startups, local businesses and luxury brands, built to be found and made to convert.',
  cta: { label: 'Start a project', href: '/connect' },
};

/**
 * Home search listing: the <title> and meta description Google shows. The
 * title leads with what people search for, then the brand.
 */
export const homeSeo = {
  title: 'Digital Marketing Agency in South Africa · The Connect Digital',
  description:
    'South African digital marketing agency working worldwide. Web development, social media marketing, content creation, app development and tech solutions.',
};

/**
 * DRAFT COPY for the Home sections below the hero (services overview, why us,
 * process, questions, closing CTA). Brand voice, shown unmarked like the
 * hero; facts only from the client (24-hour reply, free first consultation,
 * worldwide, quotation after scoping) or from the Services copy. The build
 * warns while `homeDraft` is true. Listed in PLACEHOLDERS.md.
 */
export const homeDraft = true;

/** One line per service for the Home overview (slugs from src/data/site.ts). */
export const serviceSummaries: Record<string, string> = {
  web: 'Fast, search-ready websites and online stores that turn visitors into enquiries.',
  social: 'Strategy, content, community and paid campaigns that grow a following worth having.',
  content: 'Copy, photography and video that explain what you do and why it matters.',
  apps: 'Mobile and web apps for bookings, loyalty, internal tools and new products.',
  tech: 'The right tools, properly connected: audits, automation, integrations and dashboards.',
};

export const servicesIntro = {
  title: 'Digital marketing services that work together',
  text: 'Pick one or combine them. Every service is planned around the same goal: more of the right customers finding and choosing you.',
};

export const reasons = {
  title: 'Why work with The Connect Digital',
  items: [
    {
      title: 'One team, every channel',
      text: 'Website, social, content and apps from one team, so your brand looks and sounds the same everywhere.',
    },
    {
      title: 'Built to be found',
      text: 'Fast pages, clean structure and search foundations in everything we build, so customers can find you.',
    },
    {
      title: 'Clear quotes, no surprises',
      text: 'We agree the scope first, then send a written quotation. Nothing starts until you approve it.',
    },
    {
      title: 'Worldwide, and quick to reply',
      text: 'We work with clients across time zones and reply to every enquiry within 24 hours.',
    },
  ],
};

export const process = {
  title: 'How we work',
  steps: [
    { title: 'Listen', text: 'A free first consultation about your business, customers and goals.' },
    { title: 'Plan', text: 'We agree the scope, timeline and what success looks like, in a written quotation.' },
    { title: 'Make', text: 'We design and build, sharing work early so you can steer it.' },
    { title: 'Launch', text: 'We go live and hand over everything you need, with 30 days of support.' },
    { title: 'Improve', text: 'We look at what’s working and recommend what to do next.' },
  ],
};

/** FAQ questions shown on Home, by id from src/data/faq.ts. */
export const featuredFaqs = ['pricing', 'timeline', 'first-call', 'seo', 'location'];

export const closingCta = {
  title: 'Ready to grow online?',
  text: 'Tell us what you’re working on. The first consultation is free, and we reply within 24 hours.',
};

/**
 * A stat value that can count up: a number with an optional short prefix or
 * suffix of up to 3 characters (currency, unit, "+", "%"), e.g. "120+",
 * "98%", "R2.5m", "1,200". Placeholders like "[STAT 1]" don't match.
 * Groups: prefix, digits, suffix.
 */
export const NUMERIC_STAT = /^([^\d\s[\]]{0,3})(\d[\d,]*(?:\.\d+)?)([^\d\s[\]]{0,3})$/;

export interface Stat {
  value: string;
  label: string;
}

/**
 * SAMPLE FIGURES, NOT REAL. The labels are the client's; the values are
 * plausible stand-ins at the client's request (CLAUDE.md, Decisions log,
 * Phase 4). Each is a factual claim once live, so every value must be
 * replaced with a verified figure before launch; the build warns while
 * `statsSample` is true. Listed in PLACEHOLDERS.md.
 */
export const statsSample = true;

export const stats: Stat[] = [
  { value: '120+', label: 'Projects delivered' },
  { value: '45+', label: 'Startups assisted' },
  { value: 'R25m+', label: 'Revenue generated for clients' },
  { value: '15', label: 'Industries served' },
];
