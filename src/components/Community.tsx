import data from "../data/photos.json";
import { useI18n } from "../i18n";
import { PhotoPager } from "./Gallery";
export default function Community() {
  const { t, copy } = useI18n();
  return <section id="customer" className="vr-community">
    <header className="vr-community-heading"><p className="k-s">{t.cu_eyebrow}</p><h2>{t.cu_title}</h2><p className="lead">{copy.communityLead}</p></header>
    <PhotoPager title={t.cu_title} photos={data.CUSTOMER.map(c => ({src: c.src, caption: c.name}))} />
  </section>;
}
