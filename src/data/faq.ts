/**
 * FAQ page copy (/faq), in groups.
 *
 * DRAFT COPY: questions and answers are written in the brand's voice for the
 * client to approve (like the Services copy, CLAUDE.md Decisions log). They
 * describe how the agency works, using only what the site already states.
 * Company terms supplied by the client (2026-09-30): 24-hour reply, free
 * first consultation, clients worldwide, pricing by quotation after scoping,
 * then (2026-10-01) fixed website packages, the Care Plan and 30 days' free
 * support (amounts from src/data/pricing.ts, never typed here),
 * 50% upfront / 50% on completion. The other terms (call length, timelines,
 * EFT, ad platforms, 30-day support, ownership) were filled in as realistic
 * suggestions at the client's request and await confirmation. A missing fact
 * can be a `{ tbc }` part, rendered as a visible placeholder. The build warns
 * while `faqDraft` is true. Listed in PLACEHOLDERS.md.
 *
 * Answers are blocks: a paragraph (an array of inline parts) or a bullet
 * list. Inline parts are text, a `{ tbc }` placeholder, or an internal
 * `{ link, text }` (a site path; the page passes it through url()).
 */

import { carePlan, deliveryRange, extras, formatRand, fromPrice, supportDays, vatNote } from './pricing';

/** Flip to false once the client has approved the FAQ. */
export const faqDraft = true;

const websiteDays = `${deliveryRange.min} to ${deliveryRange.max} business days`;
/** "Send us changes, we do them within 2 business days." → "send us changes, … days" */
const careSummary = carePlan.headline.charAt(0).toLowerCase() + carePlan.headline.slice(1, -1);

export type Inline = string | { tbc: string } | { link: string; text: string };
export type Block = Inline[] | { list: Inline[][] };

