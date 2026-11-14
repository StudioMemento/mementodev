import { useState, type CSSProperties } from "react";
import data from "../data/photos.json";
import { useI18n } from "../i18n";
import { useDrag, wrap } from "../hooks/useDrag";
import { Photo } from "./Photo";
import { Chevron, ExpandIcon } from "./Icon";
import { useDialog } from "./DialogContext";
import GradualBlur from "../vendor/react-bits/GradualBlur";
const albumOrder = [
  "esterno",
  "bancone",
  "sala_sinistra",
  "sala_destra",
  "via_roma",
] as const;
function Album({ album }: { album: (typeof albumOrder)[number] }) {
  const { t, copy } = useI18n();
  const { open } = useDialog();
  const photos = data.GALLERY_ALBUMS[album];
  const title = t.g_categories[album];
  const [index, setIndex] = useState(0);
  const step = (d: number) => setIndex((i) => wrap(i + d, photos.length));
  const drag = useDrag(step);
  const shifts = [0, 60, 94, 117],
    scales = [1, 0.78, 0.6, 0.46];
  return (
    <section
      className="album"
      id={`album-${album}`}
      aria-labelledby={`title-${album}`}
    >
      <div className="album-heading">
        <h2 id={`title-${album}`}>{title}</h2>
      </div>
      <div className="gallery-shell">
        <div
          className="gallery-stage"
          {...drag}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          data-album={album}
          data-index={index}
        >
          {photos.map((src, logical) => {
            const offset = wrap(logical - index + Math.floor(photos.length / 2), photos.length) - Math.floor(photos.length / 2);
            const depth = Math.min(3, Math.abs(offset));
            return (
              <button
                className={`gallery-card depth-${depth} ${offset === 0 ? "is-current" : ""}`}
                key={logical}
                data-side={offset < 0 ? "left" : offset > 0 ? "right" : "center"}
                type="button"
                aria-hidden={offset !== 0}
                tabIndex={offset === 0 ? 0 : -1}
                aria-label={`${copy.expand}: ${title}, ${logical + 1} / ${photos.length}`}
                style={
                  {
                    "--shift": shifts[depth] * Math.sign(offset),
                    "--scale": scales[depth],
                    visibility: Math.abs(offset) > 3 ? "hidden" : undefined,
                    zIndex: 10 - Math.abs(offset),
                  } as CSSProperties
                }
                onClick={() => {
                  if (offset !== 0) setIndex(logical);
                  else
                    open({
                      kind: "photo",
                      photos: photos.map((src, i) => ({
                        src,
                        caption: `${title} · ${i + 1} / ${photos.length}`,
                      })),
                      index,
                    });
                }}
              >
                <Photo
                  src={src}
                  alt={offset === 0 ? `${title} · Via Roma` : ""}
                />
                {offset === 0 && (
                  <span className="gallery-expand">
                    <ExpandIcon />
                  </span>
                )}
              </button>
            );
          })}
          <GradualBlur
            position="left"
            height="100%"
            width="7%"
            layers={4}
            strength={0.4}
            tint="#080809"
            zIndex={15}
          />
          <GradualBlur
            position="right"
            height="100%"
            width="7%"
            layers={4}
            strength={0.4}
            tint="#080809"
            zIndex={15}
          />
        </div>
        <button
          type="button"
          className="gallery-arrow previous"
          onClick={() => step(-1)}
          aria-label={`${copy.previous} — ${title}`}
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          className="gallery-arrow next"
          onClick={() => step(1)}
          aria-label={`${copy.next} — ${title}`}
        >
          <Chevron direction="right" />
        </button>
      </div>
      <div className="gallery-dots" aria-label={title}>
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${title} · ${i + 1}`}
            aria-pressed={index === i}
            className={index === i ? "active" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {title}, {copy.photo} {index + 1} / {photos.length}
      </p>
    </section>
  );
}
export default function Gallery() {
  const { copy } = useI18n();
  return (
    <section id="gallery" className="room-gallery" aria-label={copy.gallery}>
      {albumOrder.map((album) => (
        <Album key={album} album={album} />
      ))}
    </section>
  );
}
