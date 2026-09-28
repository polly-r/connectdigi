// Generates the illustrative mockups for the SAMPLE case studies
// (src/content/work/, placeholder: true). Each image shows the kind of work
// delivered (a site, a social feed, an app) for a fictional client. They are
// illustrations, not evidence: no analytics, documents or testimonials.
// Replace them with real project imagery when real case studies arrive.
//
//   node scripts/build-sample-art.mjs   → src/assets/work/<slug>-{cover,detail}.svg
//
// Fictional client palettes live here, not in the site's colour tokens:
// they belong to the illustrations, not to the site UI.

import { mkdirSync, writeFileSync } from 'node:fs';

const W = 1600;
const H = 1000;
const SANS = "Inter, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
let uid = 0;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rect = (x, y, w, h, fill, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, s, { size = 16, fill = '#000', weight = 400, family = SANS, anchor = 'start', ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(s)}</text>`;
/** Skeleton text: n rounded bars, the last one shorter. */
const lines = (x, y, w, n, fill, { h = 10, gap = 20, last = 0.6 } = {}) =>
  Array.from({ length: n }, (_, i) => rect(x, y + i * gap, i === n - 1 ? w * last : w, h, fill, h / 2)).join('');

function defs() {
  return `<defs><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.14"/></filter></defs>`;
}

function browser(x, y, w, h, url, inner, { bar = '#F3F3F3' } = {}) {
  const id = `clip${uid++}`;
  return `<g transform="translate(${x} ${y})" filter="url(#shadow)">
    ${rect(0, 0, w, h, '#FFFFFF', 16)}
    <clipPath id="${id}"><rect x="0" y="44" width="${w}" height="${h - 44}" rx="0"/></clipPath>
    <path d="M16 0H${w - 16}Q${w} 0 ${w} 16V44H0V16Q0 0 16 0Z" fill="${bar}"/>
    ${circle(24, 22, 6, '#E0E0E0')}${circle(44, 22, 6, '#E0E0E0')}${circle(64, 22, 6, '#E0E0E0')}
    ${rect(w / 2 - 170, 11, 340, 22, '#FFFFFF', 11)}${text(w / 2, 27, url, { size: 12, fill: '#8A8A8A', anchor: 'middle' })}
    <g clip-path="url(#${id})"><g transform="translate(0 44)">${inner}</g></g>
  </g>`;
}

function phone(x, y, w, h, inner, { bezel = '#15171A', screen = '#FFFFFF' } = {}) {
  const id = `clip${uid++}`;
  const b = 12;
  return `<g transform="translate(${x} ${y})" filter="url(#shadow)">
    ${rect(0, 0, w, h, bezel, 46)}
    ${rect(b, b, w - 2 * b, h - 2 * b, screen, 36)}
    <clipPath id="${id}"><rect x="${b}" y="${b}" width="${w - 2 * b}" height="${h - 2 * b}" rx="36"/></clipPath>
    <g clip-path="url(#${id})"><g transform="translate(${b} ${b})">${inner}</g></g>
    ${rect(w / 2 - 48, b + 10, 96, 26, bezel, 13)}
  </g>`;
}

