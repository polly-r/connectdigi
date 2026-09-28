/**
 * Services accordion (React island, `client:load`). Accessible disclosure
 * pattern: each service name is a heading containing a button with
 * aria-expanded / aria-controls; its panel is a region labelled by the button.
 * Several panels can be open at once.
 *
 * - Deep links: /services#<slug> opens that panel and scrolls to it; opening
 *   a panel updates the URL hash so the link can be shared.
 * - Server render: every panel open, so the page reads fully without JS.
 *   With JS, CSS hides the panels until hydration (no open-then-snap-shut),
 *   with a failsafe that shows them after 2.5s if hydration never happens.
 * - Animation: the panel's content fades and rises in (transform + opacity);
 *   height changes instantly. None under reduced motion.
 * - Icon: a ring node that fills to a solid node when open (node motif).
 */
import { useEffect, useState } from 'react';
import { NODE_RADIUS, ringGeometry } from '../../lib/node-motif';
import './service-accordion.css';

export interface AccordionItem {
  slug: string;
  name: string;
  description: string;
  included: string[];
  caseStudy: { href: string; client: string; sample: boolean };
}

interface Props {
  items: AccordionItem[];
}

const UNIT = 3;
const ring = ringGeometry('l');
const ICON = Math.ceil(ring.outer * UNIT * 2 + 2);

function NodeIcon() {
  const c = ICON / 2;
  return (
    <svg className="sa-icon" width={ICON} height={ICON} aria-hidden="true" focusable="false">
      <circle className="sa-icon-ring" cx={c} cy={c} r={ring.mid * UNIT} strokeWidth={ring.band * UNIT} />
      <circle className="sa-icon-fill" cx={c} cy={c} r={NODE_RADIUS.l * UNIT} />
    </svg>
  );
}

export default function ServiceAccordion({ items }: Props) {
  // Server and first client render: all open (matches, so no hydration mismatch).
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.map((i) => i.slug)));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const slugFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      return items.some((i) => i.slug === slug) ? slug : null;
    };

    const initial = slugFromHash();
    setOpen(new Set(initial ? [initial] : []));
    setReady(true);
    if (initial) requestAnimationFrame(() => document.getElementById(initial)?.scrollIntoView({ block: 'start' }));

    const onHashChange = () => {
      const slug = slugFromHash();
      if (!slug) return;
      setOpen((prev) => new Set(prev).add(slug));
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: 'start' }));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [items]);

  const toggle = (slug: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      const opening = !next.has(slug);
      if (opening) next.add(slug);
      else next.delete(slug);
      const { pathname, search } = window.location;
      history.replaceState(null, '', opening ? `#${slug}` : `${pathname}${search}`);
      return next;
    });
  };

  return (
    <div className="sa" data-ready={ready ? '' : undefined}>
      {items.map((item) => {
        const isOpen = open.has(item.slug);
        const buttonId = `${item.slug}-button`;
        const panelId = `${item.slug}-panel`;
        return (
          <div key={item.slug} id={item.slug} className="sa-item">
            <h2 className="sa-heading">
              <button
                type="button"
                id={buttonId}
                className="sa-button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.slug)}
              >
                <span>{item.name}</span>
                <NodeIcon />
              </button>
            </h2>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="sa-panel" hidden={!isOpen} data-panel>
              <div className="sa-panel-inner">
                <p className="sa-description">{item.description}</p>
                <div className="sa-included">
                  <h3 className="sa-label">What's included</h3>
                  <ul>
                    {item.included.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <p className="sa-case">
                  <span className="sa-label">{item.caseStudy.sample ? 'Sample project' : 'Case study'}</span>
                  <a href={item.caseStudy.href} className="link">
                    {item.caseStudy.client}
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
