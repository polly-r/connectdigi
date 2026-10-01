/**
 * Marquee behaviour. Markup and CSS: ./Marquee.astro.
 *
 * Seamless loop: the rendered set is measured, then cloned until one half of
 * the track (k sets) is at least as wide as the viewport; the track holds 2k
 * sets and the CSS keyframe moves it by -50%, i.e. exactly k sets, so the end
 * frame equals the start frame. Every set carries its trailing gap, so the
 * seam spacing matches the spacing between items.
 *
 * Pace: duration = distance travelled (k × set width) ÷ speed.
 * On resize (debounced), font load, or crossing the mobile breakpoint, the
 * track is re-measured and the animation resumes from the same pixel offset.
 * Measuring is batched: requests are coalesced to one per frame, and in that
 * frame every marquee on the page reads its sizes before any of them changes
 * the DOM, so the browser lays the page out once instead of once per read.
 *
 * Paused while any reason applies: off-screen, waiting for first view
 * (startOnView), or a tap on touch. Hover and focus pausing is pure CSS.
 * There is no pause/play button (client decision, CLAUDE.md Decisions log,
 * Phase 2). Reduced motion: no clones, no animation (static wrapped row).
 */

type PauseReason = 'offscreen' | 'waiting' | 'touch';

const MOBILE_QUERY = '(max-width: 47.999rem)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const RESIZE_DEBOUNCE_MS = 150;

/** Layout requests for the next frame: marquee → whether to keep the current position. */
const pending = new Map<Marquee, boolean>();
let frame = 0;

function requestLayout(marquee: Marquee, preservePosition: boolean): void {
  pending.set(marquee, (pending.get(marquee) ?? true) && preservePosition);
  frame ||= requestAnimationFrame(() => {
    frame = 0;
    const batch = [...pending];
    pending.clear();
    // All reads first, then all writes.
    const measured = batch.map(([m, preserve]) => [m, m.measure(preserve)] as const);
    for (const [m, size] of measured) if (size) m.apply(size);
  });
}

interface Measurement {
  naturalWidth: number;
  viewportWidth: number;
  offset: number;
  preservePosition: boolean;
}

class Marquee {
  private readonly viewport: HTMLElement;
  private readonly track: HTMLElement;
  private readonly set: HTMLElement;
  private readonly speed: number;
  private readonly mobileSpeed: number;
  private readonly reverse: boolean;
  private readonly mobile = window.matchMedia(MOBILE_QUERY);
  private readonly reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

  private reasons = new Set<PauseReason>();
  private clones: HTMLElement[] = [];
  private copies = 0;
  private seamPad = 0;
  private running = false;
  private touchStartedInside = false;
  private active: HTMLElement | null = null;
  private resizeTimer: number | undefined;
  private teardown: Array<() => void> = [];
  private motionTeardown: Array<() => void> = [];

  constructor(private readonly root: HTMLElement) {
    this.viewport = root.querySelector<HTMLElement>('[data-marquee-viewport]')!;
    this.track = root.querySelector<HTMLElement>('[data-marquee-track]')!;
    this.set = root.querySelector<HTMLElement>('[data-marquee-set]')!;
    this.speed = Number(root.dataset.speed) || 50;
    this.mobileSpeed = Number(root.dataset.mobileSpeed) || this.speed;
    this.reverse = root.dataset.direction === 'right';
  }

  init(): void {
    const onReducedMotionChange = () => (this.reducedMotion.matches ? this.stop() : this.start());
    this.reducedMotion.addEventListener('change', onReducedMotionChange);
    this.teardown.push(() => this.reducedMotion.removeEventListener('change', onReducedMotionChange));

    if (this.root.hasAttribute('data-active-item')) this.trackActiveItem();
    if (!this.reducedMotion.matches) this.start();
  }

  destroy(): void {
    this.stop();
    for (const fn of this.teardown) fn();
    this.teardown = [];
  }

