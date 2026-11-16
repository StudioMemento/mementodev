import { useEffect, type RefObject } from "react";

/** React Bits Dock cosine falloff and spring, adapted to native links. */
export function useDockMagnification(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a'));
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = links.map(() => ({ value: 0, velocity: 0 }));
    let pointerX: number | null = null, focused = -1, frame = 0, last = 0;
    const render = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now-last)/1000, 1/30) : 1/60;
      last = now;
      const rect = root.getBoundingClientRect();
      const base = parseFloat(getComputedStyle(root).getPropertyValue('--dock-base')) || 52;
      const gap = 20, total = base * links.length + gap * (links.length-1);
      const start = rect.left + (rect.width-total)/2;
      let moving = false;
      links.forEach((link, i) => {
        const center = start + i*(base+gap) + base/2;
        const focus = pointerX ?? (focused >= 0 ? start + focused*(base+gap) + base/2 : null);
        const reach = focus === null ? 1 : Math.abs(focus-center)/400;
        const target = fine.matches && !reduce.matches && reach < 1 ? Math.cos(reach*Math.PI/2)**2 : 0;
        const s = motion[i];
        const steps = Math.ceil(dt*240), h = dt/steps;
        for(let j=0;j<steps;j++) {
          s.velocity = (s.velocity+h*210*(target-s.value))/(1+h*28+h*h*210);
          s.value += s.velocity*h;
        }
        if(Math.abs(target-s.value)<0.0005 && Math.abs(s.velocity)<0.002) { s.value=target; s.velocity=0; }
        else moving=true;
        link.style.setProperty('--dock-size', `${(base + (80-base)*s.value).toFixed(3)}px`);
      });
      if(moving) frame=requestAnimationFrame(render); else last=0;
    };
    const wake = () => { if(!frame && !document.hidden) frame=requestAnimationFrame(render); };
    const move = (event: PointerEvent) => { if(event.pointerType==='mouse') { pointerX=event.clientX; wake(); } };
    const leave = () => { pointerX=null; wake(); };
    const focus = (event: FocusEvent) => { focused=links.findIndex(link=>link.contains(event.target as Node)); wake(); };
    const blur = (event: FocusEvent) => { if(!root.contains(event.relatedTarget as Node|null)){ focused=-1; wake(); } };
    const visibility = () => { cancelAnimationFrame(frame); frame=0; last=0; if(!document.hidden) wake(); };
    root.addEventListener('pointermove',move); root.addEventListener('pointerleave',leave);
    root.addEventListener('focusin',focus); root.addEventListener('focusout',blur);
    fine.addEventListener('change',wake); reduce.addEventListener('change',wake);
    window.addEventListener('resize',wake); document.addEventListener('visibilitychange',visibility);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove',move); root.removeEventListener('pointerleave',leave);
      root.removeEventListener('focusin',focus); root.removeEventListener('focusout',blur);
      fine.removeEventListener('change',wake); reduce.removeEventListener('change',wake);
      window.removeEventListener('resize',wake); document.removeEventListener('visibilitychange',visibility);
    };
  }, [ref]);
}
