/** One continuous alpha ramp. No tint, stacked strips, borders or background wash. */
export function ViewportBlur({ edge }: { edge: 'top' | 'bottom' }) {
  return <div className={`vr-viewport-blur vr-viewport-blur--${edge}`} aria-hidden="true" />;
}
