import { useI18n } from "../i18n";
import { socialProfiles } from "../data/venue-links";
import { BentoGrid } from "./BentoGrid";
import { Icon } from "./Icon";

function PlatformMark({ id }: { id: string }) {
  if (id === "google") return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.4 12.2c0-.7 0-1.3-.2-2h-9.1v3.7h5.2a4.5 4.5 0 0 1-2 2.9v.1A6 6 0 1 1 12 6a5.4 5.4 0 0 1 3.9 1.5l2.8-2.8A9.8 9.8 0 1 0 12 21.8c5.7 0 9.4-4 9.4-9.6Z"/></svg>;
  if (id === "tripadvisor") return <svg viewBox="0 0 32 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 7 2 4.7h7A14 14 0 0 1 23 4.7h7L27.5 7M13 16l3 4 3-4"/><circle cx="9" cy="12" r="6.2"/><circle cx="23" cy="12" r="6.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="23" cy="12" r="2.2"/></svg>;
  if (id === "guru") return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M6.1 13a4.1 4.1 0 0 1-.6-8.2 4.6 4.6 0 0 1 2.1.5 5 5 0 0 1 8.8 0 4.2 4.2 0 1 1 1.6 7.8v6.2h-12Z M6.3 16.5h11.4m-7-7.1.5 3m3-3-.5 3"/></svg>;
  return <Icon name={id === "sluurpy" ? "fork-knife" : `${id}-logo`} />;
}

export default function Social() {
  const { t, copy } = useI18n();
  return <section id="social" className="closing-section" aria-labelledby="social-title">
    <div className="closing-shell">
      <header className="closing-heading"><h2 id="social-title" className="section-gold"><span>{t.so_title}</span></h2></header>
      <BentoGrid className="social-bento">
        {socialProfiles.map(profile => <a key={profile.id} className={`bento-tile social-tile platform-${profile.id}`}
          href={profile.href} target="_blank" rel="noopener noreferrer">
          {profile.image && <img className="tile-photo" src={`/assets/ribbons/${profile.image}`} loading="lazy" decoding="async" alt="" />}
          <span className="bento-glints" aria-hidden="true" />
          <span className="platform-mark"><PlatformMark id={profile.id} /></span>
          <Icon className="tile-arrow" name="arrow-up-right" />
          <span className="platform-copy"><strong>{profile.name}</strong><small>{profile.detail ?? copy.reviews}</small></span>
        </a>)}
      </BentoGrid>
    </div>
  </section>;
}
