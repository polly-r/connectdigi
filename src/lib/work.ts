import type { CollectionEntry } from 'astro:content';
import { services } from '../data/site';

/**
 * Case studies in display order: by service line (the order in
 * src/data/site.ts), real projects before sample ones, then by client name.
 * Used for Services' project lists and the case studies' "Next project".
 */
export function sortWork(entries: CollectionEntry<'work'>[]): CollectionEntry<'work'>[] {
  const order = services.map((s) => s.slug as string);
  return [...entries].sort(
    (a, b) =>
      order.indexOf(a.data.service) - order.indexOf(b.data.service) ||
      Number(a.data.placeholder) - Number(b.data.placeholder) ||
      a.data.client.localeCompare(b.data.client),
  );
}
