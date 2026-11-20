import { useRef, type ReactNode } from "react";
import { useHoloTilt, type CardEffect } from "./useHoloTilt";

export function HoloCard({ children, effect = "tilt" }: { children: ReactNode; effect?: CardEffect }) {
  const shell = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLElement>(null);
  useHoloTilt(shell, face, effect);
  return <div className="crust-card-shell" data-effect={effect} ref={shell}>
    <article className="crust-card" ref={face}>{children}</article>
  </div>;
}
