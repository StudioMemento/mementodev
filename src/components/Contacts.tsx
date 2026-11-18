import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { closingCopy } from "../data/closing-copy";
import { legalPath } from "../data/legal-path";
import { mapUrl } from "../data/venue-links";
import { useDialog } from "./DialogContext";
import { BentoGrid } from "./BentoGrid";
import { Icon } from "./Icon";

export function isRestaurantOpen(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const day = parts.find(p => p.type === "weekday")?.value;
  const hour = Number(parts.find(p => p.type === "hour")?.value);
  return day !== "Mon" && hour >= 18 && hour < 23;
}

function Hours() {
  const { t, ui } = useI18n();
  const [isOpen, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => { if (!document.hidden) setOpen(isRestaurantOpen(new Date())); };
    update();
    const timer = setInterval(update, 30000);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div className="bento-tile hours-tile">
    <div className="hours-label"><span className="tile-label"><Icon name="clock" />{t.d_orari}</span>
      <span id="openState" role="status" className="hours-state" data-state={isOpen == null ? "pending" : isOpen ? "open" : "closed"}>
        <i aria-hidden="true" /><span data-status-label>{isOpen == null ? "—" : isOpen ? ui.open_now : ui.closed_now}</span>
      </span>
    </div>
    <strong className="opening-time">18:00 – 23:00</strong>
    <p className="opening-days">{ui.opening_days}<span>{ui.closed_day}</span></p>
  </div>;
}

export default function Contacts() {
  const { t, ui, copy, language } = useI18n();
  const { open } = useDialog();
  return <section id="dove" className="closing-section visit-section" aria-labelledby="visit-title">
    <div className="closing-shell">
      <header className="visit-heading">
        <div><p className="k-s">{ui.info_label} / {t.d_contatti}</p>
          <h2 className="section-gold" id="visit-title"><span>{closingCopy[language].visit}</span></h2></div>
        <img className="visit-sign" src="/assets/logo.png" width="100" height="100" loading="lazy" decoding="async" alt="Pizzeria Via Roma" />
      </header>
      <BentoGrid className="visit-bento">
        <a className="bento-tile map-tile" href={mapUrl} target="_blank" rel="noopener noreferrer">
          <img className="map-image" src="/assets/maniago.webp" srcSet="/assets/maniago-640.webp 640w, /assets/maniago.webp 1254w"
            sizes="(min-width: 760px) min(49vw, 600px), 90vw" width="1254" height="1254" alt="" loading="lazy" decoding="async" />
          <span className="map-caption"><span className="tile-label">{t.d_maps}</span><strong>Via Roma 47</strong><span>33085 Maniago (PN)</span></span>
          <Icon className="tile-arrow" name="arrow-up-right" />
        </a>
        <Hours />
        <a className="bento-tile contact-tile phone-tile" href="tel:+390427541232">
          <span className="tile-label"><Icon name="phone" />{ui.call}</span><Icon className="tile-arrow" name="arrow-up-right" /><strong>0427 541232</strong>
        </a>
        <a className="bento-tile contact-tile wa-tile" href="https://wa.me/393802453757" target="_blank" rel="noopener noreferrer">
          <span className="tile-label"><Icon name="whatsapp-logo" />WhatsApp</span><Icon className="tile-arrow" name="arrow-up-right" /><strong>380 2453 757</strong>
        </a>
      </BentoGrid>
      <footer className="visit-footer">
        <p>© 2026 Pizzeria Via Roma</p>
        <nav aria-label={ui.legal_notes}>
          {([["privacy", copy.privacy], ["cookie", copy.cookies], ["note-legali", ui.legal_notes]] as const).map(([slug, label]) =>
            <a key={slug} href={legalPath(language, slug)} aria-haspopup="dialog" onClick={event => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); open({ kind: "legal", slug });
            }}>{label}</a>)}
        </nav>
        <a className="studio-credit" href="https://mementostudio.it" target="_blank" rel="noopener noreferrer">
          <span lang="en">DESIGN &amp; DEVELOPMENT</span>
          <img src="/assets/memento-wordmark.svg" width="202" height="9" loading="lazy" alt="Memento Studio" />
        </a>
      </footer>
    </div>
  </section>;
}