const svg = (bg, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}${rect(0, 0, W, H, bg)}${body}</svg>\n`;

// ---------------------------------------------------------------------------
// Harbour & Hide (web): luxury leather goods, online store
// ---------------------------------------------------------------------------
const hh = { bg: '#EFE7DD', ink: '#2B211B', tan: '#A0672F', light: '#E4D5C1', soft: '#F7F2EB', grey: '#D8CEC2' };

function bag(cx, cy, s, c = hh.tan) {
  const w = 220 * s;
  const h = 170 * s;
  return `<path d="M${cx - w * 0.36} ${cy - h * 0.35} Q${cx - w * 0.36} ${cy - h * 0.95} ${cx} ${cy - h * 0.95} Q${cx + w * 0.36} ${cy - h * 0.95} ${cx + w * 0.36} ${cy - h * 0.35}" fill="none" stroke="${hh.ink}" stroke-width="${10 * s}" stroke-linecap="round"/>
    <path d="M${cx - w / 2 + 14 * s} ${cy - h * 0.4} H${cx + w / 2 - 14 * s} L${cx + w / 2} ${cy + h * 0.55} Q${cx + w / 2} ${cy + h * 0.62} ${cx + w / 2 - 12 * s} ${cy + h * 0.62} H${cx - w / 2 + 12 * s} Q${cx - w / 2} ${cy + h * 0.62} ${cx - w / 2} ${cy + h * 0.55} Z" fill="${c}"/>
    ${rect(cx - 22 * s, cy - h * 0.2, 44 * s, 26 * s, hh.ink, 5 * s)}
    <path d="M${cx - w / 2 + 8 * s} ${cy + h * 0.1} H${cx + w / 2 - 8 * s}" stroke="${hh.ink}" stroke-opacity="0.25" stroke-width="${3 * s}"/>`;
}

function hhNav(w) {
  return `${text(48, 44, 'HARBOUR & HIDE', { size: 18, fill: hh.ink, weight: 600, ls: 4 })}
    ${['Bags', 'Wallets', 'Journal'].map((t, i) => text(w - 360 + i * 90, 44, t, { size: 15, fill: hh.ink })).join('')}
    ${circle(w - 60, 39, 14, 'none', `stroke="${hh.ink}" stroke-width="2"`)}`;
}

const hhCover = svg(
  hh.bg,
  browser(
    110,
    100,
    1160,
    790,
    'harbourandhide.example',
    `${rect(0, 0, 1160, 746, hh.soft)}${hhNav(1160)}
     ${text(48, 190, 'Made to be', { size: 66, fill: hh.ink, family: SERIF })}
     ${text(48, 262, 'carried.', { size: 66, fill: hh.ink, family: SERIF })}
     ${lines(48, 300, 380, 3, hh.grey)}
     ${rect(48, 380, 210, 56, hh.ink, 28)}${text(153, 414, 'Shop the collection', { size: 16, fill: '#FFF', anchor: 'middle' })}
     ${rect(560, 84, 552, 380, hh.light, 12)}${bag(836, 300, 1.25)}
     ${[0, 1, 2]
       .map((i) => {
         const x = 48 + i * 364;
         return `${rect(x, 500, 336, 160, hh.light, 10)}${i === 1 ? bag(x + 168, 590, 0.55, '#6E4B2E') : rect(x + 118, 560, 100, 64, i ? hh.tan : hh.ink, 8)}
           ${lines(x, 680, 200, 1, hh.ink, { h: 11 })}${lines(x, 702, 90, 1, hh.grey, { h: 9 })}`;
       })
       .join('')}`,
  ) +
    phone(
      1220,
      360,
      290,
      580,
      `${rect(0, 0, 266, 556, hh.soft)}${text(22, 76, 'HARBOUR & HIDE', { size: 11, fill: hh.ink, weight: 600, ls: 2 })}
       ${rect(22, 100, 222, 210, hh.light, 10)}${bag(133, 215, 0.7)}
       ${text(22, 356, 'Made to be', { size: 30, fill: hh.ink, family: SERIF })}${text(22, 390, 'carried.', { size: 30, fill: hh.ink, family: SERIF })}
       ${lines(22, 412, 200, 2, hh.grey, { h: 8, gap: 16 })}${rect(22, 460, 160, 42, hh.ink, 21)}`,
    ),
);

const hhDetail = svg(
  hh.bg,
  browser(
    120,
    80,
    1360,
    840,
    'harbourandhide.example/bags/the-weekender',
    `${rect(0, 0, 1360, 796, '#FFFFFF')}${hhNav(1360)}
     ${rect(48, 80, 640, 660, hh.light, 12)}${bag(368, 440, 2.1)}
     ${[0, 1, 2, 3].map((i) => rect(48 + i * 90, 752, 78, 0, hh.grey)).join('')}
     ${text(760, 120, 'Bags  /  The Weekender', { size: 14, fill: '#8C7F72' })}
     ${text(760, 190, 'The Weekender', { size: 54, fill: hh.ink, family: SERIF })}
     ${text(760, 236, 'R 6 450', { size: 22, fill: hh.ink })}
     ${lines(760, 272, 500, 4, hh.grey, { h: 10, gap: 22 })}
     ${text(760, 390, 'Colour', { size: 14, fill: '#8C7F72' })}
     ${circle(778, 422, 16, hh.tan, `stroke="${hh.ink}" stroke-width="3"`)}${circle(822, 422, 16, '#6E4B2E')}${circle(866, 422, 16, hh.ink)}
     ${rect(760, 470, 540, 62, hh.ink, 31)}${text(1030, 508, 'Add to bag', { size: 17, fill: '#FFF', anchor: 'middle' })}
     ${['Details', 'Care', 'Delivery and returns']
       .map((t, i) => `${rect(760, 570 + i * 60, 540, 1, hh.grey)}${text(760, 606 + i * 60, t, { size: 16, fill: hh.ink })}${text(1296, 606 + i * 60, '+', { size: 20, fill: hh.ink, anchor: 'end' })}`)
       .join('')}`,
  ),
);

// ---------------------------------------------------------------------------
// Tafel Bakehouse (social): neighbourhood bakery group
// ---------------------------------------------------------------------------
const tf = { bg: '#F6E3C9', ink: '#3A2A1E', crust: '#C8792F', dough: '#EBC48F', green: '#7A9A62', cream: '#FFF8EE', rust: '#9C4A24' };

function loaf(cx, cy, s, c = tf.crust) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${46 * s}" ry="${30 * s}" fill="${c}"/>
    ${[-1, 0, 1].map((k) => `<path d="M${cx + k * 20 * s - 10 * s} ${cy - 14 * s} Q${cx + k * 20 * s} ${cy} ${cx + k * 20 * s + 10 * s} ${cy + 14 * s}" stroke="${tf.dough}" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>`).join('')}`;
}
function croissant(cx, cy, s) {
  return `<path d="M${cx - 50 * s} ${cy + 10 * s} Q${cx} ${cy - 50 * s} ${cx + 50 * s} ${cy + 10 * s} Q${cx + 30 * s} ${cy + 20 * s} ${cx + 20 * s} ${cy + 4 * s} Q${cx} ${cy - 20 * s} ${cx - 20 * s} ${cy + 4 * s} Q${cx - 30 * s} ${cy + 20 * s} ${cx - 50 * s} ${cy + 10 * s}Z" fill="${tf.crust}"/>`;
}
function tile(x, y, size, i) {
  const bgs = [tf.dough, tf.cream, tf.green, tf.rust, tf.dough, tf.cream, tf.cream, tf.green, tf.dough];
  const c = x + size / 2;
  const m = y + size / 2;
  const art = [loaf(c, m, size / 130), croissant(c, m + 8, size / 140), loaf(c, m, size / 150, tf.cream), text(c, m + 12, 'Sat', { size: size / 4, fill: tf.cream, anchor: 'middle', family: SERIF }), croissant(c, m + 8, size / 160), loaf(c, m, size / 130, tf.rust), `${circle(c, m, size / 3.2, tf.dough)}${circle(c, m, size / 7, tf.rust)}`, loaf(c, m, size / 140, tf.dough), croissant(c, m + 6, size / 150)];
  return rect(x, y, size, size, bgs[i % bgs.length]) + art[i % art.length];
}

