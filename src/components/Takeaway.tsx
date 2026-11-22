import { useI18n, type Language } from "../i18n";
import { FeatureCard } from "./FeatureCard";

const copy: Record<Language, [string, string]> = {
  it: ["Gusto Via Roma nel comfort di casa?", "Facciamo anche servizio da asporto!"],
  en: ["A taste of Via Roma at home?", "We do takeaway too!"],
  de: ["Lust auf Via Roma zu Hause?", "Unsere Pizza gibt’s auch zum Mitnehmen!"],
  fr: ["Envie de Via Roma chez vous ?", "Nos pizzas sont aussi à emporter !"],
};

export function Takeaway() {
  const { language } = useI18n();
  const [heading, caption] = copy[language];
  return <FeatureCard id="asporto" titleId="takeaway-title" imageBase="/assets/asporto/pizza-in-cartone"
    heading={heading} caption={caption} />;
}
