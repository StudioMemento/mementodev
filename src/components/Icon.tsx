const dockPaths: Record<string, string> = {
  house: "m2.8 10.4 9.2-7.7 9.2 7.7 M5 9v11h5v-6h4v6h5V9",
  "fork-knife": "M4 3v5a3 3 0 0 0 6 0V3 M7 3v18 M19.5 21V3c-3 1.8-5.3 6.4-5.3 11h5.3",
  gallery: "M3 5.5h18v13H3z M3.5 16l5.2-5.1 3.4 3.2 2.4-2.2 6 6 M15.7 8.7h.1",
  phone: "M7.5 3.7 10 8c.3.5.2 1.1-.2 1.5l-1.6 1.7a12.6 12.6 0 0 0 4.7 4.7l1.7-1.6c.4-.4 1-.5 1.5-.2l4.3 2.5c.6.4.8 1 .6 1.6-.6 2.1-2.2 3.1-4.1 2.9C9.4 20.3 3.6 14.5 2.9 7.2c-.2-1.9.9-3.5 2.9-4.1.7-.2 1.3 0 1.7.6z",
};
export function Icon({ name, className = "" }: { name: string; className?: string }) {
  if (name === "brand-flame") return <span className="dock-flame" aria-hidden="true" />;
  if (dockPaths[name]) return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
      <path d={dockPaths[name]} />
    </svg>
  );
  return <i className={`ph-thin ph-${name} ${className}`} aria-hidden="true" />;
}
export function Chevron({
  direction = "down",
}: {
  direction?: "left" | "right" | "down";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      style={{
        transform:
          direction === "left"
            ? "rotate(90deg)"
            : direction === "right"
              ? "rotate(-90deg)"
              : undefined,
      }}
    >
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
      <path
        d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
