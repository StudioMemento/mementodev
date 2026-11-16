import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { Chevron } from "./Icon";
import { IntroBackground } from "./IntroBackground";
const MetallicPaint = lazy(() => import("../vendor/v23-react-bits/MetallicPaint"));
import GradientText from "../vendor/v23-react-bits/GradientText";
import { useEffectActivity } from "./effects/useEffectActivity";

export default function Hero() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const { active, reduced } = useEffectActivity(section);
  const [ready, setReady] = useState(false);
  useEffect(() => { if (active) setReady(true); }, [active]);
  const lines = t.tagline.replace(/<[^>]+>/g, "|").split("|").filter(Boolean);
  return <section id="home" ref={section} className="vr-hero vr-hero-v23" aria-label="Pizzeria Via Roma" data-fx-active={active}>
    <IntroBackground active={active} reduced={reduced} />
    <div className="hero-composition">
      <p className="hero-location">{t.sp_kicker}</p>
      <div className="hero-logo-fx">
        <img className="hero-logo" src="/assets/logo.png" alt="Pizzeria Via Roma" width="851" height="851" fetchPriority="high" />
        <div className="hero-metallic" aria-hidden="true">
          {ready && <Suspense fallback={null}><MetallicPaint imageSrc="/assets/logo.png" color="#ffffff" density={2}
            dispersion={0} softness={1} distortion={0} edgeBend={0.5} scale={1}
            angle={90} speed={0.25} mouseTilt={reduced ? 0 : 0.5} intro={false}
            paused={!active} dpr={1.5} /></Suspense>}
        </div>
      </div>
      <h1 className="hero-slogan">
        <GradientText colors={["#ffe288", "#ffffff", "#ffbf92"]} glow={0.2}
          followPointer={!reduced} borderWidth={1} showBorder={false} animationSpeed={8} paused={!active}>
          {lines.map((line, i) => <span className="hero-slogan-line" key={line}>{i > 0 && " "}{line}</span>)}
        </GradientText>
      </h1>
      <a className="hero-down" href="#pizza-slider" aria-label={t.strip_k}><Chevron /></a>
    </div>
  </section>;
}
