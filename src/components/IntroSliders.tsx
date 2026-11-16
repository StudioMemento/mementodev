import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import data from "../data/menu.json";
import { useI18n, translateDescription, translateName, type Language } from "../i18n";
import { useCarousel } from "../hooks/useCarousel";
import { IntroBackground } from "./IntroBackground";
import { Chevron } from "./Icon";
import { Photo } from "./Photo";
import { useEffectActivity } from "./effects/useEffectActivity";
const Aurora = lazy(() => import("../vendor/v23-react-bits/Aurora"));
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
  const carousel = useCarousel(data.FORNO.length, 6500);
  const near = useNear(carousel.rootRef);
  const { active, reduced } = useEffectActivity(carousel.rootRef);
  return <section className="vr-pizza-carousel pizza-v23" id="pizza-slider" ref={carousel.rootRef} {...carousel.rootBind} aria-label={t.strip_k}>
    <IntroBackground active={active} reduced={reduced} />
    <header className="oven-crown">
      <div className="oven-aurora" aria-hidden="true">
        {near && <Suspense fallback={null}><Aurora colorStops={["#f97316", "#eab308", "#ef4444"]}
          height={0.3} glow={2} blend={0} layers={2} intro={false} direction="top"
          mouseInteraction={false} speed={0.35} paused={!active || reduced} dpr={1} /></Suspense>}
      </div>
      <h2>{t.strip_k}</h2>
    </header>
    <div className="vr-pizza-viewport">
      <div className="vr-pizza-stage" id="forno" ref={carousel.stageRef} {...carousel.bind} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={t.strip_k}>
        {data.FORNO.map(([src, name, description], logical) => {
          const offset = ((logical + data.FORNO.length / 2) % data.FORNO.length) - data.FORNO.length / 2;
          return <figure key={src} className={`vr-pizza-card${logical === carousel.index ? " is-current" : ""}`} data-carousel-card data-forno-index={logical} aria-hidden={logical !== carousel.index} style={{ "--slide-x": `${offset * 390}px`, "--slide-distance": Math.abs(offset) } as CSSProperties}>
            <div className="vr-pizza-image"><Photo src={src} alt={logical === carousel.index ? translateName(name, language) : ""} enabled={carousel.isLoaded(logical)} eager sizes="(max-width: 700px) 86vw, (max-width: 1100px) 42vw, 31vw" /></div>
            <figcaption>{translateName(name, language)}</figcaption>
            <p className="vr-pizza-ingredients">{translateDescription(description, language)}</p>
          </figure>;
        })}
      </div>
    </div>
    <Controls labels={data.FORNO.map(r => translateName(r[1], language))} carousel={carousel} />
  </section>;
}

function Cornicione() {
  const { t, language } = useI18n();
  const text = interactionCopy[language];
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const { active, reduced } = useEffectActivity(ref);
  const options = [
    { id: "ricotta", name: "Ricotta" },
    { id: "brie", name: "Brie" },
    { id: "gorgonzola", name: t.gorgo },
  ];
  return <section className="vr-crust-intro crust-v23" id="cornicione" ref={ref}>
    <IntroBackground active={active} reduced={reduced} />
    <header className="crust-heading">
      <h2>{text.crustTitle}</h2>
      <p>{text.crustBody}</p>
    </header>
    <div className="crust-options crust-grid">
      {options.map((option, i) => {
        const alt = `${text.filling} · ${option.name}`;
        const fallback = <img className="crust-photo" src={`/assets/cornicione/${option.id}-960.webp`}
          srcSet={`/assets/cornicione/${option.id}-480.webp 480w, /assets/cornicione/${option.id}-960.webp 960w`}
          sizes="(max-width: 700px) 31vw, 30vw" width="960" height="720" loading="lazy" decoding="async" alt={alt} />;
        return <article className="crust-option crust-card" key={option.id}>
          <div className="crust-art">
            {near && !reduced ? <Suspense fallback={fallback}>
              <HoloCard image={`/assets/cornicione/${option.id}-960.webp`} alt={alt}
                preset="glitter" scale={1.75} hoverScale={1.1} radius={8} tiltMax={15} edgeSparkle={0.2}
                intensity={0.32} glare={0.16} frame={0} foilColor="#e8ca85" idle={false} shadow={false}
                style={{ width: "100%", "--hc-ratio": 4/3 } as CSSProperties} />
            </Suspense> : fallback}
          </div>
          <div className="crust-card-copy">
            <h3>{option.name}</h3>
            <p className="crust-price"><strong>+ € {data.CORNICE[i][2]}</strong><span>{text.perPizza}</span></p>
          </div>
        </article>;
      })}
    </div>
  </section>;
}

export function IntroSliders() { return <><Oven /><Cornicione /></>; }
