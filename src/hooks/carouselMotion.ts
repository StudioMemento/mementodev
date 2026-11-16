/** Time-based motion in slide units. Free movement never quantizes position. */
export type Motion = { position: number; velocity: number; target: null | { from: number; to: number; elapsed: number; duration: number } };
export const createMotion = (): Motion => ({ position: 0, velocity: 0, target: null });
export const loopDistance = (item: number, position: number, count: number) => ((item - position + count / 2) % count + count) % count - count / 2;
export const smoothstep = (n: number) => { const x = Math.max(0, Math.min(1, n)); return x * x * (3 - 2 * x); };
export const captionOpacity = (distance: number) => smoothstep((0.5 - Math.abs(distance)) / 0.3);
export function seek(m: Motion, to: number, immediate = false) {
  m.velocity = 0;
  if (immediate) { m.position = to; m.target = null; }
  else m.target = { from: m.position, to, elapsed: 0, duration: Math.min(1.3, 0.8 + Math.abs(to - m.position) * 0.1) };
}
export function advance(m: Motion, dt: number, autoVelocity: number) {
  if (m.target) {
    const t = m.target;
    t.elapsed += dt;
    const x = Math.min(1, t.elapsed / t.duration);
    const ease = x * x * x * (x * (x * 6 - 15) + 10);
    m.position = t.from + (t.to - t.from) * ease;
    if (x === 1) m.target = null;
  } else {
    // Exact exponential integration keeps friction consistent at 60/90/120 Hz.
    const tau = autoVelocity ? 0.65 : 0.3, decay = Math.exp(-dt / tau);
    m.position += autoVelocity * dt + (m.velocity - autoVelocity) * tau * (1 - decay);
    m.velocity = autoVelocity + (m.velocity - autoVelocity) * decay;
    if (!autoVelocity && Math.abs(m.velocity) < 0.0001) m.velocity = 0;
  }
  return !!m.target || Math.abs(m.velocity) > 0 || autoVelocity !== 0;
}
