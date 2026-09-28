# The Connect Digital: website

Read this file at the start of every session. It is the source of truth for
decisions already made. If a request conflicts with it, point out the conflict
before acting.

## Project
Marketing site for The Connect Digital, a digital marketing agency offering web
development, social media marketing, content creation, app development and
general tech solutions. Pages: Home, About, Services, Connect, Privacy Policy,
plus case-study pages (see Pages).

## Audience
Tech startups, local businesses and, as a growth goal, luxury brands. The visual
system stays identical for all three. Audience targeting happens through copy and
case-study selection only.

## Stack
- Astro (latest stable at install time), TypeScript in strict mode, Tailwind CSS.
  Follow the Tailwind setup that the current Astro docs recommend. For Tailwind v4
  that is the `@tailwindcss/vite` plugin, not the older `@astrojs/tailwind`
  integration. Check the docs rather than working from memory.
- GSAP from the public `gsap` npm package, with ScrollTrigger and SplitText. All
  GSAP plugins are free for commercial use, no private registry or token needed.
  Register plugins once in `src/lib/gsap.ts` and import from there. Do not add
  GSAP as an Astro integration.
- `@astrojs/react` for exactly two islands: `ServiceAccordion` (Services) and
  `ContactForm` (Connect). Everything else is `.astro` plus small vanilla TS
  scripts. Ask before adding a third island.
- Fonts self-hosted via Fontsource: `@fontsource-variable/fraunces` (display) and
  `@fontsource-variable/inter` (body/UI). Reference them only through
  `--font-display` and `--font-body` so a typeface swap is a one-line change.
  Fraunces is provisional, awaiting sign-off.
- Static output (`output: 'static'`), no server adapter.
- Hosting happens last: the site goes on a free static hosting platform after
  the domain is bought. Until then keep the build host-agnostic. No
  host-specific features (Netlify Forms, Vercel or Cloudflare functions,
  host-specific redirect files) and no assumptions about which platform it
  will be. `npm run build` must produce a plain `dist/` folder that any static
  host can serve.
- Do not install anything outside this list without saying what it is for first.

## Colour tokens (confirmed)
Defined once in `src/styles/global.css` and exposed to Tailwind via `@theme`.
Never hard-code hex values in components.

| Token            | Light     | Dark      |
|------------------|-----------|-----------|
| `--color-bg`     | `#FFFFFF` | `#051D40` |
| `--color-fg`     | `#051D40` | `#FFFFFF` |
| `--color-accent` | `#1976D2` | `#1976D2` |

Only background and foreground invert. The accent never changes. Borders,
hairlines and muted text are derived from these tokens with `color-mix()`, never
from new hex values.

### Contrast rules (measured, WCAG 2.x)
- Accent on white: 4.6:1. Passes AA for body text, with little margin.
- Accent on navy `#051D40`: 3.63:1. **Fails AA for body-size text.** In dark mode
  the accent may only be used for large text (24px+, or 18.66px+ bold), UI
  components, icons, borders and the node motif (3:1 threshold), or as a button
  background with white text (4.6:1).
- Body-size links in dark mode are white with an accent underline or accent
  node marker, not accent-coloured text.
- Navy on white / white on navy: 16.7:1.

### Dark mode
- `.dark` class on `<html>`. Default follows `prefers-color-scheme`; a manual
  toggle overrides it and is stored in `localStorage`.
- A small inline script in `<head>` applies the class before first paint so there
  is no flash of the wrong theme.
- Tailwind v4: `@custom-variant dark (&:where(.dark, .dark *));`

## Typography
Display: Fraunces (variable, use the optical-size and weight axes for large
headlines). Body/UI: Inter. Take typographic confidence from
minimal-goods.webflow.io: very large, high-contrast headlines, generous
whitespace, a strict grid. Fluid type scale with `clamp()`.

## Logo
All logo variants are supplied as SVG files in `public/logo/` (full colour,
full colour for dark backgrounds, mono black, mono white). Before using them,
inspect each file and report on:

- **Real vectors or wrapped bitmaps.** Exports from some design tools embed a
  PNG inside an `<svg>` wrapper (look for `<image>` or `data:image/png`). If so,
  stop and say so: that file cannot be recoloured or animated.
- **Background rectangles.** Remove any full-size background `<rect>` so the
  mark sits on `--color-bg` in both themes. An opaque black or white box on the
  `#051D40` dark background is the failure to avoid.
