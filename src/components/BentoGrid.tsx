import { useEffect, useRef, type ReactNode } from "react";
import { Chevron } from "./Icon";

export function TileArrow() {
  return <span className="tile-arrow" aria-hidden="true"><Chevron direction="right" /></span>;
}

export function BentoGrid({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      void import("./bento/particles").then(({ bindParticles }) => {
        if (!disposed) cleanup = bindParticles(grid);
      }).catch(() => { /* Links and CSS feedback work without animation. */ });
    }, { rootMargin: "360px 0px" });
    near.observe(grid);
    return () => { disposed = true; near.disconnect(); cleanup?.(); };
  }, []);
  return <div ref={ref} className={`bento-grid ${className}`}>{children}</div>;
}
