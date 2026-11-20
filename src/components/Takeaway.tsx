import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const titles: Record<Language, string> = {
  it: "Facciamo anche servizio da asporto!",
  en: "Our pizzas are available to take away!",
  de: "Unsere Pizza gibt’s auch zum Mitnehmen!",
  fr: "Nos pizzas sont aussi à emporter !",
};

export function Takeaway() {
  const { language } = useI18n();
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard>
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/asporto/asporto-mobile-768.webp" width="768" height="768" />
          <img className="crust-photo" src="/assets/asporto/asporto-1536.webp"
            srcSet="/assets/asporto/asporto-768.webp 768w, /assets/asporto/asporto-1536.webp 1536w"
            sizes="(min-width: 2400px) 40vw, (min-width: 1200px) 60vw, (min-width: 768px) 70vw, 80vw"
            width="1536" height="864" loading="lazy" decoding="async" draggable={false} alt="" />
        </picture>
        <div className="crust-card-shade" aria-hidden="true" />
        <div className="crust-card-copy takeaway-copy"><h2 id="takeaway-title">{titles[language]}</h2></div>
      </HoloCard>
    </section>
  );
}