- **Hard-coded fills and strokes.** In the working copy, the navy upper half
  should use `currentColor` (follows `--color-fg`, so it turns white in dark
  mode) and the blue lower half `var(--color-logo-lower)`: the accent in light
  mode, white in dark mode, so the dark-mode mark is the mono white logo (see
  Decisions log, Phase 1). Group them as `#logo-upper` and `#logo-lower`. One
  themeable SVG then replaces the variants in the UI; the originals stay in
  `public/logo/` untouched.
- **`viewBox` and size.** Keep a correct `viewBox`, strip fixed `width`/`height`.
- **Structure.** Whether nodes and connectors are separate `<circle>`,
  `<line>` and `<path>` elements or one merged path.

Optimise with SVGO, but keep IDs and groups. Save the working copy as
`src/assets/logo/logo-mark.svg`, inline it through `Logo.astro`, and generate
favicons from it. Rename files to kebab-case if needed.

### The node motif as an interaction signature
If the SVGs keep nodes and connectors as separate elements, `NodeNetwork` may
reuse that geometry directly (for example, drawing connectors in with
stroke-dashoffset). If the logo is one merged path, do not try to animate it.
Either way, build a primitive, `NodeNetwork`, that draws the same visual
vocabulary: solid nodes, ring nodes,
straight connectors and arc segments, with stroke-to-node proportions matched to
the logo. Use it for link/button hover states, section dividers and the contact
form's submitting/success state. Motif colour follows the accent rules above.

No full-screen loading screen: it delays first content and adds nothing on a
static site. Use the motif for in-context states instead.

## Design direction
Reference: minimal-goods.webflow.io for typographic confidence, whitespace and
grid discipline. Do not copy its product-grid layout. This is a services site,
not a catalogue.

## Pages

### Home
- Hero headline in the display face, revealed with SplitText (lines or words,
  masked). One reveal on load, no looping.
- Services ticker: Web Dev / Social / Content / App Dev / Tech Solutions, via
  `Marquee`. Continuous leftward loop with no visible jump. Hover (or tap on
  touch) pauses the ticker. Items are plain text: no descriptions, no links
  (Decisions log, Phase 2).
- Client logo strip via `Marquee`, animation starting only when scrolled into
  view. Currently shows STAND-IN logos of well-known brands (client decision,
  Decisions log, Phase 2); none is a client, and all must be replaced with real
  client logos before launch (`src/data/clients.ts`).
- Stats: currently SAMPLE figures under the client's labels (client decision,
  Decisions log, Phase 4); every value must be replaced with a verified
  figure before launch (`statsSample` in `src/data/home.ts`, build warns).
  The count-up animation only runs on numeric values, so "[STAT n]"-style
  placeholders show statically.

### About
Structure reference: narrativearcstudio.com/about-us. No team section, bios or
headshots.
- Oversized wordmark-style treatment of "The Connect Digital".
- Three to four short manifesto paragraphs on approach and philosophy
  (placeholder copy, clearly marked).
- Closing CTA band via `Marquee`: "Let's talk ✲ Let's talk ✲ …", linking to
  Connect. The ✲ is decorative: `aria-hidden`, and the link has a plain
  accessible name ("Let's talk: go to Connect page").

### Services
- `ServiceAccordion` React island, one panel per service line. Accessible
  disclosure pattern (button with `aria-expanded`, `aria-controls`). Tabs on wide
  screens are optional; if used, follow the ARIA tabs pattern with arrow-key
  support. Do not ship both patterns half-built.
- Each panel links to a case study. No calculator or estimator.

### Case studies
- Astro content collection `work`, route `/work/[slug]`.
- Schema includes `placeholder: boolean`. Placeholder entries render with a
  visible banner in dev and production, and Services links to them normally.
- While `placeholder: true`, the page gets `<meta name="robots"
  content="noindex">` and is left out of the sitemap. Visitors still see it;
  search engines just don't index filler. Flipping the flag to `false` with
  real content removes both automatically.

### Connect
- `ContactForm` React island. Fields: name, email, company (optional), service
  of interest (select, the five service lines), message, consent checkbox.
  Honeypot field for spam.
- Real-time inline validation: validate on blur; once a field has shown an
  error, revalidate on input. `aria-invalid`, `aria-describedby`, error text
  in words (never colour alone). Focus moves to the first invalid field on a
  failed submit.
- Submit states: idle, submitting, success, error. Submitting/success use the
  node motif micro-interaction. On error, keep everything the user typed.
- Submission goes through `src/lib/submit-contact.ts` with an adapter interface.
  The default adapter is `mock` (resolves after a short delay, logs the payload)
  until a provider is chosen. Endpoint from `PUBLIC_FORM_ENDPOINT`.
