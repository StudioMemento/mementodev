import { useI18n, type Language } from "../i18n";
import { photosUrl } from "../data/venue-links";
import { FeatureCard } from "./FeatureCard";

const copy: Record<Language, [string, string]> = {
  it: ["Ricordi condivisi dalla community!", "Apri le foto su Google Maps"],
  en: ["Memories shared by our community!", "Open photos on Google Maps"],
  de: ["Erinnerungen aus unserer Community!", "Fotos auf Google Maps öffnen"],
  fr: ["Les souvenirs de notre communauté !", "Voir les photos sur Google Maps"],
};

export function GuestPhotos() {
  const { language } = useI18n();
  const [heading, label] = copy[language];
  return <FeatureCard id="customer" titleId="guest-photos-title" heading={heading} link={{ href: photosUrl, label }}>
    <img className="community-pin" src="/assets/foto-ospiti/maps-pin-480.webp"
      srcSet="/assets/foto-ospiti/maps-pin-240.webp 240w, /assets/foto-ospiti/maps-pin-480.webp 480w, /assets/foto-ospiti/maps-pin-750.webp 750w"
      sizes="(min-width:2400px) 10vw, (min-width:1200px) 15vw, 21vw"
      width="750" height="750" loading="lazy" decoding="async" draggable={false} alt="" />
  </FeatureCard>;
}
