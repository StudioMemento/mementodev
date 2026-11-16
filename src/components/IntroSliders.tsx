import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import data from "../data/menu.json";
import { useI18n, translateDescription, translateName, type Language } from "../i18n";
import { useCarousel } from "../hooks/useCarousel";
import { Chevron } from "./Icon";
import { Photo } from "./Photo";
import { useEffectActivity } from "./effects/useEffectActivity";
const HoloCard = lazy(() => import("../vendor/v23-react-bits/HoloCard"));
export const interactionCopy: Record<Language, { drag: string; pause: string; play: string; crustKicker: string; crustTitle: string; crustBody: string; ricotta: string; brie: string; gorgonzola: string; filling: string; perPizza: string; discover: string }> = {
  it: { drag: "Trascina, scegli, lasciati tentare.", pause: "Pausa scorrimento", play: "Riprendi scorrimento", crustKicker: "FINO ALL’ULTIMO MORSO", crustTitle: "Il cornicione con qualcosa in più!", crustBody: "Scegli il ripieno e rendi la tua pizza unica.", ricotta: "Morbida e delicata", brie: "Cremoso e avvolgente", gorgonzola: "Dolce, dal gusto deciso", filling: "Cornicione ripieno", perPizza: "alla tua pizza", discover: "Esplora il menù" },
  en: { drag: "Drag, choose, give in to temptation.", pause: "Pause autoplay", play: "Resume autoplay", crustKicker: "TO THE VERY LAST BITE", crustTitle: "A crust with something extra!", crustBody: "Choose your filling and make your pizza unique.", ricotta: "Soft and delicate", brie: "Rich and creamy", gorgonzola: "Sweet, with a bold character", filling: "Stuffed crust", perPizza: "per pizza", discover: "Explore the menu" },
  de: { drag: "Ziehen, wählen, genießen.", pause: "Automatik pausieren", play: "Automatik fortsetzen", crustKicker: "BIS ZUM LETZTEN BISSEN", crustTitle: "Ein Pizzarand mit dem gewissen Extra!", crustBody: "Wähle deine Füllung und mache deine Pizza einzigartig.", ricotta: "Weich und mild", brie: "Vollmundig und cremig", gorgonzola: "Mild, mit kräftigem Charakter", filling: "Gefüllter Rand", perPizza: "pro Pizza", discover: "Speisekarte entdecken" },
  fr: { drag: "Faites glisser, choisissez, savourez.", pause: "Mettre le défilement en pause", play: "Reprendre le défilement", crustKicker: "JUSQU’À LA DERNIÈRE BOUCHÉE", crustTitle: "Une bordure avec un petit plus !", crustBody: "Choisissez votre garniture et rendez votre pizza unique.", ricotta: "Douce et délicate", brie: "Fondant et crémeux", gorgonzola: "Doux, au caractère affirmé", filling: "Bordure farcie", perPizza: "par pizza", discover: "Découvrir la carte" },
};

function useNear(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "360px 0px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return near;
}

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
  const carousel = useCarousel(data.FORNO.length, 6500, 0, 900);
  return <section className="vr-pizza-carousel pizza-v24" id="pizza-slider" ref={carousel.rootRef} {...carousel.rootBind} aria-label={t.strip_k}>
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
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const { reduced } = useEffectActivity(ref);
  const [line1, line2, addition] = crustHeadings[language];
  const options = [{ id: "ricotta", name: "Ricotta" }, { id: "brie", name: "Brie" }, { id: "gorgonzola", name: t.gorgo }];
  return <section className="vr-crust-intro crust-v24" id="cornicione" ref={ref}>
    <header className="crust-heading"><h2><span>{line1}</span><span>{line2}</span></h2></header>
    <div className="crust-options crust-grid">
      {options.map((option, i) => {
        const alt = `${interactionCopy[language].filling} · ${option.name}`;
        const src = `/assets/cornicione/${option.id}-portrait-768.webp`;
        const fallback = <img className="crust-photo" src={src}
          srcSet={`/assets/cornicione/${option.id}-portrait-384.webp 384w, ${src} 768w`}
          sizes="(max-width: 767px) 26vw, (max-width: 1199px) 23vw, (max-width: 2399px) 20vw, 13vw" width="768" height="1152" loading="lazy" decoding="async" alt={alt} />;
        return <article className="crust-option crust-card" key={option.id}>
          <div className="crust-art">
            {near && !reduced ? <Suspense fallback={fallback}>
              <HoloCard image={src} alt={alt} preset="glitter" scale={1.75} hoverScale={1.04} radius={8} tiltMax={6} edgeSparkle={0.2}
                intensity={0.2} glare={0.12} frame={0} foilColor="#c6ab70" idle={false} shadow={false}
                style={{ width: "100%", "--hc-ratio": 2/3 } as CSSProperties} />
            </Suspense> : fallback}
          </div>
          <div className="crust-card-shade" aria-hidden="true" />
          <div className="crust-card-copy">
            <span className="crust-addition">{addition}</span>
            <h3>{option.name}</h3>
            <p className="crust-price">€ {data.CORNICE[i][2]}</p>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
export function IntroSliders() { return <><Oven /><Cornicione /></>; }
