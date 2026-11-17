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
  // Sample the density curve directly. Generation and drawing stay bounded even
  // on an 8K monitor; there is no viewport-scaled grid or per-frame randomness.
  const count = Math.min(preset.maxSquaresPerSide,
    Math.floor(width * height / (preset.spacing ** 2 * (preset.falloff + 1))));
  const chance = random(seed);
  const squares: Square[] = [];
  for (let i = 0; i < count; i++) {
    // Inverse CDF of (1 - x)^falloff: denser at the outside, sparse at the menu.
    const distance = 1 - (1 - chance()) ** (1 / (preset.falloff + 1));
    const size = Math.min(width, height,
      preset.minSize + (preset.maxSize - preset.minSize) * chance() ** 2);
    const innerFade = 1 - smoothstep((distance - preset.fadeStart) / (1 - preset.fadeStart));
    squares.push({
      x: distance * (width - size),
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
  return square.peak * wave * wave;
}

export function pixelRatio(width: number, height: number, deviceRatio: number) {
  return Math.min(deviceRatio || 1, preset.maxDpr, Math.sqrt(preset.maxPixels / (2 * width * height)));
}

/** Reuse typed buckets: at most 31 fills per side, no allocations while animating. */
export function createPainter(context: CanvasRenderingContext2D, squares: Square[], width: number, height: number, mirrored: boolean) {
  const counts = new Uint16Array(preset.alphaLevels);
  const indices = new Uint16Array(preset.alphaLevels * squares.length);
  return (seconds: number) => {
    context.clearRect(0, 0, width, height);
    counts.fill(0);
    for (let i = 0; i < squares.length; i++) {
      const level = Math.round(brightness(squares[i], seconds) * (preset.alphaLevels - 1));
      if (level) indices[level * squares.length + counts[level]++] = i;
    }
    context.fillStyle = preset.squareColor;
    for (let level = 1; level < counts.length; level++) {
      if (!counts[level]) continue;
      context.globalAlpha = level / (preset.alphaLevels - 1);
      context.beginPath();
      for (let n = 0; n < counts[level]; n++) {
        const square = squares[indices[level * squares.length + n]];
        const x = mirrored ? width - square.x - square.size : square.x;
        context.rect(x, square.y, square.size, square.size);
      }
      context.fill();
    }
    context.globalAlpha = 1;
  };
}
