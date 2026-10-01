/**
 * Contact form submission. The form only ever calls `submitContact()`; the
 * provider lives behind a small adapter, so choosing one later means writing
 * (or configuring) an adapter, not touching the form.
 *
 * Choose with environment variables (see .env.example):
 *   PUBLIC_FORM_ADAPTER   'mock' (default) | 'http'
 *   PUBLIC_FORM_ENDPOINT  URL the 'http' adapter POSTs JSON to
 *
 * The mock adapter sends NOTHING: it waits, logs the payload and reports
 * success. The build warns while it is the active adapter
 * (scripts/check-stand-ins.mjs), so the site can't launch with a form that
 * looks like it works but doesn't.
 */
import type { ServiceSlug } from '../data/site';

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  service: ServiceSlug | 'unsure';
  /** Optional package of interest (src/data/pricing.ts `packageChoices`, e.g. 'standard', 'care-plan', 'unsure'). */
  package?: string;
  message: string;
  consent: true;
  /** ISO 8601 timestamp, set by the form. */
  submittedAt: string;
  /** Page the form was sent from, e.g. "/connect". */
  page: string;
}

export type SubmitResult = { ok: true } | { ok: false; reason: 'network' | 'rejected' | 'timeout'; message?: string };

export interface ContactAdapter {
  readonly name: string;
  submit(payload: ContactPayload, options: { signal: AbortSignal }): Promise<SubmitResult>;
}

/** Give up after this long and show the error state. */
export const SUBMIT_TIMEOUT_MS = 15_000;

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

/**
 * Default until a provider is chosen. Nothing leaves the browser.
 * In dev, a message containing "[mock-fail]" simulates a failure, to test
 * the error state.
 */
export const mockAdapter: ContactAdapter = {
  name: 'mock',
  async submit(payload, { signal }) {
    await wait(1200, signal);
    if (import.meta.env.DEV && payload.message.includes('[mock-fail]')) {
      return { ok: false, reason: 'rejected', message: 'Simulated failure ([mock-fail])' };
    }
    console.info('[contact:mock] Not sent (mock adapter). Payload:', payload);
    return { ok: true };
  },
};

/**
 * Generic JSON POST. Works as-is with most form services that accept JSON;
 * a provider needing a different shape gets its own adapter alongside this.
 */
export function httpAdapter(endpoint: string): ContactAdapter {
  return {
    name: 'http',
    async submit(payload, { signal }) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal,
        });
        return response.ok ? { ok: true } : { ok: false, reason: 'rejected', message: `HTTP ${response.status}` };
      } catch {
        return { ok: false, reason: signal.aborted ? 'timeout' : 'network' };
      }
    },
  };
}

export function getAdapter(): ContactAdapter {
  const kind = import.meta.env.PUBLIC_FORM_ADAPTER ?? 'mock';
  if (kind === 'http') {
    const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT;
    if (!endpoint) throw new Error('PUBLIC_FORM_ADAPTER=http needs PUBLIC_FORM_ENDPOINT.');
    return httpAdapter(endpoint);
  }
  return mockAdapter;
}

/** Submit through the active adapter, with a timeout. Never throws. */
export async function submitContact(payload: ContactPayload, adapter: ContactAdapter = getAdapter()): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  try {
    return await adapter.submit(payload, { signal: controller.signal });
  } catch {
    return { ok: false, reason: controller.signal.aborted ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
