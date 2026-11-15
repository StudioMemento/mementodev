import { useEffect, useRef, useState } from "react";
import { languages, useI18n } from "../i18n";
import { Icon } from "./Icon";
import GradualBlur from "../vendor/react-bits/GradualBlur";
export function Header() {
  const { language, setLanguage, copy } = useI18n();
  return (
    <>
      <GradualBlur
        position="top"
        target="page"
        height="144px"
        strength={1.1}
        layers={8}
        tint="#09090b90"
        zIndex={40}
        className="page-edge-blur top-edge"
      />
      <header className="site-top">
        <a
          className="site-brand"
          href="#home"
          aria-label="Pizzeria Via Roma — home"
        >
          <img
            src="/assets/flame.png"
            width="42"
            height="46"
            alt="Pizzeria Via Roma"
          />
        </a>
        <div className="lang" role="group" aria-label={copy.changeLanguage}>
          {languages.map((l) => (
            <button
              key={l}
              type="button"
              data-lang={l}
              className={language === l ? "on" : ""}
              onClick={() => setLanguage(l)}
              aria-pressed={language === l}
              lang={l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
    </>
  );
}
export function Dock() {
  const { t, copy } = useI18n();
  const [active, setActive] = useState("home");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let selected = "home";
      for (const id of ["menu", "gallery", "dove"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.45)
          selected = id;
      }
      setActive(selected);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);
  return (
    <>
      <GradualBlur
        position="bottom"
        target="page"
        height="190px"
        strength={1.3}
        layers={8}
        tint="#09090b90"
        zIndex={40}
        className="page-edge-blur bottom-edge"
      />
      <nav className="vr-dock" aria-label={copy.navigation}>
        {[
          { id: "menu", icon: "fork-knife", label: t.tab_menu },
          { id: "gallery", icon: "fire", label: t.tab_storia },
          { id: "dove", icon: "info", label: t.tab_dove },
          { id: "call", icon: "phone", label: t.tab_chiama },
        ].map((x) => (
          <a
            key={x.id}
            href={x.id === "call" ? "tel:+390427541232" : `#${x.id}`}
            aria-current={active === x.id ? "location" : undefined}
          >
            <span className="dock-tile">
              <Icon name={x.icon} />
            </span>
            <span className="dock-label">{x.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = document.documentElement.scrollHeight - innerHeight;
      const progress =
        total > 0 ? Math.max(0, Math.min(1, scrollY / total)) : 0;
      if (ref.current) {
        // Keep a visible leading mark at the top, then fill the actual travel.
        ref.current.style.transform = `scaleY(${Math.max(24 / innerHeight, progress)})`;
        ref.current.dataset.progress = progress.toFixed(4);
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    update();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}
