import { useI18n, translateName } from "../i18n";
import allergens from "../data/allergens.json";
import { releaseCopy } from "../data/release-copy";
import { approvedItem, foodId, getAllergenInfo } from "../data/allergen-info";
import menu from "../data/menu.json";

type Food = { name: string; description?: string; codes?: string };
const toppings = new Set([...menu.VARIANTI, ...menu.CORNICE.filter(row => row[0].startsWith("Cornicione"))].map(row => row[0]));

export function AllergenSummary({ name, description, codes }: Food) {
  const { language, copy } = useI18n();
  const t = releaseCopy[language], info = getAllergenInfo(name, description, codes);
  const list = (values: number[]) => values.map(code => code + " · " + allergens[language][code - 1][0] + (code === 8 && !info.approved && namedNuts[language][name] ? " (" + namedNuts[language][name] + ")" : "")).join(", ");
  return <div className="food-summary">
    {info.codes.length > 0 && <p><strong>{info.approved ? t.contains : t.printed}</strong><br />{list(info.codes)}</p>}
    {info.details?.[language] && <p>{info.details[language]}</p>}
    {info.crossContact.length > 0 && <p><strong>{t.cross}</strong><br />{list(info.crossContact)}</p>}
    {name === "Patatine Fritte" && <p>{t.fryer}</p>}
    {toppings.has(name) && <p>{t.topping}</p>}
    {info.frozen && <p className="food-frozen">* {copy.frozenTitle} · {copy.frozen}</p>}
    {(!info.approved || (!info.codes.length && !info.details?.[language])) && <p>{t.consult}</p>}
  </div>;
}

export function AllergenLegend({ selected = [] }: { selected?: number[] }) {
  const { language } = useI18n();
  return <ol className="allergen-list">{allergens[language].map(([name, description], i) =>
    <li key={name} className={selected.includes(i + 1) ? "contains" : undefined}>
      <b className="allergen-code">{i + 1}</b><span className="allergen-text"><strong className="allergen-name">{name}</strong>
      <span className="allergen-description">{description}</span></span>
    </li>)} </ol>;
}

const beerSheets: Record<string, string> = {
  Flag: "https://birragarlatticosta.it/products/flag-keller-pils?variant=53668126916938",
  "Iron Bridge": "https://birragarlatticosta.it/products/iron-bridge-altbier-33cl?variant=53668127048010",
  Liquidambra: "https://birragarlatticosta.it/products/liquidambra?variant=62508399034698",
  "Hirter Marzen": "https://shop.hirterbier.at/produkt/hirter-maerzen/",
  "Hirter Morchl": "https://shop.hirterbier.at/produkt/hirter-morchl/",
};
const namedNuts: Record<string, Record<string, string>> = {
  it: { Caprina: "mandorle", Povera: "pistacchi", Delicata: "noci" },
  en: { Caprina: "almonds", Povera: "pistachios", Delicata: "walnuts" },
  de: { Caprina: "Mandeln", Povera: "Pistazien", Delicata: "Walnüsse" },
  fr: { Caprina: "amandes", Povera: "pistaches", Delicata: "noix" },
};
const drinks = [...menu.ACQUA_BIBITE, ...menu.BOTTIGLIA.flatMap(group => group[2] as string[][]), ...menu.SPINA, ...menu.VINI].map(row => row[0]);
const wines = new Set(menu.VINI.map(row => row[0]));
const drinkCopy = {
  it: ["Il produttore indica malto d’orzo.", "Il produttore indica «senza glutine» e malto d’orzo.", "Chiedi di verificare i solfiti sull’etichetta del vino servito."],
  en: ["The producer lists barley malt.", "The producer specifies gluten-free and lists barley malt.", "Ask our staff to check the wine label for sulphites."],
  de: ["Der Hersteller nennt Gerstenmalz.", "Der Hersteller kennzeichnet das Bier als glutenfrei und nennt Gerstenmalz.", "Bitte das Personal um Prüfung der Sulfite auf dem Weinetikett."],
  fr: ["Le producteur indique du malt d’orge.", "Le producteur indique « sans gluten » et mentionne du malt d’orge.", "Demandez au personnel de vérifier les sulfites sur l’étiquette du vin servi."],
};
export function DrinkAllergens() {
  const { language } = useI18n(), t = releaseCopy[language];
  const [barley, flag, wine] = drinkCopy[language];
  function approvedDrink(name: string) {
    const record = approvedItem("drink-" + foodId(name));
    if (!record) return null;
    const names = (codes: number[]) => codes.map(c => allergens[language][c - 1][0]).join(", ");
    return <>{record.codes.length > 0 && <p><strong>{t.contains}</strong> · {names(record.codes)}</p>}
      {record.details?.[language] && <p>{record.details[language]}</p>}
      {Boolean(record.crossContact?.length) && <p>{t.cross} · {names(record.crossContact!)}</p>}{t.label}</>;
  }
  return <details className="menu-disclosure drinks-allergens"><summary>{t.drinks}</summary>
    <dl>{drinks.map(name => <div key={name}><dt>{translateName(name, language)}</dt><dd>
      {approvedDrink(name) ?? (beerSheets[name] ? <>{name === "Flag" ? flag : barley} {t.label} <a href={beerSheets[name]} target="_blank" rel="noopener noreferrer">{t.source} ↗</a></>
        : wines.has(name) ? wine : t.label)}
    </dd></div>)}</dl></details>;
}
