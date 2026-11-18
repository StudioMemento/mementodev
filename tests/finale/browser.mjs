import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const playwright = process.env.PLAYWRIGHT_MODULE || (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + "/playwright/index.mjs" : "playwright");
const { chromium } = await import(playwright);
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const url = process.env.TEST_URL || "http://127.0.0.1:4175/";
const original = JSON.parse(await readFile("src/data/photos.json", "utf8"));

async function tick(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function center(locator) {
  await locator.evaluate(el => window.scrollBy({ top: el.getBoundingClientRect().top + el.clientHeight / 2 - innerHeight / 2, behavior: "instant" }));
}
async function position(stage) {
  return stage.locator(".ribbon-card").first().evaluate(el => el.style.transform);
}
async function touchSwipe(page, from, to) {
  const cdp = await page.context().newCDPSession(page);
  const points = { x: from.x, y: from.y };
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [points] });
  for (let i = 1; i <= 6; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + (to.x - from.x) * i / 6, y: from.y + (to.y - from.y) * i / 6 }] });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
}

async function galleries(page, touch) {
  const rooms = page.locator("#gallery .venue-room");
  assert.equal(await rooms.count(), 5);
  assert.deepEqual(await rooms.locator("h2").allTextContents(), ["Esterno", "Bancone", "Sala sinistra", "Sala destra", "Via Roma"]);
  for (const [key, photos] of Object.entries(original.GALLERY_ALBUMS))
    assert.equal(await page.locator(`#album-${key} .ribbon-card`).count(), photos.length);
  assert.equal(await rooms.locator(".photo-controls,.photo-expand,[aria-live] + button").count(), 0);
  assert.equal(await page.locator("#customer .photo-byline").count(), 12);
  assert.deepEqual(await page.locator("#customer .photo-byline").allTextContents(), original.CUSTOMER.map(p => p.name));
  assert.equal(await page.locator(".table-lead").textContent(), "Ricordi condivisi dalla community!");

  const stage = rooms.first().locator(".ribbon-stage");
  await center(stage); await page.waitForSelector("#album-esterno [data-enhanced]");
  await center(stage); await stage.focus(); await page.keyboard.press("Home");
  await page.waitForFunction(() => document.querySelector("#album-esterno .ribbon-stage").dataset.active === "0");
  const projection = await stage.evaluate(node => {
    const cards = [...node.querySelectorAll(".ribbon-card")];
    const frame = i => cards[i].getBoundingClientRect();
    const centered = frame(0), right = frame(1);
    return { clip: node.firstElementChild.style.clipPath, transforms: cards[0].style.transform, sideHigher: right.height > centered.height,
      narrowerThanStage: centered.width < node.clientWidth, noTilt: centered.top >= right.top };
  });
  assert.ok(projection.sideHigher && projection.noTilt && projection.narrowerThanStage);
  assert.match(projection.transforms, /matrix3d/); assert.match(projection.clip, /polygon/);
  await page.keyboard.press("ArrowLeft");
  assert.equal(await stage.getAttribute("data-active"), String(original.GALLERY_ALBUMS.esterno.length - 1));
  await page.keyboard.press("ArrowRight"); assert.equal(await stage.getAttribute("data-active"), "0");

  const rect = await stage.boundingBox();
  const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
  const before = await position(stage);
  if (touch) await touchSwipe(page, {x, y}, {x:x-110, y:y+2});
  else { await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x-110,y+1,{steps:7}); await page.mouse.up(); }
  assert.notEqual(await position(stage), before);
  assert.equal(await page.locator("dialog[open]").count(), 0);

  const strip = page.locator("#customer .ribbon-stage");
  await center(strip); await page.waitForSelector("#customer [data-enhanced]"); await center(strip); await strip.focus();
  await page.keyboard.press("Home"); const card = strip.locator(".ribbon-card").first();
  const geom = await card.evaluate(button => {
    const img = button.querySelector("img").getBoundingClientRect();
    const label = button.querySelector(".photo-byline").getBoundingClientRect();
    return [img.width, img.height, img.left, label.left, getComputedStyle(button).textAlign];
  });
  assert.ok(Math.abs(geom[0] - geom[1]) < 1 && Math.abs(geom[2] - geom[3]) < 1); assert.equal(geom[4], "left");
  const bounds = await card.boundingBox();
  if (touch) {
    const start = await page.evaluate(() => scrollY);
    await touchSwipe(page, {x:bounds.x+bounds.width*.55,y:bounds.y+bounds.height*.7}, {x:bounds.x+bounds.width*.55+1,y:bounds.y+bounds.height*.7-130});
    await page.waitForFunction(y => scrollY > y+12, start);
    assert.equal(await page.locator("dialog[open]").count(), 0, "Vertical gestures must scroll the page");
    await center(strip); await strip.focus(); await page.keyboard.press("Home");
    const bb=await card.boundingBox(), sx=bb.x+bb.width*.65, sy=bb.y+bb.height*.5;
    await touchSwipe(page,{x:sx,y:sy},{x:sx-95,y:sy+1});
    assert.equal(await page.locator("dialog[open]").count(), 0, "Horizontal swipes must not open the photo");
  }
  await strip.focus(); await page.keyboard.press("Home"); await page.keyboard.press("Enter");
  await page.locator("dialog.modal-photo[open]").waitFor();
  assert.equal(await page.locator("#modal-title").textContent(), original.CUSTOMER[0].name);
  await page.keyboard.press("ArrowRight"); assert.equal(await page.locator("#modal-title").textContent(), original.CUSTOMER[1].name);
  await page.keyboard.press("Escape"); await page.locator("dialog").waitFor({state:"detached"});
  assert.ok(await strip.evaluate(el => el === document.activeElement));
  // A normal click also opens the matching original, independently of the square thumbnail.
  await strip.focus(); await page.keyboard.press("Home"); await center(strip);
  if (touch) await card.tap(); else await card.click();
  await page.locator(".lightbox-image img").waitFor();
  assert.ok((await page.locator(".lightbox-image img").getAttribute("src")).endsWith(original.CUSTOMER[0].src));
  await page.locator(".modal-close").click();
}

