import { lazy, Suspense, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import metadata from "../../data/images.json";
import { closingCopy } from "../../data/closing-copy";
import { useDialog } from "../DialogContext";
import type { RibbonController, Variant } from "./ribbon";

const PhotoFocus = lazy(() => import("./PhotoFocus"));
export type GalleryPhoto = { src: string; caption: string };
type Props = { photos: GalleryPhoto[]; title: string; variant: Variant };

export function PhotoRibbon({ photos, title, variant }: Props) {
  const { language, copy } = useI18n();
  const { modal } = useDialog();
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<RibbonController | null>(null);
  const restore = useRef(false);
  const [selected, setSelected] = useState<number | null>(null);
  const helpId = useId();
  const strings = closingCopy[language];
  const flat = variant === "flat";

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let disposed = false;
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      void import("./ribbon").then(({ mountRibbon }) => {
        if (!disposed) engine.current = mountRibbon(element, variant);
      }).catch(() => { /* The native horizontal strip remains available. */ });
    }, { rootMargin: "550px 0px" });
    near.observe(element);
    return () => { disposed = true; near.disconnect(); engine.current?.destroy(); engine.current = null; };
  }, [variant]);

  useLayoutEffect(() => {
    stage.current?.toggleAttribute("data-obscured", Boolean(modal) || selected !== null);
    engine.current?.refresh();
    if (restore.current && selected === null) {
      stage.current?.focus({ preventScroll: true });
      restore.current = false;
    }
  }, [modal, selected]);

  const dismiss = useCallback((restoreFocus: boolean) => {
    restore.current = restoreFocus;
    setSelected(null);
  }, []);

  function activate(index: number) {
    if (flat) { engine.current?.focusCard(index, true); setSelected(index); }
    else if (engine.current) engine.current.focusCard(index);
    else {
      const element = stage.current;
      const card = element?.querySelectorAll<HTMLElement>(".ribbon-card")[index];
      if (card && element) element.scrollLeft += card.getBoundingClientRect().left - element.getBoundingClientRect().left - (element.clientWidth - card.offsetWidth) / 2;
    }
  }
  return <div className={`photo-ribbon ${variant}`}>
    <p className="sr-only" id={helpId}>{strings.galleryKeys}{flat && ` ${strings.photoKeys}`}</p>
    <div className="ribbon-stage" ref={stage} tabIndex={0} role="group" aria-label={title} aria-describedby={helpId}
      inert={selected !== null} aria-keyshortcuts="ArrowLeft ArrowRight Home End Space Enter">
      <div className="ribbon-track">
        {photos.map(({ src, caption }, index) => {
          const thumb = `/assets/ribbons/${src.split("/").pop()}`;
          const { width, height } = metadata[src as keyof typeof metadata];
          const sources = flat
            ? (Math.min(width, height) > 640 ? `${thumb} 640w, /${src} ${width}w` : undefined)
            : `${thumb} 640w, /${src.replace(".webp", "-768.webp")} 768w, /${src} ${width}w`;
          return <button className="ribbon-card" type="button" key={src} tabIndex={-1}
            aria-label={flat ? `${copy.expand} · ${caption}` : caption} onClick={() => activate(index)}>
            <img className="ribbon-image" src={thumb} srcSet={sources}
              sizes={flat ? "(max-width: 620px) and (orientation: portrait) 69vw, max(9.5vw, min(28vw, 49svh))" : "(max-width: 620px) and (orientation: portrait) 83vw, max(10vw, min(40vw, 60svh))"}
              width="640" height={flat ? 640 : 480} loading="lazy" decoding="async" draggable={false} alt={caption} />
            {flat && <span className="photo-byline">{caption}</span>}
          </button>;
        })}
      </div>
      <span className="sr-only ribbon-announcement" aria-live="polite" aria-atomic="true" />
    </div>
    {selected !== null && <Suspense fallback={null}>
      <PhotoFocus photos={photos} index={selected} select={index => { setSelected(index); engine.current?.focusCard(index, true); }} dismiss={dismiss} />
    </Suspense>}
  </div>;
}
