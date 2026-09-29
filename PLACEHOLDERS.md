# Placeholders

Every piece of content still missing, and where it lives. Placeholders are
visible in dev and production builds (marked `[TBC: …]` or drawn with the
`Placeholder` component) and are replaced by hand. Use this file as the
content-handover checklist: tick an item once the real content is in.

> **Legal review:** the Privacy Policy (`/privacy`) and Terms of Service
> (`/terms`) are drafts, not legal advice. Their final text needs review by
> the client and, ideally, a legal professional before launch. Re-check the
> Information Regulator's details on its website (`src/data/regulator.ts`,
> last checked 29 September 2026) at the same time.

## ⚠ Must replace before launch (look real, are not)

These are shown without a dashed placeholder outline at the client's request,
so they can pass for real content. `npm run build` prints a warning while any
of them is in place (`scripts/check-stand-ins.mjs`).

- [ ] **Client logos: stand-in brand logos, NOT clients.** Spotify, Airbnb,
      Shopify, Stripe, Netflix, Nike. Replace with real, approved client logos
      in `src/data/clients.ts`, then set `standIn = false`.
- [ ] **Contact form sends NOTHING yet (mock adapter).** Choose a form
      provider, then set `PUBLIC_FORM_ADAPTER=http` and `PUBLIC_FORM_ENDPOINT`
      (see `.env.example` and `src/lib/submit-contact.ts`). Update the Privacy
      Policy with the provider in the same change.
- [ ] **Contact email** (example value `hello@example.com`): `site.contact.email`
- [ ] **Contact phone** (example value `+27 00 000 0000`): `site.contact.phone`
- [ ] **Business address** (example value `Street, City, South Africa`): `site.contact.address`
- [ ] **Home hero headline and intro: DRAFT copy** ("Digital work that connects." /
      "Web, social, content and apps for startups, local businesses and luxury brands.").
      Replace in `src/data/home.ts`, then set `heroDraft = false`.
- [ ] **Home stats: SAMPLE figures, not real.** 120+ projects delivered, 45+
      startups assisted, R25m+ revenue generated for clients, 15 industries
      served. The labels are the client's; every value must be replaced with a
      verified figure in `src/data/home.ts`, then set `statsSample = false`.
      A value counts up if it's a number with a short prefix/suffix (`120+`, `R25m+`).
- [ ] **About manifesto: DRAFT copy** (four paragraphs on approach, no claims).
      Replace in `src/data/about.ts`, then set `aboutDraft = false`.
- [ ] **Services descriptions and "What's included" lists: DRAFT copy.**
      Replace in `src/data/services.ts`, then set `servicesDraft = false`.
- [ ] **Case studies: SAMPLE projects with fictional clients** (Harbour & Hide,
      Tafel Bakehouse, Ledgerline, Stride Physio, Northgate Logistics), with
      illustrative figures and mock-up imagery. Each page shows a "Sample
      project" tag, is noindex and out of the sitemap. To replace one: edit its
      Markdown in `src/content/work/` (brief, what we did, result, deliverables,
      verified outcomes), swap `cover`/`detail` for real project images in
      `src/assets/work/`, and set `placeholder: false`. Keep one entry per
      service line (the Services page links each panel to its case study).
- [ ] **Testimonials: SAMPLE quotes** (one per case study; three also shown on
      Home under "What clients say"), attributed by role only and tagged
      "Sample testimonial". Replace `testimonial` in each case study with a
      real quote the client has approved in writing (name/company only with
      consent). The tag disappears when `placeholder: false`.
- [ ] **Results charts: SAMPLE data** (one per case study), captioned
      "Illustrative data". Replace `chart.points` with verified figures and
      say where they came from; the caption note disappears with `placeholder: false`.

## Company and social — `src/data/site.ts`

- [ ] Site URL / domain: `SITE_URL` (currently `https://theconnectdigital.invalid`; also drives sitemap and canonical URLs)
- [ ] Facebook, Instagram, LinkedIn profile URLs: `site.social[].href`
      (icons show in the footer now; they become links once a URL is set)

## Legal pages: company facts — `src/data/site.ts`

Shown as visible placeholders on `/privacy` and `/terms` until supplied.

- [ ] Registered company name: `site.legal.registeredName`
- [ ] Legal form (e.g. (Pty) Ltd, sole proprietor): `site.legal.legalStatus`
- [ ] Company registration number: `site.legal.registrationNumber`
- [ ] Registered / physical address (also the address for legal notices): `site.legal.registeredAddress`
- [ ] Information Officer name, email, phone: `site.legal.informationOfficer`
      (the Information Officer must also be registered with the Information Regulator)
- [ ] Where the PAIA manual is available: `site.legal.paiaManual`
- [ ] Contact form provider and where it stores data: `site.providers.form`, `site.providerLocations.form`
- [ ] Hosting provider and where it stores logs: `site.providers.hosting`, `site.providerLocations.hosting`
- [ ] Email provider and where it stores data: `site.providers.email`, `site.providerLocations.email`
- [ ] CRM or project tool enquiries are copied into, and where it stores data: `site.providers.crm`, `site.providerLocations.crm`
- [ ] Booking tool (or none): `site.providers.booking`
- [ ] Analytics tool (or none): `site.providers.analytics` (the policy currently states none; adding one means updating it)
- [ ] Retention periods (enquiries, WhatsApp, client records, server logs, bookings): `site.retention`
- [ ] Effective dates, set when the final text is approved: `site.policies.privacyEffective`, `site.policies.termsEffective`

## Brand and design

- [ ] Typeface sign-off: Fraunces is provisional (`--font-display` in `src/styles/global.css`)
- [ ] Favicon legibility at 16–32px: the full mark is used; a simplified
      favicon mark would need a supplied or approved design
      (generated by `npm run logo` into `public/`)
- [ ] Social share image (`og:image`): none yet; add to `src/components/Seo.astro`

## Draft UI copy (confirm wording)

- [ ] Hero button label ("Start a project") and section labels ("What we do",
      "In numbers", "Clients"): draft UI copy, confirm wording
- [ ] About section labels ("Our approach", "What we do") and the CTA band
      text ("Let's talk"): draft UI copy, confirm wording
- [ ] Connect intro ("Tell us what you're working on. We'll reply by email."),
      form heading, consent wording and thank-you text: draft UI copy, confirm
      wording (consent wording also needs legal review with the Privacy Policy)
- [ ] Booking tool (optional): set `PUBLIC_BOOKING_URL` to show the embed on Connect
- [ ] Services intro line and closing prompt ("Not sure which you need? Tell us
      the problem."): draft UI copy, confirm wording

## SEO copy

- [ ] Meta descriptions for each page (factual drafts, need client review):
      `description` prop in each file under `src/pages/`

## Holding pages (replaced as each phase lands)

Each shows a block `Placeholder` and is linked from the nav/footer so links never 404.


## Not built yet (added as each phase lands)

- [ ] Testimonials (no location yet)
