import type { Language } from "../i18n";

// Extra detail for the highlighted family, where the menu or supplier names it.
const sources = {
  barley: { it: "Malto d’orzo.", en: "Barley malt.", de: "Gerstenmalz.", fr: "Malt d’orge." },
  wheat: { it: "Frumento.", en: "Wheat.", de: "Weizen.", fr: "Blé." },
  almonds: { it: "Mandorle.", en: "Almonds.", de: "Mandeln.", fr: "Amandes." },
  pistachios: { it: "Pistacchi.", en: "Pistachios.", de: "Pistazien.", fr: "Pistaches." },
  walnuts: { it: "Noci.", en: "Walnuts.", de: "Walnüsse.", fr: "Noix." },
};
const barleyBeers = new Set(["Rush More", "Flag", "Iron Bridge", "Liquidambra", "Guglielmo", "Cordelia", "Amleto", "Hirter Marzen", "Hirter Morchl"]);
const nutSources: Record<string, keyof typeof sources> = { Caprina: "almonds", Povera: "pistachios", Delicata: "walnuts" };
// These groups are printed for the dish, but the ingredient list does not identify their source.
const printedGroups: Record<string, number[]> = {
  "Marinara Classica": [7], "Marinara d'Oro": [7],
  Valtellina: [5], Greca: [5], Saporita: [5], Sarah: [5], Golosa: [5],
  "Aggiunta di Burrata": [1], "Tagliere di Affettati Misti e Formaggi": [8],
  "Caesar Salad": [1, 3, 5], "Panino Vegetariano e Patate Fritte": [3, 5, 10],
  "Hot Dog e Patate Fritte": [5, 7, 10], "Montanare 4pz": [3, 4, 5],
};
const printedDetail = {
  it: "In carta, da confermare.",
  en: "On menu, please confirm.",
  de: "Laut Karte, bitte prüfen.",
  fr: "Sur la carte, à confirmer.",
};
export function ingredientSource(name: string, code: number, language: Language) {
  if (printedGroups[name]?.includes(code)) return printedDetail[language];
  if (code === 8 && nutSources[name]) return sources[nutSources[name]][language];
  if (code === 1 && barleyBeers.has(name)) return sources.barley[language];
  if (code === 1 && name === "Wieze Blanche") return sources.wheat[language];
}

const notes = {
  water: {
    it: "Acqua naturale o frizzante.",
    en: "Still or sparkling water.",
    de: "Stilles Wasser oder Sprudelwasser.",
    fr: "Eau plate ou gazeuse.",
  },
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
  pestoNuts: {
    it: "Chiedi quale frutta a guscio contiene il pesto.",
    en: "Ask which tree nuts are in the pesto.",
    de: "Bitte die Schalenfruchtart im Pesto erfragen.",
    fr: "Demandez quels fruits à coque contient le pesto.",
  },
  grana: {
    it: "Da verificare l’eventuale lisozima da uovo nel grana.",
    en: "Check the grana cheese for egg-derived lysozyme.",
    de: "Grana auf Lysozym aus Ei prüfen.",
    fr: "Vérifier si le grana contient du lysozyme issu de l’œuf.",
  },
  fried: {
    it: "Verificare preparazione, olio e friggitrice condivisa.",
    en: "Check ingredients, oil and shared fryer.",
    de: "Rezeptur, Öl und gemeinsame Fritteuse prüfen.",
    fr: "Vérifier la recette, l’huile et la friteuse partagée.",
  },
  caesar: {
    it: "Verificare salsa Caesar, pollo fritto e lisozima da uovo nel grana.",
    en: "Check the dressing and chicken, and the grana for egg lysozyme.",
    de: "Dressing, Backhuhn und Ei-Lysozym im Grana prüfen.",
    fr: "Vérifier la sauce, le poulet frit et le lysozyme d’œuf du grana.",
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
  if (name === "Acqua") return notes.water[language];
  if (name === "Flag") return notes.flag[language];
  if (wines.has(name)) return notes.wine[language];
  if (name === "Caesar Salad") return notes.caesar[language];
  if (friedFoods.has(name)) return notes.fried[language];
  if (name === "Genovese") return notes.pestoNuts[language];
  if (/pesto/i.test(description)) return notes.pesto[language];
  if (/grana/i.test(description)) return notes.grana[language];
  if (barleyBeers.has(name) || ["Wieze Blanche", "Bibite"].includes(name)) return notes.label[language];
  return hasCodes ? undefined : notes.missing[language];
}
