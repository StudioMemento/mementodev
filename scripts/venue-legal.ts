import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import venue from "../config/venue.json" with { type: "json" };
import approvals from "../config/food-approvals.json" with { type: "json" };
import type { Approval } from "../src/data/allergen-info.ts";

const languages = ["it", "en", "de", "fr"] as const;
type Lang = typeof languages[number];
const pages = ["privacy", "cookie", "note-legali"];
const routes = new Map(languages.flatMap(lang => pages.map(slug =>
  [(lang === "it" ? "/" : "/" + lang + "/") + slug + ".html", lang] as const)));
const labels = {
  it: ["Gestore", "Sede legale", "P. IVA", "Registro delle imprese"],
  en: ["Operator", "Registered office", "Italian VAT number", "Business register"],
  de: ["Betreiber", "Geschäftssitz", "Italienische USt-IdNr.", "Handelsregister"],
  fr: ["Exploitant", "Siège social", "Numéro de TVA italien", "Registre des entreprises"],
};
const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
if (venue.identityConfirmed && (!venue.registeredName || !venue.registeredAddress || !/^\d{11}$/.test(venue.vat))) throw Error("Controllare la denominazione, la sede e la partita IVA approvate.");
if (venue.publicEmail && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(venue.publicEmail)) throw Error("Indirizzo pubblico non valido.");
export const publicVat = venue.identityConfirmed ? venue.vat : "";
const validCodes = (codes: unknown) => Array.isArray(codes) && codes.every(code => Number.isInteger(code) && code >= 1 && code <= 14) && new Set(codes).size === codes.length;
const records: Record<string, Approval & { source: string; date: string }> = approvals;
export const publicFood = Object.fromEntries(Object.entries(records).map(([id, record]) => {
  if (!record.source?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(record.date) || !validCodes(record.codes) ||
    (record.crossContact && !validCodes(record.crossContact))) throw Error("Scheda allergeni incompleta: " + id);
  const details = Object.fromEntries(languages.flatMap(lang => record.details?.[lang] ? [[lang, record.details[lang]]] : []));
  return [id, { codes: record.codes, crossContact: record.crossContact ?? [], details }];
}));
function render(html: string, lang: Lang) {
  const values = [venue.registeredName, venue.registeredAddress, venue.vat, [venue.registerOffice, venue.rea ? "REA " + venue.rea : ""].filter(Boolean).join(" · ")];
  const identity = venue.identityConfirmed ? values.map((value, i) => value ? "<p>" + labels[lang][i] + " · " + escape(value) + "</p>" : "").join("") : "";
  const mail = escape(venue.publicEmail);
  return html.replace("<!--venue-identity-->", identity)
    .replace("<!--venue-email-->", mail ? '<p>Email · <a href="mailto:' + mail + '">' + mail + "</a></p>" : "")
    .replace("<!--venue-chat-->", venue.chatPolicy[lang] ? "<p>" + escape(venue.chatPolicy[lang]) + "</p>" : "");
}
export function venueLegal(): Plugin {
  let ssr = false;
  return {
    name: "venue-legal",
    configResolved(config) { ssr = Boolean(config.build.ssr); },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? "").split("?")[0], lang = routes.get(path);
        if (!lang) return next();
        try {
          res.setHeader("Content-Type","text/html; charset=utf-8");
          res.end(render(await readFile(resolve("public", "." + path), "utf8"), lang));
        } catch (error) { next(error); }
      });
    },
    async writeBundle(options) {
      if (ssr || !options.dir) return;
      await Promise.all([...routes].map(async ([path, lang]) => {
        const file = resolve(options.dir!, "." + path);
        await writeFile(file, render(await readFile(resolve("public", "." + path), "utf8"), lang));
      }));
    },
  };
}
