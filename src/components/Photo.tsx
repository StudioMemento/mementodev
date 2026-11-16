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
  sizes = "(max-width: 700px) 90vw, 55vw",
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Non-menu carousels can defer a resource without replacing its image element. */
  enabled?: boolean;
  sizes?: string;
}) {
  const meta = images[src];
  // A new URL prevents cached 4K files from surviving the FHD release.
  const assetUrl = (path: string) => `/${path}${path.startsWith("assets/gallery/") ? "?v=25" : ""}`;
  return (
    <img
      src={enabled ? assetUrl(src) : undefined}
      srcSet={
        enabled && meta?.small ? `${assetUrl(meta.small)} 768w, ${assetUrl(src)} ${meta.width}w` : undefined
      }
      sizes={enabled && meta?.small ? sizes : undefined}
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
