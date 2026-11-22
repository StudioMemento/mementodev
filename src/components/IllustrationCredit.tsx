import { useI18n, type Language } from "../i18n";

const credits: Record<Language, [string, string]> = {
  it: ["Immagine generata con IA", "Da una foto del locale"],
  en: ["AI-generated image", "Based on the restaurant’s photo"],
  de: ["KI-generiertes Bild", "Nach einem Foto des Lokals"],
  fr: ["Image générée par IA", "D’après une photo du restaurant"],
};

export function IllustrationCredit({ fromPhoto = false }: { fromPhoto?: boolean }) {
  const { language } = useI18n();
  return <small className="image-credit">{credits[language][fromPhoto ? 1 : 0]}</small>;
}
