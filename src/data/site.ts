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

/** The label inside a placeholder value: "[TBC: contact email]" → "contact email". */
export const tbcLabel = (value: string): string => value.replace(/^\[TBC:\s*/, '').replace(/\]$/, '');

/**
 * Placeholder domain. `.invalid` is reserved (RFC 2606) and can never resolve,
 * so it cannot be mistaken for the live site. Replace once the domain is bought;
 * astro.config.mjs (sitemap, canonical URLs) reads it from here.
 */
export const SITE_URL = 'https://theconnectdigital.invalid';

/** Main navigation, in order. */
export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Connect', href: '/connect' },
] as const;

export const site = {
  name: 'The Connect Digital',
  url: SITE_URL,
  locale: 'en-ZA',

  /**
   * EXAMPLE VALUES, NOT REAL. Shown as-is in the footer at the client's
   * request (CLAUDE.md, Decisions log, Phase 2). example.com is reserved
   * (RFC 2606) and the 000 number doesn't exist. Replace with real details;
   * listed in PLACEHOLDERS.md.
   */
  contact: {
    email: 'hello@example.com',
    phone: '+27 00 000 0000',
    address: 'Street, City, South Africa',
  },

  /** Networks are decided; profile URLs are still to be supplied. */
  social: [
    { network: 'facebook', label: 'Facebook', href: tbc('Facebook profile URL') },
    { network: 'instagram', label: 'Instagram', href: tbc('Instagram profile URL') },
    { network: 'linkedin', label: 'LinkedIn', href: tbc('LinkedIn profile URL') },
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
 * URLs, contact form select values); `short` is the Home ticker label.
 */
export const services = [
  { slug: 'web', name: 'Web development', short: 'Web Dev' },
  { slug: 'social', name: 'Social media marketing', short: 'Social' },
  { slug: 'content', name: 'Content creation', short: 'Content' },
  { slug: 'apps', name: 'App development', short: 'App Dev' },
  { slug: 'tech', name: 'Tech solutions', short: 'Tech Solutions' },
] as const;

export type ServiceSlug = (typeof services)[number]['slug'];
