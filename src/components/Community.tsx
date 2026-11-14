import { useState } from "react";
import MagicBento from "../vendor/react-bits/MagicBento";
import data from "../data/photos.json";
import { useI18n } from "../i18n";
import { useDialog } from "./DialogContext";
import { Photo } from "./Photo";
import { useMedia } from "../hooks/useMedia";
import { Chevron } from "./Icon";
import { wrap } from "../hooks/useDrag";
export default function Community() {
  const { t, copy } = useI18n();
  const { open } = useDialog();
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const small = useMedia("(max-width: 640px)");
  const coarse = useMedia("(pointer: coarse)");
  const [page, setPage] = useState(0);
  const count = small ? 1 : 3;
  const pages = Math.ceil(data.CUSTOMER.length / count);
  const current = wrap(page, pages);
  const photos = data.CUSTOMER.map((c) => ({ src: c.src, caption: c.name }));
  const items = data.CUSTOMER.slice(
    current * count,
    current * count + count,
  ).map((c, i) => ({
    id: c.src,
    title: `${copy.expand} · ${c.name}`,
    onClick: () => open({ kind: "photo", photos, index: current * count + i }),
    content: (
      <figure className="community-photo">
        <Photo
          src={c.src}
          alt={`${t.cu_eyebrow} · ${c.name}`}
          sizes="(max-width: 640px) 90vw, 33vw"
        />
        <figcaption>{c.name}</figcaption>
      </figure>
    ),
  }));
  return (
    <section id="customer" className="vr-community">
      <p className="k-s">{t.cu_eyebrow}</p>
      <h2>{t.cu_title}</h2>
      <p className="lead">{copy.communityLead}</p>
      <MagicBento
        items={items}
        columns={count}
        rowHeight={300}
        radius={0}
        gap={14}
        className="community-bento vr-bento"
        glowColor="#C6AB70"
        spotlightRadius={180}
        textAutoHide={false}
        enableTilt={false}
        enableMagnetism={false}
        enableStars={false}
        clickEffect={false}
        intro={false}
        disableAnimations={reduce || coarse}
      />
      <div className="community-controls">
        <button
          type="button"
          aria-label={copy.previous}
          onClick={() => setPage((i) => wrap(i - 1, pages))}
        >
          <Chevron direction="left" />
        </button>
        <span aria-live="polite">
          {String(current + 1).padStart(2, "0")}{" "}
          <span aria-hidden="true">/</span> {String(pages).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label={copy.next}
          onClick={() => setPage((i) => wrap(i + 1, pages))}
        >
          <Chevron direction="right" />
        </button>
      </div>
    </section>
  );
}
