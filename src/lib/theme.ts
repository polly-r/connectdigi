/**
 * Theme toggle. The inline script in BaseLayout sets `.dark` on <html> before
 * first paint; this wires up the toggle buttons afterwards.
 *
 * Two states. With no stored choice the theme follows prefers-color-scheme
 * (including live changes); a click stores an explicit choice that overrides it.
 */

export const THEME_STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark';

let teardown: Array<() => void> = [];

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function apply(dark: boolean, buttons: Iterable<HTMLButtonElement>): void {
  document.documentElement.classList.toggle('dark', dark);
  for (const button of buttons) button.setAttribute('aria-pressed', String(dark));
}

export function init(): void {
  destroy();

  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  apply(document.documentElement.classList.contains('dark'), buttons);

  const onClick = () => {
    const dark = !document.documentElement.classList.contains('dark');
    apply(dark, buttons);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Storage unavailable (private mode, blocked): the choice lasts for this page only.
    }
  };

  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!storedTheme()) apply(event.matches, buttons);
  };

  for (const button of buttons) button.addEventListener('click', onClick);
  media.addEventListener('change', onSystemChange);

  teardown = [
    () => buttons.forEach((button) => button.removeEventListener('click', onClick)),
    () => media.removeEventListener('change', onSystemChange),
  ];
}

export function destroy(): void {
  for (const fn of teardown) fn();
  teardown = [];
}
