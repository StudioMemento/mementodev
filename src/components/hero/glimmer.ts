import { HERO_PRESET } from "./preset";

export type HeroGeometry = { width: number; height: number; x: number; y: number; logoWidth: number };

/** Lightweight original implementation inspired by the supplied Glimmer Wrap
 * reference. Reusable sprites, deterministic seeds, no trails or full-screen blur. */
export function createGlimmer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;
  const p = HERO_PRESET.glimmer;
  let seed = 23451;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const points = Array.from({ length: p.count }, () => ({
    angle: random() * Math.PI * 2, radius: random(), phase: random() * Math.PI * 2,
    size: 0.5 + random() * p.sizeVariance, depth: random(), color: random() > 0.55 ? 1 : 0,
  }));
  const sprites = p.colors.map(color => {
    const sprite = document.createElement("canvas"); sprite.width = sprite.height = 32;
    const context = sprite.getContext("2d")!;
    const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, color); glow.addColorStop(0.18, color + "a6"); glow.addColorStop(0.55, color + "29"); glow.addColorStop(1, color + "00");
    context.fillStyle = glow; context.fillRect(0, 0, 32, 32); return sprite;
  });
  let g: HeroGeometry = { width: 1, height: 1, x: 0, y: 0, logoWidth: 1 };
  let count = p.count as number;
  let hollow = 1;
  const resize = (next: HeroGeometry) => {
    g = next;
    const dpr = Math.min(window.devicePixelRatio || 1, HERO_PRESET.maxPixelRatio);
    canvas.width = Math.round(g.width * dpr); canvas.height = Math.round(g.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    count = g.width < 768 ? p.mobileCount : p.count;
    // Original transparent PNG has a visible mark ~68.6% of its square.
    // The inner clear radius follows that real logo, rather than viewport center.
    hollow = g.logoWidth * (0.343 + p.hollow * 0.12);
    canvas.dataset.centerX = g.x.toFixed(2); canvas.dataset.centerY = g.y.toFixed(2);
    canvas.dataset.hollowRadius = hollow.toFixed(2);
  };
  const draw = (seconds: number) => {
    ctx.clearRect(0, 0, g.width, g.height);
    const reach = Math.hypot(Math.max(g.x, g.width - g.x), Math.max(g.y, g.height - g.y));
    for (let i = 0; i < count; i++) {
      const dot = points[i];
      const phase = (dot.radius + seconds * p.speed * 0.018) % 1;
      const radius = hollow + 8 + Math.pow(phase, 0.72) * reach * p.spread;
      const angle = dot.angle + Math.sin(seconds * 0.13 + dot.phase) * 0.014 * p.turbulence;
      const x = g.x + Math.cos(angle) * radius * 1.12;
      const y = g.y + Math.sin(angle) * radius;
      if (x < -5 || x > g.width + 5 || y < -5 || y > g.height + 5) continue;
      const edgeFade = Math.min(1, phase * 16) * Math.min(1, (1 - phase) * 8);
      const bottomFade = Math.max(0, Math.min(1, (g.height - y) / (g.height * 0.26)));
      const twinkle = 0.62 + 0.38 * Math.sin(seconds * (0.5 + dot.depth) * p.twinkle + dot.phase);
      const alpha = (0.16 + dot.depth * 0.45) * twinkle * edgeFade * bottomFade * (p.boost / 14);
      const size = p.size * dot.size * (0.9 + dot.depth);
      ctx.globalAlpha = alpha;
      const defocus = Math.abs(dot.depth - p.focus) * p.aperture;
      if (defocus > 0.33) {
        const softSize = p.glintSize + (defocus - 0.33) * 25;
        ctx.drawImage(sprites[dot.color], x - softSize / 2, y - softSize / 2, softSize, softSize);
      } else {
        ctx.fillStyle = p.colors[dot.color];
        ctx.fillRect(x, y, Math.max(0.65, size), Math.max(0.65, size));
      }
    }
    ctx.globalAlpha = 1;
  };
  return { resize, draw };
}
