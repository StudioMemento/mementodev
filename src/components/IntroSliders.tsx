import { Fragment, useMemo, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import data from "../data/menu.json";
import { useI18n, translateDescription, translateName, type Language } from "../i18n";
import { useCarousel } from "../hooks/useCarousel";
import { Chevron } from "./Icon";
import { Photo } from "./Photo";
import { HoloCard } from "./intro/HoloCard";
import { useIntroVisibility } from "./intro/useIntroVisibility";
function Controls({ labels, carousel }: { labels: string[]; carousel: ReturnType<typeof useCarousel> }) {
  const { copy } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const rail = railRef.current;
    const active = rail?.children[carousel.index] as HTMLButtonElement | undefined;
    if (!rail || !active) return;
    const center = () => {
      rail.scrollLeft = active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2;
    };
    center();
    const observer = new ResizeObserver(center);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [carousel.index]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, from: number) {
    const last = labels.length - 1;
    let next: number;
    switch (event.key) {
      case "Home": next = 0; break;
      case "End": next = last; break;
      case "ArrowLeft": next = from === 0 ? last : from - 1; break;
      case "ArrowRight": next = from === last ? 0 : from + 1; break;
      default: return;
    }
    event.preventDefault();
    carousel.select(next);
    const target = railRef.current?.children[next] as HTMLButtonElement | undefined;
    target?.focus({ preventScroll: true });
  }
  return <div className="pizza-controls" role="group" aria-label={copy.navigation}>
    <button className="pizza-arrow" type="button" aria-controls="forno" aria-label={copy.previous} onClick={() => carousel.move(-1)}><Chevron direction="left" /></button>
    <div ref={railRef} className="pizza-dots" role="group" aria-label={copy.menu}>
      {labels.map((label, i) => <button key={label} type="button" className="pizza-dot"
        aria-label={label} tabIndex={i === carousel.index ? 0 : -1} onKeyDown={event => navigate(event, i)}
        aria-pressed={i === carousel.index} onClick={() => carousel.select(i)}><span /></button>)}
    </div>
    <button className="pizza-arrow" type="button" aria-controls="forno" aria-label={copy.next} onClick={() => carousel.move(1)}><Chevron direction="right" /></button>
  </div>;
}

export function PizzaSlider() {
  const { t, language } = useI18n();
  const slides = useMemo(() => data.FORNO.map(([src, name, description]) => ({
    src,
    name: translateName(name, language),
    lines: description.split(/ · (?=base:)/).map(line => translateDescription(line, language)),
  })), [language]);
  const carousel = useCarousel(slides.length, language);
  return <section className="vr-pizza-carousel pizza-clean" id="pizza-slider" ref={carousel.rootRef} {...carousel.rootBind} aria-label={t.strip_k}>
    <h2 className="oven-heading">{t.strip_k}</h2>
    <div className="vr-pizza-viewport">
      <div className="vr-pizza-stage" id="forno" ref={carousel.stageRef} {...carousel.bind} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={t.strip_k}>
        {Array.from({length:carousel.renderCount},(_,slot) => {
          const logical = slot % slides.length;
          const { src, name } = slides[logical];
          const offset = ((slot + carousel.renderCount / 2) % carousel.renderCount) - carousel.renderCount / 2;
          return <figure key={slot} className="vr-pizza-card" data-carousel-card data-forno-index={logical} aria-hidden={slot !== 0} style={{ "--slide-x": `${offset * 390}px`, "--slide-distance": Math.abs(offset) } as CSSProperties}>
            <div className="vr-pizza-image"><Photo src={src} alt={name} enabled={carousel.isLoaded(logical)} eager sizes="(max-width: 767px) 80vw, (max-width: 1199px) 42vw, 500px" /></div>
          </figure>;
        })}
      </div>
    </div>
    <div className="pizza-copy" id="pizza-copy">
      {slides.map(({ name, lines }, i) => <div className="pizza-caption" key={`${i}-${language}`} aria-hidden={i !== carousel.index}>
        <h3>{name}</h3>
        <p>{lines.map((line, part) => (
          <Fragment key={part}>{part > 0 && <br />}{line}</Fragment>
        ))}</p>
      </div>)}
    </div>
    <Controls labels={slides.map(slide => slide.name)} carousel={carousel} />
  </section>;
}

const crustHeadings: Record<Language, [string, string]> = {
  it: ["Il cornicione,", "con qualcosa in più!"],
  en: ["A crust,", "with something extra!"],
  de: ["Ein Pizzarand,", "mit dem gewissen Extra!"],
  fr: ["Une bordure,", "avec un petit plus !"],
};
export function Cornicione() {
  const { t, language } = useI18n();
  const [line1, line2] = crustHeadings[language];
  const section = useIntroVisibility();
  const options = [{ id: "ricotta", name: "Ricotta" }, { id: "brie", name: "Brie" }, { id: "gorgonzola", name: t.gorgo }];
  return <section ref={section} className="vr-crust-intro" id="cornicione" data-fx-state="paused">
    <header className="crust-heading"><h2 className="hero-slogan"><span>{line1}</span><span>{line2}</span></h2></header>
    <div className="crust-grid">
      {options.map((option, i) => <HoloCard key={option.id}>
        <img className="crust-photo" src={`/assets/cornicione/${option.id}-portrait-768.webp`}
          srcSet={`/assets/cornicione/${option.id}-portrait-384.webp 384w, /assets/cornicione/${option.id}-portrait-768.webp 768w`}
          sizes="(max-width: 767px) 80vw, (max-width: 1199px) 23vw, (max-width: 2399px) 20vw, 13vw"
          width="768" height="1152" loading="lazy" decoding="async" draggable={false} alt={`${line1} ${option.name}`} />
        <div className="crust-card-shade" aria-hidden="true" />
        <div className="crust-card-copy"><h3>{option.name}</h3><p className="crust-price">€ {data.CORNICE[i][2]}</p></div>
      </HoloCard>)}
    </div>
  </section>;
}
