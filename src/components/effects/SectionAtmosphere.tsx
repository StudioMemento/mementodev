import { lazy, Suspense, useRef, type CSSProperties } from "react";
import { useEffectActivity } from "./useEffectActivity";

const LightRays = lazy(() => import("../../vendor/react-bits/LightRays"));
export type AtmosphereVariant = "hero" | "oven" | "crust" | "categories" | "menu" | "gallery" | "community" | "social" | "info";

/** Shared material family; different compositions for each chapter.
 * Shader chapters mount only while visible. CSS always supplies a static fallback.
 */
export default function SectionAtmosphere({
  variant,
  seed = 0,
}: { variant: AtmosphereVariant; seed?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const { active } = useEffectActivity(root);
  const shader = variant === "hero" || variant === "info";
  const sparks = variant === "hero" ? 20 : variant === "oven" ? 12 : 0;
  return (
    <div
      ref={root}
      className={`vr-atmosphere vr-atmosphere--${variant}`}
      data-active={active ? "true" : "false"}
      data-seed={seed % 5}
      style={{ "--atmosphere-turn": `${seed * 23}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <div className="atmosphere-wash" />
      <div className="atmosphere-haze haze-a" />
      <div className="atmosphere-haze haze-b" />
      {shader && active && (
        <Suspense fallback={null}>
          <LightRays
            className="atmosphere-rays"
            raysOrigin={variant === "hero" ? "top-center" : "top-right"}
            raysColor="#c6ab70"
            raysSpeed={variant === "hero" ? 0.18 : 0.12}
            lightSpread={variant === "hero" ? 0.8 : 1.1}
            rayLength={1.8}
            rayDensity={1.15}
            raySharpness={0.12}
            glow={0.24}
            haze={0.4}
            atmosphere={0.55}
            intensity={0.8}
            fadeDistance={1.3}
            opacity={variant === "hero" ? 0.72 : 0.42}
            followMouse={variant === "hero"}
            mouseInfluence={0.035}
            cursorShadow={false}
            clickPulse={false}
            noiseAmount={0}
            distortion={0.08}
            intro
            maxDevicePixelRatio={1.1}
          />
        </Suspense>
      )}
      {sparks > 0 && (
        <div className="atmosphere-embers">
          {Array.from({ length: sparks }, (_, i) => (
            <i key={i} style={{
              "--spark-x": `${8 + ((i * 37) % 86)}%`,
              "--spark-y": `${12 + ((i * 17) % 80)}%`,
              "--spark-size": `${i % 5 === 0 ? 2 : 1}px`,
              "--spark-delay": `${-(i * 1.7)}s`,
              "--spark-duration": `${15 + i % 7}s`,
            } as CSSProperties} />
          ))}
        </div>
      )}
      <div className="atmosphere-edge" />
    </div>
  );
}