async function contactAndLegal(page, touch) {
  const links = page.locator(".social-bento a");
  assert.equal(await links.count(),6); assert.equal(await page.locator(".platform-google").getAttribute("href"),
    "https://www.google.com/maps/place//data=!4m4!3m3!1s0x477983a3cc4c3b4f:0x641962f142805885!9m1!1b1");
  assert.deepEqual(await links.evaluateAll(a => a.map(el => new URL(el.href).hostname)),
    ["www.instagram.com","www.facebook.com","www.tripadvisor.it","restaurantguru.it","www.sluurpy.it","www.google.com"]);
  assert.equal(await page.locator(".map-tile").getAttribute("href"),"https://maps.google.com/?cid=7212905066552907909");
  assert.equal(await page.locator(".phone-tile").getAttribute("href"),"tel:+390427541232");
  assert.equal(await page.locator(".wa-tile").getAttribute("href"),"https://wa.me/393802453757");
  assert.equal(await page.locator(".studio-credit").getAttribute("href"),"https://mementostudio.it");
  if (!touch) {
    await links.first().hover(); await page.waitForSelector(".social-bento[data-lit]");
    assert.ok(await links.first().evaluate(el=>el.style.getPropertyValue("--light-x").endsWith("px")));
  }
  for (const lang of ["it", "en", "de", "fr"]) {
    await page.locator(`[data-lang="${lang}"]`).click();
    const footer = page.locator(".visit-footer nav a");
    for (let i=0;i<3;i++) {
      const link=footer.nth(i);
      await center(link); await link.click();
      const dialog=page.locator("dialog.modal-legal[open]");
      const text = dialog.locator("article.legal-text");
      await text.waitFor();
      assert.equal(await text.getAttribute("lang"), lang);
      const path=await link.getAttribute("href");
      const response=await page.request.get(new URL(path,url).toString()); assert.ok(response.ok());
      const html=await response.text();
      assert.equal(await text.evaluate((e,html)=>new DOMParser().parseFromString(html,"text/html").querySelector(".legal-text").innerHTML===e.innerHTML,html),true);
      const dims=await dialog.evaluate(d=>{
        const v=d.querySelector(".legal-scroll"),rail=d.querySelector(".vr-scroll-progress");
        const close=d.querySelector(".modal-close").getBoundingClientRect();
        return {width:d.clientWidth,height:d.clientHeight,innerWidth,innerHeight,range:v.scrollHeight-v.clientHeight,hidden:rail.hidden,bar:getComputedStyle(v).scrollbarWidth,closeFits:close.top>=0&&close.bottom<=innerHeight,back:getComputedStyle(d,"::backdrop").backdropFilter};
      });
      assert.ok(Math.abs(dims.width-dims.innerWidth)<2 && Math.abs(dims.height-dims.innerHeight)<2 && dims.closeFits);
      assert.ok(dims.back.includes("blur"));assert.equal(dims.bar,"none");assert.equal(dims.hidden,dims.range<=1);
      if (dims.range>1) {
        await page.keyboard.press("End");
        await page.waitForFunction(()=>{const v=document.querySelector(".legal-scroll");return v.scrollTop>=v.scrollHeight-v.clientHeight-1;});
        // The native scroll event is delivered after scrollTop updates.
        await page.waitForFunction(() => {
          const fill = document.querySelector(".legal-panel .vr-scroll-progress > span");
          return new DOMMatrix(getComputedStyle(fill).transform).m22 > .98;
        }, null, {timeout:3000});
      }
      if (i===1 && lang==="it") {
        await text.locator("a[data-legal='privacy']").click();
        await page.waitForFunction(()=>document.querySelector("#modal-title")?.textContent==="Privacy" && document.querySelector(".legal-text h2")?.textContent==="Chi contattare");
        assert.equal(await page.locator(".legal-scroll").evaluate(e=>e.scrollTop),0);
      }
      if (i===2 && !touch) await page.mouse.click(3,3); else await page.keyboard.press("Escape");
      await dialog.waitFor({state:"detached"});assert.ok(await link.evaluate(e=>e===document.activeElement));
    }
  }
  await page.locator('[data-lang="it"]').click();
}

