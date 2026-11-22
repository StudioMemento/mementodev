import type { Language } from "../i18n";

// Extra detail for the highlighted family, where the menu or supplier names it.
const sources = {
  barley: { it: "Malto d’orzo.", en: "Barley malt.", de: "Gerstenmalz.", fr: "Malt d’orge." },
  wheat: { it: "Frumento.", en: "Wheat.", de: "Weizen.", fr: "Blé." },
  almonds: { it: "Mandorle.", en: "Almonds.", de: "Mandeln.", fr: "Amandes." },
  pistachios: { it: "Pistacchi.", en: "Pistachios.", de: "Pistazien.", fr: "Pistaches." },
  walnuts: { it: "Noci.", en: "Walnuts.", de: "Walnüsse.", fr: "Noix." },
};
const barleyBeers = new Set(["Flag", "Iron Bridge", "Liquidambra", "Guglielmo", "Cordelia", "Amleto", "Hirter Marzen", "Hirter Morchl"]);
const nutSources: Record<string, keyof typeof sources> = { Caprina: "almonds", Povera: "pistachios", Delicata: "walnuts" };
export function ingredientSource(name: string, code: number, language: Language) {
  if (code === 8 && nutSources[name]) return sources[nutSources[name]][language];
  if (code === 1 && barleyBeers.has(name)) return sources.barley[language];
  if (code === 1 && name === "Wieze Blanche") return sources.wheat[language];
}

const notes = {
  missing: {
    it: "Allergeni da verificare sulla ricetta o sull’etichetta.",
    en: "Check the recipe or label for allergens.",
    de: "Allergene anhand der Rezeptur oder des Etiketts prüfen.",
    fr: "Allergènes à vérifier sur la recette ou l’étiquette.",
  },
  pesto: {
    it: "Da verificare gli ingredienti del pesto, in particolare la frutta a guscio.",
    en: "Check the pesto ingredients, especially tree nuts.",
    de: "Zutaten des Pestos prüfen, insbesondere Schalenfrüchte.",
    fr: "Vérifier les ingrédients du pesto, notamment les fruits à coque.",
  },
  grana: {
    it: "Da verificare l’eventuale lisozima da uovo nel grana.",
    en: "Check the grana cheese for egg-derived lysozyme.",
    de: "Grana auf Lysozym aus Ei prüfen.",
    fr: "Vérifier si le grana contient du lysozyme issu de l’œuf.",
  },
  fried: {
    it: "Da verificare la preparazione, l’olio e l’uso condiviso della friggitrice.",
    en: "Check the preparation, oil and use of a shared fryer.",
    de: "Zubereitung, Frittieröl und gemeinsame Nutzung der Fritteuse prüfen.",
    fr: "Vérifier la préparation, l’huile et le partage de la friteuse.",
  },
  caesar: {
    it: "Da verificare la salsa Caesar, il pollo fritto e l’eventuale lisozima da uovo nel grana.",
    en: "Check the Caesar dressing, fried chicken and possible egg-derived lysozyme in the grana.",
    de: "Caesar-Dressing, Brathähnchen und mögliches Ei-Lysozym im Grana prüfen.",
    fr: "Vérifier la sauce César, le poulet frit et l’éventuel lysozyme d’œuf du grana.",
  },
  label: {
    it: "Consultare l’etichetta del prodotto servito.",
    en: "Check the label of the product served.",
    de: "Etikett des servierten Produkts prüfen.",
    fr: "Vérifier l’étiquette du produit servi.",
  },
  flag: {
    it: "Il birrificio indica «senza glutine» e riporta il malto d’orzo tra gli ingredienti.",
    en: "The brewery labels this beer gluten-free and lists barley malt as an ingredient.",
    de: "Die Brauerei kennzeichnet das Bier als glutenfrei und nennt Gerstenmalz als Zutat.",
    fr: "La brasserie indique « sans gluten » et mentionne le malt d’orge parmi les ingrédients.",
  },
  wine: {
    it: "Verificare solfiti e altri allergeni sull’etichetta del vino servito.",
    en: "Check the wine label for sulphites and other allergens.",
    de: "Weinetikett auf Sulfite und weitere Allergene prüfen.",
    fr: "Vérifier les sulfites et autres allergènes sur l’étiquette du vin servi.",
  },
};
const wines = new Set(["Cabernet Franc", "Friulano", "Prosecco DOC Treviso"]);
const friedFoods = new Set(["Cotoletta e Patate Fritte", "Stuzzica Mix", "Patatine Fritte", "Alette di Pollo 6pz",
  "Anelli di Cipolla 6pz", "Mini Frico 8pz", "Pepite di Asiago 8pz", "Panino Vegetariano e Patate Fritte", "Hot Dog e Patate Fritte"]);
export function recipeNote(name: string, description: string, hasCodes: boolean, language: Language) {
  if (name === "Flag") return notes.flag[language];
  if (wines.has(name)) return notes.wine[language];
  if (name === "Caesar Salad") return notes.caesar[language];
  if (friedFoods.has(name)) return notes.fried[language];
  if (/pesto/i.test(description)) return notes.pesto[language];
  if (/grana/i.test(description)) return notes.grana[language];
  if (barleyBeers.has(name) || ["Wieze Blanche", "Rush More", "Bibite"].includes(name)) return notes.label[language];
  return hasCodes ? undefined : notes.missing[language];
}
