import { readFile, writeFile } from "node:fs/promises";

const operator = JSON.parse(await readFile(new URL("../src/data/operator.json", import.meta.url), "utf8"));
const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = text => text.replace(/[&<>"']/g, char => entities[char]);

for (const language of ["", "en/", "de/", "fr/"]) {
  for (const slug of ["privacy", "note-legali"]) {
    const file = new URL(`../public/${language}${slug}.html`, import.meta.url);
    const original = await readFile(file, "utf8");
    const updated = original
      .replace(/(<span data-operator="([a-zA-Z]+)">)(?:[^<]*|<a href="mailto:[^"]*">[^<]*<\/a>)(<\/span>)/g, (_, open, key, close) => {
        const value = operator[key];
        if (typeof value !== "string") throw new Error(`Unknown operator field: ${key}`);
        const label = escape(value);
        const content = key === "email" && !operator.preview
          ? `<a href="mailto:${encodeURIComponent(value).replace("%40", "@")}">${label}</a>`
          : label;
        return open + content + close;
      })
      .replace(/<p data-preview(?: hidden)?>/g, operator.preview ? "<p data-preview>" : "<p data-preview hidden>");
    if (updated !== original) await writeFile(file, updated);
  }
}
