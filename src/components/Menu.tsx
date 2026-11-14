import { useEffect, useRef, useState } from "react";
import data from "../data/menu.json";
import { Copy, translateDescription, translateName, useI18n } from "../i18n";
import { getAllergenInfo } from "../data/allergen-info";
import { useDialog } from "./DialogContext";
import { Icon } from "./Icon";
import { Photo } from "./Photo";
import GradualBlur from "../vendor/react-bits/GradualBlur";
export const categoryOrder = [
  "classiche",
  "audaci",
  "bianche",
  "calzoni",
  "cucina",
  "stuzzicherie",
  "dolci",
  "bevande",
] as const;
export function AllergenTrigger({
  name,
  codes = "",
  description = "",
}: {
  name: string;
  codes?: string;
  description?: string;
}) {
  const { copy, language } = useI18n();
  const { open } = useDialog();
  const info = getAllergenInfo(name, description, codes);
  if (name === "Coperto" || (!info.codes.length && !info.frozen)) return null;
  return (
    <button
      className="allergen-trigger"
      type="button"
      aria-haspopup="dialog"
      aria-label={`${copy.allergens}: ${translateName(name, language)}, ${info.codes.join(", ")}`}
      onClick={() => open({ kind: "allergens", name, description, codes })}
    >
      {info.codes.join(" · ")}
      {info.frozen && <span className="frozen-mark">*</span>}
    </button>
  );
}
function MenuItem({ row }: { row: string[] }) {
  const [name, description, price, codes = "", qualifier = ""] = row;
  const { language } = useI18n();
  const desc = translateDescription(description, language)
    .split(" · ")
    .map((part) =>
      part ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    );
  return (
    <div className="item" data-menu-item={name}>
      <div className="row">
        <span className="label">
          <span className="nome">{translateName(name, language)}</span>
          {qualifier && (
            <span className="qualifier">
              {translateDescription(qualifier, language)}
            </span>
          )}
        </span>
        <span className="dots" />
        <span className="prezzo">{price}</span>
      </div>
      {description && (
        <p className="desc">
          {desc.map((s, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {s}
            </span>
          ))}
        </p>
      )}
      <AllergenTrigger name={name} codes={codes} description={description} />
    </div>
  );
}
function Rows({ rows }: { rows: string[][] }) {
  return (
    <>
      {rows.map((row, i) => (
        <MenuItem key={`${row[0]}-${i}`} row={row} />
      ))}
    </>
  );
}
function Drinks() {
  const { t, language } = useI18n();
  const bottles = data.BOTTIGLIA as [string, string, string[][]][];
  return (
    <>
      <Rows rows={data.ACQUA_BIBITE} />
      <p className="groupline">{t.bottiglia}</p>
      {bottles.map(([name, desc, rows]) => (
        <div key={name}>
          <p className="groupsub">
            <strong>{name}</strong> · {translateDescription(desc, language)}
          </p>
          <Rows rows={rows} />
        </div>
      ))}
      <p className="groupline">{t.spina}</p>
      {data.SPINA.map((b) => (
        <div className="item multi drink-item" key={b[0]} data-menu-item={b[0]}>
          <div className="row">
            <span className="label">
              <span className="nome">{b[0]}</span>
              {b[1] && (
                <span className="qualifier">
                  {translateDescription(b[1], language)}
                </span>
              )}
            </span>
            <span className="dots" />
            <div className="pricegrid">
              {["0,3 l", "0,5 l", `${t.caraffa} 1,5 l`].map((s, i) => (
                <span key={s}>
                  <em>{s}</em>
                  <b>{b[i + 2]}</b>
                </span>
              ))}
            </div>
          </div>
          <AllergenTrigger name={b[0]} description={b[1]} />
        </div>
      ))}
      <p className="groupline">{t.vini}</p>
      {data.VINI.map((v) => (
        <div className="item multi drink-item" key={v[0]} data-menu-item={v[0]}>
          <div className="row">
            <span className="label">
              <span className="nome">{v[0]}</span>
            </span>
            <span className="dots" />
            <div className="pricegrid">
              {[t.calice, `${t.caraffa} 0,5 l`, `${t.bott} 0,75 l`].map(
                (s, i) => (
                  <span key={s}>
                    <em>{s}</em>
                    <b>{v[i + 1]}</b>
                  </span>
                ),
              )}
            </div>
          </div>
          <AllergenTrigger name={v[0]} />
        </div>
      ))}
    </>
  );
}
export default function Menu() {
  const { t } = useI18n();
  const [active, setActive] = useState<string>("classiche");
  const chips = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(e.target.id.replace("cat-", ""));
      },
      { rootMargin: "-150px 0px -55% 0px" },
    );
    document.querySelectorAll(".mcat").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const rail = chips.current;
    const selected = rail?.querySelector<HTMLElement>(`[data-go="${active}"]`);
    if (!rail || !selected) return;
    const x =
      selected.offsetLeft - (rail.clientWidth - selected.offsetWidth) / 2;
    rail.scrollTo({
      left: x,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [active]);
  useEffect(() => {
    const rail = chips.current;
    if (!rail) return;
    const check = () => {
      wrap.current?.classList.toggle("can-l", rail.scrollLeft > 5);
      wrap.current?.classList.toggle(
        "can-r",
        rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 5,
      );
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(rail);
    rail.addEventListener("scroll", check, { passive: true });
    return () => {
      ro.disconnect();
      rail.removeEventListener("scroll", check);
    };
  }, []);
  return (
    <section id="menu">
      <div className="menu-head fx on">
        <p className="k-s">{t.m_eyebrow}</p>
        <h2>{t.m_title}</h2>
      </div>
      <div className="chipbar">
        <GradualBlur
          position="top"
          height="80px"
          strength={0.35}
          layers={4}
          tint="#080809dc"
          zIndex={-1}
        />
        <div className="chipbar-inner" ref={wrap}>
          <button
            className="chipchev l"
            aria-label="←"
            onClick={() =>
              chips.current?.scrollBy({ left: -220, behavior: "smooth" })
            }
          >
            <Icon name="caret-left" />
          </button>
          <button
            className="chipchev r"
            aria-label="→"
            onClick={() =>
              chips.current?.scrollBy({ left: 220, behavior: "smooth" })
            }
          >
            <Icon name="caret-right" />
          </button>
          <nav
            className="chips scrollable"
            id="chips"
            ref={chips}
            aria-label={t.m_title}
          >
            {categoryOrder.map((id) => (
              <button
                key={id}
                type="button"
                data-go={id}
                className={active === id ? "on" : ""}
                aria-current={active === id ? "location" : undefined}
                onClick={() => {
                  document
                    .getElementById(`cat-${id}`)
                    ?.scrollIntoView({
                      behavior: matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                        ? "instant"
                        : "smooth",
                    });
                  history.replaceState(null, "", `#cat-${id}`);
                  setActive(id);
                }}
              >
                {t.cats[id][0]}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div id="carta">
        {categoryOrder.map((id) => {
          const [title, tag] = t.cats[id];
          const rows = (data.MENU as Record<string, string[][]>)[id];
          return (
            <section className="mcat fx on has-art" id={`cat-${id}`} key={id}>
              <header className="mcat-head">
                <h3>{title}</h3>
                {tag && <p className="tag">{tag}</p>}
              </header>
              <figure className={`menu-art menu-art-${id}`}>
                <div className="menu-art-window">
                  <Photo src={data.MENU_ART[id]} alt={title} />
                </div>
              </figure>
              <div className="mcat-body">
                {rows && <Rows rows={rows} />}{" "}
                {id === "calzoni" && (
                  <>
                    <p className="groupline">{t.varianti}</p>
                    <Rows rows={data.VARIANTI} />
                    <p className="variant-callout">
                      <Copy value={t.variant_callout} />
                    </p>
                    <Rows rows={data.CORNICE} />
                  </>
                )}
                {id === "dolci" && <p className="dolci-note">{t.dolci_note}</p>}
                {id === "bevande" && <Drinks />}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
