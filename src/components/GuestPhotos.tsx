import { useI18n, type Language } from "../i18n";
import { photosUrl } from "../data/venue-links";
import { FeatureCard } from "./FeatureCard";

const copy: Record<Language, [string, string, string]> = {
  it: ["Le foto", "degli ospiti", "Apri su Google Maps"],
  en: ["Photos from", "our guests", "View on Google Maps"],
  de: ["Fotos", "unserer Gäste", "Auf Google Maps ansehen"],
  fr: ["Les photos", "de nos clients", "Voir sur Google Maps"],
};

export function GuestPhotos() {
  const { language } = useI18n();
  const [first, second, action] = copy[language];
  return <FeatureCard id="customer" titleId="guest-photos-title" imageBase="/assets/foto-ospiti/gallery"
    heading={<>{first}<br />{second}</>} caption={action} href={photosUrl} />;
}