const tfCover = svg(
  tf.bg,
  phone(
    240,
    80,
    430,
    840,
    `${rect(0, 0, 406, 816, '#FFFFFF')}
     ${circle(62, 112, 40, tf.crust)}${text(62, 125, 'T', { size: 36, fill: tf.cream, family: SERIF, anchor: 'middle' })}
     ${text(122, 104, 'tafelbakehouse', { size: 17, fill: tf.ink, weight: 600 })}${lines(122, 118, 200, 2, '#E3D6C6', { h: 8, gap: 16 })}
     ${lines(22, 176, 360, 2, '#E3D6C6', { h: 8, gap: 16 })}
     ${rect(22, 220, 176, 36, tf.ink, 8)}${text(110, 243, 'Follow', { size: 14, fill: '#FFF', anchor: 'middle' })}${rect(208, 220, 176, 36, '#F1E7DA', 8)}${text(296, 243, 'Order online', { size: 14, fill: tf.ink, anchor: 'middle' })}
     ${Array.from({ length: 9 }, (_, i) => tile((i % 3) * 136, 280 + Math.floor(i / 3) * 136, 134, i)).join('')}`,
  ) +
    [
      [760, 150, 3],
      [1130, 320, 5],
    ]
      .map(
        ([x, y, i]) => `<g filter="url(#shadow)">${rect(x, y, 340, 470, '#FFFFFF', 18)}</g>
      ${circle(x + 34, y + 34, 16, tf.crust)}${lines(x + 60, y + 28, 120, 1, '#D9CBB9', { h: 10 })}
      <g>${tile(x, y + 68, 340, i)}</g>
      <path d="M${x + 30} ${y + 432} q10 -12 20 0 q10 -12 20 0 q0 12 -20 24 q-20 -12 -20 -24Z" fill="${tf.rust}"/>${circle(x + 96, y + 436, 11, 'none', `stroke="${tf.ink}" stroke-width="3"`)}
      ${lines(x + 140, y + 428, 170, 1, '#D9CBB9', { h: 10 })}`,
      )
      .join(''),
);

