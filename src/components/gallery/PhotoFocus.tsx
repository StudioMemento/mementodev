import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { useI18n } from "../../i18n";
import metadata from "../../data/images.json";
import { useDrag, wrap } from "../../hooks/useDrag";
import { Photo } from "../Photo";
import type { GalleryPhoto } from "./PhotoRibbon";
import "../../styles/ribbon-motion.css";

type Props = {
  photos: GalleryPhoto[]; index: number; select: (next: number) => void;
  dismiss: (restoreFocus: boolean) => void;
};

export default function PhotoFocus({ photos, index, select, dismiss }: Props) {
  const { copy } = useI18n();
  const surface = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLButtonElement>(null);
  const { src, caption } = photos[index];
  const { width, height } = metadata[src as keyof typeof metadata];
  const step = (direction: number) => select(wrap(index + direction, photos.length));
  const drag = useDrag(step);

  useLayoutEffect(() => { center.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !surface.current?.contains(event.target)) dismiss(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [dismiss]);

  function neighbor(direction: number) {
    const next = photos[wrap(index + direction, photos.length)];
    const label = direction < 0 ? copy.previous : copy.next;
    return <button type="button" className={`focus-side ${direction < 0 ? "before" : "after"}`}
      aria-label={`${label} · ${next.caption}`} onClick={() => step(direction)}>
      <img src={`/assets/ribbons/${next.src.split("/").pop()}`} alt="" width="640" height="640" draggable={false} decoding="async" />
    </button>;
  }
  return <div className="photo-focus" ref={surface} role="group" aria-label={caption}
    style={{ "--photo-ratio": width / height } as CSSProperties} {...drag}
    onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); dismiss(true); }
      else drag.onKeyDown(event);
    }}
    onClick={event => { if (event.target === event.currentTarget) dismiss(true); }}>
    {neighbor(-1)}
    <figure className="focus-figure">
      <button type="button" ref={center} aria-label={`${copy.close} · ${caption}`} onClick={() => dismiss(true)}>
        <Photo key={src} src={src} alt={caption} eager sizes="(max-width: 620px) 82vw, 60vw" />
      </button>
      <figcaption aria-live="polite" aria-atomic="true">{caption}</figcaption>
    </figure>
    {neighbor(1)}
  </div>;
}
