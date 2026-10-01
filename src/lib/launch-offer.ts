/**
 * Launch offer, run-time half (CLAUDE.md, "Launch offer on a static site").
 * The Pricing page's inline head script has already set [data-offer-ended]
 * on <html> before first paint if the visitor's clock is past the offer's
 * end, and CSS has swapped in the full price. This removes the offer markup
 * itself, so nothing stale is left in the page.
 */
export function init(): void {
  if (!document.documentElement.hasAttribute('data-offer-ended')) return;
  for (const el of document.querySelectorAll('[data-offer]')) el.remove();
  for (const el of document.querySelectorAll('[data-offer-fallback]')) el.removeAttribute('data-offer-fallback');
}
