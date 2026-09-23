# Placeholders

Every piece of content still missing, and where it lives. Placeholders are
visible in dev and production builds (marked `[TBC: …]` or drawn with the
`Placeholder` component) and are replaced by hand. Use this file as the
content-handover checklist: tick an item once the real content is in.

> **Legal review:** the Privacy Policy (built in Phase 8) is a draft, not legal
> advice. Its final text needs review by the client and, ideally, a legal
> professional before launch.

## Company and contact details — `src/data/site.ts`

- [ ] Site URL / domain: `SITE_URL` (currently `https://theconnectdigital.invalid`; also drives sitemap and canonical URLs)
- [ ] Contact email: `site.contact.email`
- [ ] Contact phone: `site.contact.phone`
- [ ] Business address: `site.contact.address`
- [ ] Social networks and profile URLs: `site.social`

## Privacy Policy facts — `src/data/site.ts`

- [ ] Registered company name: `site.legal.registeredName`
- [ ] Company registration number: `site.legal.registrationNumber`
- [ ] Registered address: `site.legal.registeredAddress`
- [ ] Information Officer name, email, phone: `site.legal.informationOfficer`
- [ ] Contact form provider: `site.providers.form`
- [ ] Hosting provider: `site.providers.hosting`
- [ ] Booking tool (or none): `site.providers.booking`
- [ ] Analytics tool (or none): `site.providers.analytics`
- [ ] Retention periods (enquiries, server logs, bookings): `site.retention`

## Service copy — `src/data/site.ts`

- [ ] One-line descriptions for the five service lines: `services[].description`
      (used by the Home ticker; full Services copy is added in Phase 6)

## Brand and design

- [ ] Typeface sign-off: Fraunces is provisional (`--font-display`, set up in Phase 1)
- [ ] Logo: only two of four variants were supplied
      (`public/logo/logo-full-colour.svg`, `public/logo/logo-mono-white.svg`).
      Confirm whether a wordmark SVG exists; until then the name is set in type.

## Not built yet (added as each phase lands)

- [ ] Home hero headline (Phase 4)
- [ ] Client logos (Phase 4, logo strip)
- [ ] Stats values (Phase 4)
- [ ] About manifesto paragraphs (Phase 5)
- [ ] Case studies, one placeholder per service line (Phase 6, `src/content/work/`)
- [ ] Testimonials (no location yet)
- [ ] Privacy Policy last-updated date (Phase 8)
