import { useCallback, useId, useLayoutEffect, useRef } from "react";
import { useOnApproach } from "../../hooks/useOnApproach";
import { useI18n } from "../../i18n";
import { closingCopy } from "../../data/closing-copy";
import { useDialog } from "../DialogContext";
import { Photo } from "../Photo";
import type { RibbonController } from "./ribbon";

type GalleryPhoto = { src: string; caption: string };
type Props = { photos: GalleryPhoto[]; title: string };

export function PhotoRibbon({ photos, title }: Props) {
  const { language } = useI18n();
  const { modal } = useDialog();
  const engine = useRef<RibbonController | null>(null);
  const announcement = useRef<HTMLSpanElement>(null);
  const helpId = useId();

  const loadRibbon = useCallback(async () => {
    const { mountRibbon } = await import("./ribbon");
    return (element: HTMLDivElement) => {
      const controller = mountRibbon(element, announcement.current!);
      engine.current = controller;
      return () => { controller.destroy(); engine.current = null; };
    };
  }, []);
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
  return <div className="photo-ribbon panorama">
    <p className="sr-only" id={helpId}>{closingCopy[language].galleryKeys}</p>
    <div className="ribbon-stage" ref={stage} tabIndex={0} role="group" aria-label={title} aria-describedby={helpId}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End Space Enter">
      <div className="ribbon-track">
        {photos.map(({ src, caption }, index) => (
          <button className="ribbon-card" type="button" key={src} tabIndex={-1} aria-label={caption} onClick={() => centerPanel(index)}>
            <Photo className="ribbon-image" src={src} alt={caption}
              sizes="(max-width:620px) and (orientation:portrait) 83vw, max(14vw, min(42vw, 62svh, 680px))" />
          </button>
        ))}
      </div>
      <span ref={announcement} className="sr-only ribbon-announcement" aria-live="polite" aria-atomic="true" />
    </div>
  </div>;
}
