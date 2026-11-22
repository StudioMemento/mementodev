import type { ReactNode } from "react";
import { HoloCard } from "./intro/HoloCard";
import { Chevron } from "./Icon";

type FeatureCardProps = {
  id: string;
  titleId: string;
  heading: string;
  caption?: string;
  children: ReactNode;
  link?: { href: string; label: string };
};

export function FeatureCard({ id, titleId, heading, caption, children, link }: FeatureCardProps) {
  return (
    <section className="takeaway" id={id} aria-labelledby={titleId}>
      <HoloCard>
        {children}
        <div className="takeaway-copy">
          <h2 id={titleId}>{heading}{link && <Chevron direction="right" />}</h2>
          {caption && <p>{caption}</p>}
        </div>
        {link && <a className="feature-card-link" href={link.href} target="_blank" rel="noopener noreferrer"
          aria-label={`${heading} ${link.label}`} />}
      </HoloCard>
    </section>
  );
}
