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
 *
 * Paused while any reason applies: the pause button, off-screen, waiting for
 * first view (startOnView), or a tap on touch. Hover and focus pausing is pure
 * CSS. Reduced motion: no clones, no animation (static wrapped row).
 */

type PauseReason = 'user' | 'offscreen' | 'waiting' | 'touch';

const MOBILE_QUERY = '(max-width: 47.999rem)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const RESIZE_DEBOUNCE_MS = 150;

class Marquee {
  private readonly viewport: HTMLElement;
  private readonly track: HTMLElement;
  private readonly set: HTMLElement;
  private readonly control: HTMLButtonElement | null;
  private readonly controlText: HTMLElement | null;
  private readonly label: string;
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
  private resizeTimer: number | undefined;
  private teardown: Array<() => void> = [];
  private motionTeardown: Array<() => void> = [];

  constructor(private readonly root: HTMLElement) {
    this.viewport = root.querySelector<HTMLElement>('[data-marquee-viewport]')!;
    this.track = root.querySelector<HTMLElement>('[data-marquee-track]')!;
    this.set = root.querySelector<HTMLElement>('[data-marquee-set]')!;
    this.control = root.querySelector<HTMLButtonElement>('[data-marquee-control]');
    this.controlText = root.querySelector<HTMLElement>('[data-marquee-control-text]');
    this.label = root.dataset.label ?? '';
    this.speed = Number(root.dataset.speed) || 50;
    this.mobileSpeed = Number(root.dataset.mobileSpeed) || this.speed;
    this.reverse = root.dataset.direction === 'right';
  }

  init(): void {
    const onReducedMotionChange = () => (this.reducedMotion.matches ? this.stop() : this.start());
    this.reducedMotion.addEventListener('change', onReducedMotionChange);
    this.teardown.push(() => this.reducedMotion.removeEventListener('change', onReducedMotionChange));

    if (this.control) {
      const onControl = () => {
        if (this.interactivelyPaused()) {
          this.reasons.delete('user');
          this.reasons.delete('touch');
        } else {
          this.reasons.add('user');
        }
        this.update();
      };
      this.control.addEventListener('click', onControl);
      this.teardown.push(() => this.control?.removeEventListener('click', onControl));
    }

    if (!this.reducedMotion.matches) this.start();
  }

  destroy(): void {
    this.stop();
    for (const fn of this.teardown) fn();
    this.teardown = [];
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

    const resize = new ResizeObserver(() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.layout(), RESIZE_DEBOUNCE_MS);
    });
    resize.observe(this.viewport);
    resize.observe(this.set);

    const onFontsLoaded = () => this.layout();
    document.fonts.addEventListener('loadingdone', onFontsLoaded);
    void document.fonts.ready.then(() => this.running && this.layout());

    const onBreakpoint = () => this.layout();
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
      () => document.fonts.removeEventListener('loadingdone', onFontsLoaded),
      () => this.mobile.removeEventListener('change', onBreakpoint),
      () => document.removeEventListener('pointerdown', onPointerDown, true),
      () => this.viewport.removeEventListener('click', onViewportClick),
    ];

    this.layout(false);
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

  /** Measure, adjust the clone count and duration, and keep the current position. */
  private layout(preservePosition = true): void {
    if (!this.running) return;
    const naturalWidth = this.set.getBoundingClientRect().width - this.seamPad;
    const viewportWidth = this.viewport.clientWidth;
    if (naturalWidth <= 0 || !viewportWidth) return;

    const offset = preservePosition ? this.currentOffset() : 0;

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

  private interactivelyPaused(): boolean {
    return this.reasons.has('user') || this.reasons.has('touch');
  }

  private update(): void {
    this.root.toggleAttribute('data-paused', this.reasons.size > 0);
    if (!this.control || !this.controlText) return;
    const paused = this.interactivelyPaused();
    this.control.dataset.state = paused ? 'paused' : 'playing';
    this.controlText.textContent = `${paused ? 'Play' : 'Pause'} ${this.label}`;
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
