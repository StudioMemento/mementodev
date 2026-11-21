import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const driver = process.env.PLAYWRIGHT_MODULE || (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright/index.mjs" : "playwright");
const drivers = await import(driver);
const origin = "https://viaroma.test";
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".webp":"image/webp", ".png":"image/png", ".woff2":"font/woff2", ".svg":"image/svg+xml" };
const langs = ["it","en","de","fr"];
const shortWait = {timeout: 6000};

for (const engine of (process.env.BROWSERS || "chromium,firefox,webkit").split(",")) {
  const options = { headless:true };
  if (engine === "chromium" && process.env.CHROMIUM_PATH) options.executablePath=process.env.CHROMIUM_PATH;
  if (engine === "chromium" && process.env.CHROMIUM_FLAGS) options.args=JSON.parse(process.env.CHROMIUM_FLAGS);
  if (engine === "webkit" && process.env.WEBKIT_PATH) options.executablePath=process.env.WEBKIT_PATH;
  if (engine === "firefox") options.firefoxUserPrefs={"layout.css.prefers-reduced-motion.content-override":1};
  const browser=await drivers[engine].launch(options);
  try {
    async function openFixture(extra={},initialFailure=()=>false) {
      const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce",...extra});
      const requests=[],external=[],errors=[];
      let failure=initialFailure;
      await ctx.route("**/*",async route=>{
        const url=new URL(route.request().url());
        if (url.origin!==origin) {external.push(url.href);return route.abort();}
        requests.push(url.pathname);
        if (failure(url.pathname)) return route.abort("internetdisconnected");
        const filename=decodeURIComponent(url.pathname==="/" ? "/index.html" : url.pathname);
        try { const bytes=await readFile(path.resolve("dist","."+filename));await route.fulfill({body:bytes,contentType:types[path.extname(filename)]||"application/octet-stream"}); }
        catch { try { await route.fulfill({status:404,body:""}); } catch {} }
      });
      const p=await ctx.newPage(); p.setDefaultTimeout(7500);p.on("pageerror",err=>{errors.push(err.message);console.error(engine+" page error: "+err.message)});
      await p.goto(origin+"/",{waitUntil:"load"});
      return {p,ctx,requests,external,errors,fail(fn){failure=fn}};
    }
    const f=await openFixture(),p=f.p;
    await p.locator('[data-lang=it]').click();
    assert.equal(await p.locator('[data-menu-item]').count(),86);
    const pizzaPaths=new Set(f.requests.filter(url=>url.includes('/pizze/')||url.includes('/forno/')));
    const pizzaCount=await p.locator('.vr-pizza-card img:is([src],[srcset])').count();
    assert.ok(pizzaCount>0&&pizzaCount<=3,"Initial carousel source count "+pizzaCount);
    assert.equal(pizzaPaths.size,3);
    const gallery=p.locator('#customer a');
    assert.match(await gallery.getAttribute("href"),/0x477983a3cc4c3b4f:0x641962f142805885!10e5$/);
    assert.equal(await p.locator('#customer .crust-card-shell[data-effect=tilt]').count(),1);
    assert.equal(await p.locator('.venue-room').count(),5);
    assert.equal(await p.locator('a[href^="tel:"]').first().getAttribute('href'),'tel:+390427541232');
    assert.equal(await p.locator('.wa-tile').getAttribute('href'),'https://wa.me/393802453757');
    for (const lang of langs) {
      await p.locator('[data-lang='+lang+']').click();
      await p.waitForFunction(l=>document.documentElement.lang===l,lang);
      const item=p.locator('[data-menu-item="Siciliana"] a.nome');
      await item.focus();await item.press("Enter");
      const dialog=p.locator('dialog[open]');
      await dialog.locator('.food-summary').waitFor();
      assert.match(await dialog.locator('.food-summary').innerText(),/4 ·/);
      await dialog.locator('.food-summary strong').click();assert.equal(await dialog.count(),1);
      await dialog.locator('summary').click();assert.equal(await dialog.locator('.allergen-list li').count(),14);
      assert.equal(await dialog.locator('.allergen-list .contains').count(),3);
      await p.keyboard.press("Escape");await dialog.waitFor({state:"detached"});
      assert.equal(await item.evaluate(n=>document.activeElement===n),true);
      for(const slug of ["privacy","note-legali","cookie"]) {
        const url=(lang==="it"?"/":"/"+lang+"/")+slug+".html";
        const response=await p.evaluate(async url=>{const r=await fetch(url);const d=new DOMParser().parseFromString(await r.text(),"text/html");return [r.status,d.documentElement.lang,!!d.querySelector("article.legal-text")];},url);
        assert.deepEqual(response,[200,lang,true]);
      }
    }
    await p.locator('[data-lang=it]').click();
    const item=p.locator('[data-menu-item="Marinara Classica"] a.nome');
    f.fail(()=>true);await f.ctx.setOffline(true);
    await item.focus();await item.press("Enter");
    await p.locator('dialog .food-summary').waitFor();
    assert.match(await p.locator('dialog .food-summary').innerText(),/7 · Latte/);
    await p.goBack();await p.locator('dialog').waitFor({state:"detached"});
    await p.locator('.drinks-allergens summary').click();assert.equal(await p.locator('.drinks-allergens dt').count(),15);
    assert.match(await p.locator('.drinks-allergens').innerText(),/malto d’orzo/);
    await p.locator('.visit-footer a[href="/privacy.html"]').click();
    await p.locator('dialog .legal-error').waitFor();
    assert.equal(await p.locator('[data-menu-item]').count(),86);
    f.fail(()=>false);await f.ctx.setOffline(false);
    await p.locator('dialog .legal-text').waitFor(shortWait);await p.keyboard.press("Escape");
    await p.locator('dialog').waitFor({state:"detached"});
    await p.locator('[data-lang=de]').click();
    for(const spacing of [false,true]) {
      if(spacing)await p.addStyleTag({content:'* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-block-end:2em!important}'});
      for (const [width,height] of [[240,320],[280,420],[320,480],[390,844],[1440,900]]) {
        await p.setViewportSize({width,height});await p.waitForTimeout(70);
        const sizes=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth,document.querySelector('.vr-pizza-card[data-active=true]').getBoundingClientRect().width]);
        assert.ok(sizes[0]<=sizes[1]+1,"Reflow "+width+" "+spacing+" "+sizes);assert.ok(sizes[2]>85);
      }
    }
    assert.deepEqual(f.errors,[]);assert.deepEqual(f.external,[]);
    const passive=await openFixture({javaScriptEnabled:false});
    const np=passive.p;
    await np.locator('[data-menu-item="Marinara Classica"] a.nome').click();
    assert.ok(await np.locator('#allergeni-marinara-classica').isVisible());
    assert.match(await np.locator('#allergeni-marinara-classica').innerText(),/7 · Latte/);
    await np.locator('#allergeni-marinara-classica a[href="#legenda-allergeni"]').click();
    const details=np.locator('#legenda-allergeni');
    if(!await details.isVisible())await np.locator('details:has(#legenda-allergeni)>summary').click();
    assert.equal(await details.locator('li:visible').count(),14);
    await np.locator('.drinks-allergens summary').click();assert.equal(await np.locator('.drinks-allergens dt:visible').count(),15);
    await np.locator('.visit-footer a[href="/privacy.html"]').click();await np.locator('article.legal-text').waitFor();
    for(const extension of ['.js','.css']){
      const broken=await openFixture({},url=>url.endsWith(extension));const bp=broken.p;
      assert.equal(await bp.locator('[data-menu-item]').count(),86);
      const link=bp.locator('[data-menu-item="Siciliana"] a.nome');await link.focus();await link.press("Enter");
      if(extension==='.js') await bp.locator('#allergeni-siciliana:target').waitFor();
      else await bp.locator('dialog[open] .food-summary').waitFor();
    }
    const touch=await openFixture({hasTouch:true,reducedMotion:"no-preference"});const tp=touch.p;
    const stage=tp.locator('#album-esterno .ribbon-stage');await stage.scrollIntoViewIfNeeded();
    await tp.locator('#album-esterno .ribbon-pause').waitFor();await stage.dispatchEvent("pointerdown",{pointerType:"touch",isPrimary:true,pointerId:59});
    await tp.locator('#album-esterno button[aria-label^="Riprendi"]').waitFor();await stage.dispatchEvent("pointerup",{pointerType:"touch",pointerId:59});
    const current=await stage.getAttribute('data-active');await tp.waitForTimeout(300);assert.equal(await stage.getAttribute('data-active'),current);
    await tp.locator('#album-esterno .ribbon-pause').click();await tp.locator('#album-esterno button[aria-label^="Pausa"]').waitFor();
    console.log(engine+" OK · offline, recovery, missing JS/CSS, no JS, four languages, 86 menu items, 15 drinks, reflow, touch pause, native gallery link; initial pizza images "+pizzaCount);
    if(process.env.QA_DIR && engine==="chromium"){
      await mkdir(process.env.QA_DIR,{recursive:true});
      const snap=await openFixture();for(const [width,height] of [[1440,900],[390,844]]){await snap.p.setViewportSize({width,height});
        const card=snap.p.locator('#customer .crust-card');await card.scrollIntoViewIfNeeded();await snap.p.locator('#customer img').evaluate(img=>img.decode());
        await card.screenshot({path:path.join(process.env.QA_DIR,'card-'+width+'.jpg'),type:'jpeg',quality:92});}
    }
  } finally { await browser.close(); }
}
