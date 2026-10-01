/**
 * Runs a callback the first time elements scroll into view. Built on
 * IntersectionObserver, so it never reads layout on the main thread (unlike
 * GSAP ScrollTrigger, which measured every trigger at load and on resize and
 * was the largest share of start-up work on phones).
 *
 * `start` mirrors ScrollTrigger's "top N%": an element counts as in view once
 * its top edge is above N% of the viewport height. Elements that enter in the
 * same frame arrive together, so callers can stagger them as a batch.
 * Returns a cleanup function that disconnects the observer.
 */
export function onFirstView<T extends Element>(
  elements: Iterable<T>,
  callback: (batch: T[]) => void,
  { start = 88 }: { start?: number } = {},
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as T);
      if (!batch.length) return;
      for (const el of batch) observer.unobserve(el);
      callback(batch);
    },
    { rootMargin: `0px 0px -${100 - start}% 0px` },
  );
  for (const el of elements) observer.observe(el);
  return () => observer.disconnect();
}
