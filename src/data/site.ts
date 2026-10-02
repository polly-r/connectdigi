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
  { label: 'Pricing', href: '/pricing' },
  { label: 'Connect', href: '/connect' },
] as const;

export const site = {
  name: 'The Connect Digital',
  url: SITE_URL,
  locale: 'en-ZA',

  /** Real contact details, supplied by the client on 2026-10-02. */
  contact: {
    email: 'thedigitalconnect777@gmail.com',
    phone: '+27 64 900 5414',
    address: 'Centurion, Midrand, South Africa',
  },

  /** Networks are decided; profile URLs are still to be supplied. */
  social: [
    { network: 'facebook', label: 'Facebook', href: tbc('Facebook profile URL') },
    { network: 'instagram', label: 'Instagram', href: tbc('Instagram profile URL') },
    { network: 'linkedin', label: 'LinkedIn', href: tbc('LinkedIn profile URL') },
  ],

  /** Company facts for the Privacy Policy (POPIA) and Terms of Service (ECTA s43). */
  legal: {
    registeredName: tbc('registered company name'),
    legalStatus: tbc('legal form, e.g. private company (Pty) Ltd or sole proprietor'),
    registrationNumber: tbc('company registration number'),
    registeredAddress: tbc('registered address'),
    informationOfficer: {
      name: tbc('Information Officer name'),
      email: tbc('Information Officer email'),
      phone: tbc('Information Officer phone'),
    },
    paiaManual: tbc('where the PAIA manual is available (link, or "on request")'),
  },

  /**
   * Third parties (operators) that receive personal information, and where
   * each stores it (for the cross-border section). Decided later.
   */
  providers: {
    form: 'Formspree',
    hosting: tbc('hosting provider'),
    email: 'Google (Gmail)',
    crm: tbc('CRM or project tool enquiries are copied into'),
    /** Decided: enquiries may be answered on WhatsApp. */
    messaging: 'WhatsApp (Meta Platforms)',
    booking: tbc('booking tool, or none'),
    analytics: tbc('analytics tool, or none'),
  },
  providerLocations: {
    // Formspree privacy policy (updated 24 April 2022): "technical infrastructure in the US". Checked 2026-10-02.
    form: 'United States',
    hosting: tbc('where the host stores logs'),
    // Google privacy policy (effective 1 October 2026): "servers around the world". Checked 2026-10-02.
    email: 'Google’s servers in several countries, including outside South Africa',
    crm: tbc('where the CRM or project tool stores data'),
  },

  /** How long each kind of data is kept. */
  retention: {
    enquiries: tbc('retention period for enquiries (form, email, CRM)'),
    whatsapp: tbc('retention period for WhatsApp conversations'),
    clientRecords: tbc('retention period for client project records'),
    serverLogs: tbc('retention period for hosting server logs'),
    bookings: tbc('retention period for booking data'),
  },

  /** Effective dates of the legal pages. Set when the final text is approved. */
  policies: {
    privacyEffective: tbc('Privacy Policy effective date'),
    termsEffective: tbc('Terms of Service effective date'),
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