export interface Faq {
  /** Anchor: /faq#<id>. Keep stable once live, other pages may link to it. */
  id: string;
  question: string;
  answer: Block[];
}

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'what-we-do',
        question: 'What does The Connect Digital do?',
        answer: [
          ['We are a digital marketing agency. We help businesses get found, get understood and get chosen online, through five services:'],
          {
            list: [
              [{ link: '/services#web', text: 'Web development' }, ': marketing websites and online stores'],
              [{ link: '/services#social', text: 'Social media marketing' }, ': strategy, content, community and paid social'],
              [{ link: '/services#content', text: 'Content creation' }, ': copy, photography and video'],
              [{ link: '/services#apps', text: 'App development' }, ': mobile and web apps'],
              [{ link: '/services#tech', text: 'Tech solutions' }, ': tools, automation and integrations'],
            ],
          },
          ['Most clients combine a few. We can do one or all of them.'],
        ],
      },
      {
        id: 'who-we-work-with',
        question: 'Who do you work with?',
        answer: [
          [
            'Tech startups, local businesses and luxury brands. Different stages and budgets, the same need: a digital presence that looks the part and brings in the right customers.',
          ],
        ],
      },
      {
        id: 'start-a-project',
        question: 'How do I start a project?',
        answer: [
          [
            'Tell us what you’re working on through our ',
            { link: '/connect', text: 'contact form' },
            '. A rough idea is enough. We reply by email within 24 hours to set up a first conversation.',
          ],
        ],
      },
      {
        id: 'first-call',
        question: 'Is the first conversation free?',
        answer: [
          [
            'Yes. Your first consultation is free, with no obligation. It usually takes about 30 minutes, by video call or phone. We listen to what you need, ask questions and tell you honestly whether we’re the right fit.',
          ],
        ],
      },
      {
        id: 'what-to-prepare',
        question: 'What should I have ready before we talk?',
        answer: [
          ['Nothing formal. If you have them, these help us give you useful advice sooner:'],
          {
            list: [
              ['What you want to achieve, and how you’ll know it worked'],
              ['Who your customers are'],
              ['Websites, brands or accounts you admire'],
              ['A budget range and any deadlines'],
            ],
          },
          ['If you don’t know yet, that’s fine. Working it out is part of the job.'],
        ],
      },
      {
        id: 'location',
        question: 'Do you work with clients outside your city?',
        answer: [
          [
            'Yes. We work with clients worldwide. Meetings happen by video call, work is shared online, and we agree meeting times that suit your time zone.',
          ],
        ],
      },
    ],
  },
  {
    id: 'pricing-and-process',
    title: 'Pricing and process',
    items: [
      {
        id: 'pricing',
        question: 'How much does a project cost?',
        answer: [
          [
            `Websites come in fixed-price packages, from ${formatRand(fromPrice)}, listed with everything they include on our `,
            { link: '/pricing', text: 'Pricing page' },
            `. ${vatNote}`,
          ],
          [
            'Everything else, such as social media, content, apps and larger custom builds, is priced individually. Once we’ve discussed the scope of work, we send you a written quotation with exactly what’s included and what it costs. Nothing starts until you’ve approved it, so there are no surprises.',
          ],
        ],
      },
      {
        id: 'timeline',
        question: 'How long does a project take?',
        answer: [
          ['That depends on the scope, and on how quickly we receive content and feedback. As a guide:'],
          {
            list: [
              [`Website packages: ${websiteDays}, depending on the package, once we have your deposit and your content`],
              ['Online store: 6 to 10 weeks'],
              ['Social media set-up and first month of content: 2 to 3 weeks'],
              ['Automation or integration project: 1 to 4 weeks'],
              ['Mobile or web app: 3 to 6 months'],
            ],
          },
          ['Larger projects get an agreed timeline in the quotation, and we keep you updated against it.'],
        ],
      },
      {
        id: 'payment',
        question: 'How do payments work?',
        answer: [
          [
            'For projects, we invoice 50% before work starts and the balance on completion, before launch. Ongoing monthly services, such as social media management or the Care Plan, are invoiced monthly.',
          ],
          [
            'We accept EFT (bank transfer). For international clients, we agree the currency and payment method in the quotation.',
          ],
        ],
      },
      {
        id: 'process',
        question: 'What does working with you look like?',
        answer: [
          ['Every project follows the same simple shape:'],
          {
            list: [
              ['Listen: we learn about your business, your customers and your goals.'],
              ['Plan: we agree the scope, the timeline and what success looks like.'],
              ['Make: we design and build, sharing work early so you can steer it.'],
              ['Launch: we go live and hand over everything you need.'],
              ['Improve: we look at what’s working and recommend what to do next.'],
            ],
          },
        ],
      },
      {
        id: 'involvement',
        question: 'How involved do I need to be?',
        answer: [
          [
            'As involved as you want to be. We need you at the key moments: the first conversation, approving the plan and giving feedback on the work. We do the rest, and we’ll always tell you when we need something from you.',
          ],
        ],
      },
      {
        id: 'single-service',
        question: 'Can I hire you for just one thing?',
        answer: [
          [
            'Yes. You can start with one service, like a new website or a month of social content, and add more later. Where services work better together, we’ll say so, but we’ll never push a package you don’t need.',
          ],
        ],
      },
      {
        id: 'examples',
        question: 'Can I see examples of your work?',
        answer: [
          [
            'Yes. Each service on our ',
            { link: '/services', text: 'Services page' },
            ' links to a project write-up with the brief, what we did and the results.',
          ],
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Websites, social and content',
    items: [
      {
        id: 'seo',
        question: 'Will my website show up on Google?',
        answer: [
          [
            'Every site we build has strong search foundations: fast loading, clean structure, readable on every screen, and the titles, descriptions and technical set-up search engines look for.',
          ],
          [
            'Rankings also depend on your content, competition and time, and no one can honestly guarantee a first-place ranking. We’ll tell you what’s realistic for your market and how to improve over time.',
          ],
        ],
      },
      {
        id: 'mobile',
        question: 'Will my website work on phones?',
        answer: [
          [
            'Yes. We design for phones first and test on every screen size, because that’s where most of your visitors will find you.',
          ],
        ],
      },
      {
        id: 'update-myself',
        question: 'Can I update my website myself?',
        answer: [
          [
            'Yes. We set up a content management system (CMS) where it makes sense, and show your team how to change text, images and products without calling us.',
          ],
        ],
      },
      {
        id: 'existing-brand',
        question: 'Can you work with my existing website, brand or social accounts?',
        answer: [
          [
            'Yes. We can improve what you have rather than start again, whether that’s a refresh of your website, your brand guidelines applied more consistently or new life for your social channels. We’ll recommend a rebuild only when it’s the better use of your money.',
          ],
        ],
      },
      {
        id: 'paid-ads',
        question: 'Do you run paid advertising?',
        answer: [
          [
            'Yes, paid social campaigns are part of our ',
            { link: '/services#social', text: 'social media marketing' },
            ' service.',
          ],
          [
            'We run campaigns on Facebook, Instagram, TikTok and LinkedIn. Your ad budget is separate from our management fee: it’s paid directly to the platform from your own ad account, so you always see exactly what’s spent.',
          ],
        ],
      },
      {
        id: 'results',
        question: 'How do you measure results?',
        answer: [
          [
            'We agree what success looks like before we start, such as enquiries, sales, bookings or reach, and report against it. Social media clients get a monthly report with plain-English recommendations, not just numbers.',
          ],
        ],
      },
    ],
  },
  {
    id: 'after-launch',
    title: 'After launch',
    items: [
      {
        id: 'support',
        question: 'Do you offer support after launch?',
        answer: [
          [
            'Yes. We don’t disappear after launch. We can look after updates, fixes and improvements, and help you get more from what we built.',
          ],
          [
            `Every website and app includes ${supportDays} days of free support after launch, to fix anything that isn’t working as it should. After that, you can add the `,
            { link: '/pricing#care-plan', text: carePlan.name },
            ` (${careSummary}), or pay for updates as you need them at ${formatRand(extras.hourlyRate)} per hour, quoted in advance.`,
          ],
        ],
      },
      {
        id: 'ownership',
        question: 'Who owns the work?',
        answer: [
          [
            'You do. Once the final invoice is paid, the website, designs and content we create for you are yours. Third-party items, such as fonts, stock images and plugins, stay under their own licences, which we set up in your name wherever possible.',
          ],
          [
            'Your domain name and your social media and advertising accounts should always be in your name. If they aren’t yet, we’ll help you set that up.',
          ],
        ],
      },
      {
        id: 'confidentiality',
        question: 'Will you keep my ideas confidential?',
        answer: [
          [
            'Yes. We treat everything you share with us as confidential, and we’re happy to sign a non-disclosure agreement (NDA) before you share the details.',
          ],
        ],
      },
      {
        id: 'your-information',
        question: 'What happens to the information I send you?',
        answer: [
          [
            'We use it to reply to you and discuss your project. We never sell it, and we won’t add you to marketing emails unless you separately agree. Our ',
            { link: '/privacy', text: 'Privacy Policy' },
            ' explains exactly what we keep, for how long, and your rights.',
          ],
        ],
      },
    ],
  },
];
