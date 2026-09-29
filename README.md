# The Connect Digital: website

Marketing site for The Connect Digital. Static Astro site: `npm run build`
produces a plain `dist/` folder any static host can serve.

- **Decisions and rules:** [CLAUDE.md](CLAUDE.md) (read this before changing anything)
- **Content still to supply:** [PLACEHOLDERS.md](PLACEHOLDERS.md) (the client checklist)

## Run and build

Needs Node 22.12 or later.

```sh
npm install
npm run dev        # http://localhost:4321, with hot reload
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to check the real build
npm run check      # type and template checks (astro check)
```

`npm run build` first runs two checks:

- `check:contrast` fails the build if a colour token breaks the contrast rules
  in CLAUDE.md.
- `check:stand-ins` prints a yellow **NOT READY FOR LAUNCH** list of anything
  that looks real but isn't yet (sample case studies, draft copy, example
  contact details, the mock contact form, facts still `[TBC]`). It warns; it
  doesn't stop the build. It should print nothing before launch.

Dev-only review pages (never built): `/lab/logo`, `/lab/marquee`, `/lab/motif`.

## Where things live

| What | Where |
|---|---|
| Colour tokens (light/dark), type scale, spacing, grid | `src/styles/global.css` |
| Company facts, contact details, social links, providers, retention periods | `src/data/site.ts` |
| Home copy and stats | `src/data/home.ts` |
| About manifesto | `src/data/about.ts` |
| Services descriptions and "What's included" | `src/data/services.ts` |
| Client logos | `src/data/clients.ts` |
| Case studies (text, figures, testimonial, chart) | `src/content/work/*.md` |
| Case study images | `src/assets/work/` |
| Privacy Policy / Terms of Service | `src/pages/privacy.astro`, `src/pages/terms.astro` |
| Information Regulator details | `src/data/regulator.ts` |
| Contact form submission | `src/lib/submit-contact.ts` |
| Logo (themeable working copy) | `src/assets/logo/logo-mark.svg` (built from `public/logo/`) |

## Change colours or fonts

**Colours.** Edit the hex values in the token block at the top of
`src/styles/global.css` (`@theme static` for light, `.dark` for dark). Nothing
else in the code uses hex colours. Then:

```sh
npm run check:contrast   # confirms every pair still passes
npm run logo             # regenerates the favicons from the new tokens
```

**Fonts.** Fonts are self-hosted with Fontsource. To swap a typeface:

1. `npm install @fontsource-variable/<new-font>` (and remove the old one).
2. Update the imports at the top of `src/layouts/BaseLayout.astro` (and the
   preload line for the body font).
3. Change `--font-display` or `--font-body` in `src/styles/global.css`.
4. If you change the display face, re-measure two things that are tuned to
   Fraunces: the About wordmark widths in `src/components/about/Wordmark.astro`,
   and the `size-adjust` of the "Fraunces Fallback" font in `global.css`.

## Choose a contact form provider

The form never talks to a provider directly; it calls `submitContact()` in
`src/lib/submit-contact.ts`, which uses an adapter. Until a provider is chosen
the **mock** adapter is active: it sends nothing.

For any provider that accepts a JSON POST (most do), set two environment
variables in `.env` or in the host's settings (see `.env.example`):

```sh
PUBLIC_FORM_ADAPTER=http
PUBLIC_FORM_ENDPOINT=https://…your provider's endpoint…
```

If a provider needs a different request format, add an adapter next to
`httpAdapter` in `submit-contact.ts` (it implements `ContactAdapter`: one
`submit(payload, { signal })` method returning `{ ok: true }` or
`{ ok: false, reason }`) and select it in `getAdapter()`. The form component
doesn't change.

Test a real submission end to end after switching, including the error path
(e.g. with the network turned off).

## Replace placeholders

Every stand-in is listed in [PLACEHOLDERS.md](PLACEHOLDERS.md). By kind:

- **`[TBC: …]` facts** (company details, providers, retention periods, social
  URLs): edit the value in `src/data/site.ts`. It stops rendering as a dashed
  placeholder and appears as normal text everywhere it's used.
- **Example contact details** (`hello@example.com` …): `site.contact` in
  `src/data/site.ts`.
- **Draft copy**: edit the text, then set the flag to `false`:
  `heroDraft` (`home.ts`), `aboutDraft` (`about.ts`), `servicesDraft` (`services.ts`).
- **Stats**: edit the four values in `src/data/home.ts` and set
  `statsSample = false`. A value counts up automatically if it's a number with
  a short prefix or suffix (`120+`, `98%`, `R25m+`).
- **Client logos**: replace the entries in `src/data/clients.ts` (each is a
  name plus one SVG path on a 24×24 viewBox), then set `standIn = false`.
- **Case studies**: each file in `src/content/work/` is one project, one per
  service line. Replace the text, `results`, `testimonial` (a quote the client
  approved in writing) and `chart.points` (verified figures), swap `cover` and
  `detail` for real images in `src/assets/work/`, then set
  **`placeholder: false`**. That one flag removes the "Sample project" tag,
  the "Sample testimonial" tag, the "Illustrative data" notes and `noindex`,
  and adds the page to the sitemap.
- **Social links**: add each profile URL to `site.social` in `site.ts`; the
  footer icon becomes a link.
- **Booking tool** (optional): set `PUBLIC_BOOKING_URL`; the Connect page
  shows the embed. Update the Privacy Policy in the same change.
- **Domain**: set `SITE_URL` in `src/data/site.ts`; the sitemap, canonical
  URLs and the Terms page use it.

## Privacy Policy: what changes when providers are chosen

The policy (`/privacy`) is a draft for legal review. When the host and form
provider (and email provider, CRM or project tool, booking tool) are chosen,
update these in `src/data/site.ts` and re-read the page:

| Decision | Update | Policy sections affected |
|---|---|---|
| Hosting provider | `providers.hosting`, `providerLocations.hosting`, `retention.serverLogs` | 5 Sharing, 6 Transfers, 7 Retention |
| Form provider | `providers.form`, `providerLocations.form` | 5, 6 |
| Email provider | `providers.email`, `providerLocations.email` | 5, 6 |
| CRM or project tool | `providers.crm`, `providerLocations.crm`, `retention.enquiries` | 5, 6, 7 |
| Booking tool | `providers.booking`, `retention.bookings`, and text in section 10 (cookies) | 2, 5, 6, 7, 10 |
| Analytics (currently none) | add a provider, and rewrite sections 2 and 10, which state there is none | 2, 5, 6, 10 |
| Approval | `policies.privacyEffective`, `policies.termsEffective` | effective dates |

Re-check the Information Regulator's details (`src/data/regulator.ts`) on its
website whenever the policy changes.

## Scripts

| Script | What it does |
|---|---|
| `npm run logo` | Rebuilds the themeable logo and favicons from `public/logo/logo-full-colour.svg` |
| `npm run sample-art` | Regenerates the sample case-study illustrations (delete once real images are in) |
| `npm run check:contrast` | Contrast check of the colour tokens |
| `npm run check:stand-ins` | The "not ready for launch" list |
| `node scripts/shoot.mjs <url>` | Screenshots at 360/768/1280 in light and dark, with console-error and overflow checks (uses the installed Microsoft Edge) |