- Booking embed: `BookingEmbed.astro` renders only when `PUBLIC_BOOKING_URL` is
  set. Nothing is shown otherwise.
- Consent checkbox, required, with wording that links to `/privacy`
  (see Privacy Policy below).

### Privacy Policy (`/privacy`)
A complete, full-length Privacy Policy page, not a stub. POPIA (Protection of
Personal Information Act, South Africa) compliance lives here, alongside the
rest of the policy. Linked from the footer on every page and from the contact
form's consent line.

Write it from an inventory of what the site actually does, not from a generic
template. Before drafting, list every point where personal information is
collected, stored or sent to a third party (contact form and its provider,
booking embed if used, hosting provider's server logs, theme preference in
`localStorage`, any analytics, fonts), and confirm the list with me.

Sections to cover:
1. Who we are: the responsible party, registered name, address, and the
   Information Officer's name and contact details.
2. What personal information is collected, and how (directly via the form,
   automatically via server logs).
3. Purpose of processing and lawful basis for each purpose.
4. Consent, and how to withdraw it.
5. Who it is shared with (operators such as the form provider, hosting
   provider, booking tool), and that no personal information is sold.
6. Cross-border transfers: if any provider stores data outside South Africa,
   say so and on what basis (POPIA section 72).
7. Retention: how long each kind of data is kept, and how it is deleted.
8. Security safeguards, in general terms.
9. Data subject rights: access, correction, deletion, objection, and how to
   exercise them.
10. Cookies and local storage: what is used and why (currently only a theme
    preference in `localStorage`, no tracking cookies unless that changes).
11. Direct marketing: that contact details from the form are not used for
    marketing without separate opt-in consent.
12. Children: the site is not directed at children.
13. Complaints: the right to complain to the Information Regulator (South
    Africa). **Look up the Regulator's current contact details on its official
    website at build time; do not write them from memory.**
14. Changes to the policy, and an effective / last-updated date.

Rules:
- Every company-specific fact (legal name, registration number, address,
  Information Officer, providers, retention periods) is a visible placeholder
  from `src/data/site.ts` and listed in `PLACEHOLDERS.md`. Nothing invented.
- Plain English, short sections, a linked table of contents, readable at 360px.
- Keep it in sync with the site: if a feature adds a new data flow (analytics,
  a new embed), the policy must be updated in the same change.
- Show a visible note in the page source and in `PLACEHOLDERS.md` that the
  final text needs review by the client and ideally a legal professional
  before launch. The draft is a starting point, not legal advice.

## Marquee component (single implementation for all three uses)
`src/components/marquee/Marquee.astro` plus `MarqueeItem.astro`.

Props: `speed` (pixels per second, not duration, so pace is independent of
content width), `mobileSpeed` (optional, defaults lower), `direction`
(`'left' | 'right'`), `pauseOnHover`, `startOnView`, `gap`, `label`
(accessible name), and `href` + `linkLabel` for the CTA band.

Implementation:
- Render the item set once as a real list. On mount, measure it and clone the
  set until the track is at least twice the container width, then animate the
  track with a CSS keyframe from `translateX(0)` to `translateX(-50%)`.
  Duration is computed from width ÷ speed and set as a CSS custom property.
  Recalculate on resize (debounced) and after fonts load.
- Every clone is `aria-hidden="true"` and `inert`, so screen readers and
  keyboard users meet each item once.
- An IntersectionObserver pauses every instance while off-screen (saves CPU on
  all three, not only the logo strip). `startOnView` additionally keeps it
  paused until first entry.
