import { useI18n, type Language } from "../i18n";
import { FeatureCard } from "./FeatureCard";

const copy: Record<Language, [string, string]> = {
  it: ["Pizzata nel comfort di casa?", "Facciamo anche servizio da asporto!"],
  en: ["Pizza night at home?", "We do takeaway too!"],
  de: ["Pizzaabend zu Hause?", "Unsere Pizza gibt’s auch zum Mitnehmen!"],
  fr: ["Soirée pizza à la maison ?", "Nos pizzas sont aussi à emporter !"],
};

export function Takeaway() {
  const { language } = useI18n();
  const [heading, caption] = copy[language];
  return <FeatureCard id="asporto" titleId="takeaway-title" heading={heading} caption={caption}>
    <img className="crust-photo" src="/assets/asporto/pizzata-960.webp"
      srcSet="/assets/asporto/pizzata-480.webp 480w, /assets/asporto/pizzata-960.webp 960w, /assets/asporto/pizzata-1600.webp 1600w"
      sizes="(min-width:2400px) 40vw, (min-width:1200px) 60vw, (min-width:768px) 70vw, 80vw"
      width="1600" height="900" loading="lazy" decoding="async" draggable={false} alt="" />
  </FeatureCard>;
}
