import {
  useRef,
  type PointerEvent,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
/** Preserve vertical touch scrolling. Capture only after horizontal intent is clear. */
export function useDrag(onStep: (direction: number) => void) {
  const state = useRef<{
    id: number;
    x: number;
    y: number;
    dx: number;
    active: boolean;
  } | null>(null);
  const suppress = useRef(false);
  const reset = (element: HTMLElement) => {
    element.style.removeProperty("--drag-x");
    element.classList.remove("is-dragging");
    state.current = null;
  };
  return {
    onPointerDown(e: PointerEvent<HTMLElement>) {
      if (
        e.button !== 0 ||
        (e.target instanceof Element && e.target.closest("[data-no-drag]"))
      )
        return;
      suppress.current = false;
      state.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        dx: 0,
        active: false,
      };
    },
    onPointerMove(e: PointerEvent<HTMLElement>) {
      const s = state.current;
      if (!s || s.id !== e.pointerId) return;
      const dx = e.clientX - s.x,
        dy = e.clientY - s.y;
      if (!s.active && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        reset(e.currentTarget);
        return;
      }
      if (!s.active && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        s.active = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.classList.add("is-dragging");
      }
      s.dx = dx;
      if (s.active)
        e.currentTarget.style.setProperty(
          "--drag-x",
          `${Math.max(-75, Math.min(75, dx * 0.25))}px`,
        );
    },
    onPointerUp(e: PointerEvent<HTMLElement>) {
      const s = state.current;
      if (!s) return;
      if (s.active) {
        suppress.current = true;
        if (Math.abs(s.dx) > 30) onStep(s.dx > 0 ? -1 : 1);
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }
      reset(e.currentTarget);
    },
    onPointerCancel(e: PointerEvent<HTMLElement>) {
      reset(e.currentTarget);
    },
    onClickCapture(e: MouseEvent<HTMLElement>) {
      if (suppress.current) {
        e.preventDefault();
        e.stopPropagation();
        suppress.current = false;
      }
    },
    onKeyDown(e: KeyboardEvent<HTMLElement>) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        onStep(e.key === "ArrowLeft" ? -1 : 1);
      }
    },
  };
}
export const wrap = (index: number, count: number) =>
  ((index % count) + count) % count;
