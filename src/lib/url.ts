/**
 * Internal links. The site normally lives at the domain root, but a build can
 * be served from a sub-folder instead (the GitHub Pages preview serves it
 * under /<repo>/; see BASE_PATH in astro.config.mjs). Write every internal
 * link as url('/about'), never a bare '/about'.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A site path ('/about', '/services#web') with the base prepended. */
export const url = (path: string): string => `${base}${path}`;

/** The current page's site path without the base or a trailing slash ('/' for Home). */
export const pagePath = (pathname: string): string =>
  (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).replace(/\/$/, '') || '/';
