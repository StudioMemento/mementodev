import data from "../data/images.json";
const images = data as Record<
  string,
  { width: number; height: number; small?: string }
>;
export function Photo({
  src,
  alt,
  className = "",
  eager = false,
  enabled = true,
  deferred = false,
  sizes = "(max-width: 700px) 90vw, 55vw",
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Non-menu carousels can defer a resource without replacing its image element. */
  enabled?: boolean;
  deferred?: boolean;
  sizes?: string;
}) {
  const meta = images[src];
  const revision = src.startsWith("assets/pizze/") ? "?v=47" : src.startsWith("assets/gallery/") ? "?v=25" : "";
  const assetUrl = (path: string) => "/" + path + revision;
  const small = meta?.small === "-768.webp" ? src.replace(/\.webp$/, meta.small) : meta?.small;
  const srcSet = small ? `${assetUrl(small)} 768w, ${assetUrl(src)} ${meta.width}w` : undefined;
  return (
    <img
      src={enabled && !deferred ? assetUrl(src) : undefined}
      srcSet={enabled && !deferred ? srcSet : undefined}
      data-file={deferred ? assetUrl(src) : undefined}
      data-sources={deferred ? srcSet : undefined}
      sizes={enabled && small ? sizes : undefined}
      alt={alt}
      width={meta?.width}
      height={meta?.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}
