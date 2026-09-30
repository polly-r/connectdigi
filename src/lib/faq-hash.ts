/**
 * FAQ deep links: /faq#<question-id> opens that question on load and on hash
 * changes, and opening a question puts its id in the address bar (without a
 * new history entry or a scroll jump), so any answer can be shared as a link.
 * The disclosure itself is native <details>; without JS every link still
 * scrolls to its question.
 */
let controller: AbortController | null = null;

function openFromHash(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement && !target.open) {
    target.open = true;
    target.scrollIntoView();
  }
}

export function init(): void {
  destroy();
  controller = new AbortController();
  const { signal } = controller;

  openFromHash();
  window.addEventListener('hashchange', openFromHash, { signal });

  for (const item of document.querySelectorAll<HTMLDetailsElement>('details[id]')) {
    item.addEventListener(
      'toggle',
      () => {
        if (item.open && location.hash !== `#${item.id}`) history.replaceState(null, '', `#${item.id}`);
      },
      { signal },
    );
  }
}

export function destroy(): void {
  controller?.abort();
  controller = null;
}