- Pause/play via `animation-play-state` driven by a data attribute.
- Hover pause applies only under `@media (hover: hover)`. On touch, tapping the
  marquee pauses it; tapping elsewhere resumes. Focus within the marquee (for
  example the CTA band's link) also pauses it.
- **No pause/play button** (client decision, Decisions log, Phase 2). Known
  gap: WCAG 2.2.2 asks for a way to pause auto-moving content that runs longer
  than five seconds; keyboard-only users cannot pause strips that contain
  nothing focusable (services ticker, logo strip). Hover, tap, focus and
  reduced motion still apply.
- `prefers-reduced-motion: reduce`: no animation and no clones. Render the
  single set as a static wrapped row.
- No per-item descriptions (dropped in Phase 2). `MarqueeItem` is a plain
  list item.

## Interaction rules
- Every GSAP animation and every marquee has a `prefers-reduced-motion`
  fallback that disables it or shows the end state. Use `gsap.matchMedia()`.
- Maximum four interaction types per page. Budget:
  - Home: hero reveal, marquees, node hover, scroll reveal.
  - About: wordmark reveal, scroll reveal, CTA marquee, node hover.
  - Services: accordion, node hover, scroll reveal.
  - Connect: inline validation, submit micro-interaction, node hover.
  Adding anything beyond this means removing something.
- Animate `transform` and `opacity` only.
- Write every client script as `init()` / `destroy()` pairs (kill ScrollTriggers,
  disconnect observers, remove listeners). No Astro `ClientRouter` view
  transitions in v1. If added later, init runs on `astro:page-load` and destroy
  on `astro:before-swap`.
- Mobile-first. Check every interaction at 360px before calling it done.

## Placeholders and content
Still missing: final typeface sign-off, client logos, case studies,
testimonials, contact details, service descriptions, stats, company details
for the Privacy Policy.
- Placeholders stay visible in both dev and production builds. They will be
  replaced by hand later. Do not hide, filter or conditionally render them.
- Never invent client names, numbers, testimonials, quotes or contact details.
  Exceptions the client asked for (Decisions log, Phase 2): stand-in brand
  logos in the client strip, and reserved example contact values in the
  footer. Both print a warning on every build until replaced.
- Use a `Placeholder` component with a visible dashed outline and a label such as
  "PLACEHOLDER: client logo" so nothing can be mistaken for real content.
- Contact details, social links and site URL live in `src/data/site.ts`.
  Contact details are example values, social profile URLs are TBC.
- Maintain `PLACEHOLDERS.md` in the repo root listing every placeholder and
  where it lives, so the content handover is a checklist.

## SEO and basics
- Per-page `<title>` and meta description through a `Seo.astro` component.
- `@astrojs/sitemap` needs `site` set in `astro.config`. Read it from a
  single constant in `src/data/site.ts`, set to a clearly fake placeholder
  domain until the domain is bought, so switching is a one-line change.
- `<html lang="en-ZA">` (assumes a South African agency; change if not).
- Images through `astro:assets`. Custom 404 page using the node motif.

## Conventions
- Component names PascalCase, file names kebab-case except component files,
  which match their component name.
- Tailwind classes over custom CSS, except where GSAP or the marquee keyframe
  needs to target something directly.
- Colours only through the tokens above.

## Definition of done (every feature)
- Works at 360px, 768px and 1280px+.
- Keyboard operable with a visible focus state.
- Correct under `prefers-reduced-motion: reduce`.
- Correct in light and dark mode, contrast rules respected.
- No console errors. `npx astro check` and `npm run build` pass.

## Decisions log
Answers to open questions, recorded so later phases don't reopen them.

Phase 0 (2026-09-23):
- Logo: only two variants were supplied, renamed to
  `public/logo/logo-full-colour.svg` and `public/logo/logo-mono-white.svg`
  (contents untouched). The themeable working copy is built from
  `logo-full-colour.svg`. No wordmark SVG, so the name is set in type next to
  the mark. (Dark-mode colours superseded in Phase 1, below.)
- The logo is four merged, filled compound paths (nodes and connectors are not
  separate elements). It is not animated; `NodeNetwork` draws its own geometry.
- Interaction budget: divider draw-in and stats count-up count as "scroll
  reveal"; the accordion's open/close animation counts as "accordion"; header
  menu and theme toggle are site chrome and don't count. Privacy,
  `/work/[slug]` and 404 get scroll reveal and node hover only (404 also a
  single motif draw).
- Theme toggle has two states (light/dark). With no stored choice, the theme
  follows `prefers-color-scheme`.
- Placeholder domain: `https://theconnectdigital.invalid`.
- Service slugs: `web`, `social`, `content`, `apps`, `tech` (in
  `src/data/site.ts`).
- TypeScript pinned to `^6`: `@astrojs/check` does not support TS 7 yet.
- `/lab` is added only under `astro dev` by a local integration, never built.

Phase 1 (2026-09-23):
- Work with only the two supplied logo variants.
- Dark theme uses the mono white logo: the whole mark is white (both halves
  follow `--color-fg` via `--color-logo-lower`). The mono white original is
  the same artwork at a different scale (verified pixel-identical), so the one
  working copy covers it. `favicon.svg` also turns fully white on dark browser
  chrome. Light theme keeps navy upper / accent lower. This applies to the logo
  only; the accent token and the `NodeNetwork` motif rules are unchanged.
- `playwright-core` (dev only) drives the installed Microsoft Edge for
  screenshots and checks (`scripts/shoot.mjs`). No browser download.

Phase 2 (2026-09-28):
- Services ticker has no descriptions and its items are plain text (not
  buttons, not links). The Marquee has no description feature.
- Marquee extras: optional `href` + `linkLabel` put one link over the strip
  (used by the CTA band; the moving text is then hidden from screen readers).
- Pause/play button removed at the client's request, after being told it
  leaves keyboard-only users unable to pause the services and logo strips
  (WCAG 2.2.2). Hover, tap-to-pause, focus pause and reduced motion remain.
- Footer contact shows an icon plus reserved example values
  (hello@example.com, +27 00 000 0000, "Street, City, South Africa") instead of
  dashed placeholders. Social shows Facebook, Instagram and LinkedIn icons;
  they become links once profile URLs are supplied. Icons: Bootstrap Icons
  (MIT), in `Icon.astro`.
- Client logo strip uses stand-in logos of well-known brands (Spotify,
  Airbnb, Shopify, Stripe, Netflix, Nike; Simple Icons, CC0) at the client's
  request, after being told this reads as a client claim and is a trademark
  risk if it goes live. None is a client. `src/data/clients.ts` has
  `standIn = true`; `scripts/check-stand-ins.mjs` warns on every build.

Phase 3 (2026-09-28):
- Motif proportions measured from the logo, in connector widths (w):
  connectors/arcs 1w; node radii s 0.85w, m 1.7w, l 2.2w, xl 3w; ring band =
  half the outer radius. Single source: `src/lib/node-motif.ts`.
- The logo is not animated. The motif is drawn with transform and opacity
  only: connectors are rotated rects/lines scaled in from their start
  (scaleX), nodes scale from their centre. No stroke-dashoffset.
- Link and button hovers are plain CSS transitions (no GSAP), shown on hover
  (hover-capable devices), keyboard focus, and held for the current page.
  GSAP (via `src/lib/gsap.ts`, gsap.matchMedia) is used for the divider
  draw-in and the submit states. Link hover variant still to be chosen from
  /lab/motif (A underline, B leading node, C arc underline).
- Divider uses m and larger nodes: at 2px per w an s node disappears into
  the line.

Phase 4 (2026-09-28):
- Home hero uses draft copy in the brand's voice, shown unmarked at the
  client's request ("Digital work that connects." + intro), with
  `heroDraft = true` in `src/data/home.ts`; the build warns until replaced.
- Home order: hero (headline, intro, "Start a project" CTA) → services
  ticker (full width) → divider → stats → divider → client strip.
- Reveals pre-hide with opacity only (content stays in the accessibility
  tree) and have a CSS failsafe that shows content after 2.5s if scripts
  never run. The hero split is reverted after the reveal.
- A stat counts up only if it is a number with an optional prefix/suffix of
  up to 3 characters ("120+", "98%", "R2.5m"); "[STAT 1]" placeholders stay
  static. Rule: `NUMERIC_STAT` in `src/data/home.ts`.
- Footer has no top margin; each page supplies its own bottom padding.
- Stats use sample figures at the client's request, after being told each
  becomes a factual claim once live: labels (client's) Projects delivered,
  Startups assisted, Revenue generated for clients, Industries served; sample
  values 120+, 45+, R25m+, 15. `statsSample = true`; the build warns.
- A second node divider sits between the services ticker and the stats.

Phase 5 (2026-09-28):
- About: wordmark heading ("About" label + "The Connect Digital", one h1) →
  manifesto (four draft paragraphs, ordered list, as a native horizontal
  scroll row: all four in the large display style, cards snap to the content
  edge, focusable region named "Our approach"; not a pinned scroll-jacking
  section, which would exceed the interaction budget) → "What we do" list of the
  five services linking to /services#<slug> → divider → "Let's talk ✲" CTA
  band linking to /connect.
- Manifesto is draft copy, unmarked at the client's request (`aboutDraft` in
  `src/data/about.ts`; build warns). Approach and attitude only, no claims.
- Wordmark line breaks are fixed, never browser wrapping: three stacked lines
  below md, one line from md. Sized with container units against measured
  Fraunces widths at opsz 144 ("The Connect Digital" 7.1866em, "Connect"
  3.0611em, 2% margin). Re-measure if the display face changes.
- The hero reveal became the shared `src/lib/headline-reveal.ts`
  ([data-headline], [data-headline-after]); Home and About both use it.
- Astro's HTML compression strips whitespace between tags. Where words sit in
  separate elements, put explicit `{' '}` between them, or the accessible
  name runs together.

## Working agreement
- Use plan mode at the start of each phase and wait for approval.
- Commit at the end of each phase with a clear message.
- End every phase with: what was built, what was assumed, what needs checking
  by a human, and any new placeholders.
