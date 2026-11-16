import type { CSSProperties } from "react";
import data from "../data/menu.json";
import { useI18n, translateDescription, translateName, type Language } from "../i18n";
import { useCarousel } from "../hooks/useCarousel";
import { Chevron } from "./Icon";
import { Photo } from "./Photo";
function Controls({ labels, carousel }: { labels: string[]; carousel: ReturnType<typeof useCarousel> }) {
  const { copy } = useI18n();
  return <div className="pizza-controls" aria-label={copy.navigation}>
    <button className="pizza-arrow" type="button" aria-label={copy.previous} onClick={() => carousel.move(-1)}><Chevron direction="left" /></button>
    <div className="pizza-dots" role="group" aria-label={copy.menu}>
      {labels.map((label, i) => <button key={label} type="button" className="pizza-dot"
        aria-label={label} aria-pressed={i === carousel.index} onClick={() => carousel.select(i)}><span /></button>)}
    </div>
    <button className="pizza-arrow" type="button" aria-label={copy.next} onClick={() => carousel.move(1)}><Chevron direction="right" /></button>
  </div>;
}

function Oven() {
  const { t, language } = useI18n();
  const carousel = useCarousel(data.FORNO.length, language);
  return <section className="vr-pizza-carousel pizza-clean" id="pizza-slider" ref={carousel.rootRef} {...carousel.rootBind} aria-label={t.strip_k}>
    <h2 className="oven-heading">{t.strip_k}</h2>
    <div className="vr-pizza-viewport">
      <div className="vr-pizza-stage" id="forno" ref={carousel.stageRef} {...carousel.bind} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={t.strip_k}>
        {data.FORNO.map(([src, name], logical) => {
          const offset = ((logical + data.FORNO.length / 2) % data.FORNO.length) - data.FORNO.length / 2;
          return <figure key={src} className={`vr-pizza-card${logical === carousel.index ? " is-current" : ""}`} data-carousel-card data-forno-index={logical} aria-hidden={logical !== carousel.index} style={{ "--slide-x": `${offset * 390}px`, "--slide-distance": Math.abs(offset) } as CSSProperties}>
            <div className="vr-pizza-image"><Photo src={src} alt={logical === carousel.index ? translateName(name, language) : ""} enabled={carousel.isLoaded(logical)} eager sizes="(max-width: 767px) 80vw, (max-width: 1199px) 50vw, 32vw" /></div>
          </figure>;
        })}
      </div>
    </div>
    <div className="pizza-copy" id="pizza-copy">
      {data.FORNO.map(([, name, description], i) => <div className="pizza-caption" key={`${i}-${language}`} aria-hidden={i !== carousel.index}>
        <h3>{translateName(name, language)}</h3>
        <p>{translateDescription(description, language)}</p>
      </div>)}
    </div>
    <Controls labels={data.FORNO.map(r => translateName(r[1], language))} carousel={carousel} />
  </section>;
}

const crustHeadings: Record<Language, [string, string, string]> = {
  it: ["Il cornicione,", "con qualcosa in più!", "aggiunta di:"],
  en: ["A crust,", "with something extra!", "filled with:"],
  de: ["Ein Pizzarand,", "mit dem gewissen Extra!", "gefüllt mit:"],
  fr: ["Une bordure,", "avec un petit plus !", "garnie de :"],
};
function Cornicione() {
  const { t, language } = useI18n();
  const [line1, line2, addition] = crustHeadings[language];
  const options = [{ id: "ricotta", name: "Ricotta" }, { id: "brie", name: "Brie" }, { id: "gorgonzola", name: t.gorgo }];
  return <section className="vr-crust-intro" id="cornicione">
    <header className="crust-heading"><h2><span>{line1}</span><span>{line2}</span></h2></header>
    <div className="crust-grid">
      {options.map((option, i) => <article className="crust-card" key={option.id}>
        <img className="crust-photo" src={`/assets/cornicione/${option.id}-portrait-768.webp`}
          srcSet={`/assets/cornicione/${option.id}-portrait-384.webp 384w, /assets/cornicione/${option.id}-portrait-768.webp 768w`}
          sizes="(max-width: 767px) 80vw, (max-width: 1199px) 23vw, (max-width: 2399px) 20vw, 13vw"
          width="768" height="1152" loading="lazy" decoding="async" alt={`${line1} ${option.name}`} />
        <div className="crust-card-shade" aria-hidden="true" />
        <div className="crust-card-copy"><span className="crust-addition">{addition}</span><h3>{option.name}</h3><p className="crust-price">€ {data.CORNICE[i][2]}</p></div>
      </article>)}
    </div>
  </section>;
}
export function IntroSliders() { return <><Oven /><Cornicione /></>; }
