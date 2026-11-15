import { useEffect, useState } from "react";
import { useI18n, Copy } from "../i18n";
import { useMedia } from "../hooks/useMedia";
import { useDialog } from "./DialogContext";
import { Icon } from "./Icon";
import { Photo } from "./Photo";
import MagicBento from "../vendor/react-bits/MagicBento";
import SectionAtmosphere from "./effects/SectionAtmosphere";
export function isRestaurantOpen(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  return day !== "Mon" && hour >= 18 && hour < 23;
}
export default function Contacts() {
  const { t, ui, copy } = useI18n();
  const { open } = useDialog();
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const coarse = useMedia("(pointer: coarse)");
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const isOpen = now ? isRestaurantOpen(now) : null;
  const items = [
    {
      id: "map",
      colSpan: 4,
      rowSpan: 3,
      href: "https://maps.google.com/?cid=7212905066552907909",
      target: "_blank",
      rel: "noopener",
      content: (
        <div className="vr-map">
          <Photo
            className="closing-map-image"
            src="assets/maniago.webp"
            alt="Vista aerea artistica di Maniago"
          />
          <span className="map-shade" aria-hidden="true" />
          <span className="map-address">
            <small>{t.d_maps}</small>
            <strong>Via Roma 47</strong>
            <Icon name="arrow-up-right" />
          </span>
        </div>
      ),
    },
    {
      id: "status",
      colSpan: 2,
      content: (
        <div
          className={`vr-visit-status ${isOpen ? "open" : "closed"}`}
          id="openState"
          role="status"
        >
          <span className="visit-icon">
            <i className="status-dot" />
          </span>
          <span className="visit-copy">
            <small>{ui.info_label}</small>
            <strong data-status-label>
              {isOpen === null ? "—" : isOpen ? ui.open_now : ui.closed_now}
            </strong>
          </span>
        </div>
      ),
    },
    {
      id: "hours",
      colSpan: 2,
      content: (
        <div className="vr-visit-hours">
          <span className="visit-icon">
            <Icon name="clock" />
          </span>
          <span className="visit-copy">
            <small>{t.d_orari}</small>
            <strong>18:00 — 23:00</strong>
            <em>{ui.opening_days}</em>
            <em>{ui.closed_day}</em>
          </span>
        </div>
      ),
    },
    {
      id: "call",
      href: "tel:+390427541232",
      content: (
        <div className="vr-visit-contact">
          <span className="visit-icon">
            <Icon name="phone" />
          </span>
          <span className="visit-copy">
            <small>{ui.call}</small>
            <strong>0427 541232</strong>
            <em>{t.d_contatti}</em>
          </span>
          <Icon name="arrow-up-right" className="visit-arrow" />
        </div>
      ),
    },
    {
      id: "whatsapp",
      href: "https://wa.me/393802453757",
      target: "_blank",
      rel: "noopener",
      content: (
        <div className="vr-visit-contact">
          <span className="visit-icon">
            <Icon name="whatsapp-logo" />
          </span>
          <span className="visit-copy">
            <small>WhatsApp</small>
            <strong>380 2453 757</strong>
            <em>{copy.whatsapp}</em>
          </span>
          <Icon name="arrow-up-right" className="visit-arrow" />
        </div>
      ),
    },
  ];
  return (
    <section id="dove" className="vr-contacts">
      <SectionAtmosphere variant="info" />
      <div className="closing-shell">
        <header className="visit-heading-row fx">
          <div className="visit-heading-copy">
            <p className="k-s">{ui.info_label}</p>
            <h2>{copy.infoTitle}</h2>
          </div>
          <div className="visit-brand">
            <img
              className="visit-logo"
              src="/assets/logo.png"
              width="851"
              height="851"
              alt="Pizzeria Via Roma"
              loading="lazy"
            />
          </div>
        </header>
        <MagicBento
          items={items}
          columns={6}
          rowHeight={176}
          gap={12}
          radius={0}
          glowColor="#C6AB70"
          spotlightRadius={200}
          className="contacts-bento vr-bento"
          textAutoHide={false}
          enableTilt={false}
          enableStars={false}
          enableMagnetism={false}
          clickEffect={false}
          intro={false}
          disableAnimations={reduced || coarse}
        />
        <footer className="footer-bottom">
          <p className="foot">© 2026 Pizzeria Via Roma</p>
          <nav className="legal-links" aria-label={ui.legal_notes}>
            {(
              [
                { slug: "privacy", label: copy.privacy },
                { slug: "cookie", label: copy.cookies },
                { slug: "note-legali", label: ui.legal_notes },
              ] as const
            ).map((x) => (
              <a
                key={x.slug}
                href={`${x.slug}.html`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  open({ kind: "legal", slug: x.slug });
                }}
              >
                {x.label}
              </a>
            ))}
          </nav>
          <p className="foot">
            <Copy value={ui.footer_credit} />
          </p>
        </footer>
      </div>
    </section>
  );
}
