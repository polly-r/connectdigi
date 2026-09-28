/** Public environment variables (see .env.example). All optional. */
interface ImportMetaEnv {
  /** Contact form adapter: 'mock' (default, sends nothing) or 'http'. */
  readonly PUBLIC_FORM_ADAPTER?: 'mock' | 'http';
  /** Endpoint the 'http' contact adapter POSTs JSON to. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Booking page URL. When set, the Connect page shows the booking embed. */
  readonly PUBLIC_BOOKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
