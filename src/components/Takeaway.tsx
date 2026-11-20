import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const titles: Record<Language, [string, string]> = {
  it: ["Gusto Via Roma nel comfort di casa?", "Facciamo anche servizio da asporto!"],
  en: ["A taste of Via Roma at home?", "We do takeaway too!"],
  de: ["Lust auf Via Roma zu Hause?", "Unsere Pizza gibt’s auch zum Mitnehmen!"],
  fr: ["Envie de Via Roma chez vous ?", "Nos pizzas sont aussi à emporter !"],
};

export function Takeaway() {
  const { language } = useI18n();
  const [question, answer] = titles[language];
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard>
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/asporto/asporto-mobile-768.webp" width="768" height="768" />
          <img className="crust-photo" src="/assets/asporto/asporto-1536.webp"
            srcSet="/assets/asporto/asporto-768.webp 768w, /assets/asporto/asporto-1536.webp 1536w"
            sizes="(min-width: 2400px) 26vw, (min-width: 1200px) 39vw, (min-width: 768px) 46vw, 52vw"
            width="1536" height="864" loading="lazy" decoding="async" draggable={false} alt="" />
        </picture>
        <h2 className="takeaway-copy" id="takeaway-title"><span className="takeaway-question">{question}</span>{" "}<span className="takeaway-answer">{answer}</span></h2>
      </HoloCard>
    </section>
  );
}
