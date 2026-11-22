import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import original from "./data/translations.json";
export type Language = "it" | "en" | "de" | "fr";
export const languages: Language[] = ["it", "en", "de", "fr"];
const additions = {
  it: {
    previous: "Precedente",
    next: "Successiva",
    close: "Chiudi",
    expand: "Ingrandisci la foto",
    photo: "Foto",
    menu: "Menù",
    gallery: "Foto del locale",
    infoTitle: "Vieni a trovarci.",
    whatsapp: "Scrivici su WhatsApp",
    skip: "Vai al menù",
    allergens: "Allergeni",
    allergenIncluded: "Presente in questo piatto",
    allergenNote: "Per ulteriori info, chiedi al personale.",
    checkAllergens: "Verifica allergeni",
    ingredientNotice: "I numeri indicano gli allergeni ricavabili dagli ingredienti in carta.",
    staffNotice: "Per allergie o intolleranze, chiedi al personale di consultare le informazioni scritte prima di ordinare.",
    drinkNotice: "Tocca il nome della bevanda per le informazioni sugli allergeni.",
    frozenTitle: "Prodotti surgelati",
    frozen: "Surgelato all’origine o in assenza del fresco.",
    changeLanguage: "Scegli la lingua",
    navigation: "Navigazione",
    photoSelection: "Altri scatti",
    privacy: "Privacy",
    cookies: "Cookie",
    menuHelp: "Prezzi in euro · Tocca i numeri per consultare gli allergeni.",
    reviews: "Recensioni",
  },
  en: {
    previous: "Previous",
    next: "Next",
    close: "Close",
    expand: "Enlarge photo",
    photo: "Photo",
    menu: "Menu",
    gallery: "Photos of the restaurant",
    infoTitle: "Come and visit us.",
    whatsapp: "Message us on WhatsApp",
    skip: "Skip to the menu",
    allergens: "Allergens",
    allergenIncluded: "Present in this dish",
    allergenNote: "Ask our staff for more information",
    checkAllergens: "Check allergens",
    ingredientNotice: "The numbers identify allergens in the ingredients listed on the menu.",
    staffNotice: "If you have an allergy or intolerance, ask staff to check the written information before ordering.",
    drinkNotice: "Select a drink name for allergen information.",
    frozenTitle: "Frozen products",
    frozen: "Frozen at source or when fresh ingredients are unavailable.",
    changeLanguage: "Choose language",
    navigation: "Navigation",
    photoSelection: "More photos",
    privacy: "Privacy",
    cookies: "Cookies",
    menuHelp: "Prices in euros · Tap the numbers for allergen information.",
    reviews: "Reviews",
  },
  de: {
    previous: "Zurück",
    next: "Weiter",
    close: "Schließen",
    expand: "Foto vergrößern",
    photo: "Foto",
    menu: "Menü",
    gallery: "Fotos des Lokals",
    infoTitle: "Kommt uns besuchen.",
    whatsapp: "Schreib uns auf WhatsApp",
    skip: "Zum Menü springen",
    allergens: "Allergene",
    allergenIncluded: "In diesem Gericht enthalten",
    allergenNote: "Für weitere Informationen fragt unser Personal",
    checkAllergens: "Allergene erfragen",
    ingredientNotice: "Die Zahlen kennzeichnen Allergene in den aufgeführten Zutaten.",
    staffNotice: "Bei Allergien oder Unverträglichkeiten bitte vor der Bestellung mit dem Personal die schriftlichen Angaben prüfen.",
    drinkNotice: "Für Allergeninformationen auf den Namen des Getränks tippen.",
    frozenTitle: "Tiefkühlprodukte",
    frozen: "Tiefgekühlt oder bei fehlender Frischware tiefgekühlt.",
    changeLanguage: "Sprache wählen",
    navigation: "Navigation",
    photoSelection: "Weitere Fotos",
    privacy: "Datenschutz",
    cookies: "Cookies",
    menuHelp: "Preise in Euro · Die Zahlen öffnen die Allergeninformationen.",
    reviews: "Bewertungen",
  },
  fr: {
    previous: "Précédente",
    next: "Suivante",
    close: "Fermer",
    expand: "Agrandir la photo",
    photo: "Photo",
    menu: "Menu",
    gallery: "Photos du restaurant",
    infoTitle: "Venez nous voir.",
    whatsapp: "Écrivez-nous sur WhatsApp",
    skip: "Aller au menu",
    allergens: "Allergènes",
    allergenIncluded: "Présent dans ce plat",
    allergenNote: "Demandez au personnel pour plus d’informations",
    checkAllergens: "Vérifier les allergènes",
    ingredientNotice: "Les numéros indiquent les allergènes identifiables dans les ingrédients de la carte.",
    staffNotice: "En cas d’allergie ou d’intolérance, demandez au personnel de consulter les informations écrites avant de commander.",
    drinkNotice: "Touchez le nom de la boisson pour consulter les allergènes.",
    frozenTitle: "Produits surgelés",
    frozen: "Surgelé à l’origine ou en l’absence de produit frais.",
    changeLanguage: "Choisir la langue",
    navigation: "Navigation",
    photoSelection: "Autres photos",
    privacy: "Confidentialité",
    cookies: "Cookies",
    menuHelp: "Prix en euros · Touchez les numéros pour consulter les allergènes.",
    reviews: "Avis",
  },
};
const LanguageContext = createContext({
  language: "it" as Language,
  setLanguage: (_: Language) => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("it");
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useI18n() {
  const { language, setLanguage } = useContext(LanguageContext);
  return {
    language,
    setLanguage,
    t: original.T[language],
    ui: original.UI[language],
    copy: additions[language],
  };
}
export function translateDescription(value: string, language: Language) {
  if (language === "it" || !value) return value;
  const index = language === "en" ? 1 : language === "de" ? 2 : 3;
  return original.TERMS.reduce(
    (text, term) => text.split(term[0]).join(term[index] || term[0]),
    value,
  );
}
export function translateName(value: string, language: Language) {
  const names = original.NAME_TR as Record<string, string[]>;
  return language === "it"
    ? value
    : names[value]?.[language === "en" ? 0 : language === "de" ? 1 : 2] ||
        value;
}
/** Trusted, bundled editorial copy only. Never use for user-provided HTML. */
export function Copy({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: value }} />
  );
}
