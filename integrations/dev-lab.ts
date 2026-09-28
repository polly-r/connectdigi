import type { AstroIntegration } from 'astro';

/**
 * Lab pages for reviewing components in isolation. They live in src/lab/
 * (outside src/pages) and are routed only under `astro dev`, so they never
 * reach a production build.
 */
const labPages = ['logo', 'marquee', 'motif'];

export default function devLab(): AstroIntegration {
  return {
    name: 'dev-lab',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        for (const page of labPages) {
          injectRoute({ pattern: `/lab/${page}`, entrypoint: `./src/lab/${page}.astro` });
        }
      },
    },
  };
}
