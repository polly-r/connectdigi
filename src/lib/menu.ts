/**
 * Mobile menu (below the md breakpoint).
 *
 * - The button carries aria-expanded / aria-controls.
 * - While open, Tab cycles through `[data-menu-trap]` elements only, and
 *   everything marked `[data-menu-inert]` (page content, footer, logo link)
 *   is made inert so pointer and assistive-tech users can't reach it either.
 * - Escape closes and returns focus to the button. Choosing a link, widening
 *   past the breakpoint, or restoring the page from the back/forward cache
 *   also closes it.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let teardown: Array<() => void> = [];

export function init(): void {
  destroy();

  const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!button || !panel) return;

  const desktop = window.matchMedia('(min-width: 48rem)');
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  const trapped = () =>
    [...document.querySelectorAll<HTMLElement>('[data-menu-trap]')].flatMap((el) =>
      el.matches(FOCUSABLE) ? [el] : [...el.querySelectorAll<HTMLElement>(FOCUSABLE)],
    );

  const setInert = (inert: boolean) => {
    for (const el of document.querySelectorAll<HTMLElement>('[data-menu-inert]')) el.inert = inert;
  };

  const open = () => {
    button.setAttribute('aria-expanded', 'true');
    panel.dataset.open = '';
    setInert(true);
    document.documentElement.style.overflow = 'hidden';
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };

  const close = (returnFocus: boolean) => {
    if (!isOpen()) return;
    button.setAttribute('aria-expanded', 'false');
    delete panel.dataset.open;
    setInert(false);
    document.documentElement.style.overflow = '';
    if (returnFocus) button.focus();
  };

  const onButtonClick = () => (isOpen() ? close(true) : open());

  const onKeydown = (event: KeyboardEvent) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = trapped();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !items.includes(active as HTMLElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const onPanelClick = (event: MouseEvent) => {
    if ((event.target as Element).closest('a')) close(false);
  };

  const onBreakpoint = (event: MediaQueryListEvent) => {
    if (event.matches) close(false);
  };

  const onPageShow = () => close(false);

  button.addEventListener('click', onButtonClick);
  panel.addEventListener('click', onPanelClick);
  document.addEventListener('keydown', onKeydown);
  desktop.addEventListener('change', onBreakpoint);
  window.addEventListener('pageshow', onPageShow);

  teardown = [
    () => close(false),
    () => button.removeEventListener('click', onButtonClick),
    () => panel.removeEventListener('click', onPanelClick),
    () => document.removeEventListener('keydown', onKeydown),
    () => desktop.removeEventListener('change', onBreakpoint),
    () => window.removeEventListener('pageshow', onPageShow),
  ];
}

export function destroy(): void {
  for (const fn of teardown) fn();
  teardown = [];
}
