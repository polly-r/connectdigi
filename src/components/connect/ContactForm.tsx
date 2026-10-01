/**
 * Contact form (React island, `client:load`). Spec: CLAUDE.md "Connect".
 *
 * Validation timing: each field is checked when it loses focus; once a field
 * has shown an error it is re-checked on every change, so the error clears as
 * soon as it's fixed. Errors are words (never colour alone), wired with
 * aria-invalid + aria-describedby. A failed submit shows every error,
 * announces how many fields need attention and moves focus to the first one.
 *
 * Submit: values are read from the form itself (so autofill without input
 * events is covered). States idle → submitting → success | error, drawn with
 * the node motif on the button (submit-motif.ts). A busy flag stops double
 * submits. On error everything typed is kept. A filled honeypot pretends to
 * succeed and sends nothing. Sending goes through src/lib/submit-contact.ts.
 *
 * Package (optional): preselected from ?package= after mount (unknown values
 * are ignored); a package also preselects Web Dev if Service is still empty.
 * While the launch offer is live, choosing its package shows the offer label.
 */
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { destroy as destroyMotif, setSubmitState } from '../motif/submit-motif';
import { CHECK, LOADER, NODE_RADIUS, ringGeometry, type MotifNetwork } from '../../lib/node-motif';
import { submitContact, type ContactPayload } from '../../lib/submit-contact';
import './contact-form.css';

type Field = 'name' | 'email' | 'company' | 'service' | 'package' | 'message' | 'consent';
type Values = {
  name: string;
  email: string;
  company: string;
  service: string;
  package: string;
  message: string;
  consent: boolean;
};

