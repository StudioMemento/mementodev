import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

/** One light follows the pointer across the grid. Batch all geometry reads before painting. */
export function BentoGrid({ children, className }: { children: ReactNode; className: string }) {
  const grid = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function illuminate(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      if (!grid.current) return;
      const cells = Array.from(grid.current.children) as HTMLElement[];
      const rects = cells.map(cell => cell.getBoundingClientRect());
      for (let i = 0; i < cells.length; i++) {
        cells[i].style.setProperty("--light-x", `${pointer.current.x - rects[i].left}px`);
        cells[i].style.setProperty("--light-y", `${pointer.current.y - rects[i].top}px`);
      }
      grid.current.dataset.lit = "true";
    });
  }
  function leave() {
    cancelAnimationFrame(frame.current); frame.current = 0;
    if (grid.current) delete grid.current.dataset.lit;
  }
  return <div ref={grid} className={`bento-grid ${className}`} onPointerMove={illuminate} onPointerLeave={leave}>{children}</div>;
}
