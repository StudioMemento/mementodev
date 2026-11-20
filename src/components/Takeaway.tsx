import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const copy: Record<Language, { title: string; invitation: string }> = {
  it: { title: "La tua pizza da asporto", invitation: "La sforniamo noi, passi a ritirarla tu." },
  en: { title: "Your favourite pizza to go", invitation: "We’ll bake it fresh for you to pick up." },
  de: { title: "Deine Pizza zum Mitnehmen", invitation: "Wir backen sie frisch, du holst sie ab." },
  fr: { title: "Ta pizza à emporter", invitation: "On la sort du four, tu passes la chercher." },
};

export function Takeaway() {
  const { language } = useI18n();
  const { title, invitation } = copy[language];
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard effect="window">
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/asporto/forno-asporto-mobile-768.webp" width="768" height="768" />
          <img
            src="/assets/asporto/forno-asporto-1536.webp"
            srcSet="/assets/asporto/forno-asporto-768.webp 768w, /assets/asporto/forno-asporto-1536.webp 1536w"
            sizes="(min-width: 2400px) 40vw, (min-width: 1200px) 60vw, (min-width: 768px) 70vw, 80vw"
            width="1536" height="864" loading="lazy" decoding="async" draggable={false} alt=""
          />
        </picture>
        <div className="crust-card-shade" aria-hidden="true" />
        <div className="takeaway-copy">
          <h2 id="takeaway-title">{title}</h2>
          <p>{invitation}</p>
        </div>
      </HoloCard>
    </section>
  );
}
