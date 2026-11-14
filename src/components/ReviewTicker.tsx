import { useRef } from "react";
import data from "../data/reviews.json";
import { useI18n } from "../i18n";
import { useReviewTicker } from "../hooks/useReviewTicker";
export default function ReviewTicker() {
  const { language } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  useReviewTicker(ref, language, data.REVIEW_LIBRARY.length);
  return (
    <div
      className="review-track"
      id="reviewTrack"
      ref={ref}
      aria-label="Recensioni"
      tabIndex={0}
    >
      <div className="review-runner" id="reviewRunner">
        {[false, true].flatMap((clone) =>
          data.REVIEW_LIBRARY.map((r, i) => (
            <article
              className="rev"
              key={`${clone}-${i}`}
              aria-hidden={clone || undefined}
            >
              <blockquote lang="it">
                <p>{r.text}</p>
              </blockquote>
              <div className="src">
                <span className="review-author">
                  <b>{r.author}</b>
                </span>
                <span className="review-meta">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                    tabIndex={clone ? -1 : undefined}
                  >
                    {r.source}
                  </a>
                  {r.date && (
                    <time dateTime={r.date}>
                      {new Intl.DateTimeFormat(language, {
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(r.date))}
                    </time>
                  )}
                </span>
              </div>
            </article>
          )),
        )}
      </div>
    </div>
  );
}