const stories = [
  { bg: tf.crust, title: ['Fresh', 'at 7am'], art: (c, m) => loaf(c, m, 2.2, tf.cream) },
  { bg: tf.ink, title: ['Sourdough', 'Saturdays'], art: (c, m) => loaf(c, m, 2.2, tf.crust) },
  { bg: tf.green, title: ['New:', 'rye & honey'], art: (c, m) => loaf(c, m, 2.2, tf.rust) },
];
const tfDetail = svg(
  tf.bg,
  stories
    .map((s, i) =>
      phone(
        190 + i * 430,
        80,
        360,
        840,
        `${rect(0, 0, 336, 816, s.bg)}
         ${[0, 1, 2].map((k) => rect(18 + k * 102, 58, 96, 4, k <= i ? tf.cream : 'rgba(255,248,238,0.35)', 2)).join('')}
         ${circle(34, 96, 14, tf.cream)}${text(58, 101, 'tafelbakehouse', { size: 13, fill: tf.cream, weight: 600 })}
         ${text(30, 250, s.title[0], { size: 50, fill: tf.cream, family: SERIF })}${text(30, 308, s.title[1], { size: 50, fill: tf.cream, family: SERIF })}
         ${s.art(168, 520)}
         ${rect(30, 700, 276, 54, tf.cream, 27)}${text(168, 734, 'Order for collection', { size: 15, fill: tf.ink, anchor: 'middle' })}`,
      ),
    )
    .join(''),
);

// ---------------------------------------------------------------------------
// Ledgerline (content): fintech startup, invoicing for small businesses
// ---------------------------------------------------------------------------
const ll = { bg: '#E6ECF5', ink: '#0F1B33', blue: '#3B6FF5', mint: '#1FB58F', pale: '#EEF2FA', grey: '#D5DCE8' };

