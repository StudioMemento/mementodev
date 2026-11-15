// Social profiles only: reviews are intentionally omitted in V21.
import { useI18n, Copy } from "../i18n";
import SectionAtmosphere from "./effects/SectionAtmosphere";
function SentenceCopy({ value }: { value: string }) {
  const clean = value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return (
    <>
      {(clean.match(/[^.!?]+(?:[.!?]+|$)/g) || [clean])
        .filter(Boolean)
        .map((part, i) => (
          <span className="sentence-unit" key={i}>
            {part.trim()}
          </span>
        ))}
    </>
  );
}
export default function Social() {
  const { t, ui } = useI18n();
  return (
    <section id="social" className="vr-social">
      <SectionAtmosphere variant="social" />
      <div className="social-shell">
        <header className="social-head fx">
          <p className="k-s">
            <Copy value={t.so_eyebrow} />
          </p>
          <h2>
            <Copy value={ui.so_title} />
          </h2>
          <p className="social-lead sentence-flow">
            <SentenceCopy value={ui.so_lead} />
          </p>
        </header>

        <div className="social-actions fx">
          <a
            className="social-card social-card-primary"
            href="https://www.instagram.com/pizzeriaviaromamaniago/"
            target="_blank"
            rel="noopener"
          >
            <span className="social-icon">
              <i className="ph-thin ph-instagram-logo"></i>
            </span>
            <span className="social-copy">
              <small>Instagram</small>
              <strong>@pizzeriaviaromamaniago</strong>
              <em>
                <Copy value={ui.so_instagram} />
              </em>
            </span>
            <i className="ph-thin ph-arrow-up-right social-arrow"></i>
          </a>
          <a
            className="social-card"
            href="https://www.facebook.com/people/Pizzeria-Via-Roma/61562436140782/"
            target="_blank"
            rel="noopener"
          >
            <span className="social-icon">
              <i className="ph-thin ph-facebook-logo"></i>
            </span>
            <span className="social-copy">
              <small>Facebook</small>
              <strong>Via Roma Maniago</strong>
              <em>
                <Copy value={ui.so_facebook} />
              </em>
            </span>
            <i className="ph-thin ph-arrow-up-right social-arrow"></i>
          </a>
        </div>

      </div>
    </section>
  );
}
