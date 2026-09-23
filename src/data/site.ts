/**
 * Single source for the site URL, company facts and contact details.
 *
 * Every value built with `tbc()` is a visible placeholder. It renders as
 * "[TBC: …]" so it can never pass as real content, and it is listed in
 * PLACEHOLDERS.md. Nothing here is real until the client supplies it.
 */

/** Wraps a missing fact in a visible marker. */
const tbc = (label: string): string => `[TBC: ${label}]`;

/** True if a value is still a placeholder, so components can render it as one. */
export const isTbc = (value: string): boolean => value.startsWith('[TBC:');

/**
 * Placeholder domain. `.invalid` is reserved (RFC 2606) and can never resolve,
 * so it cannot be mistaken for the live site. Replace once the domain is bought;
 * astro.config.mjs (sitemap, canonical URLs) reads it from here.
 */
export const SITE_URL = 'https://theconnectdigital.invalid';

export const site = {
  name: 'The Connect Digital',
  url: SITE_URL,
  locale: 'en-ZA',

  contact: {
    email: tbc('contact email'),
    phone: tbc('contact phone'),
    address: tbc('business address'),
  },

  /** Which networks, and their URLs, are still to be supplied. */
  social: [
    { label: tbc('social network 1'), href: tbc('social profile URL 1') },
    { label: tbc('social network 2'), href: tbc('social profile URL 2') },
  ],

  /** Company facts for the Privacy Policy (POPIA). */
  legal: {
    registeredName: tbc('registered company name'),
    registrationNumber: tbc('company registration number'),
    registeredAddress: tbc('registered address'),
    informationOfficer: {
      name: tbc('Information Officer name'),
      email: tbc('Information Officer email'),
      phone: tbc('Information Officer phone'),
    },
  },

  /** Third parties that will receive personal information. Decided later. */
  providers: {
    form: tbc('contact form provider'),
    hosting: tbc('hosting provider'),
    booking: tbc('booking tool, or none'),
    analytics: tbc('analytics tool, or none'),
  },

  /** How long each kind of data is kept. */
  retention: {
    enquiries: tbc('retention period for contact form enquiries'),
    serverLogs: tbc('retention period for hosting server logs'),
    bookings: tbc('retention period for booking data'),
  },
} as const;

/**
 * The five service lines. Slugs are fixed (anchors on /services, case-study
 * URLs, contact form select values); descriptions are placeholders.
 */
export const services = [
  { slug: 'web', name: 'Web development', short: 'Web Dev', description: tbc('web development one-liner') },
  { slug: 'social', name: 'Social media marketing', short: 'Social', description: tbc('social media one-liner') },
  { slug: 'content', name: 'Content creation', short: 'Content', description: tbc('content creation one-liner') },
  { slug: 'apps', name: 'App development', short: 'App Dev', description: tbc('app development one-liner') },
  { slug: 'tech', name: 'Tech solutions', short: 'Tech Solutions', description: tbc('tech solutions one-liner') },
] as const;

export type ServiceSlug = (typeof services)[number]['slug'];
