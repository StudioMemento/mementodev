/** Canvas 2D fallback for browsers without WebGL2. Same spacing and pointer radius. */
type Settings = { dotSize: number; gap: number; baseColor: string; proximity: number; strength: number;
  returnDuration: number; swell: number; fade: number; opacity: number; paused: boolean; mouseInteraction: boolean; dpr?: number };
export function dotFallback(canvas: HTMLCanvasElement, settings: { current: Settings }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { rebuild() {}, refresh() {}, destroy() {} };
  canvas.dataset.renderer = 'canvas2d';
  let width = 0, height = 0, ratio = 1, raf = 0, last = 0, visible = true;
  let points: { x: number; y: number; dx: number; dy: number; energy: number }[] = [];
  const pointer = { x: -9999, y: -9999, inside: false };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const draw = (now: number) => {
    raf = 0;
    const s = settings.current, dt = Math.min((now - (last || now - 16)) / 1000, .05);
    last = now;
    const interactive = !s.paused && s.mouseInteraction && !reduced.matches && !document.hidden && visible;
    const easing = 1 - Math.exp(-dt * 5 / Math.max(.2, s.returnDuration));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = s.baseColor;
    let busy = false;
    for (const p of points) {
      const dx = p.x - pointer.x, dy = p.y - pointer.y, distance = Math.hypot(dx, dy);
      const proximity = interactive && pointer.inside ? Math.max(0, 1 - distance / s.proximity) : 0;
      const energy = proximity * proximity;
      const push = energy * s.strength * 44;
      const tx = dx / Math.max(1, distance) * push, ty = dy / Math.max(1, distance) * push;
      p.dx += (tx - p.dx) * easing; p.dy += (ty - p.dy) * easing; p.energy += (energy - p.energy) * easing;
      if (reduced.matches) { p.dx = 0; p.dy = 0; p.energy = 0; }
      busy ||= Math.abs(tx - p.dx) + Math.abs(ty - p.dy) + Math.abs(energy - p.energy) > .002;
      ctx.globalAlpha = s.opacity * (1 - s.fade * (1 - p.energy));
      ctx.beginPath(); ctx.arc(p.x + p.dx, p.y + p.dy, s.dotSize * .5 * (1 + p.energy * s.swell), 0, Math.PI * 2); ctx.fill();
    }
    if (busy && interactive) raf = requestAnimationFrame(draw);
    else last = 0;
  };
  const refresh = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw); };
  const rebuild = () => {
    const rect = canvas.getBoundingClientRect(), s = settings.current;
    width = rect.width; height = rect.height; ratio = Math.min(s.dpr || 1.5, devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const cell = s.dotSize + s.gap, cols = Math.max(1, Math.floor((width + s.gap) / cell)), rows = Math.max(1, Math.floor((height + s.gap) / cell));
    const startX = (width - (cols * cell - s.gap)) / 2 + s.dotSize / 2, startY = (height - (rows * cell - s.gap)) / 2 + s.dotSize / 2;
    points = Array.from({ length: cols * rows }, (_, i) => ({ x: startX + i % cols * cell, y: startY + Math.floor(i / cols) * cell, dx: 0, dy: 0, energy: 0 }));
    refresh();
  };
  const move = (event: PointerEvent) => {
    if (settings.current.paused) return;
    const r = canvas.getBoundingClientRect(); pointer.x = event.clientX - r.left; pointer.y = event.clientY - r.top;
    pointer.inside = pointer.x >= 0 && pointer.x <= r.width && pointer.y >= 0 && pointer.y <= r.height; refresh();
  };
  const leave = () => { pointer.inside = false; refresh(); };
  const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else refresh(); };
  const resize = new ResizeObserver(rebuild); resize.observe(canvas);
  const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) refresh(); else { cancelAnimationFrame(raf); raf = 0; last = 0; } }); observer.observe(canvas);
  window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerup', leave, { passive: true });
  document.addEventListener('pointerleave', leave); document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', refresh);
  rebuild();
  return { rebuild, refresh, destroy() { cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', leave); document.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', refresh); } };
}