const llCover = svg(
  ll.bg,
  browser(
    110,
    90,
    1090,
    820,
    'ledgerline.example/journal',
    `${rect(0, 0, 1090, 776, '#FFFFFF')}
     ${circle(62, 40, 12, ll.blue)}${text(84, 46, 'Ledgerline', { size: 18, fill: ll.ink, weight: 700 })}
     ${['Product', 'Pricing', 'Journal'].map((t, i) => text(760 + i * 100, 46, t, { size: 15, fill: ll.ink })).join('')}
     ${text(48, 128, 'JOURNAL  ·  CASH FLOW', { size: 13, fill: ll.blue, weight: 600, ls: 2 })}
     ${text(48, 190, 'What your cash flow', { size: 52, fill: ll.ink, family: SERIF })}
     ${text(48, 250, 'is telling you', { size: 52, fill: ll.ink, family: SERIF })}
     ${circle(62, 296, 14, ll.grey)}${lines(86, 290, 180, 1, ll.grey)}
     ${rect(48, 330, 994, 250, ll.pale, 12)}
     <path d="M48 520 C220 440 330 500 470 430 S760 380 900 410 S1042 360 1042 360 V580 H48Z" fill="${ll.blue}" fill-opacity="0.18"/>
     <path d="M48 550 C200 500 360 540 520 480 S820 470 1042 430 V580 H48Z" fill="${ll.mint}" fill-opacity="0.25"/>
     ${circle(470, 430, 9, ll.blue)}${circle(900, 410, 9, ll.blue)}
     ${lines(48, 616, 640, 5, ll.grey, { h: 10, gap: 24 })}`,
  ) +
    `<g filter="url(#shadow)">${rect(1060, 480, 440, 320, ll.ink, 18)}</g>
     ${rect(1080, 500, 400, 225, '#1C2B4D', 10)}
     <path d="M1080 700 C1180 640 1260 690 1340 620 S1480 600 1480 600 V725 H1080Z" fill="${ll.blue}" fill-opacity="0.35"/>
     ${circle(1280, 612, 38, '#FFFFFF')}<path d="M1270 594 L1298 612 L1270 630Z" fill="${ll.ink}"/>
     ${text(1080, 760, 'Invoicing in 90 seconds', { size: 18, fill: '#FFFFFF', weight: 600 })}
     ${rect(1080, 776, 400, 4, '#33456B', 2)}${rect(1080, 776, 150, 4, ll.mint, 2)}`,
);

const llDetail = svg(
  ll.bg,
  `<g filter="url(#shadow)">${rect(200, 110, 580, 790, ll.ink, 6)}</g>
   <path d="M200 700 C360 620 460 720 620 640 S780 600 780 600 V900 H200Z" fill="${ll.blue}"/>
   <path d="M200 780 C340 740 500 800 780 720 V900 H200Z" fill="${ll.mint}" fill-opacity="0.8"/>
   ${circle(242, 164, 12, ll.blue)}${text(264, 170, 'Ledgerline', { size: 16, fill: '#FFFFFF', weight: 700 })}
   ${text(244, 300, 'The founder’s', { size: 50, fill: '#FFFFFF', family: SERIF })}
   ${text(244, 360, 'guide to', { size: 50, fill: '#FFFFFF', family: SERIF })}
   ${text(244, 420, 'getting paid', { size: 50, fill: '#FFFFFF', family: SERIF })}
   ${text(244, 480, 'Terms, reminders and the maths of waiting', { size: 16, fill: '#AFC0E6' })}
   <g filter="url(#shadow)">${rect(820, 110, 580, 790, '#FFFFFF', 6)}</g>
   ${text(864, 180, 'CHAPTER 2', { size: 13, fill: ll.blue, weight: 600, ls: 2 })}
   ${text(864, 232, 'Terms that work', { size: 38, fill: ll.ink, family: SERIF })}
   ${lines(864, 270, 492, 6, ll.grey, { h: 9, gap: 22 })}
   ${rect(864, 420, 4, 110, ll.mint)}${text(888, 452, '“Set the terms before', { size: 24, fill: ll.ink, family: SERIF })}${text(888, 486, 'you send the invoice.”', { size: 24, fill: ll.ink, family: SERIF })}
   ${lines(864, 566, 492, 4, ll.grey, { h: 9, gap: 22 })}
   ${[0, 1, 2].map((i) => `${rect(864 + i * 168, 690, 150, 150, ll.pale, 10)}${circle(939 + i * 168, 750, 26, i === 1 ? ll.mint : ll.blue)}${lines(894 + i * 168, 796, 90, 1, ll.grey, { h: 8 })}`).join('')}
   ${rect(1003, 765, 38, 3, ll.grey)}${rect(1171, 765, 38, 3, ll.grey)}`,
);

// ---------------------------------------------------------------------------
// Stride Physio (apps): physiotherapy practices, booking and exercise app
// ---------------------------------------------------------------------------
const sp = { bg: '#E4F2EE', ink: '#12342E', teal: '#1F9E83', sun: '#F2B84B', pale: '#EEF7F4', grey: '#D6E4DF' };

