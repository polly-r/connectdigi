/**
 * Pricing: the single source for every price, package's contents, the Care
 * Plan and the launch offer (CLAUDE.md, "Pricing data"). Nothing else on the
 * site hard-codes an amount: pages and copy format them from here with
 * `formatRand()`.
 *
 * Packages, features, explainers, extras, payment and ownership lines, the
 * Care Plan and the launch offer were supplied by the client (2026-10-01) and
 * are used as given. Only the copy in `pricingCopy` (and the revision-rounds
 * explainer) is draft: the build warns while `pricingDraft` is true.
 */

/** Flip to false once the client has approved `pricingCopy`. */
export const pricingDraft = true;

export type PackageSlug = 'starter' | 'standard' | 'plus' | 'enterprise';

export interface Package {
  slug: PackageSlug;
  name: string;
  bestFor: string;
  /** Rand, VAT included. null: no fixed price ("Let's talk"). */
  price: number | null;
  /** Maximum pages. null: as agreed. */
  pages: number | null;
  /** Business days, counted from deposit and content received. null: as agreed. */
  deliveryDays: number | null;
  highlight?: 'Most popular';
}

export const packages: Package[] = [
  {
    slug: 'starter',
    name: 'Starter',
    bestFor: 'A simple, credible online presence.',
    price: 4000,
    pages: 3,
    deliveryDays: 10,
  },
  {
    slug: 'standard',
    name: 'Standard',
    bestFor: 'Small businesses that want to be found.',
    price: 10000,
    pages: 5,
    deliveryDays: 15,
    highlight: 'Most popular',
  },
  {
    slug: 'plus',
    name: 'Plus',
    bestFor: 'Businesses that take bookings or publish regularly.',
    price: 16000,
    pages: 10,
    deliveryDays: 20,
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    bestFor: 'Custom features and larger sites.',
    price: null,
    pages: null,
    deliveryDays: null,
  },
];

/** Shown wherever a package has no fixed value. */
export const AS_AGREED = 'As agreed';
/** Enterprise's price. */
export const NO_PRICE_LABEL = "Let's talk";

/**
 * A feature, per package: `true` included, `null` not included, or a short
 * qualifier ("Up to 5 pages", "As agreed").
 */
export type FeatureValue = true | string | null;

export interface Feature {
  id: string;
  name: string;
  /** One line, shown by the feature's "i" button. */
  explainer: string;
  values: Record<PackageSlug, FeatureValue>;
}

const all = { starter: true, standard: true, plus: true, enterprise: true } as const;

export const features: Feature[] = [
  {
    id: 'design',
    name: 'Custom design, mobile-friendly',
    explainer: 'Designed for your business, works on every screen size.',
    values: all,
  },
  {
    id: 'contact-form',
    name: 'Contact form',
    explainer: 'Enquiries come straight to your inbox.',
    values: all,
  },
  {
    id: 'seo',
    name: 'Basic on-page SEO',
    explainer: 'Page titles, descriptions and structure that help search engines read your site.',
    values: all,
  },
  {
    id: 'domain-hosting',
    name: 'Help setting up domain and hosting',
    explainer: 'Registered in your name, so you own it.',
    values: all,
  },
  {
    id: 'google-business',
    name: 'Google Business Profile setup',
    explainer: 'Appear on Google Search and Maps.',
    values: { starter: null, standard: true, plus: true, enterprise: true },
  },
  {
    id: 'booking-blog',
    name: 'Booking embed or blog',
    explainer: 'Let customers book, or publish news and articles.',
    values: { starter: null, standard: null, plus: 'One of the two', enterprise: AS_AGREED },
  },
  {
    id: 'copy-polish',
    name: 'Copy polish of your text',
    explainer: 'We tighten and tidy the words you supply.',
    values: { starter: null, standard: null, plus: 'Up to 5 pages', enterprise: AS_AGREED },
  },
  {
    id: 'revisions',
    name: 'Revision rounds',
    // DRAFT explainer (the client supplied the feature, not this line).
    explainer: 'One round is one set of your feedback, which we then apply in full.',
    values: { starter: '2', standard: '2', plus: '2', enterprise: AS_AGREED },
  },
];

/** Rand amounts for work outside a package, VAT included. */
export const extras = {
  extraPage: 600,
  /** Extra revision round or out-of-scope work, quoted in advance. */
  hourlyRate: 450,
};

export const paymentLine = '50% deposit to start, balance before launch';
export const ownershipLine = 'Every package: you own the finished site.';
export const deliveryNote = 'Delivery times start once we have your deposit and your content.';
export const vatNote = 'Prices in South African rand, including VAT.';
/** Free support included with every package before the Care Plan applies. */
export const supportDays = 30;

