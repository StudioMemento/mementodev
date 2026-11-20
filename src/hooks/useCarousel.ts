import { useCallback, useEffect, useLayoutEffect, useRef, useState, type DragEvent, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { useDialog } from "../components/DialogContext";
import { advance, captionOpacity, carouselWindow, createMotion, loopDistance, pizzaPose, seek } from "./carouselMotion";
import { wrap } from "./useDrag";

/** One RAF, only while visible and moving. No layout reads in the frame loop. */
export function useCarousel(count: number, language: string) {
  const rootRef = useRef<HTMLElement>(null), stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [renderCount, setRenderCount] = useState(count);
  const [preload, setPreload] = useState(1);
  const { modal } = useDialog();
  const model = useRef(createMotion());
  const state = useRef({ visible: false, hovered: false, focused: false, reduced: false, modal: false, step: 220, focusStep: 300, radius: 3, index: 0, frame: 0, last: 0 });
  const pointer = useRef<{ id: number; x: number; y: number; start: number; active: boolean; lastX: number; time: number; velocity: number } | null>(null);
  const wake = useRef<() => void>(() => {}), paint = useRef<() => void>(() => {});
  const select = useCallback((logical: number) => {
    const m = model.current;
    seek(m, m.position + loopDistance(logical, m.position, count), state.current.reduced);
    paint.current(); wake.current();
  }, [count]);
  const move = useCallback((amount: number) => {
    const m = model.current;
    seek(m, Math.round(m.target?.to ?? m.position) + amount, state.current.reduced);
    paint.current(); wake.current();
  }, []);
  useLayoutEffect(() => {
    const root = rootRef.current, stage = stageRef.current;
    if (!root || !stage) return;
    const s = state.current, m = model.current;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-carousel-card]"));
    const captions = Array.from(root.querySelectorAll<HTMLElement>(".pizza-caption"));
    let lastCaption = -1;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, timer = 0;
    const render = () => {
      const selectedSlot = wrap(Math.round(m.position), cards.length);
      cards.forEach((card, i) => {
        const d = loopDistance(i, m.position, cards.length), visible = Math.abs(d) < s.radius;
        const visibility = visible ? "visible" : "hidden";
        if (card.style.visibility !== visibility) card.style.visibility = visibility;
        if (visible) {
          const pose = pizzaPose(d, s.step, s.focusStep);
          card.style.transform = `translate3d(calc(-50% + ${pose.x.toFixed(3)}px),0,0) scale(${pose.scale.toFixed(4)})`;
          card.style.opacity = pose.opacity.toFixed(3);
        }
        const active = i === selectedSlot;
        if (card.dataset.active !== String(active)) { card.dataset.active = String(active); card.ariaHidden = String(!active); }
      });
      const next = wrap(Math.round(m.position), count);
      // The fade occupies less than half a slide on either side of the center.
      if (lastCaption !== next) {
        if (lastCaption >= 0) captions[lastCaption].style.opacity = "0";
        else captions.forEach(caption => { caption.style.opacity = "0"; });
        lastCaption = next;
      }
      // Even a drag that stops halfway leaves the selected recipe legible.
      const fade = captionOpacity(loopDistance(next, m.position, count));
      captions[next].style.opacity = (0.82 + 0.18 * fade).toFixed(4);
      if (next !== s.index) { s.index = next; setIndex(next); }
    };
    const eligible = () => s.visible && !document.hidden && !s.modal;
    const autoplay = () => !s.reduced && !s.hovered && !s.focused && !pointer.current;
    const tick = (now: number) => {
      s.frame = 0;
      if (!eligible()) return;
      const dt = Math.min(0.05, Math.max(0, (now - (s.last || now)) / 1000));
      s.last = now;
      const moving = !pointer.current && advance(m, dt);
      render();
      if (moving) s.frame = requestAnimationFrame(tick);
      else {
        s.last = 0;
        if (autoplay()) timer = window.setTimeout(() => {
          if (!eligible() || !autoplay()) return;
          seek(m, Math.round(m.position) + 1);
          start();
        }, 5000);
      }
    };
    function start() {
      clearTimeout(timer); timer = 0;
      if (disposed || !eligible() || s.frame) return;
      s.frame = requestAnimationFrame(tick);
    }
    const stop = () => { cancelAnimationFrame(s.frame); clearTimeout(timer); s.frame = 0; s.last = 0; };
    const resize = () => {
      const cardWidth = cards[0]?.offsetWidth || 300;
      const layout = carouselWindow(stage.getBoundingClientRect().width, cardWidth, count);
      s.step = layout.step; s.focusStep = layout.focusStep; s.radius = layout.radius;
      setPreload(layout.preload);
      setRenderCount(layout.renderCount);
      render();
    };
    const visibility = () => { stop(); if (eligible()) start(); };
    const motion = () => { s.reduced = media.matches; if (s.reduced) { seek(m, Math.round(m.target?.to ?? m.position), true); render(); } visibility(); };
    const io = new IntersectionObserver(entries => { s.visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.3; visibility(); }, { threshold: [0, 0.3] });
    const ro = new ResizeObserver(resize);
    io.observe(stage); ro.observe(stage); if (cards[0]) ro.observe(cards[0]);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    s.reduced = media.matches;
    paint.current = render;
    wake.current = () => { if (!eligible()) stop(); else start(); };
    resize();
    return () => {
      disposed = true; stop(); io.disconnect(); ro.disconnect();
      media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility);
      paint.current = () => {}; wake.current = () => {};
    };
  }, [count, language, renderCount]);
  useEffect(() => { state.current.modal = !!modal; wake.current(); }, [modal]);
  const release = (element: HTMLElement, cancelled: boolean) => {
    const p = pointer.current;
    if (!p) return;
    pointer.current = null;
    if (p.active) {
      element.classList.remove("is-dragging");
      if (element.hasPointerCapture(p.id)) element.releasePointerCapture(p.id);
    }
    const flick = p.active && !cancelled && performance.now() - p.time < 100 ? p.velocity * .19 : 0;
    seek(model.current, Math.round(model.current.position + flick), state.current.reduced);
    paint.current(); wake.current();
  };
  return {
    rootRef, stageRef, index, renderCount, select, move,
    // Keep only the visible belt and its overscan attached, even after a full tour.
    isLoaded: (i: number) => Math.abs(loopDistance(i, index, count)) <= preload,
    rootBind: {
      onPointerEnter(e: PointerEvent<HTMLElement>) { if (e.pointerType === "mouse") { state.current.hovered = true; wake.current(); } },
      onPointerLeave(e: PointerEvent<HTMLElement>) { if (e.pointerType === "mouse") { state.current.hovered = false; if (pointer.current && !pointer.current.active) release(e.currentTarget, true); wake.current(); } },
      onFocusCapture(e: FocusEvent<HTMLElement>) { state.current.focused = (e.target as HTMLElement).matches(":focus-visible"); wake.current(); },
      onBlurCapture(e: FocusEvent<HTMLElement>) { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { state.current.focused = false; wake.current(); } },
    },
    bind: {
      onDragStart(e: DragEvent<HTMLElement>) { e.preventDefault(); },
      onPointerDown(e: PointerEvent<HTMLElement>) {
        if (e.button !== 0 || !e.isPrimary) return;
        model.current.target = null;
        pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: model.current.position, active: false, lastX: e.clientX, time: performance.now(), velocity: 0 };
        wake.current();
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        const p = pointer.current;
        if (!p || p.id !== e.pointerId) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        if (!p.active && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { release(e.currentTarget, true); return; }
        if (!p.active && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.2) { p.active = true; e.currentTarget.setPointerCapture(p.id); e.currentTarget.classList.add("is-dragging"); }
        if (!p.active) return;
        const now = performance.now();
        const v = -(e.clientX - p.lastX) / state.current.focusStep / Math.max(0.008, (now - p.time) / 1000);
        p.velocity = Math.max(-4, Math.min(4, p.velocity * 0.35 + v * 0.65));
        p.time = now; p.lastX = e.clientX;
        model.current.position = p.start - dx / state.current.focusStep;
        wake.current();
      },
      onPointerUp(e: PointerEvent<HTMLElement>) { release(e.currentTarget, false); },
      onPointerCancel(e: PointerEvent<HTMLElement>) { release(e.currentTarget, true); },
      onLostPointerCapture(e: PointerEvent<HTMLElement>) { if (e.target === e.currentTarget) release(e.currentTarget, true); },
      onKeyDown(e: KeyboardEvent<HTMLElement>) {
        if (e.key === "Home" || e.key === "End") { e.preventDefault(); select(e.key === "Home" ? 0 : count - 1); }
        else if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); move(e.key === "ArrowLeft" ? -1 : 1); }
      },
    },
  };
}
