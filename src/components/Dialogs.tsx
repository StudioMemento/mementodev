import "../styles/dialogs.css";
import { useLayoutEffect, useRef } from "react";
import { useDialog } from "./DialogContext";
import { useI18n, translateName } from "../i18n";
import { AllergenLegend, AllergenSummary } from "./AllergenDetails";
import { releaseCopy } from "../data/release-copy";
import { getAllergenInfo } from "../data/allergen-info";
import { LegalReader } from "./LegalReader";
import { Icon } from "./Icon";
export default function Dialogs() {
  const { modal, close, update } = useDialog();
  const { copy, language, ui } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previous;
    };
  }, []);
  if (!modal) return null;
  const title = modal.kind === "allergens" ? translateName(modal.name, language)
    : ({ privacy: copy.privacy, cookie: copy.cookies, "note-legali": ui.legal_notes })[modal.slug];
  const info =
    modal.kind === "allergens"
      ? getAllergenInfo(modal.name, modal.description, modal.codes)
      : null;
  return (
    <dialog
      ref={ref}
      className={`vr-dialog modal-${modal.kind}`}
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (modal.kind === "legal" && (e.target as HTMLElement).closest(".modal-header")) {
          const reader = ref.current?.querySelector<HTMLElement>(".legal-scroll");
          if (reader && reader.scrollHeight > reader.clientHeight) {
            const offsets: Record<string, number> = { ArrowDown: 40, ArrowUp: -40, PageDown: reader.clientHeight * .9, PageUp: -reader.clientHeight * .9, Home: -reader.scrollHeight, End: reader.scrollHeight };
            if (e.key in offsets) { e.preventDefault(); reader.scrollBy({ top: offsets[e.key], behavior: "instant" }); }
          }
        }
      }}
    >
      <section
        className={`modal-panel ${modal.kind === "allergens" ? "allergen-panel" : "legal-panel"}`}
      >
        <header className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>
          </div>
          <button
            className="modal-close"
            type="button"
            autoFocus
            aria-label={copy.close}
            onClick={(e) => { e.stopPropagation(); close(); }}
          >
            <Icon name="x" />
          </button>
        </header>
        {modal.kind === "allergens" && info && (
          <>
            <AllergenSummary {...modal} />
            <details className="menu-disclosure"><summary>{releaseCopy[language].legend}</summary><AllergenLegend selected={info.codes} />
              <p className="food-frozen">* {copy.frozenTitle} · {copy.frozen}</p>
            </details>
          </>
        )}
        {modal.kind === "legal" && (
          <LegalReader key={`${language}/${modal.slug}`} slug={modal.slug} navigate={slug => {
            ref.current?.querySelector<HTMLButtonElement>(".modal-close")?.focus({ preventScroll: true });
            update({ kind: "legal", slug });
          }} />
        )}
      </section>
    </dialog>
  );
}