const EMPTY: Values = { name: '', email: '', company: '', service: '', package: '', message: '', consent: false };
const ORDER: Field[] = ['name', 'email', 'company', 'service', 'package', 'message', 'consent'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(field: Field, v: Values): string | null {
  switch (field) {
    case 'name': {
      const t = v.name.trim();
      if (!t) return 'Enter your name.';
      return t.length < 2 ? 'Enter at least 2 characters.' : null;
    }
    case 'email': {
      const t = v.email.trim();
      if (!t) return 'Enter your email address.';
      return EMAIL.test(t) ? null : 'Enter an email address in the format name@example.com.';
    }
    case 'company':
    case 'package':
      return null;
    case 'service':
      return v.service ? null : 'Choose a service, or "Not sure yet".';
    case 'message': {
      const t = v.message.trim();
      if (!t) return 'Tell us a little about your project.';
      return t.length < 10 ? 'Add a little more detail (at least 10 characters).' : null;
    }
    case 'consent':
      return v.consent ? null : 'Tick the box to agree before sending.';
  }
}

const idFor = (field: Field) => `cf-${field}`;
const errorIdFor = (field: Field) => `cf-${field}-error`;

/** The node-motif network, as NodeNetwork.astro draws it (same data attributes). */
function NetworkSvg({ network, unit }: { network: MotifNetwork; unit: number }) {
  const { nodes, links = [] } = network;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const r = (id: string) => NODE_RADIUS[byId.get(id)?.size ?? 'm'];
  const minX = Math.min(...nodes.map((n) => n.x - r(n.id)));
  const maxX = Math.max(...nodes.map((n) => n.x + r(n.id)));
  const minY = Math.min(...nodes.map((n) => n.y - r(n.id)));
  const maxY = Math.max(...nodes.map((n) => n.y + r(n.id)));
  return (
    <svg
      className="nn"
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      width={(maxX - minX) * unit}
      height={(maxY - minY) * unit}
      aria-hidden="true"
      focusable="false"
    >
      {links.map(([from, to]) => {
        const a = byId.get(from)!;
        const b = byId.get(to)!;
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        return (
          <g key={`${from}-${to}`} transform={`translate(${a.x} ${a.y}) rotate(${angle})`}>
            <rect x={0} y={-0.5} width={length} height={1} className="nn-link" data-nn-link="" />
          </g>
        );
      })}
      {nodes.map(({ id, x, y, size = 'm', kind = 'solid' }) => {
        if (kind === 'ring') {
          const { mid, band } = ringGeometry(size);
          return <circle key={id} cx={x} cy={y} r={mid} strokeWidth={band} className="nn-ring" data-nn-node="" />;
        }
        return <circle key={id} cx={x} cy={y} r={NODE_RADIUS[size]} className="nn-solid" data-nn-node="" />;
      })}
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="cf-error-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 1.5 15 14H1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.75" r="0.9" fill="currentColor" />
    </svg>
  );
}

interface Props {
  services: Array<{ value: string; label: string }>;
  /** Package choices, in order; values match ?package=. */
  packages: Array<{ value: string; label: string }>;
  /** The launch offer, if live when the site was built; re-checked against the visitor's clock. */
  offer: { package: string; label: string; endsAt: string } | null;
  contactEmail: string;
  privacyHref: string;
}

/** Package choices that are real packages (not "Not sure yet"). */
const NOT_A_PACKAGE = 'unsure';

export default function ContactForm({ services, packages, offer, contactEmail, privacyHref }: Props) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [live, setLive] = useState<Set<Field>>(new Set());
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [done, setDone] = useState<{ name: string; email: string } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [focusTarget, setFocusTarget] = useState<{ id: string; n: number } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);

  useEffect(() => () => destroyMotif(), []);

  // ?package=<slug> from the Pricing page. After mount, so the server render and hydration match.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('package');
    if (!wanted || !packages.some((p) => p.value === wanted)) return;
    const web = services.some((s) => s.value === 'web') && wanted !== NOT_A_PACKAGE;
    setValues((prev) => ({ ...prev, package: wanted, service: prev.service || (web ? 'web' : '') }));
  }, [packages, services]);

  useEffect(() => {
    if (focusTarget) document.getElementById(focusTarget.id)?.focus();
  }, [focusTarget]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const showError = (field: Field, next: Values) => {
    const message = validate(field, next);
    setErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
    return message;
  };

  const onChange = (field: Field, value: string | boolean) => {
    const next = { ...values, [field]: value } as Values;
    setValues(next);
    // Once a field has shown an error, re-check it as the user types.
    if (live.has(field)) showError(field, next);
  };

  const onBlur = (field: Field) => {
    // Checked when leaving the field; an error switches on live re-checking.
    if (showError(field, values)) setLive((prev) => new Set(prev).add(field));
  };

  const readForm = (): Values => {
    const data = new FormData(formRef.current!);
    return {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      service: String(data.get('service') ?? ''),
      package: String(data.get('package') ?? ''),
      message: String(data.get('message') ?? ''),
      consent: data.get('consent') === 'yes',
    };
  };

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current || status === 'success') return;

    const current = readForm();
    setValues(current);

    // Honeypot: people never see it; bots fill it. Pretend it worked.
    const honeypot = new FormData(formRef.current!).get('website');
    if (honeypot) {
      setDone({ name: current.name.trim(), email: current.email.trim() });
      return;
    }

    const found = ORDER.map((field) => [field, validate(field, current)] as const).filter(([, message]) => message);
    if (found.length) {
      setErrors(Object.fromEntries(found));
      setLive((prev) => new Set([...prev, ...found.map(([field]) => field)]));
      setAnnouncement(`${found.length} ${found.length === 1 ? 'field needs' : 'fields need'} attention.`);
      setFocusTarget({ id: idFor(found[0]![0]), n: Date.now() });
      return;
    }

    busy.current = true;
    setErrors({});
    setStatus('submitting');
    setAnnouncement('Sending your message…');
    if (buttonRef.current) setSubmitState(buttonRef.current, 'submitting');

    const payload: ContactPayload = {
      name: current.name.trim(),
      email: current.email.trim(),
      company: current.company.trim() || undefined,
      service: current.service as ContactPayload['service'],
      package: current.package || undefined,
      message: current.message.trim(),
      consent: true,
      submittedAt: new Date().toISOString(),
      page: window.location.pathname,
    };
    const result = await submitContact(payload);

    if (result.ok) {
      setStatus('success');
      setAnnouncement('Message sent.');
      if (buttonRef.current) setSubmitState(buttonRef.current, 'success');
      // Let the check draw before swapping in the thank-you panel.
      window.setTimeout(() => {
        busy.current = false;
        setDone({ name: payload.name, email: payload.email });
      }, 900);
    } else {
      busy.current = false;
      setStatus('error');
      setAnnouncement("Your message didn't send. Everything you typed is still here. Please try again.");
      if (buttonRef.current) setSubmitState(buttonRef.current, 'idle');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setLive(new Set());
    setStatus('idle');
    setDone(null);
    setAnnouncement('');
    setFocusTarget({ id: idFor('name'), n: Date.now() });
  };

  const fieldProps = (field: Field) => {
    const error = errors[field];
    return {
      id: idFor(field),
      name: field,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorIdFor(field) : undefined,
      onBlur: () => onBlur(field),
    };
  };

  const showOffer = Boolean(offer && values.package === offer.package && Date.now() < Date.parse(offer.endsAt));

  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={errorIdFor(field)} className="cf-error">
        <ErrorIcon />
        <span>{errors[field]}</span>
      </p>
    ) : null;

  return (
    <div className="cf">
      <p role="status" className="sr-only">
        {announcement}
      </p>

      {done ? (
        <div className="cf-done">
          <h2 ref={doneRef} tabIndex={-1} className="font-display text-h2">
            Thanks{done.name ? `, ${done.name.split(/\s+/)[0]}` : ''}.
          </h2>
          <p className="mt-4 max-w-[44ch] text-lead text-muted">
            We'll be in touch at <span className="text-fg">{done.email}</span>.
          </p>
          <button type="button" className="link mt-8" onClick={reset}>
            Send another message
          </button>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="cf-title">
          <h2 id="cf-title" className="cf-label">
            Send us a message
          </h2>

          <div className="cf-grid">
            <div className="cf-field">
              <label htmlFor={idFor('name')}>Name</label>
              <input
                {...fieldProps('name')}
                type="text"
                autoComplete="name"
                aria-required="true"
                value={values.name}
                onChange={(e) => onChange('name', e.target.value)}
              />
              {errorText('name')}
            </div>

            <div className="cf-field">
              <label htmlFor={idFor('email')}>Email</label>
              <input
                {...fieldProps('email')}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                aria-required="true"
                value={values.email}
                onChange={(e) => onChange('email', e.target.value)}
              />
              {errorText('email')}
            </div>

            <div className="cf-field">
              <label htmlFor={idFor('company')}>
                Company <span className="text-muted">(optional)</span>
              </label>
              <input
                {...fieldProps('company')}
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={(e) => onChange('company', e.target.value)}
              />
            </div>

            <div className="cf-field">
              <label htmlFor={idFor('service')}>Service</label>
              <div className="cf-select">
                <select
                  {...fieldProps('service')}
                  aria-required="true"
                  value={values.service}
                  onChange={(e) => onChange('service', e.target.value)}
                >
                  <option value="">Choose a service</option>
                  {services.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                  <option value="unsure">Not sure yet</option>
                </select>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {errorText('service')}
            </div>

            <div className="cf-field">
              <label htmlFor={idFor('package')}>
                Package <span className="text-muted">(optional)</span>
              </label>
              <div className="cf-select">
                <select
                  id={idFor('package')}
                  name="package"
                  aria-describedby={showOffer ? 'cf-package-offer' : undefined}
                  value={values.package}
                  onChange={(e) => onChange('package', e.target.value)}
                >
                  <option value="">Choose a package</option>
                  {packages.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {showOffer && offer && (
                <p id="cf-package-offer" className="cf-hint">
                  {offer.label}
                </p>
              )}
            </div>

            <div className="cf-field cf-field--wide">
              <label htmlFor={idFor('message')}>Message</label>
              <textarea
                {...fieldProps('message')}
                rows={6}
                aria-required="true"
                value={values.message}
                onChange={(e) => onChange('message', e.target.value)}
              />
              {errorText('message')}
            </div>

            <div className="cf-field cf-field--wide">
              <div className="cf-check">
                <input
                  {...fieldProps('consent')}
                  type="checkbox"
                  value="yes"
                  aria-required="true"
                  checked={values.consent}
                  onChange={(e) => onChange('consent', e.target.checked)}
                />
                <label htmlFor={idFor('consent')}>
                  I agree that The Connect Digital may use these details to reply to my enquiry, as described in the{' '}
                  <a href={privacyHref} className="link">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errorText('consent')}
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
            <div className="cf-hp" aria-hidden="true">
              <label htmlFor="cf-website">Leave this field empty</label>
              <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
          </div>

          {status === 'error' && (
            <div className="cf-failed">
              <ErrorIcon />
              <p>
                Your message didn't send. Everything you typed is still here: please try again, or email us at{' '}
                <a href={`mailto:${contactEmail}`} className="link">
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          )}

          <div className="cf-actions">
            <button
              ref={buttonRef}
              type="submit"
              className="sm inline-grid rounded-full bg-accent px-6 py-3 font-medium text-on-accent"
              data-submit-motif=""
              data-state="idle"
              aria-disabled="false"
            >
              <span className="sm-layer" data-layer="idle">
                {status === 'error' ? 'Try again' : 'Send message'}
              </span>
              <span className="sm-layer sm-layer--motif" data-layer="submitting">
                Sending…
                <NetworkSvg network={LOADER} unit={1.5} />
              </span>
              <span className="sm-layer sm-layer--motif" data-layer="success">
                Sent
                <NetworkSvg network={CHECK} unit={1.5} />
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
