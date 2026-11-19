import { useLayoutEffect, useRef } from "react";
import { useIntroVisibility } from "../intro/useIntroVisibility";

/** Fit the real type, including translations, without stretching its glyphs. */
export function useTitleFit(text: string) {
  const heading = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = heading.current;
    const label = el?.firstElementChild as HTMLElement | null;
    if (!el || !label) return;
    let disposed = false;
    let lastWidth = 0, frame = 0;
    const fit = () => {
      if (disposed) return;
      const available = el.clientWidth;
      const type = getComputedStyle(label);
      // CSS cancels the final tracking advance with a negative inline margin.
      // Measure the visible word, so both its first and last letters meet the gutters.
      const tracking = parseFloat(type.letterSpacing) || 0;
      const measured = label.getBoundingClientRect().width - tracking;
      if (available <= 0 || measured <= 0) return;
      const current = parseFloat(type.fontSize);
      el.style.setProperty("--menu-title-size", `${current * available / measured}px`);
      lastWidth = available;
    };
    fit();
    const observer = new ResizeObserver(() => {
      // Writing the font size changes the observed heading height. Fit on the next
      // frame so WebKit can finish its resize delivery during device rotation.
      if (el.clientWidth !== lastWidth && !frame) {
        frame = requestAnimationFrame(() => { frame = 0; fit(); });
      }
    });
    observer.observe(el);
    // Fallback font metrics must not determine the final title width.
    document.fonts.ready.then(fit);
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(frame); };
  }, [text]);
  return heading;
}

export function MenuTitle({ text }: { text: string }) {
  const visibility = useIntroVisibility();
  const heading = useTitleFit(text);
  return <header className="menu-head" ref={visibility}>
    <h2 ref={heading}><span>{text}</span></h2>
  </header>;
}