function ring(cx, cy, r, p, c) {
  const a = p * 2 * Math.PI - Math.PI / 2;
  const large = p > 0.5 ? 1 : 0;
  return `${circle(cx, cy, r, 'none', `stroke="${sp.grey}" stroke-width="10"`)}<path d="M${cx} ${cy - r} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
}

const spCover = svg(
  sp.bg,
  phone(
    400,
    80,
    380,
    840,
    `${rect(0, 0, 356, 816, '#FFFFFF')}
     ${text(24, 100, 'Book a session', { size: 26, fill: sp.ink, weight: 700 })}
     ${['M', 'T', 'W', 'T', 'F'].map((d, i) => `${rect(24 + i * 64, 130, 56, 76, i === 2 ? sp.teal : sp.pale, 14)}${text(52 + i * 64, 158, d, { size: 13, fill: i === 2 ? '#FFF' : sp.ink, anchor: 'middle' })}${text(52 + i * 64, 188, String(14 + i), { size: 20, fill: i === 2 ? '#FFF' : sp.ink, weight: 600, anchor: 'middle' })}`).join('')}
     ${rect(24, 232, 308, 86, sp.pale, 14)}${circle(66, 275, 24, sp.sun)}${text(102, 268, 'Thandi M.', { size: 16, fill: sp.ink, weight: 600 })}${text(102, 292, 'Sports physiotherapist', { size: 13, fill: '#5A7A73' })}
     ${text(24, 358, 'Available times', { size: 15, fill: sp.ink, weight: 600 })}
     ${['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'].map((t, i) => `${rect(24 + (i % 3) * 104, 378 + Math.floor(i / 3) * 58, 96, 46, i === 1 ? sp.ink : '#FFFFFF', 12, `stroke="${sp.grey}" stroke-width="${i === 1 ? 0 : 2}"`)}${text(72 + (i % 3) * 104, 407 + Math.floor(i / 3) * 58, t, { size: 15, fill: i === 1 ? '#FFF' : sp.ink, anchor: 'middle' })}`).join('')}
     ${rect(24, 520, 308, 1, sp.grey)}${lines(24, 548, 260, 2, sp.grey, { h: 9, gap: 20 })}
     ${rect(24, 700, 308, 60, sp.teal, 30)}${text(178, 737, 'Confirm booking', { size: 17, fill: '#FFF', weight: 600, anchor: 'middle' })}`,
  ) +
    phone(
      830,
      150,
      380,
      800,
      `${rect(0, 0, 356, 776, sp.pale)}
       ${text(24, 100, 'Today’s plan', { size: 26, fill: sp.ink, weight: 700 })}
       ${rect(24, 126, 308, 150, '#FFFFFF', 18)}${ring(104, 201, 46, 0.6, sp.teal)}${text(104, 208, '3 of 5', { size: 16, fill: sp.ink, weight: 600, anchor: 'middle' })}
       ${text(176, 188, 'Knee rehab', { size: 17, fill: sp.ink, weight: 600 })}${text(176, 214, 'Week 4 · 20 min', { size: 13, fill: '#5A7A73' })}
       ${['Straight-leg raise', 'Wall squat', 'Step-ups', 'Hamstring stretch', 'Balance hold']
         .map((t, i) => {
           const y = 300 + i * 86;
           return `${rect(24, y, 308, 74, '#FFFFFF', 16)}${rect(38, y + 13, 48, 48, i < 3 ? sp.teal : sp.grey, 12)}${text(100, y + 34, t, { size: 15, fill: sp.ink, weight: 600 })}${text(100, y + 56, '3 × 12', { size: 12, fill: '#5A7A73' })}
             ${circle(306, y + 37, 13, i < 3 ? sp.teal : 'none', `stroke="${i < 3 ? sp.teal : sp.grey}" stroke-width="2"`)}${i < 3 ? `<path d="M300 ${y + 37} l4 5 l9 -10" stroke="#FFF" stroke-width="2.5" fill="none"/>` : ''}`;
         })
         .join('')}`,
      { screen: sp.pale },
    ),
);

const spDetail = svg(
  sp.bg,
  phone(
    330,
    80,
    380,
    840,
    `${rect(0, 0, 356, 816, '#FFFFFF')}
     ${circle(178, 290, 150, sp.pale)}
     <path d="M110 380 L178 250 L246 380" stroke="${sp.teal}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     ${circle(178, 210, 26, sp.sun)}<path d="M120 300 H236" stroke="${sp.ink}" stroke-width="12" stroke-linecap="round"/>
     ${text(178, 520, 'Recover on', { size: 30, fill: sp.ink, weight: 700, anchor: 'middle' })}${text(178, 558, 'your schedule', { size: 30, fill: sp.ink, weight: 700, anchor: 'middle' })}
     ${lines(58, 590, 240, 2, sp.grey, { h: 9, gap: 20, last: 0.7 })}
     ${circle(158, 666, 5, sp.teal)}${circle(178, 666, 5, sp.grey)}${circle(198, 666, 5, sp.grey)}
     ${rect(24, 700, 308, 60, sp.teal, 30)}${text(178, 737, 'Get started', { size: 17, fill: '#FFF', weight: 600, anchor: 'middle' })}`,
  ) +
    phone(
      890,
      80,
      380,
      840,
      `${rect(0, 0, 356, 816, sp.ink)}
       ${text(178, 170, '07:42', { size: 72, fill: '#FFFFFF', weight: 300, anchor: 'middle' })}${text(178, 206, 'Tuesday 16', { size: 16, fill: '#9FC2B9', anchor: 'middle' })}
       ${[
         ['Stride', 'Your session with Thandi is', 'tomorrow at 10:30.'],
         ['Stride', 'Time for your evening', 'stretches: 3 exercises, 12 min.'],
       ]
         .map(
           ([app, a, b], i) =>
             `${rect(16, 270 + i * 118, 324, 104, 'rgba(255,255,255,0.14)', 20)}${rect(32, 286 + i * 118, 26, 26, sp.teal, 7)}${text(68, 305 + i * 118, app.toUpperCase(), { size: 12, fill: '#CFE3DD', weight: 600, ls: 1 })}${text(32, 336 + i * 118, a, { size: 15, fill: '#FFFFFF' })}${text(32, 358 + i * 118, b, { size: 15, fill: '#FFFFFF' })}`,
         )
         .join('')}`,
      { screen: sp.ink },
    ),
);

// ---------------------------------------------------------------------------
// Northgate Logistics (tech): regional logistics firm, operations dashboard
// ---------------------------------------------------------------------------
const ng = { bg: '#E9EBEE', ink: '#1B2430', orange: '#F26B1D', blue: '#4A6FA5', pale: '#F4F5F7', grey: '#DADDE3' };

const ngCover = svg(
  ng.bg,
  browser(
    90,
    80,
    1420,
    840,
    'ops.northgate.example',
    `${rect(0, 0, 1420, 796, ng.pale)}
     ${rect(0, 0, 230, 796, ng.ink)}${rect(28, 34, 26, 26, ng.orange, 6)}${text(64, 54, 'Northgate', { size: 17, fill: '#FFF', weight: 700 })}
     ${['Overview', 'Deliveries', 'Fleet', 'Customers', 'Reports'].map((t, i) => `${i === 0 ? rect(16, 98 + i * 50, 198, 40, '#2A3647', 8) : ''}${text(40, 124 + i * 50, t, { size: 15, fill: i === 0 ? '#FFF' : '#9AA6B8' })}`).join('')}
     ${text(270, 64, 'Operations overview', { size: 26, fill: ng.ink, weight: 700 })}
     ${[
       ['Deliveries today', '128'],
       ['On time', '96%'],
       ['Avg. route time', '4.2 h'],
       ['Vehicles out', '12'],
     ]
       .map(([l, v], i) => `${rect(270 + i * 280, 96, 262, 120, '#FFFFFF', 14)}${text(294 + i * 280, 134, l, { size: 14, fill: '#6B7686' })}${text(294 + i * 280, 188, v, { size: 38, fill: ng.ink, weight: 700 })}`)
       .join('')}
     ${rect(270, 240, 700, 520, '#FFFFFF', 14)}${text(294, 280, 'Live routes', { size: 16, fill: ng.ink, weight: 600 })}
     ${rect(294, 300, 652, 436, '#EEF1F5', 10)}
     <path d="M330 690 L470 560 L610 600 L720 430 L900 360" stroke="${ng.orange}" stroke-width="6" fill="none" stroke-linejoin="round"/>
     <path d="M340 380 L480 440 L610 600 L760 660 L910 610" stroke="${ng.blue}" stroke-width="6" fill="none" stroke-linejoin="round"/>
     ${[[330, 690], [470, 560], [610, 600], [720, 430], [900, 360], [340, 380], [480, 440], [760, 660], [910, 610]].map(([x, y], i) => circle(x, y, i === 2 ? 14 : 9, '#FFFFFF', `stroke="${i < 5 ? ng.orange : ng.blue}" stroke-width="5"`)).join('')}
     ${rect(990, 240, 390, 520, '#FFFFFF', 14)}${text(1014, 280, 'Deliveries this week', { size: 16, fill: ng.ink, weight: 600 })}
     ${[0.55, 0.72, 0.64, 0.85, 0.78, 0.4, 0.3].map((h, i) => rect(1024 + i * 48, 700 - 340 * h, 30, 340 * h, i === 3 ? ng.orange : ng.blue, 6)).join('')}
     ${rect(1014, 712, 342, 1, ng.grey)}`,
  ),
);

const flow = [
  ['New order', 'From the web shop'],
  ['Assign vehicle', 'Nearest free driver'],
  ['Notify customer', 'SMS with live link'],
  ['Update invoice', 'Synced to accounts'],
];
const ngDetail = svg(
  ng.bg,
  `${text(160, 170, 'Order-to-invoice automation', { size: 34, fill: ng.ink, weight: 700 })}
   ${text(160, 212, 'Each step runs on its own; people only step in for exceptions.', { size: 18, fill: '#5E6978' })}
   ${flow
     .map(([t, s], i) => {
       const x = 160 + i * 330;
       return `<g filter="url(#shadow)">${rect(x, 330, 280, 220, '#FFFFFF', 18)}</g>
         ${rect(x + 28, 360, 52, 52, i % 2 ? ng.blue : ng.orange, 12)}${text(x + 54, 395, String(i + 1), { size: 22, fill: '#FFF', weight: 700, anchor: 'middle' })}
         ${text(x + 28, 458, t, { size: 21, fill: ng.ink, weight: 700 })}${text(x + 28, 490, s, { size: 15, fill: '#6B7686' })}
         ${i < flow.length - 1 ? `<path d="M${x + 280} 440 H${x + 330}" stroke="${ng.ink}" stroke-width="4"/>${circle(x + 305, 440, 9, ng.ink)}` : ''}`;
     })
     .join('')}
   ${rect(160, 640, 1270, 170, '#FFFFFF', 18)}${text(190, 690, 'Connected tools', { size: 17, fill: ng.ink, weight: 600 })}
   ${['Web shop', 'Fleet tracking', 'SMS', 'Accounting', 'Email'].map((t, i) => `${circle(214 + i * 240, 752, 22, [ng.orange, ng.blue, ng.ink, ng.blue, ng.orange][i])}${text(248 + i * 240, 758, t, { size: 16, fill: ng.ink })}`).join('')}`,
);

// ---------------------------------------------------------------------------
const out = new URL('../src/assets/work/', import.meta.url);
mkdirSync(out, { recursive: true });
const files = {
  'harbour-and-hide-cover.svg': hhCover,
  'harbour-and-hide-detail.svg': hhDetail,
  'tafel-bakehouse-cover.svg': tfCover,
  'tafel-bakehouse-detail.svg': tfDetail,
  'ledgerline-cover.svg': llCover,
  'ledgerline-detail.svg': llDetail,
  'stride-physio-cover.svg': spCover,
  'stride-physio-detail.svg': spDetail,
  'northgate-logistics-cover.svg': ngCover,
  'northgate-logistics-detail.svg': ngDetail,
};
for (const [name, content] of Object.entries(files)) writeFileSync(new URL(name, out), content);
console.log(`Wrote ${Object.keys(files).length} files to src/assets/work/`);
