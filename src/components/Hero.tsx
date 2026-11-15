import { useRef } from "react";
import { useI18n } from "../i18n";
import { Chevron } from "./Icon";
import ShinyText from "../vendor/react-bits/ShinyText";
import SectionAtmosphere from "./effects/SectionAtmosphere";
import { useEffectActivity } from "./effects/useEffectActivity";

export default function Hero() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const { active, reduced } = useEffectActivity(section);
  const lines = t.tagline.replace(/<[^>]+>/g, "|").split("|").filter(Boolean);
  return (
    <section id="home" ref={section} className="vr-hero" aria-label="Pizzeria Via Roma" data-fx-active={active}>
      <SectionAtmosphere variant="hero" />
      <div className="hero-composition">
        <p className="hero-location">{t.sp_kicker}</p>
        <div
          className="hero-logo-fx"
          ref={logo}
          onPointerMove={(e) => {
            if (reduced || e.pointerType !== "mouse" || !logo.current) return;
            const b = e.currentTarget.getBoundingClientRect();
            logo.current.style.setProperty("--logo-x", `${((e.clientX - b.left) / b.width - 0.5) * 4}deg`);
            logo.current.style.setProperty("--logo-y", `${-((e.clientY - b.top) / b.height - 0.5) * 4}deg`);
          }}
          onPointerLeave={() => {
            logo.current?.style.setProperty("--logo-x", "0deg");
            logo.current?.style.setProperty("--logo-y", "0deg");
          }}
        >
          <img className="hero-logo" src="/assets/logo.png" alt="Pizzeria Via Roma" width="800" height="800" fetchPriority="high" />
          <span className="hero-logo-sheen" aria-hidden="true">
            <ShinyText
              className="logo-glint"
              text=" "
              color="rgba(198,171,112,0)"
              shineColor="#efd594"
              speed={4.5}
              delay={7}
              shineWidth={22}
              softness={0.9}
              angle={125}
              direction="right"
              disabled={!active || reduced}
            />
          </span>
        </div>
        <h1 className="hero-slogan">
          {lines.map((line, i) => (
            <span className="hero-slogan-line" key={line} style={{ animationDelay: `${180 + i * 160}ms` }}>
              <ShinyText text={line} color="#e4dfd4" shineColor="#fff1d2" speed={5.5} delay={9} shineWidth={32} softness={0.95} angle={120} direction="right" disabled={!active || reduced} />
            </span>
          ))}
        </h1>
        <a className="hero-cta text-link" href="#menu"><span>{t.home_cta}</span><Chevron /></a>
      </div>
    </section>
  );
}
