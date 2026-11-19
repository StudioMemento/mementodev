import { useCallback, useId, useLayoutEffect, useRef, type CSSProperties } from "react";
import { useOnApproach } from "../../hooks/useOnApproach";
import { useI18n } from "../../i18n";
import metadata from "../../data/images.json";
import { closingCopy } from "../../data/closing-copy";
import { useDialog } from "../DialogContext";
import { Photo } from "../Photo";
import type { RibbonController, Variant } from "./ribbon";

type GalleryPhoto = { src: string; caption: string };
type Props = { photos: GalleryPhoto[]; title: string; variant: Variant };

export function PhotoRibbon({ photos, title, variant }: Props) {
  const { language } = useI18n();
  const { modal } = useDialog();
  const engine = useRef<RibbonController | null>(null);
  const announcement = useRef<HTMLSpanElement>(null);
  const helpId = useId();
  const flat = variant === "flat";

  const loadRibbon = useCallback(async () => {
    const { mountRibbon } = await import("./ribbon");
    return (element: HTMLDivElement) => {
      const paceReference = variant === "flat" ? element.closest("main")?.querySelector<HTMLElement>(".panorama .ribbon-card") : null;
      const controller = mountRibbon(element, variant, announcement.current!, paceReference);
      engine.current = controller;
      return () => { controller.destroy(); engine.current = null; };
    };
  }, [variant]);
  const stage = useOnApproach(loadRibbon, "550px 0px");

  useLayoutEffect(() => {
    stage.current?.toggleAttribute("data-obscured", Boolean(modal));
    engine.current?.refresh();
  }, [modal]);

  function centerPanel(index: number) {
    if (engine.current) return engine.current.focusCard(index);
    const element = stage.current;
    const card = element?.querySelectorAll<HTMLElement>(".ribbon-card")[index];
    if (card && element) element.scrollLeft += card.getBoundingClientRect().left - element.getBoundingClientRect().left - (element.clientWidth - card.offsetWidth) / 2;
  }
  return <div className={`photo-ribbon ${variant}`}>
    <p className="sr-only" id={helpId}>{closingCopy[language].galleryKeys}</p>
    <div className="ribbon-stage" ref={stage} tabIndex={0} role="group" aria-label={title} aria-describedby={helpId}
      aria-keyshortcuts={flat ? "ArrowLeft ArrowRight Home End Space" : "ArrowLeft ArrowRight Home End Space Enter"}>
      <div className="ribbon-track">
        {photos.map(({ src, caption }, index) => {
          const { width, height } = metadata[src as keyof typeof metadata];
          if (flat) {
            const ratio = width / height;
            return <figure key={src} className="ribbon-card" aria-label={caption} style={{ "--photo-ratio": ratio } as CSSProperties}>
              <Photo src={src} alt={caption} className="ribbon-image"
                sizes={`(max-width: 620px) and (orientation: portrait) ${Math.ceil(52 * ratio)}vw, max(${10 * ratio}vw, min(${28 * ratio}vw, ${46 * ratio}svh))`} />
              <figcaption className="photo-byline">{caption}</figcaption>
            </figure>;
          }
          const thumb = `/assets/ribbons/${src.split("/").pop()}`;
          return <button className="ribbon-card" type="button" key={src} tabIndex={-1} aria-label={caption} onClick={() => centerPanel(index)}>
            <img className="ribbon-image" src={thumb} srcSet={`${thumb} 640w, /${src.replace(".webp", "-768.webp")} 768w, /${src} ${width}w`}
              sizes="(max-width: 620px) and (orientation: portrait) 83vw, max(10vw, min(40vw, 60svh))"
              width="640" height="480" loading="lazy" decoding="async" draggable={false} alt={caption} />
          </button>;
        })}
      </div>
      <span ref={announcement} className="sr-only ribbon-announcement" aria-live="polite" aria-atomic="true" />
    </div>
  </div>;
}
