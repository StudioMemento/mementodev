import { LinkArrow } from "./Icon";
import { useI18n } from "../i18n";
import { releaseCopy } from "../data/release-copy";
import { photosUrl } from "../data/venue-links";
import { HoloCard } from "./intro/HoloCard";

export default function Community() {
  const { language } = useI18n();
  const copy = releaseCopy[language];
  return <section id="customer" className="community-feature" aria-labelledby="community-title">
    <HoloCard>
      <img className="crust-photo" src="/assets/foto-maps/copertina-960.webp"
        srcSet="/assets/foto-maps/copertina-480.webp 480w, /assets/foto-maps/copertina-960.webp 960w, /assets/foto-maps/copertina-1600.webp 1600w"
        sizes="(min-width: 2400px) 40vw, (min-width: 1200px) 60vw, (min-width: 768px) 70vw, 80vw"
        width="1600" height="900" loading="lazy" decoding="async" draggable={false} alt="" />
      <div className="crust-card-shade" aria-hidden="true" />
      <a className="feature-action" href={photosUrl} target="_blank" rel="noopener noreferrer">
        <h2 id="community-title">{copy.community}</h2>
        <span className="feature-cta">{copy.photos}<LinkArrow /></span>
      </a>
    </HoloCard>
    <p className="media-credit">{copy.ai}</p>
  </section>;
}
