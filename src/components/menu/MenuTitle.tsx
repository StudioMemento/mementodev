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
    let lastWidth = 0;
    const fit = () => {
      if (disposed) return;
      const available = el.clientWidth;
      const measured = label.getBoundingClientRect().width;
      if (available <= 0 || measured <= 0) return;
      const current = parseFloat(getComputedStyle(label).fontSize);
      el.style.setProperty("--menu-title-size", `${current * available / measured}px`);
      lastWidth = available;
    };
    fit();
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== lastWidth) fit();
    });
    observer.observe(el);
    // Fallback font metrics must not determine the final title width.
    document.fonts.ready.then(fit);
    return () => { disposed = true; observer.disconnect(); };
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
