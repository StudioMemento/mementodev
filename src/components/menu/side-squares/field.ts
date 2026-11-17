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

export function createSquares(width: number, height: number, viewportWidth: number, seed: number) {
  const cell = Math.max(4, Math.max(viewportWidth, height) / preset.gridSize);
  const size = cell * preset.squareSize;
  const columns = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const chance = random(seed);
  const squares: Square[] = [];
  let candidates = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const distance = (col + 0.5) * cell / width;
      const density = (1 - distance) ** preset.falloff;
      if (chance() > density) continue;
      const innerFade = 1 - smoothstep((distance - preset.fadeStart) / (1 - preset.fadeStart));
      const square = {
        x: col * cell + (cell - size) / 2,
        y: row * cell + (cell - size) / 2,
        size,
        peak: (0.15 + chance() * 0.85) * innerFade,
        phase: chance() * Math.PI * 2,
        rate: Math.PI * 2 * preset.twinkleSpeed * (0.65 + chance() * 0.35),
      };
      candidates++;
      if (squares.length < preset.maxSquaresPerSide) squares.push(square);
      else {
        // Reservoir sampling retains an even spatial distribution at extreme sizes.
        const replace = Math.floor(chance() * candidates);
        if (replace < squares.length) squares[replace] = square;
      }
    }
  }
  return squares;
}

export function brightness(square: Square, seconds: number) {
  const wave = 0.5 + 0.5 * Math.sin(square.phase + seconds * square.rate);
  const twinkle = preset.minBrightness + (1 - preset.minBrightness) * wave * wave;
  return square.peak * (1 - preset.twinkleStrength + preset.twinkleStrength * twinkle);
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
