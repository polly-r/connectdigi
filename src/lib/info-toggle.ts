/**
 * Feature info explainers (Pricing): each "i" button is a disclosure for the
 * one-line explainer it controls. Native <button>, so tap, click, Enter and
 * Space all work; no hover behaviour. aria-expanded on the button,
 * [data-open] on the panel (global.css hides closed panels only once `.js`
 * is set, so without JS every explainer is simply shown).
 *
 * Markup: <button data-info-toggle aria-expanded="false" aria-controls="id">
 * and <p id="id" data-info-panel>.
 */
let controller: AbortController | null = null;

export function init(): void {
  destroy();
  controller = new AbortController();
  const { signal } = controller;

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-info-toggle]')) {
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
    if (!panel) continue;
    button.addEventListener(
      'click',
      () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        panel.toggleAttribute('data-open', open);
      },
      { signal },
    );
  }
}

export function destroy(): void {
  controller?.abort();
  controller = null;
}
