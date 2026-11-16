import { useState } from "react";
import data from "../data/photos.json";
import { useI18n } from "../i18n";
import { useDrag, wrap } from "../hooks/useDrag";
import { Chevron, ExpandIcon } from "./Icon";
import { useDialog } from "./DialogContext";
import { Photo } from "./Photo";
export function PhotoPager({ photos, title }: { photos: {src: string; caption: string}[]; title: string }) {
  const { copy } = useI18n();
  const { open } = useDialog();
  const [index, setIndex] = useState(0);
  const step = (amount: number) => setIndex(i => wrap(i + amount, photos.length));
  const drag = useDrag(step);
  return <div className="photo-pager">
    <div className="photo-stage" {...drag}>
      <button type="button" className="photo-open" aria-label={`${copy.expand}: ${photos[index].caption}`} onClick={() => open({ kind: "photo", photos, index })}>
        <Photo src={photos[index].src} alt={photos[index].caption} sizes="(max-width: 767px) 80vw, (max-width: 1199px) 70vw, (max-width: 2399px) 60vw, 40vw" />
      </button>
    </div>
    <div className="photo-controls">
      <button type="button" aria-label={`${copy.previous} — ${title}`} onClick={() => step(-1)}><Chevron direction="left" /></button>
      <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
      <button type="button" aria-label={`${copy.next} — ${title}`} onClick={() => step(1)}><Chevron direction="right" /></button>
      <button type="button" className="photo-expand" aria-label={`${copy.expand}: ${title}`} onClick={() => open({ kind: "photo", photos, index })}><ExpandIcon /></button>
    </div>
  </div>;
}
export default function Gallery() {
  const { t, copy } = useI18n();
  const albums = ["esterno", "bancone", "sala_sinistra", "sala_destra", "via_roma"] as const;
  return <section id="gallery" className="room-gallery" aria-label={copy.gallery}>
    {albums.map((album, n) => <section className="album" id={`album-${album}`} key={album} aria-labelledby={`title-${album}`}>
      <header className="album-heading"><p className="k-s">0{n + 1} / 05</p><h2 id={`title-${album}`}>{t.g_categories[album]}</h2></header>
      <PhotoPager title={t.g_categories[album]} photos={data.GALLERY_ALBUMS[album].map((src, i) => ({ src, caption: `${t.g_categories[album]} · ${i + 1} / ${data.GALLERY_ALBUMS[album].length}` }))} />
    </section>)}
  </section>;
}
