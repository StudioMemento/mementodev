import data from "../data/photos.json";
import { useI18n } from "../i18n";
import { PhotoRibbon } from "./gallery/PhotoRibbon";
import { closingCopy } from "../data/closing-copy";

const photos = data.CUSTOMER.map(({ src, name }) => ({ src, caption: name }));

export default function Community() {
  const { t, language } = useI18n();
  return <section id="customer" className="table-gallery" aria-labelledby="table-title">
    <header className="table-heading">
      <p className="k-s">{t.cu_eyebrow}</p>
      <h2 className="section-gold" id="table-title"><span>{t.cu_title}</span></h2>
      <p className="table-lead">{closingCopy[language].memories}</p>
    </header>
    <PhotoRibbon photos={photos} title={t.cu_title} variant="flat" />
  </section>;
}
