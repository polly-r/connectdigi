/**
 * robots.txt: everything may be crawled; points crawlers to the sitemap.
 * Sample case studies and the 404 page opt out per page (noindex), not here,
 * so that search engines can still read their noindex tag.
 */
import type { APIRoute } from 'astro';
import { url } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(url('/sitemap-index.xml'), site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