  /**
   * [data-active-item]: mark the item under the mouse, or the tapped item on
   * touch, with [data-marquee-active]. Found by position, because clones are
   * inert and never match :hover. The strip is paused while hovered or
   * tapped, so the marked item stays under the pointer.
   */
  private trackActiveItem(): void {
    let mouse: { x: number; y: number } | null = null;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      mouse = { x: event.clientX, y: event.clientY };
      this.setActive(this.itemAt(mouse.x, mouse.y));
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      mouse = null;
      this.setActive(null);
    };
    // Touch or pen: a tap marks the item; a tap anywhere else clears it
    // (the same gestures that pause and resume the strip).
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') this.setActive(this.itemAt(event.clientX, event.clientY));
    };
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && !this.viewport.contains(event.target as Node)) this.setActive(null);
    };
    // Scrolling with a still mouse moves the strip under the pointer.
    const onScroll = () => {
      if (mouse) this.setActive(this.itemAt(mouse.x, mouse.y));
    };

    this.viewport.addEventListener('pointermove', onPointerMove);
    this.viewport.addEventListener('pointerleave', onPointerLeave);
    this.viewport.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    window.addEventListener('scroll', onScroll, { passive: true });

    this.teardown.push(
      () => this.viewport.removeEventListener('pointermove', onPointerMove),
      () => this.viewport.removeEventListener('pointerleave', onPointerLeave),
      () => this.viewport.removeEventListener('pointerup', onPointerUp),
      () => document.removeEventListener('pointerdown', onDocumentPointerDown, true),
      () => window.removeEventListener('scroll', onScroll),
      () => this.setActive(null),
    );
  }

  /** The item whose content is at a viewport point (the trailing gap doesn't count). */
  private itemAt(x: number, y: number): HTMLElement | null {
    for (const item of this.track.querySelectorAll<HTMLElement>('.marquee-item')) {
      const box = (item.firstElementChild ?? item).getBoundingClientRect();
      if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return item;
    }
    return null;
  }

  private setActive(item: HTMLElement | null): void {
    if (item === this.active) return;
    this.active?.removeAttribute('data-marquee-active');
    item?.setAttribute('data-marquee-active', '');
    this.active = item;
  }

  /** Clone, animate and observe. */
  private start(): void {
    if (this.running) return;
    this.running = true;

    if (this.root.hasAttribute('data-start-on-view')) this.reasons.add('waiting');

    const intersection = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        this.reasons.delete('waiting');
        this.reasons.delete('offscreen');
      } else {
        this.reasons.add('offscreen');
      }
      this.update();
    });
    intersection.observe(this.root);

    // The first callback reports the initial size, already measured below.
    let initialResize = true;
    const resize = new ResizeObserver(() => {
      if (initialResize) {
        initialResize = false;
        return;
      }
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => requestLayout(this, true), RESIZE_DEBOUNCE_MS);
    });
    resize.observe(this.viewport);
    resize.observe(this.set);

    // Fonts finishing after start-up change the set's width.
    const onFontsLoaded = () => requestLayout(this, true);
    document.fonts.addEventListener('loadingdone', onFontsLoaded);

    const onBreakpoint = () => requestLayout(this, true);
    this.mobile.addEventListener('change', onBreakpoint);

    // Touch: a tap on the strip pauses; a tap anywhere else resumes. Tracking
    // the pointerdown means a swipe that scrolls the page doesn't pause it.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      this.touchStartedInside = this.viewport.contains(event.target as Node);
      if (!this.root.contains(event.target as Node) && this.reasons.delete('touch')) this.update();
    };
    const onViewportClick = () => {
      if (!this.touchStartedInside) return;
      this.touchStartedInside = false;
      this.reasons.add('touch');
      this.update();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    this.viewport.addEventListener('click', onViewportClick);

    this.motionTeardown = [
      () => intersection.disconnect(),
      () => resize.disconnect(),
      () => window.clearTimeout(this.resizeTimer),
      () => pending.delete(this),
      () => document.fonts.removeEventListener('loadingdone', onFontsLoaded),
      () => this.mobile.removeEventListener('change', onBreakpoint),
      () => document.removeEventListener('pointerdown', onPointerDown, true),
      () => this.viewport.removeEventListener('click', onViewportClick),
    ];

    requestLayout(this, false);
    this.update();
  }

  /** Back to the single static set. */
  private stop(): void {
    if (!this.running) return;
    this.running = false;
    for (const fn of this.motionTeardown) fn();
    this.motionTeardown = [];
    for (const clone of this.clones) clone.remove();
    this.clones = [];
    this.copies = 0;
    this.seamPad = 0;
    this.root.style.removeProperty('--marquee-seam-pad');
    this.reasons.delete('waiting');
    this.reasons.delete('offscreen');
    this.reasons.delete('touch');
    delete this.root.dataset.ready;
    this.root.style.removeProperty('--marquee-duration');
    this.update();
  }

  /** Read phase: the sizes and position `apply` needs (null if not running or not laid out). */
  measure(preservePosition: boolean): Measurement | null {
    if (!this.running) return null;
    const naturalWidth = this.set.getBoundingClientRect().width - this.seamPad;
    const viewportWidth = this.viewport.clientWidth;
    if (naturalWidth <= 0 || !viewportWidth) return null;
    return { naturalWidth, viewportWidth, offset: preservePosition ? this.currentOffset() : 0, preservePosition };
  }

  /** Write phase: adjust the clone count and duration, and keep the current position. */
  apply({ naturalWidth, viewportWidth, offset, preservePosition }: Measurement): void {
    if (!this.running) return;

    // Round each set up to a whole pixel (pad < 1px) so the loop distance is
    // an integer and the end frame renders exactly like the start frame.
    const setWidth = Math.ceil(naturalWidth - 0.001);
    this.seamPad = setWidth - naturalWidth;
    this.root.style.setProperty('--marquee-seam-pad', `${this.seamPad}px`);

    const copies = Math.max(1, Math.ceil(viewportWidth / setWidth));
    if (copies !== this.copies) this.setCopies(copies);

    const distance = copies * setWidth;
    const speed = this.mobile.matches ? this.mobileSpeed : this.speed;
    const duration = distance / speed;
    this.root.style.setProperty('--marquee-duration', `${duration}s`);
    this.root.dataset.ready = '';

    // Resume from the same pixel offset. The content repeats every set width
    // and `distance` is a whole number of sets, so offset mod distance is
    // visually identical.
    const animation = this.track.getAnimations().find((a) => a instanceof CSSAnimation);
    if (animation && preservePosition) {
      const travelled = (((-offset) % distance) + distance) % distance;
      const progress = travelled / distance;
      animation.currentTime = (this.reverse ? 1 - progress : progress) * duration * 1000;
    }
  }

  /** Current translateX of the track, in px (≤ 0). */
  private currentOffset(): number {
    const transform = getComputedStyle(this.track).transform;
    return transform && transform !== 'none' ? new DOMMatrixReadOnly(transform).m41 : 0;
  }

  /** Make the track hold 2 × copies sets: the original plus clones. */
  private setCopies(copies: number): void {
    const needed = copies * 2 - 1;
    while (this.clones.length < needed) {
      const clone = this.set.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('aria-label');
      clone.removeAttribute('data-marquee-set');
      clone.inert = true;
      for (const el of clone.querySelectorAll('[id]')) el.removeAttribute('id');
      this.track.append(clone);
      this.clones.push(clone);
    }
    while (this.clones.length > needed) this.clones.pop()?.remove();
    this.copies = copies;
  }

  private update(): void {
    this.root.toggleAttribute('data-paused', this.reasons.size > 0);
  }
}

let instances: Marquee[] = [];

export function init(): void {
  destroy();
  instances = [...document.querySelectorAll<HTMLElement>('[data-marquee]')].map((root) => new Marquee(root));
  for (const instance of instances) instance.init();
}

export function destroy(): void {
  for (const instance of instances) instance.destroy();
  instances = [];
}
