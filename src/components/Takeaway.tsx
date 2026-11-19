import { useI18n, type Language } from "../i18n";
import { HoloCard } from "./intro/HoloCard";

const copy: Record<Language, { title: string; invitation: string }> = {
  it: { title: "Stasera pizza sul divano?", invitation: "Scegli la tua preferita, te la prepariamo da asporto!" },
  en: { title: "Pizza on the sofa tonight?", invitation: "Pick your favourite and we’ll box it up for you!" },
  de: { title: "Heute Pizza auf dem Sofa?", invitation: "Such dir deine Lieblingspizza aus. Wir packen sie dir zum Mitnehmen ein!" },
  fr: { title: "Ce soir, pizza sur le canapé ?", invitation: "Choisissez votre préférée, on vous la prépare à emporter !" },
};

export function Takeaway() {
  const { language } = useI18n();
  const { title, invitation } = copy[language];
  return (
    <section className="takeaway" id="asporto" aria-labelledby="takeaway-title">
      <HoloCard>
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/asporto/scatola-mobile-768.webp" width="768" height="768" />
          <img
            src="/assets/asporto/scatola-1536.webp"
            srcSet="/assets/asporto/scatola-768.webp 768w, /assets/asporto/scatola-1536.webp 1536w"
            sizes="(min-width: 1350px) 740px, 53vw"
            width="1536" height="1024" loading="lazy" decoding="async" draggable={false} alt=""
          />
        </picture>
        <div className="takeaway-copy">
          <h2 id="takeaway-title">{title}</h2>
          <p>{invitation}</p>
        </div>
      </HoloCard>
    </section>
  );
}
