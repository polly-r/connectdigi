# What we need from you before launch

**The Connect Digital website: content and decisions checklist**

The site is built and working. To launch it, we need a few decisions, your
company details, and real content to replace the samples we used while
building. Tick items off as you send them, and reply in whatever form is
easiest: an email, a shared document or a call.

Some things on the site currently **look real but are samples** (marked ⚠
below). They are clearly labelled on the site and must be replaced before
launch, because on a live site they would read as claims about your business.

---

## 1. Decisions

- [ ] **Domain name.** Which address will the site use (e.g. theconnectdigital.co.za)?
- [ ] **Hosting.** We'll recommend a free static host; just confirm you're happy with it.
- [ ] **Contact form service.** The form currently sends messages nowhere.
      Choose a form service (we can recommend one), or tell us if you already use one.
- [ ] **Email provider.** What do you use for business email (e.g. Google Workspace, Microsoft 365)?
- [ ] **Where enquiries go after email.** The name of the CRM, spreadsheet or
      project tool you copy enquiries into.
- [ ] **Booking tool (optional).** If you'd like people to book a call from the
      Contact page, which tool (e.g. Calendly)? Otherwise we leave it out.
- [ ] **Analytics.** The site currently collects no visitor statistics. Do you
      want any? (If yes, the Privacy Policy changes with it.)
- [ ] **Headline typeface.** Please approve the headline font (Fraunces), or ask for alternatives.

## 2. Company details (for the Privacy Policy and Terms)

South African law (POPIA and the ECTA) requires these on the site.

- [ ] Registered company name
- [ ] Legal form (e.g. private company (Pty) Ltd, or sole proprietor)
- [ ] Company registration number
- [ ] Registered or physical address (also used for legal notices)
- [ ] **Information Officer**: name, email and phone. Under POPIA this person
      handles privacy requests and must also be registered with the Information Regulator.
- [ ] Where your PAIA manual is available (a link, or "on request")

## 3. Contact details and social media

- [ ] ⚠ **Email address** for the site (currently a sample: hello@example.com)
- [ ] ⚠ **Phone number** (currently a sample: +27 00 000 0000)
- [ ] ⚠ **Business address** as it should appear on the site (currently a sample)
- [ ] Links to your **Facebook**, **Instagram** and **LinkedIn** profiles

## 4. Copy to approve or rewrite

We wrote draft text in your voice so the pages could be designed. Please
approve it or send your own wording.

- [ ] **Home headline and intro**: "Digital work that connects." / "Web, social,
      content and apps for startups, local businesses and luxury brands."
- [ ] **About**: the four "Our approach" paragraphs
- [ ] **Services**: the description and "What's included" list for each of the five services
- [ ] **Short labels and lines**: e.g. "Start a project", "What we do",
      "In numbers", "Let's talk", "Not sure which you need? Tell us the problem.",
      "Tell us what you're working on. We'll reply by email."
- [ ] **Search descriptions**: the one-line summary of each page shown in Google results
- [ ] **Contact form consent line**: "I agree that The Connect Digital may use
      these details to reply to my enquiry, as described in the Privacy Policy."

## 5. Proof of your work

These make the biggest difference to how the site sells you, and they are the
parts that must be genuine.

- [ ] ⚠ **Client logos.** The logo strip currently shows *stand-in logos of
      well-known brands that are not your clients* (Spotify, Airbnb, Shopify,
      Stripe, Netflix, Nike). Send logos of real clients (SVG or high-resolution
      PNG) who have agreed to be shown, in full colour: they appear grey and
      turn to their brand colour when hovered.
- [ ] ⚠ **Numbers.** The Home page shows *sample figures* under your four labels.
      Send your real figures, and what each is based on:
  - Projects delivered (sample shown: 120+)
  - Startups assisted (sample shown: 45+)
  - Revenue generated for clients (sample shown: R25m+)
  - Industries served (sample shown: 15)
- [ ] ⚠ **Case studies.** The five project pages are *sample projects with
      fictional clients* (Harbour & Hide, Tafel Bakehouse, Ledgerline, Stride
      Physio, Northgate Logistics). We need one real project per service (web,
      social, content, apps, tech). Use the questionnaire below for each.
