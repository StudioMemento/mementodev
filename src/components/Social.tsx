// Original social card hierarchy and sources retained; obsolete sharing copy removed.
import { useI18n, Copy } from "../i18n";
import ReviewTicker from "./ReviewTicker";
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
    <section id="social">
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
          <a
            className="social-card"
            href="https://www.tripadvisor.it/Restaurant_Review-g790406-d20931745-Reviews-Pizzeria_Via_Roma-Maniago_Province_of_Pordenone_Friuli_Venezia_Giulia.html"
            target="_blank"
            rel="noopener"
          >
            <span className="social-icon">
              <i className="ph-thin ph-star"></i>
            </span>
            <span className="social-copy">
              <small>Tripadvisor</small>
              <strong>
                <Copy value={ui.tripadvisor_phrase} />
              </strong>
              <em>
                <Copy value={ui.so_tripadvisor} />
              </em>
            </span>
            <i className="ph-thin ph-arrow-up-right social-arrow"></i>
          </a>
          <a
            className="social-card"
            href="https://restaurantguru.it/Pizzeria-Via-Roma-Maniago"
            target="_blank"
            rel="noopener"
          >
            <span className="social-icon">
              <i className="ph-thin ph-fork-knife"></i>
            </span>
            <span className="social-copy">
              <small>Restaurant Guru</small>
              <strong>Pizzeria Via Roma</strong>
              <em>
                <Copy value={ui.so_restaurantguru} />
              </em>
            </span>
            <i className="ph-thin ph-arrow-up-right social-arrow"></i>
          </a>
        </div>

        <div className="reviews-zone fx">
          <aside className="review-intro">
            <span className="review-intro-icon" aria-hidden="true">
              <i className="ph-thin ph-quotes"></i>
            </span>
            <p className="k-s">
              <Copy value={ui.review_eyebrow} />
            </p>
            <h3>
              <Copy value={ui.review_title} />
            </h3>
            <p>
              <Copy value={ui.review_body} />
            </p>
            <div className="review-platforms">
              <span>Google Reviews</span>
              <span>Tripadvisor</span>
            </div>
          </aside>
          <ReviewTicker />
        </div>
      </div>
    </section>
  );
}
