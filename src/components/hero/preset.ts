/** ViaRoma_1_HERO: all motion/color controls in one place. */
export const HERO_PRESET = {
  glimmer: {
    colors: ["#FFE3A3", "#FFB27A"],
    count: 1500, mobileCount: 750, size: 0.4, sizeVariance: 1,
    spread: 0.75, hollow: 0.5, speed: 0.25, turbulence: 0.25,
    twinkle: 1, focus: 0.5, aperture: 1, glintSize: 2.5, boost: 14,
    // No trail, parallax, waves, intro, or background tint.
  },
  liquid: { density: 2.6, softness: 1, distortion: 0.22, angle: 70, speed: 1,
    // Chromatic dispersion / edge bending intentionally zero: preserve the mark.
    minimumGrey: 0.62, maximumWhite: 1, pointerInfluence: 0.08 },
  desktopFps: 40, mobileFps: 30, maxPixelRatio: 1.5,
} as const;
