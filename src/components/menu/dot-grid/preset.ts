/** React Bits Background Studio preset, with bounds for this long menu. */
export const DOT_GRID = Object.freeze({
  baseColor: "#252524", activeColor: "#a89b7b", dotSize: 2, gap: 48,
  proximity: 180, strength: 1, bounce: .5, tension: .5, returnDuration: 1.5,
  shockRadius: 80, shockStrength: 0, clickShock: false, swell: 0,
  stretch: 2, glow: .5, fade: .5, intro: false,
  maxDots: 2400, maxPixels: 3_000_000, maxDpr: 1.5,
  desktopFps: 60, mobileFps: 30,
});

export function gridLayout(width: number, height: number, deviceRatio: number) {
  const cell = Math.max(DOT_GRID.dotSize + DOT_GRID.gap, Math.ceil(Math.sqrt((width + DOT_GRID.gap) * (height + DOT_GRID.gap) / DOT_GRID.maxDots)));
  const cols = Math.max(1, Math.floor((width + DOT_GRID.gap) / cell));
  const rows = Math.max(1, Math.floor((height + DOT_GRID.gap) / cell));
  return { width, height, cell, cols, rows, count: cols * rows,
    startX: (width - (cols - 1) * cell) / 2, startY: (height - (rows - 1) * cell) / 2,
    ratio: Math.min(deviceRatio || 1, DOT_GRID.maxDpr, Math.sqrt(DOT_GRID.maxPixels / (width * height))),
  };
}
