import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { Chevron } from "./Icon";
import { useMedia } from "../hooks/useMedia";
const DotGrid = lazy(() => import("../vendor/react-bits/DotGrid"));
export default function Hero() {
  const { t } = useI18n();
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMedia("(max-width: 700px), (pointer: coarse)");
  const [mounted, setMounted] = useState(false);
  const logo = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  const lines = t.tagline
    .replace(/<[^>]+>/g, "|")
    .split("|")
    .filter(Boolean);
  return (
    <section id="home" className="vr-hero" aria-label="Pizzeria Via Roma">
      <div className="hero-dot-field" aria-hidden="true">
        {mounted && !reduce && (
          <Suspense fallback={null}>
            <DotGrid
              dotSize={mobile ? 1.5 : 1.6}
              gap={mobile ? 29 : 24}
              baseColor="#544733"
              activeColor="#d5b778"
              opacity={0.62}
              proximity={mobile ? 115 : 220}
              strength={0.22}
              bounce={0}
              returnDuration={0.22}
              swell={0.75}
              stretch={0}
              glow={0.3}
              clickShock={false}
              intro={false}
              fade={0.5}
              dpr={1}
            />
          </Suspense>
        )}
      </div>
      <div className="hero-composition">
        <p className="hero-location">{t.sp_kicker}</p>
        <div
          className="hero-logo-fx"
          ref={logo}
          onPointerMove={(e) => {
            if (reduce || mobile || !logo.current) return;
            const b = e.currentTarget.getBoundingClientRect();
            logo.current.style.setProperty(
              "--logo-x",
              `${((e.clientX - b.left) / b.width - 0.5) * 5}deg`,
            );
            logo.current.style.setProperty(
              "--logo-y",
              `${-((e.clientY - b.top) / b.height - 0.5) * 5}deg`,
            );
          }}
          onPointerLeave={() => {
            logo.current?.style.setProperty("--logo-x", "0deg");
            logo.current?.style.setProperty("--logo-y", "0deg");
          }}
        >
          <img
            className="hero-logo"
            src="/assets/logo.png"
            alt="Pizzeria Via Roma"
            width="800"
            height="800"
            fetchPriority="high"
          />
          <span className="logo-glint" aria-hidden="true" />
        </div>
        <h1 className="hero-slogan">
          {lines.map((line, i) => (
            <span key={line} style={{ animationDelay: `${160 + i * 140}ms` }}>
              {line}
            </span>
          ))}
        </h1>
        <a className="hero-cta text-link" href="#menu">
          <span>{t.home_cta}</span>
          <Chevron />
        </a>
      </div>
    </section>
  );
}
