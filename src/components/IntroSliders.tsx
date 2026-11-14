import { useState, useEffect, useRef, type CSSProperties } from "react";
import data from "../data/menu.json";
import { useI18n, translateDescription } from "../i18n";
import { useDrag, wrap } from "../hooks/useDrag";
import { Chevron } from "./Icon";
import { Photo } from "./Photo";
import { categoryOrder } from "./Menu";
function DotButtons({
  labels,
  index,
  onSelect,
  id,
}: {
  labels: string[];
  index: number;
  onSelect: (i: number) => void;
  id: string;
}) {
  return (
    <div className="dots" id={id}>
      {labels.map((label, i) => (
        <button
          key={i}
          type="button"
          className={index === i ? "on" : ""}
          aria-label={label}
          aria-pressed={index === i}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
function Oven() {
  const { t, copy, language } = useI18n();
  const [index, setIndex] = useState(0);
  const step = (direction: number) =>
    setIndex((i) => wrap(i + direction, data.FORNO.length));
  const drag = useDrag(step);
  return (
    <section className="strip-wrap" id="pizza-slider" aria-label={t.strip_k}>
      <div className="strip-head fx on">
        <p className="k-s">{t.strip_k}</p>
      </div>
      <div className="pizza-viewport">
        <div
          className="strip oven-stage"
          id="forno"
          {...drag}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.strip_k}
        >
          {[-2, -1, 0, 1, 2].map((offset) => {
            const logical = wrap(index + offset, data.FORNO.length);
            const [src, name, description] = data.FORNO[logical];
            const d = translateDescription(description, language);
            return (
              <figure
                key={logical}
                className={`oven-card ${offset === 0 ? "mid" : ""}`}
                data-forno-index={logical}
                style={{ "--offset": offset } as CSSProperties}
                aria-hidden={offset !== 0}
              >
                <div className="shot">
                  <Photo
                    className="pizza bgimg"
                    src={src}
                    alt={offset === 0 ? name : ""}
                  />
                </div>
                <figcaption>
                  <span>{name}</span>
                </figcaption>
                <p className="forno-ingredients">
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </p>
              </figure>
            );
          })}
        </div>
        <button
          className="pizza-arrow previous"
          type="button"
          aria-label={copy.previous}
          onClick={() => step(-1)}
        >
          <Chevron direction="left" />
        </button>
        <button
          className="pizza-arrow next"
          type="button"
          aria-label={copy.next}
          onClick={() => step(1)}
        >
          <Chevron direction="right" />
        </button>
      </div>
      <DotButtons
        labels={data.FORNO.map((r) => r[1])}
        index={index}
        onSelect={setIndex}
        id="fornodots"
      />
    </section>
  );
}
function Cornicione() {
  const { t } = useI18n();
  return (
    <section className="screen compact teaser" id="cornicione">
      <div className="inner fx on">
        <div className="pz-s">
          <span className="arc" />
          <Photo
            className="pizza"
            src="assets/pizze/cornice-ripieno.webp"
            alt={t.cornice}
          />
        </div>
        <div className="crust-copy">
          <h2>{t.t_title}</h2>
          <p>{t.t_body}</p>
          <div className="mini-list">
            <div>
              <span>Ricotta</span>
              <b>3,00</b>
            </div>
            <div>
              <span>Brie</span>
              <b>3,00</b>
            </div>
            <div>
              <span>{t.gorgo}</span>
              <b>3,00</b>
            </div>
          </div>
          <a className="text-link crust-link" href="#menu">
            {t.t_cta}
            <Chevron direction="right" />
          </a>
        </div>
      </div>
    </section>
  );
}
function Categories() {
  const { t, copy, language } = useI18n();
  const [index, setIndex] = useState(0);
  const section = useRef<HTMLElement>(null);
  const step = (d: number) =>
    setIndex((i) => wrap(i + d, categoryOrder.length));
  const drag = useDrag(step);
  useEffect(() => {
    const root = section.current,
      window = root?.querySelector<HTMLElement>(".is-active .preview-window");
    if (!root || !window) return;
    const measure = () =>
      root.style.setProperty(
        "--category-arrow-y",
        `${window.getBoundingClientRect().top - root.getBoundingClientRect().top + window.getBoundingClientRect().height / 2}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(window);
    measure();
    return () => observer.disconnect();
  }, [index, language]);
  return (
    <section id="catshow" ref={section} aria-label={t.m_title}>
      <div className="edge l" />
      <div className="edge r" />
      <button
        className="chev l"
        onClick={() => step(-1)}
        aria-label={copy.previous}
      >
        <Chevron direction="left" />
      </button>
      <button className="chev r" onClick={() => step(1)} aria-label={copy.next}>
        <Chevron direction="right" />
      </button>
      <div
        className="rail category-stage"
        id="showrail"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={t.m_title}
        {...drag}
      >
        {[-1, 0, 1].map((offset) => {
          const logical = wrap(index + offset, categoryOrder.length);
          const id = categoryOrder[logical];
          return (
            <div
              key={id}
              className={`slide ${offset === 0 ? "is-active" : ""}`}
              style={{ "--offset": offset } as CSSProperties}
              aria-hidden={offset !== 0}
              data-cat={id}
            >
              <article className="preview-card">
                <header className="preview-head">
                  <h2>{t.cats[id][0]}</h2>
                </header>
                <a
                  draggable={false}
                  className="preview-window"
                  href={`#cat-${id}`}
                  aria-label={t.cats[id][0]}
                  tabIndex={offset === 0 ? 0 : -1}
                >
                  <span className="preview-trace t1" />
                  <span className="preview-trace t2" />
                  <Photo
                    className="preview-cutout bgimg"
                    src={data.MENU_ART[id]}
                    alt={offset === 0 ? t.cats[id][0] : ""}
                  />
                </a>
                <p className={`sub ${t.cats[id][1] ? "" : "is-empty"}`}>
                  {t.cats[id][1] || "\u00a0"}
                </p>
              </article>
            </div>
          );
        })}
      </div>
      <DotButtons
        labels={categoryOrder.map((id) => t.cats[id][0])}
        index={index}
        onSelect={setIndex}
        id="showdots"
      />
    </section>
  );
}
export function IntroSliders() {
  return (
    <>
      <Oven />
      <Cornicione />
      <Categories />
    </>
  );
}
