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
  recipe: {
    it: "Chiedi al personale di verificare la ricetta e gli eventuali contatti in cucina prima di ordinare.",
    en: "Before ordering, ask staff to check the recipe and possible cross-contact in the kitchen.",
    de: "Bitte vor der Bestellung die Rezeptur und mögliche Kreuzkontakte mit dem Personal klären.",
    fr: "Avant de commander, demandez au personnel de vérifier la recette et les risques de contact croisé.",
  },
  missing: {
    it: "Per questo prodotto, chiedi al personale di verificare gli allergeni sulla ricetta o sull’etichetta prima di ordinare.",
    en: "Ask staff to check the recipe or label for this product’s allergens before ordering.",
    de: "Bitte vor der Bestellung die Allergene dieses Produkts anhand der Rezeptur oder des Etiketts erfragen.",
    fr: "Avant de commander, demandez au personnel de vérifier les allergènes de ce produit sur la recette ou l’étiquette.",
  },
  pesto: {
    it: "Chiedi al personale quali ingredienti contiene il pesto utilizzato, in particolare la frutta a guscio.",
    en: "Ask staff which ingredients the pesto contains, especially tree nuts.",
    de: "Bitte beim Personal die Zutaten des verwendeten Pestos erfragen, insbesondere Schalenfrüchte.",
    fr: "Demandez au personnel quels ingrédients composent le pesto, en particulier les fruits à coque.",
  },
  grana: {
    it: "Chiedi al personale se il grana utilizzato contiene lisozima da uovo.",
    en: "Ask staff whether the grana cheese used contains egg-derived lysozyme.",
    de: "Bitte nachfragen, ob der verwendete Grana Lysozym aus Ei enthält.",
    fr: "Demandez si le grana utilisé contient du lysozyme issu de l’œuf.",
  },
  fried: {
    it: "Chiedi al personale di verificare la preparazione, l’olio e l’uso della friggitrice per altri alimenti.",
    en: "Ask staff to check the preparation, frying oil and whether other foods use the same fryer.",
    de: "Bitte Zubereitung, Frittieröl und die Nutzung der Fritteuse für andere Speisen erfragen.",
    fr: "Demandez au personnel de vérifier la préparation, l’huile et les autres aliments cuits dans la même friteuse.",
  },
  caesar: {
    it: "Chiedi al personale di verificare la salsa Caesar, la preparazione del pollo fritto e l’eventuale lisozima da uovo nel grana.",
    en: "Ask staff to check the Caesar dressing, the fried chicken preparation and any egg-derived lysozyme in the cheese.",
    de: "Bitte Caesar-Dressing, die Zubereitung des frittierten Hähnchens und mögliches Ei-Lysozym im Grana erfragen.",
    fr: "Faites vérifier la sauce César, la préparation du poulet frit et l’éventuel lysozyme d’œuf dans le grana.",
  },
  label: {
    it: "Per la composizione del prodotto servito, chiedi al personale di controllare l’etichetta.",
    en: "Ask staff to check the label of the product being served.",
    de: "Bitte das Personal nach den Angaben auf dem Etikett des servierten Produkts fragen.",
    fr: "Demandez au personnel de vérifier l’étiquette du produit servi.",
  },
  flag: {
    it: "Il birrificio indica «senza glutine» e riporta il malto d’orzo tra gli ingredienti.",
    en: "The brewery labels this beer gluten-free and lists barley malt as an ingredient.",
    de: "Die Brauerei kennzeichnet das Bier als glutenfrei und nennt Gerstenmalz als Zutat.",
    fr: "La brasserie indique « sans gluten » et mentionne le malt d’orge parmi les ingrédients.",
  },
  wine: {
    it: "Prima di ordinare, chiedi al personale di controllare i solfiti e gli altri allergeni sull’etichetta del vino servito.",
    en: "Before ordering, ask staff to check the wine label for sulphites and other allergens.",
    de: "Bitte vor der Bestellung das Weinetikett auf Sulfite und weitere Allergene prüfen lassen.",
    fr: "Avant de commander, faites vérifier la présence de sulfites et d’autres allergènes sur l’étiquette du vin servi.",
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
  return hasCodes ? notes.recipe[language] : notes.missing[language];
}
