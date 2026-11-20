import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const titles: Record<Language, [string, string, string]> = {
  it: ["Gusto Via Roma", "nel comfort di casa?", "Facciamo anche servizio da asporto!"],
  en: ["A taste of Via Roma", "at home?", "We do takeaway too!"],
  de: ["Lust auf Via Roma", "zu Hause?", "Unsere Pizza gibt’s auch zum Mitnehmen!"],
  fr: ["Envie de Via Roma", "chez vous ?", "Nos pizzas sont aussi à emporter !"],
};

export function Takeaway() {
  const { language } = useI18n();
  const [firstLine, secondLine, answer] = titles[language];
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard>
        <img className="crust-photo" src="/assets/asporto/margherita-960.webp"
          srcSet="/assets/asporto/margherita-480.webp 480w, /assets/asporto/margherita-960.webp 960w, /assets/asporto/margherita-1600.webp 1600w"
          sizes="(min-width: 2400px) 40vw, (min-width: 1200px) 60vw, (min-width: 768px) 70vw, 80vw"
          width="1600" height="900" loading="lazy" decoding="async" draggable={false} alt="" />
        <div className="crust-card-shade" aria-hidden="true" />
        <div className="takeaway-copy">
          <h2 id="takeaway-title">{firstLine}<br />{secondLine}</h2>
          <p>{answer}</p>
        </div>
      </HoloCard>
    </section>
  );
}
