import { useI18n } from "../i18n";
import { Chevron } from "./Icon";
export default function Hero() {
  const { t } = useI18n();
  const lines = t.tagline.replace(/<[^>]+>/g, "|").split("|").filter(Boolean);
  return <section id="home" className="vr-hero" aria-label="Pizzeria Via Roma">
    <div className="hero-composition">
      <img className="hero-logo" src="/assets/logo.png" alt="Pizzeria Via Roma" width="851" height="851" fetchPriority="high" />
      <h1 className="hero-slogan">{lines.map(line => <span key={line}>{line}</span>)}</h1>
    </div>
    <div className="hero-cue-space"><a className="hero-down" href="#pizza-slider" aria-label={t.strip_k}><Chevron /></a></div>
  </section>;
}
