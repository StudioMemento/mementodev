export type Motion = { position: number; target: null | { from: number; to: number; elapsed: number; duration: number } };
export const createMotion = (): Motion => ({ position: 0, target: null });
export const loopDistance = (item: number, position: number, count: number) => ((item - position + count / 2) % count + count) % count - count / 2;
export const smoothstep = (n: number) => { const x = Math.max(0, Math.min(1, n)); return x * x * (3 - 2 * x); };
export const captionOpacity = (distance: number) => smoothstep((0.5 - Math.abs(distance)) / 0.3);

export const sideScale = 0.68;
export const sideGap = 16;

/** The two central gaps accommodate the arrows. Outer plates follow a tighter pitch. */
export function carouselWindow(viewportWidth: number, cardWidth: number, count: number) {
  const width = Math.max(1, cardWidth);
  const lane = Math.max(48, Math.min(viewportWidth / 16, 104));
  const step = width * sideScale + sideGap;
  const focusStep = width * (1 + sideScale) / 2 + lane;
  const radius = (Math.max(1, viewportWidth) / 2 + width / 2) / step + 1;
  return { step, focusStep, radius, renderCount: Math.max(count, Math.ceil(radius * 2 / count) * count), preload: Math.ceil(radius) };
}

export function pizzaPose(distance: number, step: number, focusStep: number) {
  const near = Math.max(-1, Math.min(1, distance));
  const focus = 1 - smoothstep(Math.abs(distance));
  return {
    x: distance * step + near * (focusStep - step),
    scale: sideScale + (1 - sideScale) * focus,
    opacity: 0.7 + 0.3 * focus,
  };
}

export function seek(m: Motion, to: number, immediate = false) {
  if (immediate || Math.abs(to - m.position) < 0.0001) { m.position = to; m.target = null; }
  else m.target = { from: m.position, to, elapsed: 0, duration: Math.min(1.05, 0.48 + Math.abs(to - m.position) * 0.13) };
}

export function advance(m: Motion, dt: number) {
  if (!m.target) return false;
  const t = m.target;
  t.elapsed += dt;
  const x = Math.min(1, t.elapsed / t.duration);
  const ease = x * x * x * (x * (x * 6 - 15) + 10);
  m.position = t.from + (t.to - t.from) * ease;
  if (x === 1) { m.position = t.to; m.target = null; }
  return !!m.target;
}
