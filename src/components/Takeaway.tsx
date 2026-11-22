import { useI18n, type Language } from "../i18n";
import { FeatureCard } from "./FeatureCard";
import { IllustrationCredit } from "./IllustrationCredit";

const copy: Record<Language, [string, string]> = {
  it: ["Pizzata a casa?", "Facciamo anche servizio da asporto!"],
  en: ["Pizza night at home?", "We do takeaway too!"],
  de: ["Pizzaabend zu Hause?", "Unsere Pizza gibt’s auch zum Mitnehmen!"],
  fr: ["Soirée pizza à la maison ?", "Nos pizzas sont aussi à emporter !"],
};

export function Takeaway() {
  const { language } = useI18n();
  const [heading, caption] = copy[language];
  const title = <>{heading.slice(0, -1)}<span className="takeaway-mark">?</span></>;
  return <FeatureCard id="asporto" titleId="takeaway-title" heading={title} caption={caption} credit={<IllustrationCredit />}
    imageBase="/assets/asporto/asporto-serale" />;
}
