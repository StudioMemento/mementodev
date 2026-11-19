import type { ReactNode } from "react";

export function BentoGrid({ children, className }: { children: ReactNode; className: string }) {
  return <div className={`bento-grid ${className}`}>{children}</div>;
}