/** "All packages include" strip. */
export const allPackagesInclude = [
  'Custom mobile-friendly design',
  'Contact form',
  'Basic SEO',
  'Domain and hosting help',
  '2 revision rounds (Enterprise: as agreed)',
  'You own the site',
];

/** Not part of any package. */
export const notIncluded = [
  'Domain and hosting fees',
  'Logo design',
  'Copywriting beyond the copy polish in Plus',
  'Online shops',
  'Paid advertising',
  'Paid third-party tools',
];

/** Ongoing maintenance add-on. No amount anywhere on the site. */
export const carePlan = {
  slug: 'care-plan',
  name: 'Care Plan',
  headline: 'Send us changes, we do them within 2 business days.',
  points: [
    'Up to 5 small changes a month (text, prices, hours, images).',
    'Each change done within 2 business days.',
    'Code updates, a monthly site and form check, and a backup copy.',
    'Month to month, with 30 days’ notice.',
    'Cancelling never affects ownership: the site stays yours.',
  ],
  priceLabel: 'Price on request',
  /** The one-line pitch at the foot of every package card. */
  cardLine: 'send us changes, we do them within 2 business days',
} as const;

/**
 * Launch offer on Standard. `active` is a manual switch: set it to false once
 * three clients have signed (nothing on a static site can count them).
 * Expiry is also checked in the visitor's browser (CLAUDE.md, "Launch offer
 * on a static site"), but rebuild and redeploy after `endsAt` regardless.
 */
export const launchOffer = {
  package: 'standard' as PackageSlug,
  offerPrice: 5000,
  standardPrice: 10000,
  /** SAST. */
  endsAt: '2026-10-31T23:59:59+02:00',
  active: true,
  label: 'Launch offer: 50% off until 31 October 2026, first three clients',
};

if (packages.find((p) => p.slug === launchOffer.package)?.price !== launchOffer.standardPrice) {
  throw new Error('pricing.ts: launchOffer.standardPrice must match the Standard package price.');
}

/** True while the launch offer applies: switched on and not yet ended. */
export const offerLive = (now: number = Date.now()): boolean =>
  launchOffer.active && now < Date.parse(launchOffer.endsAt);

/** The offer's last day, e.g. "31 October 2026" (in SAST). */
export const offerEndLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Johannesburg',
}).format(new Date(launchOffer.endsAt));

/** Rand with comma grouping: 4000 → "R4,000". */
export const formatRand = (amount: number): string =>
  `R${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

/** Lowest fixed package price. */
export const fromPrice = Math.min(...packages.flatMap((p) => (p.price === null ? [] : [p.price])));

const days = packages.flatMap((p) => (p.deliveryDays === null ? [] : [p.deliveryDays]));
/** Shortest and longest fixed delivery times, in business days. */
export const deliveryRange = { min: Math.min(...days), max: Math.max(...days) };

/** The Connect form's Package choices, in order (values match ?package=). */
export const packageChoices = [
  ...packages.map((p) => ({ value: p.slug as string, label: p.name })),
  { value: carePlan.slug, label: carePlan.name },
  { value: 'unsure', label: 'Not sure yet' },
];

/**
 * DRAFT COPY (brand voice, for the client to approve): hero, scope note and
 * closing call to action. Facts in it come from the values above.
 */
export const pricingCopy = {
  title: 'Clear prices. A website you own.',
  lead: `Fixed prices for every website package, so you know the cost before we start. Pay 50% to begin and the balance before launch, and the finished site is yours.`,
  scopeNote: 'These packages are for websites. Social media, content, apps and tech solutions are quoted after a',
  scopeLinkText: 'free consultation',
  maintenanceNote: `Ongoing maintenance isn’t part of the packages. Every package includes ${supportDays} days of fixes after launch; after that, the Care Plan is a separate monthly add-on.`,
  careIntro: `Every package includes ${supportDays} days of fixes after launch. After that, the Care Plan keeps your site up to date.`,
  closing: {
    title: 'Not sure which package fits?',
    text: 'Tell us what you need and we’ll recommend one. The first consultation is free, and we reply within 24 hours.',
    label: 'Get a free consultation',
  },
};

export const pricingSeo = {
  title: 'Website Design Pricing in South Africa · The Connect Digital',
  description: `Fixed-price website packages from ${formatRand(fromPrice)}, VAT included: custom mobile-friendly design, contact form, basic SEO, and you own the site. 50% deposit to start.`,
};
