import { lazy, Suspense, useEffect, useState } from 'react';
const DotGrid = lazy(() => import('../vendor/v23-react-bits/DotGrid'));
export function IntroBackground({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { if (active) setReady(true); }, [active]);
  return <div className="intro-dot-field" aria-hidden="true">
    {ready && <Suspense fallback={null}><DotGrid dotSize={2} gap={48} baseColor="#f97316" activeColor="#f97316"
      proximity={320} strength={0.5} bounce={0} tension={0.5} returnDuration={3}
      shockRadius={80} shockStrength={0} swell={2} stretch={2} fade={0.5}
      clickShock={false} intro={false} paused={!active} mouseInteraction={!reduced} dpr={1.5} /></Suspense>}
  </div>;
}
