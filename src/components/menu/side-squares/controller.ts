import { SIDE_SQUARES as preset } from "./preset";
import { createSquares, createPainter, pixelRatio } from "./field";

export interface SideSquaresController {
  setPaused(value: boolean): void;
  dispose(): void;
  stats(): { frames: number; squares: number; pixels: number; state: string };
}

/** Two small Canvas 2D surfaces share one clock; there is no surface behind the text. */
export function mountSideSquares(section: HTMLElement, viewport: HTMLElement, initiallyPaused = false): SideSquaresController {
  const canvases = Array.from(viewport.querySelectorAll("canvas"));
  const contexts = canvases.map(canvas => canvas.getContext("2d"));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const failed = contexts.some(context => !context) || canvases.length !== 2;
  let painters: Array<(seconds: number) => void> = [];
  let visible = false, paused = initiallyPaused, disposed = false;
  let frame = 0, measureFrame = 0, last = 0, seconds = 0;
  let frames = 0, squares = 0, state = "paused";
  let width = 0, height = 0, ratio = 0;

  const eligible = () => !disposed && !failed && visible && !paused && !document.hidden;
  const setState = (next: string) => {
    if (state !== next) { state = next; viewport.dataset.state = next; }
  };
  const paint = () => {
    for (const draw of painters) draw(seconds);
    frames++;
  };
  const animate = (now: number) => {
    frame = 0;
    if (!eligible() || reduced.matches) return;
    if (!last || now - last >= 1000 / preset.fps - 0.5) {
      if (last) seconds += Math.min(0.1, (now - last) / 1000);
      last = now;
      paint();
    }
    frame = requestAnimationFrame(animate);
  };
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!eligible()) { setState(failed ? "unavailable" : "paused"); return; }
    if (reduced.matches) { paint(); setState("static"); }
    else { frame = requestAnimationFrame(animate); setState("running"); }
  };
  const measure = () => {
    measureFrame = 0;
    if (disposed || failed) return;
    const nextWidth = Math.max(1, canvases[0].clientWidth);
    const nextHeight = Math.max(1, viewport.clientHeight);
    const nextRatio = pixelRatio(nextWidth, nextHeight, window.devicePixelRatio);
    if (width === nextWidth && height === nextHeight && ratio === nextRatio) return;
    width = nextWidth; height = nextHeight; ratio = nextRatio;
    squares = 0;
    painters = contexts.map((context, index) => {
      const canvas = canvases[index];
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      const field = createSquares(width, height, 120 + index * 913);
      squares += field.length;
      // Pass actual backing dimensions so fine grain lands on whole pixels.
      return createPainter(context!, field, width, height, index === 1, canvas.width / width, canvas.height / height);
    });
    sync();
  };
  const queueMeasure = () => {
    if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure);
  };
  const resize = new ResizeObserver(queueMeasure);
  resize.observe(viewport);
  const visibility = new IntersectionObserver(([entry]) => {
    const next = entry.isIntersecting;
    if (next !== visible) { visible = next; sync(); }
  });
  visibility.observe(section);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", queueMeasure, { passive: true });
  reduced.addEventListener("change", sync);
  measure();
  if (failed) setState("unavailable");

  return {
    setPaused(value) { if (paused !== value) { paused = value; sync(); } },
    stats: () => ({ frames, squares, pixels: canvases.reduce((sum, canvas) => sum + canvas.width * canvas.height, 0), state }),
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame);
      resize.disconnect(); visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", queueMeasure);
      reduced.removeEventListener("change", sync);
      painters = [];
      for (const canvas of canvases) canvas.width = canvas.height = 1;
    },
  };
}
