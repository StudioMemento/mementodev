type Handlers = {
  begin(): void;
  move(pixels: number, seconds: number): void;
  end(coast: boolean): void;
};

type Gesture = {
  id: number; kind: "touch" | "pointer"; x: number; y: number; lastX: number; time: number; horizontal: boolean;
};

/** Resolve the axis once per contact. Only a one-finger horizontal gesture belongs to the ribbon. */
export function bindRibbonDrag(stage: HTMLElement, signal: AbortSignal, handlers: Handlers) {
  let gesture: Gesture | undefined;
  let skipClick = false;
  const passive = { signal, passive: true };
  function begin(id: number, x: number, y: number, kind: Gesture["kind"]) {
    skipClick = false;
    gesture = { id, kind, x, y, lastX: x, time: performance.now(), horizontal: false };
    handlers.begin();
  }
  function finish(cancelled: boolean) {
    if (!gesture) return;
    const { horizontal, id, kind, time } = gesture;
    gesture = undefined;
    skipClick = horizontal;
    stage.classList.remove("is-dragging");
    if (kind === "pointer" && stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
    handlers.end(horizontal && !cancelled && performance.now() - time < 100);
  }
  function move(x: number, y: number, touch?: TouchEvent) {
    if (!gesture) return;
    if (!gesture.horizontal) {
      const dx = Math.abs(x - gesture.x), dy = Math.abs(y - gesture.y);
      if (Math.max(dx, dy) < 3) return;
      if (dy >= dx) { finish(true); return; }
      gesture.horizontal = true;
      stage.classList.add("is-dragging");
      if (!touch) stage.setPointerCapture(gesture.id);
    }
    // Safari can begin native page panning before a pointer-capture handler runs.
    // Cancel the native touchmove locally, from the first horizontal displacement.
    if (touch) {
      if (!touch.cancelable) { finish(true); return; }
      touch.preventDefault();
    }
    const now = performance.now();
    handlers.move(gesture.lastX - x, Math.max(.012, (now - gesture.time) / 1000));
    gesture.lastX = x; gesture.time = now;
  }
  function touch(e: TouchEvent) {
    const starting = e.type === "touchstart";
    if (!starting && gesture?.kind !== "touch") return;
    if (e.touches.length !== 1) { finish(true); return; }
    const finger = e.touches[0];
    if (starting) begin(finger.identifier, finger.clientX, finger.clientY, "touch");
    else if (finger.identifier === gesture?.id) move(finger.clientX, finger.clientY, e);
  }
  stage.addEventListener("touchstart", touch, passive);
  stage.addEventListener("touchmove", touch, { signal, passive: false });
  function endTouch(e: TouchEvent) {
    if (gesture?.kind === "touch" && Array.from(e.changedTouches).some(t => t.identifier === gesture?.id)) finish(e.type === "touchcancel");
  }
  stage.addEventListener("touchend", endTouch, passive);
  stage.addEventListener("touchcancel", endTouch, passive);
  stage.addEventListener("pointerdown", e => {
    if (e.pointerType !== "touch" && e.isPrimary && e.button === 0) begin(e.pointerId, e.clientX, e.clientY, "pointer");
  }, passive);
  stage.addEventListener("pointermove", e => {
    if (gesture?.kind === "pointer" && e.pointerId === gesture.id) move(e.clientX, e.clientY);
  }, passive);
  function endPointer(e: PointerEvent) {
    if (gesture?.kind === "pointer" && e.pointerId === gesture.id) finish(e.type !== "pointerup");
  }
  window.addEventListener("pointerup", endPointer, passive);
  window.addEventListener("pointercancel", endPointer, passive);
  stage.addEventListener("lostpointercapture", e => { if (e.target === stage) endPointer(e); }, passive);
  stage.addEventListener("click", e => {
    if (skipClick && e.detail) { e.preventDefault(); e.stopPropagation(); }
    skipClick = false;
  }, { signal, capture: true });
}
