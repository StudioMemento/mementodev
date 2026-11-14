import { readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const html = await readFile("dist/index.html", "utf8");
assert.ok(
  html.includes("Margherita Classica") && html.includes("cat-calzoni"),
  "Menu missing from initial HTML",
);
assert.ok(!html.includes("<!--app-html-->"));
assert.ok(!html.includes("walkthrough"));
assert.ok(
  html.includes("noindex,nofollow"),
  "Preview indexing protection missing",
);
const local = [...html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)].map(
  (m) => m[1],
);
for (const url of local) await stat("dist" + url);
let js = 0,
  css = 0;
for (const file of await readdir("dist/assets")) {
  if (!/\.(js|css)$/.test(file)) continue;
  const bytes = await readFile("dist/assets/" + file),
    gzip = gzipSync(bytes).length;
  if (file.endsWith(".js")) js += gzip;
  else css += gzip;
}
assert.ok(js < 160_000, `JS budget exceeded: ${js}`);
assert.ok(css < 35_000, `CSS budget exceeded: ${css}`);
for (const file of [
  "privacy.html",
  "cookie.html",
  "note-legali.html",
  "legal.css",
  "assets/fonts/jost.css",
  "assets/fonts/phosphor.css",
])
  await stat("dist/" + file);
assert.ok(
  !(await readFile("dist/legal.css", "utf8")).includes(
    "https://fonts.googleapis.com",
  ),
  "External font dependency",
);
console.log(
  `PRODUCTION_CHECK_OK — prerendered menu; all JS chunks ${Math.round(js / 1024)} KiB gzip, CSS ${Math.round(css / 1024)} KiB gzip.`,
);
