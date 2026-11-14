import { useEffect, type RefObject } from "react";
/** V18 ticker behavior, with owned listeners and a sleeping animation loop. */
export function useReviewTicker(
  ref: RefObject<HTMLDivElement | null>,
  language: string,
  count: number,
) {
  useEffect(() => {
    const viewport = ref.current;
    if (!viewport) return;
    const runner = viewport.querySelector<HTMLElement>(".review-runner");
    if (!runner) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let pos = 0,
      half = 0,
      last = 0,
      raf = 0,
      timer = 0,
      visible = false,
      paused = false,
      suppressUntil = 0;
    let drag: {
      id: number;
      x: number;
      y: number;
      start: number;
      axis: string | null;
      moved: boolean;
    } | null = null;
    const disposers: (() => void)[] = [];
    const listen = (
      target: EventTarget,
      type: string,
      fn: EventListener,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn, options);
      disposers.push(() => target.removeEventListener(type, fn, options));
    };
    const paint = () => {
      pos = half ? ((pos % half) + half) % half : 0;
      runner.style.transform = `translate3d(${-pos.toFixed(3)}px,0,0)`;
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };
    const schedule = () => {
      if (!reduced && visible && !document.hidden && !paused && !drag && !raf)
        raf = requestAnimationFrame(tick);
    };
    function tick(ts: number) {
      raf = 0;
      const dt = last ? Math.min(40, ts - last) : 0;
      last = ts;
      if (visible && !document.hidden && !paused && !drag) {
        pos += dt * 0.034;
        paint();
      }
      schedule();
    }
    const refresh = () => {
      half =
        (runner.children[count] as HTMLElement)?.offsetLeft ||
        runner.scrollWidth / 2;
      paint();
    };
    const pause = () => {
      paused = true;
      clearTimeout(timer);
      stop();
    };
    const resume = (delay = 0) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        paused = false;
        schedule();
      }, delay);
    };
    listen(viewport, "mouseenter", pause);
    listen(viewport, "mouseleave", () => resume(180));
    listen(viewport, "focusin", pause);
    listen(viewport, "focusout", () => resume(420));
    listen(viewport, "pointerdown", (event) => {
      const e = event as PointerEvent;
      if (e.button !== 0) return;
      pause();
      drag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        start: pos,
        axis: null,
        moved: false,
      };
    });
    listen(viewport, "pointermove", (event) => {
      const e = event as PointerEvent;
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (!drag.axis && (Math.abs(dx) > 5 || Math.abs(dy) > 5))
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (drag.axis !== "x") return;
      if (!drag.moved) viewport.setPointerCapture(e.pointerId);
      drag.moved = true;
      e.preventDefault();
      pos = drag.start - dx;
      paint();
      viewport.classList.add("dragging");
    });
    const end: EventListener = (event) => {
      const e = event as PointerEvent;
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) suppressUntil = performance.now() + 350;
      drag = null;
      viewport.classList.remove("dragging");
      resume(900);
    };
    listen(viewport, "pointerup", end);
    listen(viewport, "pointercancel", end);
    listen(viewport, "lostpointercapture", end);
    listen(
      viewport,
      "click",
      (e) => {
        if (performance.now() < suppressUntil) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    listen(viewport, "keydown", (e) => {
      const k = e as KeyboardEvent;
      if (k.key === "ArrowRight" || k.key === "ArrowLeft") {
        k.preventDefault();
        pause();
        pos +=
          (k.key === "ArrowRight" ? 1 : -1) *
          Math.min(viewport.clientWidth * 0.8, 480);
        paint();
      }
    });
    listen(document, "visibilitychange", () => {
      if (document.hidden) stop();
      else schedule();
    });
    listen(media, "change", () => {
      reduced = media.matches;
      if (reduced) stop();
      else schedule();
    });
    const ro = new ResizeObserver(refresh);
    ro.observe(viewport);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) schedule();
        else stop();
      },
      { rootMargin: "20% 0px 20%", threshold: 0.01 },
    );
    io.observe(viewport);
    refresh();
    return () => {
      stop();
      clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
      disposers.forEach((fn) => fn());
    };
  }, [ref, language, count]);
}
