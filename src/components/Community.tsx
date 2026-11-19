import data from "../data/photos.json";
import { closingCopy } from "../data/closing-copy";
import { useI18n } from "../i18n";
import { PhotoRibbon } from "./gallery/PhotoRibbon";
import { SpreadTitle } from "./SpreadTitle";

const photos = data.CUSTOMER.map(({ src, name }) => ({ src, caption: name }));
const splitAfter = { it: 2, en: 2, de: 2, fr: 3 } as const;

export default function Community() {
  const { language } = useI18n();
  const title = closingCopy[language].memories;
  return <section id="customer" className="table-gallery" aria-labelledby="table-title">
    <SpreadTitle id="table-title" text={title} splitAfter={splitAfter[language]} />
    <PhotoRibbon photos={photos} title={title} variant="flat" />
  </section>;
}
