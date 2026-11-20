import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const copy: Record<Language, { title: string; invitation: string }> = {
  it: { title: "Stasera pizza sul divano?", invitation: "La prepariamo da asporto!" },
  en: { title: "Pizza on the sofa tonight?", invitation: "We’ll box it up for you!" },
  de: { title: "Heute Pizza auf dem Sofa?", invitation: "Auch zum Mitnehmen!" },
  fr: { title: "Ce soir, pizza sur le canapé ?", invitation: "On la prépare à emporter !" },
};

export function Takeaway() {
  const { language } = useI18n();
  const { title, invitation } = copy[language];
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard>
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/asporto/scatole-mobile-768.webp" width="768" height="768" />
          <img
            src="/assets/asporto/scatole-1536.webp"
            srcSet="/assets/asporto/scatole-768.webp 768w, /assets/asporto/scatole-1536.webp 1536w"
            sizes="(min-width: 2400px) 40vw, (min-width: 1200px) 60vw, (min-width: 768px) 70vw, 80vw"
            width="1536" height="1024" loading="lazy" decoding="async" draggable={false} alt=""
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