- [ ] ⚠ **Testimonials.** The quotes on Home and the project pages are
      *samples*. Send real quotes, each with the client's **written permission**
      to publish it, and say whether we may show their name, role and company.

## 6. Images and brand

- [ ] Images for each real case study: screenshots, photos or mock-ups of the work (at least two per project)
- [ ] A **social sharing image** (1200 × 630 px), shown when the site is shared on social media or WhatsApp
- [ ] Optional: a **simplified logo mark for browser tabs**. The full logo is detailed and hard to read at 16 px.

## 7. Legal review

- [ ] Have the **Privacy Policy** and **Terms of Service** reviewed, ideally by
      a legal professional. They are drafts written for your business, not legal advice.
- [ ] Decide **how long you keep** enquiries, WhatsApp chats, client records and
      website logs. Check tax-record periods with your accountant.

---

## Case study questionnaire (one per project)

1. **Client**: name and sector, and whether we may name them (or describe them, e.g. "a Cape Town retailer").
2. **The brief**: what problem the client came to you with, in two or three sentences.
3. **What you did**: the approach and the main pieces of work.
4. **Deliverables**: a short list (e.g. "UX design, online store build, CMS setup").
5. **Timeline**: roughly how long it took.
6. **Results**: up to three outcomes with figures, **and where each figure comes
   from** (e.g. "Shopify reports, Q1 2026"). Only figures you can stand behind.
7. **Optional chart**: a simple before/after series (e.g. monthly orders for nine months) from the same source.
8. **Testimonial**: a quote from the client, with written permission, plus how to credit it.
9. **Images**: at least two.
10. **Permission**: confirmation that the client has agreed to the case study being published.

---

## Appendix for the developer: where each item goes

`npm run build` prints a **NOT READY FOR LAUNCH** list while any of this is
outstanding. How to replace each kind of item is in the README.

| Item | File / setting | Then |
|---|---|---|
| Domain | `SITE_URL` in `src/data/site.ts` | sitemap, canonicals and Terms follow |
| Form service | `PUBLIC_FORM_ADAPTER=http`, `PUBLIC_FORM_ENDPOINT` (`.env.example`) | test a real submission; update the Privacy Policy |
| Providers and their data locations | `site.providers.*`, `site.providerLocations.*` | Privacy Policy sections 5 and 6 |
| Booking tool | `PUBLIC_BOOKING_URL`, `site.providers.booking` | Privacy Policy sections 2, 5, 6, 7 and 10 |
| Analytics | `site.providers.analytics` | rewrite Privacy Policy sections 2 and 10 |
| Typeface | `src/styles/global.css`, `BaseLayout.astro` | re-measure the wordmark and fallback font (README) |
| Company facts, Information Officer, PAIA manual | `site.legal.*` in `src/data/site.ts` | |
| Retention periods | `site.retention.*` | |
| Effective dates | `site.policies.*` | set when the legal text is approved |
| Contact details | `site.contact.*` | |
| Social profile URLs | `site.social[].href` | icons become links |
| Home headline/intro | `src/data/home.ts` | `heroDraft = false` |
| Stats | `stats` in `src/data/home.ts` | `statsSample = false` |
| About manifesto | `src/data/about.ts` | `aboutDraft = false` |
| Services copy | `src/data/services.ts` | `servicesDraft = false` |
| UI labels | `src/components/home/*`, `src/pages/about.astro`, `services.astro`, `connect.astro`, `src/components/connect/ContactForm.tsx` | |
| Meta descriptions | `description` prop in each file under `src/pages/` | |
| Client logos | `src/data/clients.ts` | `standIn = false` |
| Case studies, testimonials, charts | `src/content/work/*.md`, images in `src/assets/work/` | `placeholder: false` per file; delete unused sample art |
| Social share image | `src/components/Seo.astro` (`og:image`) | |
| Tab icon | `npm run logo`, or supplied artwork into `public/` | |
| Information Regulator details | `src/data/regulator.ts` | re-check on inforegulator.org.za before launch |
