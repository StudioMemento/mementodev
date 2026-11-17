import { SIDE_SQUARES as preset } from "./preset";

export type Square = {
  x: number;
  y: number;
  size: number;
  peak: number;
  phase: number;
  rate: number;
};

/** Deterministic fields avoid random flashes on remount and on resize. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

export function createSquares(width: number, height: number, seed: number) {
  const spread = Math.min(width, preset.maxFieldWidth);
  // Sample the density curve directly. Generation and drawing stay bounded even
  // on an 8K monitor; there is no viewport-scaled grid or per-frame randomness.
  const count = Math.min(preset.maxSquaresPerSide,
    Math.floor(spread * height / (preset.spacing ** 2 * (preset.falloff + 1))));
  const chance = random(seed);
  const squares: Square[] = [];
  for (let i = 0; i < count; i++) {
    // Inverse CDF of (1 - x)^falloff: denser at the outside, sparse at the menu.
    const distance = 1 - (1 - chance()) ** (1 / (preset.falloff + 1));
    const size = Math.min(width, height,
      preset.minSize + (preset.maxSize - preset.minSize) * chance() ** 2);
    const innerFade = 1 - smoothstep((distance - preset.fadeStart) / (1 - preset.fadeStart));
    squares.push({
      x: distance * (spread - size),
      y: chance() * (height - size),
      size,
      peak: (preset.minPeak + (preset.maxPeak - preset.minPeak) * chance() ** 1.5) * innerFade,
      phase: chance() * Math.PI * 2,
      rate: Math.PI * 2 / (preset.minCycle + (preset.maxCycle - preset.minCycle) * chance()),
    });
  }
  return squares;
}

export function brightness(square: Square, seconds: number) {
  const wave = 0.5 + 0.5 * Math.sin(square.phase + seconds * square.rate);
  return square.peak * wave;
}

export function pixelRatio(width: number, height: number, deviceRatio: number) {
  return Math.min(deviceRatio || 1, preset.maxDpr, Math.sqrt(preset.maxPixels / (2 * width * height)));
}

/** Pixel-aligned geometry and reusable opacity buckets; no per-frame allocation. */
export function createPainter(context: CanvasRenderingContext2D, squares: Square[], width: number, height: number, mirrored: boolean, scaleX = 1, scaleY = scaleX) {
  const pixelsWide = Math.max(1, Math.round(width * scaleX));
  const pixelsHigh = Math.max(1, Math.round(height * scaleY));
  // Round once to backing pixels: a fine dot stays crisp instead of spreading
  // its light over four dim pixels. Only opacity changes during animation.
  const rectangles = squares.map(square => {
    const w = Math.min(pixelsWide, Math.max(1, Math.round(square.size * scaleX)));
    const h = Math.min(pixelsHigh, Math.max(1, Math.round(square.size * scaleY)));
    const fromEdge = Math.round(square.x * scaleX);
    return {
      x: Math.max(0, Math.min(pixelsWide - w, mirrored ? pixelsWide - fromEdge - w : fromEdge)),
      y: Math.max(0, Math.min(pixelsHigh - h, Math.round(square.y * scaleY))),
      w, h,
    };
  });
  const counts = new Uint16Array(32);
  const indices = new Uint16Array(32 * squares.length);
  // Geometry is already in physical pixels. No fractional transform at paint time.
  context.setTransform(1, 0, 0, 1, 0, 0);
  return (seconds: number) => {
    context.clearRect(0, 0, pixelsWide, pixelsHigh);
    counts.fill(0);
    for (let i = 0; i < squares.length; i++) {
      const level = Math.round(brightness(squares[i], seconds) * 31);
      if (level) indices[level * squares.length + counts[level]++] = i;
    }
    context.fillStyle = preset.squareColor;
    for (let level = 1; level < counts.length; level++) {
      if (!counts[level]) continue;
      context.globalAlpha = level / 31;
      context.beginPath();
      for (let n = 0; n < counts[level]; n++) {
        const rect = rectangles[indices[level * squares.length + n]];
        context.rect(rect.x, rect.y, rect.w, rect.h);
      }
      context.fill();
    }
    context.globalAlpha = 1;
  };
}
