import { useEffect, useRef } from "react";
import { useDialog } from "../DialogContext";
import type { GridController } from "./dot-grid/controller";

/** The menu remains usable without this optional, deferred background. */
export function MenuDotGrid() {
  const viewport = useRef<HTMLDivElement>(null);
  const engine = useRef<GridController | null>(null);
  const { modal } = useDialog();
  const paused = useRef(!!modal);
  paused.current = !!modal;

  useEffect(() => {
    const layer = viewport.current;
    const section = layer?.parentElement?.parentElement;
    if (!layer || !section) return;
    let disposed = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void import("./dot-grid/controller").then(({ mountDotGrid }) => {
        if (!disposed) engine.current = mountDotGrid(section, layer, paused.current);
      }).catch(() => { /* Keep the static CSS grid if this optional chunk fails. */ });
    }, { rootMargin: "200px" });
    observer.observe(section);
    return () => { disposed = true; observer.disconnect(); engine.current?.dispose(); engine.current = null; };
  }, []);

  useEffect(() => { engine.current?.setPaused(!!modal); }, [modal]);

  return <div className="menu-dot-grid" aria-hidden="true">
    <div className="menu-dot-viewport" ref={viewport}><canvas /></div>
  </div>;
}
