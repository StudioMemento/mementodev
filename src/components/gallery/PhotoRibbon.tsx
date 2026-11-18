import { useEffect, useId, useRef } from "react";
import { useI18n } from "../../i18n";
import { closingCopy } from "../../data/closing-copy";
import { useDialog, type LightboxPhoto } from "../DialogContext";
import type { RibbonController, Variant } from "./ribbon";

type Props = { photos: LightboxPhoto[]; title: string; variant: Variant };

export function PhotoRibbon({ photos, title, variant }: Props) {
  const { language, copy } = useI18n();
  const { modal, open } = useDialog();
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<RibbonController | null>(null);
  const helpId = useId();
  const strings = closingCopy[language];

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let disposed = false;
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      void import("./ribbon").then(({ mountRibbon }) => {
        if (!disposed) engine.current = mountRibbon(element, variant);
      }).catch(() => { /* The native horizontal strip also works on its own. */ });
    }, { rootMargin: "550px 0px" });
    near.observe(element);
    return () => { disposed = true; near.disconnect(); engine.current?.destroy(); engine.current = null; };
  }, [variant]);

  useEffect(() => {
    stage.current?.toggleAttribute("data-obscured", Boolean(modal));
    engine.current?.refresh();
  }, [modal]);

  function activate(index: number) {
    if (variant === "flat") {
      stage.current?.focus({ preventScroll: true });
      open({ kind: "photo", photos, index });
    } else if (engine.current) {
      engine.current.focusCard(index);
    } else {
      const card = stage.current?.querySelectorAll<HTMLElement>(".ribbon-card")[index];
      if (card && stage.current) stage.current.scrollLeft += card.getBoundingClientRect().left - stage.current.getBoundingClientRect().left - (stage.current.clientWidth - card.offsetWidth) / 2;
    }
  }

  return <div className={`photo-ribbon ${variant}`}>
    <p className="sr-only" id={helpId}>{strings.galleryKeys}{variant === "flat" && ` ${strings.photoKeys}`}</p>
    <div className="ribbon-stage" ref={stage} tabIndex={0} role="group" aria-label={title} aria-describedby={helpId}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End Space Enter">
      <div className="ribbon-track">
        {photos.map(({ src, caption }, index) =>
          <button className="ribbon-card" type="button" key={src} tabIndex={-1}
            aria-label={variant === "flat" ? `${copy.expand} · ${caption}` : caption}
            aria-haspopup={variant === "flat" ? "dialog" : undefined} onClick={() => activate(index)}>
            <img className="ribbon-image" src={`/assets/ribbons/${src.split("/").pop()}`} width={variant === "flat" ? 560 : 640}
              height={variant === "flat" ? 560 : 480} loading="lazy" decoding="async" draggable={false} alt={caption} />
            {variant === "flat" && <span className="photo-byline">{caption}</span>}
          </button>)}
      </div>
      <span className="sr-only ribbon-announcement" aria-live="polite" aria-atomic="true" />
    </div>
  </div>;
}