async function run(layout) {
  const page=await browser.newPage({viewport:{width:layout[0], height:layout[1]},hasTouch:layout[2],isMobile:layout[2],reducedMotion:"reduce"});
  const errors=[], failed=[], first=[];
  page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)failed.push(r.url());});
  page.on("request",r=>first.push(r.url()));
  await page.goto(url);await page.evaluate(()=>document.fonts.ready);await tick(page);
  assert.ok(first.every(link=>!link.includes("/assets/ribbons/")), "Gallery bytes loaded on the menu landing");
  if (layout[3]) await galleries(page,layout[2]);
  await contactAndLegal(page,layout[2]);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),"Horizontal page overflow");
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await page.close();console.log(`FINALE_OK ${layout[0]}×${layout[1]} · galleries ${layout[3]} · 12 localized legal views`);
}

try {
  for(const layout of [[1440,900,false,true],[390,844,true,true],[320,568,true,false],[844,390,true,false]]) await run(layout);
  const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:"no-preference"});
  await page.goto(url);
  const room=page.locator("#album-bancone .ribbon-stage");
  await center(room);await page.waitForSelector("#album-bancone [data-enhanced]");await center(room);
  const first=await position(room);await page.waitForFunction(before=>document.querySelector("#album-bancone .ribbon-card").style.transform!==before,first);
  await room.hover();await tick(page);const held=await position(room);await page.waitForTimeout(130);assert.equal(await position(room),held);
  await page.mouse.move(2,2);await page.waitForFunction(before=>document.querySelector("#album-bancone .ribbon-card").style.transform!==before,held);
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));await tick(page);const outside=await position(room);await page.waitForTimeout(130);assert.equal(await position(room),outside);
  await page.close();console.log("GALLERY_MOTION_OK · drift, hover pause, offscreen pause");
} finally { await browser.close(); }
