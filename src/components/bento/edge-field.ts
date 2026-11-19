type Mote = {
  distance: number; y: number; phase: number; orbit: number;
  rise: number; radius: number; opacity: number;
};
type Band = {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;
  motes: Mote[];
};

function makeMotes(count: number, seed: number): Mote[] {
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: count }, (_, i) => ({
    // A few cross the content margin. The rest cluster against the glass edge.
    distance: i % 31 === 30 ? 1 + random() : Math.pow(random(), 2.25),
    y: random(), phase: random() * Math.PI * 2, orbit: .16 + random() * .2,
    rise: 3 + random() * 7, radius: .65 + random() * .8, opacity: .33 + random() * .44,
  }));
}

export function mountEdgeField(view: HTMLElement) {
  const region = view.closest<HTMLElement>(".final-sections")!;
  const bands: Band[] = [];
  for (const canvas of view.querySelectorAll("canvas")) {
    const ctx = canvas.getContext("2d");
    if (ctx) bands.push({ canvas, ctx, motes: [] });
  }
  if (bands.length !== 2) return () => {};
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const passive = { signal: events.signal, passive: true };
  let height = 0, width = 0, span = 0, gutter = 0;
  let elapsed = 0, last = 0, frame = 0, visible = false;
  let pointerX = -1000, pointerY = -1000, strength = 0, target = 0;

  function resize() {
    width = view.clientWidth; height = view.clientHeight;
    span = bands[0].canvas.clientWidth;
    gutter = (width - region.querySelector<HTMLElement>(".spread-title")!.offsetWidth) / 2;
    // Bound the backing stores even on a high-DPI ultrawide display.
    const dpr = Math.min(devicePixelRatio, 1.5, Math.sqrt(540000 / Math.max(1, span * height)));
    const count = Math.min(220, Math.max(36, Math.round(span * height / 1350)));
    bands.forEach((band, index) => {
      const { canvas, ctx } = band;
      canvas.width = Math.max(1, Math.round(span * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(index ? -dpr : dpr, 0, 0, dpr, index ? canvas.width : 0, 0);
      band.motes = makeMotes(count, 331 + index * 5251);
    });
    if (visible) paint();
  }

  function paint() {
    bands.forEach(({ ctx, motes }, side) => {
      ctx.clearRect(0, 0, span, height);
      ctx.fillStyle = "#e3c88b";
      const px = side ? width - pointerX : pointerX;
      const reach = Math.min(125, Math.max(60, gutter * .6));
      for (const mote of motes) {
        const base = mote.distance < 1 ? gutter * mote.distance : gutter + (span - gutter) * (mote.distance - 1);
        const angle = mote.phase + elapsed * mote.orbit;
        const swing = Math.min(12, 2 + gutter * .05);
        let x = base + Math.sin(angle) * swing;
        const period = height + 24;
        let y = ((mote.y * period - elapsed * mote.rise) % period + period) % period - 12 + Math.cos(angle) * swing * .65;
        if (strength > .005 && Math.abs(x - px) < reach && Math.abs(y - pointerY) < reach) {
          const dx = x - px, dy = y - pointerY;
          const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
          const force = proximity * proximity * strength * .52;
          x += (dx - .78 * dy) * force;
          y += (dy + .78 * dx) * force;
        }
        const fade = Math.max(0, Math.min(1, (y + 3) / 16, (height + 3 - y) / 16));
        ctx.globalAlpha = fade * mote.opacity * (1 - Math.min(1, base / gutter) * .43);
        ctx.beginPath(); ctx.arc(x, y, mote.radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  function animate(now: number) {
    const step = (now - last) / 1000;
    if (!last || step >= 1 / 30 - .001) {
      const dt = last ? Math.min(step, .1) : 0;
      last = now; elapsed += dt;
      strength += (target - strength) * (1 - Math.exp(-dt * 8));
      paint();
    }
    frame = requestAnimationFrame(animate);
  }
  function refresh() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!visible || document.hidden || view.hasAttribute("data-obscured")) return;
    if (motion.matches) { strength = target = 0; paint(); }
    else frame = requestAnimationFrame(animate);
  }
  function point(event: PointerEvent) {
    if (motion.matches || !event.isPrimary) return;
    const rect = view.getBoundingClientRect();
    pointerX = event.clientX - rect.left; pointerY = event.clientY - rect.top; target = 1;
  }
  function release() { target = 0; }
  region.addEventListener("pointermove", point, passive);
  region.addEventListener("pointerdown", point, passive);
  region.addEventListener("pointerleave", release, passive);
  region.addEventListener("pointercancel", release, passive);
  region.addEventListener("pointerup", e => { if (e.pointerType !== "mouse") release(); }, passive);
  document.addEventListener("visibilitychange", refresh, passive);
  view.addEventListener("fieldvisibility", refresh, passive);
  motion.addEventListener("change", refresh, passive);
  const bounds = new ResizeObserver(resize);
  bounds.observe(view);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
  resize(); visibility.observe(view);
  return () => {
    events.abort(); bounds.disconnect(); visibility.disconnect(); cancelAnimationFrame(frame);
  };
}
