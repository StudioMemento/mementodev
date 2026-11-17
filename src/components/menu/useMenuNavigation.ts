import { useEffect, useRef, useState } from "react";

export const categoryOrder = ["classiche", "audaci", "bianche", "calzoni", "cucina", "stuzzicherie", "dolci", "bevande"] as const;

export const categoryLabels = {
  it: ["Classiche", "Audaci", "Bianche", "Calzoni", "Cucina", "Snack", "Dolci", "Bevande"],
  en: ["Classiche", "Audaci", "Bianche", "Calzoni", "Kitchen", "Snacks", "Desserts", "Drinks"],
  de: ["Classiche", "Audaci", "Bianche", "Calzoni", "Küche", "Snacks", "Desserts", "Getränke"],
  fr: ["Classiche", "Audaci", "Bianche", "Calzoni", "Cuisine", "Snacks", "Desserts", "Boissons"],
};

const behavior = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" as const : "smooth" as const;

export function useMenuNavigation(language: string) {
  const [active, setActive] = useState<string>("classiche");
  const chips = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const top = Math.min(150, window.innerHeight / 3);
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting)
          setActive(entry.target.id.replace("cat-", ""));
      }, { rootMargin: `-${top}px 0px -${Math.max(0, window.innerHeight - top - 2)}px 0px` });
      document.querySelectorAll(".mcat").forEach(el => observer.observe(el));
    };
    observe();
    window.addEventListener("resize", observe, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("resize", observe); };
  }, []);
  useEffect(() => {
    const rail = chips.current;
    if (!rail) return;
    const selected = rail.querySelector<HTMLElement>(`[data-go="${active}"]`);
    const center = () => {
      if (selected) rail.scrollTo({ left: selected.offsetLeft - (rail.clientWidth - selected.offsetWidth) / 2, behavior: behavior() });
    };
    const check = () => {
      wrap.current?.classList.toggle("can-l", rail.scrollLeft > 5);
      wrap.current?.classList.toggle("can-r", rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 5);
    };
    center(); check();
    const observer = new ResizeObserver(() => { center(); check(); });
    observer.observe(rail);
    // Translations and font loading also change overflow when rail width is fixed.
    Array.from(rail.children).forEach(el => observer.observe(el));
    rail.addEventListener("scroll", check, { passive: true });
    return () => { observer.disconnect(); rail.removeEventListener("scroll", check); };
  }, [active, language]);
  const select = (id: string) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: behavior() });
    history.replaceState(null, "", `#cat-${id}`);
    setActive(id);
  };
  const nudge = (direction: number) => chips.current?.scrollBy({ left: direction * Math.max(160, chips.current.clientWidth * .65), behavior: behavior() });
  return { active, chips, wrap, select, nudge };
}
