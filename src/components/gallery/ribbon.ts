import "../../styles/ribbon-motion.css";
import { wrap } from "../../hooks/useDrag";

export type Variant = "panorama" | "flat";
export type RibbonController = { focusCard(index: number, immediate?: boolean): void; refresh(): void; destroy(): void };

const perspective = 1800;
const angularSpeed = 4 * Math.PI / 180;
const momentum = 0.5;
const scrollEase = 0.3;

type PointerDrag = { id: number; x: number; y: number; lastX: number; time: number; horizontal: boolean };

/** Show each photo once. The wrapped distance moves a card across the seam only outside the frame. */
function distance(index: number, position: number, count: number) {
  return wrap(index - position + count / 2, count) - count / 2;
}

export function mountRibbon(stage: HTMLElement, variant: Variant): RibbonController {
  const track = stage.querySelector<HTMLElement>(".ribbon-track")!;
  const cards = Array.from(track.querySelectorAll<HTMLButtonElement>(".ribbon-card"));
  const images = cards.map(card => card.querySelector("img")!);
  const announcement = stage.querySelector<HTMLElement>(".ribbon-announcement")!;
  const panorama = variant === "panorama";
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const signal = listeners.signal;
  let position = 0, goal: number | null = null, velocity = 0;
  let width = 1, cardWidth = 1, pitch = 1, focal = 1, stepAngle = 1, halfAngle = 0;
  let visible = false, paused = false;
  let hovered = matchMedia("(hover: hover)").matches && stage.matches(":hover");
  let keyboard = stage.matches(":focus-visible");
  let pointer: PointerDrag | null = null;
  let skipClick = false, frame = 0, previous = 0;

  function render() {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const delta = distance(i, position, cards.length);
      const angle = delta * stepAngle;
      const within = panorama ? Math.abs(angle) < Math.atan(width / (2 * focal)) + halfAngle + .015
                              : Math.abs(delta * pitch) < (width + cardWidth) / 2 + 1;
      const near = panorama ? Math.abs(angle) < Math.atan(width / (2 * focal)) + halfAngle + stepAngle : Math.abs(delta * pitch) < (width + cardWidth) / 2 + pitch;
      if (near && images[i].loading !== "eager") images[i].loading = "eager";
      card.style.visibility = within ? "visible" : "hidden";
      if (!within) continue;
      if (!panorama) {
        card.style.transform = `translate(-50%, -50%) translateX(${delta * pitch}px)`;
        continue;
      }
      // Project the four corners of a tangent panel on the inside of a cylinder.
      const sin = Math.sin(angle), cos = Math.cos(angle);
      const side = 2 * Math.sin(halfAngle) / cardWidth, depth = Math.cos(halfAngle);
      card.style.transform = `translate(-50%, -50%) matrix3d(${focal * cos * side},0,0,${-sin * side},0,1,0,0,0,0,1,0,${focal * sin * depth},0,0,${cos * depth})`;
      card.style.opacity = String(1 - Math.min(1, Math.abs(2 * focal * Math.tan(angle) / width)) ** 1.6 * .45);
    }
    stage.dataset.active = String(wrap(Math.round(position), cards.length));
  }

  function measure() {
    width = Math.max(1, stage.clientWidth);
    cardWidth = Math.max(1, cards[0].offsetWidth);
    pitch = cardWidth + (panorama ? 4 : Math.round(cardWidth * .04));
    // Keep the seven-photo rooms continuous even on shallow ultrawide screens.
    focal = Math.min(perspective, cardWidth * 2.15, Math.max(cardWidth * 1.12, width * .54));
    stepAngle = 2 * Math.atan(pitch / (2 * focal));
    halfAngle = Math.atan(cardWidth / (2 * focal));
    if (panorama) {
      // Trim the straight chords to one continuous, symmetrical aperture.
      const upper: string[] = [], lower: string[] = [];
      const height = Math.max(1, stage.clientHeight);
      for (let i = 0; i <= 32; i++) {
        const fraction = i / 32;
        const x = (fraction - .5) * width / focal;
        const halfHeight = cardWidth * .375 * Math.hypot(1, x) / height * 100;
        upper.push(`${fraction * 100}% ${50 - halfHeight}%`);
        lower.unshift(`${fraction * 100}% ${50 + halfHeight}%`);
      }
      track.style.clipPath = `polygon(${upper.concat(lower).join(",")})`;
    }
    render();
  }

  const canDrift = () => !motion.matches && !hovered && !keyboard && !paused && !pointer;
  function refresh() {
    if (!visible || document.hidden || pointer || stage.hasAttribute("data-obscured") || (!canDrift() && goal === null && !velocity)) {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
    } else if (!frame) frame = requestAnimationFrame(advance);
  }
  function advance(time: number) {
    frame = 0;
    const dt = previous ? Math.min(.04, (time - previous) / 1000) : 0;
    previous = time;
    if (goal !== null) {
      const diff = goal - position;
      position += diff * (1 - Math.pow(1 - scrollEase, dt * 40));
      if (Math.abs(diff) < .001 || motion.matches) { position = goal; goal = null; }
    } else if (velocity) {
      position += velocity * dt;
      velocity *= Math.exp(-5.7 * dt);
      if (Math.abs(velocity) < .012) velocity = 0;
    } else if (canDrift()) {
      position += dt * (panorama ? angularSpeed / stepAngle : 24 / pitch);
    }
    if (goal === null) position = wrap(position, cards.length);
    render(); refresh();
  }
  function focusCard(index: number, immediate = false) {
    velocity = 0;
    goal = position + distance(index, position, cards.length);
    if (immediate || motion.matches) { position = goal; goal = null; render(); }
    refresh();
  }
  function resetMotion() {
    if (motion.matches) { velocity = 0; if (goal !== null) { position = goal; goal = null; render(); } }
    refresh();
  }
  function release(event: PointerEvent, cancelled = false) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dragging = pointer.horizontal;
    const stale = performance.now() - pointer.time > 100;
    pointer = null;
    skipClick = dragging && !cancelled;
    if (!dragging || cancelled || stale || motion.matches) velocity = 0;
    else velocity *= momentum;
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    refresh();
  }

  stage.addEventListener("pointerdown", e => {
    if (!e.isPrimary || e.button !== 0) return;
    skipClick = false; velocity = 0; goal = null; keyboard = false;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, lastX: e.clientX, time: performance.now(), horizontal: false };
    refresh();
  }, { signal });
  stage.addEventListener("pointermove", e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
    if (!pointer.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { release(e, true); return; }
      pointer.horizontal = true;
      stage.setPointerCapture(e.pointerId); stage.classList.add("is-dragging");
    }
    const now = performance.now();
    const change = (pointer.lastX - e.clientX) / pitch;
    position = wrap(position + change, cards.length);
    const speed = change / Math.max(.012, (now - pointer.time) / 1000);
    velocity = .4 * velocity + .6 * Math.max(-9, Math.min(9, speed));
    pointer.lastX = e.clientX; pointer.time = now;
    render();
  }, { signal });
  window.addEventListener("pointerup", e => release(e), { signal });
  window.addEventListener("pointercancel", e => release(e, true), { signal });
  stage.addEventListener("lostpointercapture", e => { if (e.target === stage) release(e, true); }, { signal });
  stage.addEventListener("click", e => {
    if (!skipClick) return;
    skipClick = false;
    // Some touch browsers omit the click after a drag. Always allow a later keyboard or assistive activation.
    if (e.detail !== 0) { e.preventDefault(); e.stopPropagation(); }
  }, { capture: true, signal });
  stage.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { hovered = true; refresh(); } }, { signal });
  stage.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { hovered = false; refresh(); } }, { signal });
  stage.addEventListener("focusin", e => { keyboard = (e.target as HTMLElement).matches(":focus-visible"); refresh(); }, { signal });
  stage.addEventListener("focusout", e => { if (!stage.contains(e.relatedTarget as Node | null)) { keyboard = false; refresh(); } }, { signal });
  stage.addEventListener("keydown", e => {
    const current = Math.round(goal ?? position);
    if (e.key === " ") { e.preventDefault(); paused = !paused; keyboard = paused; hovered = false; refresh(); return; }
    if (e.key === "Enter" && e.target === stage) { e.preventDefault(); cards[wrap(current, cards.length)].click(); return; }
    const targets: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
    if (!(e.key in targets)) return;
    e.preventDefault(); keyboard = true;
    const index = wrap(targets[e.key], cards.length);
    focusCard(index); announcement.textContent = cards[index].getAttribute("aria-label");
  }, { signal });
  stage.addEventListener("wheel", e => {
    if (e.ctrlKey || (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY))) return;
    const amount = e.deltaX || e.deltaY;
    if (!amount) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? width : 1;
    goal = null; velocity = 0; position = wrap(position + amount * unit / pitch, cards.length);
    render(); refresh();
  }, { passive: false, signal });
  const resize = new ResizeObserver(measure);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
  stage.dataset.enhanced = "true";
  measure(); resize.observe(stage); observer.observe(stage);
  document.addEventListener("visibilitychange", refresh, { signal });
  motion.addEventListener("change", resetMotion, { signal });
  return { focusCard, refresh, destroy() {
    listeners.abort(); resize.disconnect(); observer.disconnect(); cancelAnimationFrame(frame);
    delete stage.dataset.enhanced; delete stage.dataset.active;
    stage.classList.remove("is-dragging"); track.style.removeProperty("clip-path");
    for (const card of cards) { card.style.removeProperty("transform"); card.style.removeProperty("visibility"); card.style.removeProperty("opacity"); }
  } };
}
