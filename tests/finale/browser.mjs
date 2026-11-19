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
async function touchSwipe(page, from, to, afterMove) {
  const cdp = await page.context().newCDPSession(page);
  const points = { x: from.x, y: from.y };
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [points] });
  for (let i = 1; i <= 6; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + (to.x - from.x) * i / 6, y: from.y + (to.y - from.y) * i / 6 }] });
    if (afterMove) await afterMove();
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
  assert.equal(await page.locator("#customer .photo-byline").count(), 11);
  assert.deepEqual(await page.locator("#customer .photo-byline").allTextContents(), original.CUSTOMER.map(p => p.name));
  assert.equal(await page.locator("#table-title").getAttribute("aria-label"), "Ricordi condivisi dalla community");

  assert.ok(original.CUSTOMER.every(p=>!p.src.includes("carina-30dddd1c")));
  assert.equal(await page.locator("#customer img[src*='carina-30dddd1c']").count(), 0);
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
  if (touch) {
    const initialY = await page.evaluate(() => scrollY);
    for (const dx of [112,-110]) {
      const frames = [];
      const prior = await position(stage);
      await touchSwipe(page,{x,y},{x:x+dx,y:y+(dx>0?14:-12)},async()=>{
        frames.push(await page.evaluate(()=>[scrollY,visualViewport.pageTop]));
      });
      assert.notEqual(await position(stage),prior);
      assert.ok(frames.flat().every(v=>Math.abs(v-initialY)<=1),"Horizontal movement must hold the page still");
    }
  }
  else { await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x-110,y+1,{steps:7}); await page.mouse.up(); }
  assert.notEqual(await position(stage), before);
  assert.equal(await page.locator("dialog[open]").count(), 0);

  if(touch) {
    const priorY=await page.evaluate(()=>scrollY);
    await touchSwipe(page,{x,y},{x:x+2,y:y-110});
    await page.waitForFunction(prior=>scrollY>prior+15,priorY);
  }

  const strip = page.locator("#customer .ribbon-stage");
  await center(strip); await page.waitForSelector("#customer [data-enhanced]"); await center(strip); await strip.focus();
  await page.keyboard.press("Home"); const card = strip.locator(".ribbon-card").first();
  const geom = await card.evaluate(button => {
    const img = button.querySelector("img").getBoundingClientRect();
    const label = button.querySelector(".photo-byline").getBoundingClientRect();
    return [img.width, img.height, img.left, label.left, getComputedStyle(button).textAlign];
  });
  assert.ok(Math.abs(geom[0] - geom[1]) < 1 && Math.abs(geom[2] - geom[3]) < 1); assert.equal(geom[4], "left");
  const colored=await card.evaluate(async button=>{
    const im=button.querySelector("img");await im.decode();
    const canvas=document.createElement("canvas");canvas.width=canvas.height=32;
    const ctx=canvas.getContext("2d");ctx.drawImage(im,0,0,32,32);
    const data=ctx.getImageData(0,0,32,32).data;
    let color=0;for(let i=0;i<data.length;i+=4)if(Math.max(data[i],data[i+1],data[i+2])-Math.min(data[i],data[i+1],data[i+2])>20)color++;
    return color>180 && getComputedStyle(im).boxShadow==="none" && getComputedStyle(button.querySelector(".photo-byline")).color==="rgb(186, 186, 186)";
  });
  assert.ok(colored,"Community thumbnails must be in color with neutral credits");
  const bounds = await card.boundingBox();
  if (touch) {
    const start = await page.evaluate(() => scrollY);
    await touchSwipe(page, {x:bounds.x+bounds.width*.55,y:bounds.y+bounds.height*.7}, {x:bounds.x+bounds.width*.55+1,y:bounds.y+bounds.height*.7-130});
    await page.waitForFunction(y => scrollY > y+12, start);
    assert.equal(await page.locator("dialog[open]").count(), 0, "Vertical gestures must scroll the page");
    await center(strip); await strip.focus(); await page.keyboard.press("Home");
    const bb=await card.boundingBox(), sx=bb.x+bb.width*.65, sy=bb.y+bb.height*.5;
    await touchSwipe(page,{x:sx,y:sy},{x:sx-95,y:sy+1});
    assert.equal(await page.locator(".photo-focus,dialog[open]").count(), 0, "Horizontal swipes must not open the photo");
  }
  const blocked = ".photo-focus,dialog[open],#customer [aria-haspopup],#customer button";
  await strip.focus(); await page.keyboard.press("Home"); await center(strip);
  const startY = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  if (touch) await card.tap(); else await card.click();
  assert.equal(await page.locator(blocked).count(), 0, "Gallery photos only scroll");
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - startY) < 2);
  await strip.focus();
  const stripBounds = await strip.boundingBox();
  const gap = await strip.locator(".ribbon-track").evaluate(el => parseFloat(getComputedStyle(el).columnGap));
  const ratios = new Set();
  for (let i = 0; i < original.CUSTOMER.length; i++) {
    const photo = strip.locator("figure").nth(i);
    assert.equal(await strip.getAttribute("data-active"), String(i));
    const frame = await photo.evaluate(async el => {
      const im = el.querySelector("img"); await im.decode();
      const b = im.getBoundingClientRect();
      return { origin: im.getAttribute("src"), ratio: im.naturalWidth / im.naturalHeight, actual: b.width / b.height,
        center: b.left + b.width / 2, right: b.right, width: b.width, height: b.height,
        leftCaption: el.querySelector("figcaption").getBoundingClientRect().left - b.left };
    });
    assert.equal(frame.origin, "/" + original.CUSTOMER[i].src);
    assert.ok(Math.abs(frame.ratio - frame.actual) < .006 && Math.abs(frame.leftCaption) < 1);
    assert.ok(Math.abs(frame.center - stripBounds.width / 2) < 1);
    ratios.add(Math.round(frame.actual * 100));
    const next = strip.locator("figure").nth((i+1) % original.CUSTOMER.length);
    if (await next.isVisible()) {
      const nr = await next.boundingBox(); assert.ok(Math.abs(nr.x - frame.right - gap) < 1.1, "Continuous spacing at every seam");
    }
    await page.keyboard.press("ArrowRight");
  }
  assert.ok(ratios.size >= 5); assert.equal(await strip.getAttribute("data-active"), "0");
  await page.keyboard.press("ArrowLeft"); assert.equal(await strip.getAttribute("data-active"), "10");
  await page.keyboard.press("Home");
  if (!touch) {
    const b = await strip.boundingBox(), before = await position(strip);
    await page.mouse.move(b.x+b.width*.5,b.y+b.height*.5);await page.mouse.down();
    await page.mouse.move(b.x+b.width*.5-115,b.y+b.height*.5,{steps:7});await page.mouse.up();
    assert.notEqual(await position(strip),before);
  }
  assert.equal(await page.locator(blocked).count(),0);
}

async function contactAndLegal(page, touch) {
  const links = page.locator(".social-bento a");
  assert.equal(await links.count(),6); assert.equal(await page.locator(".platform-google").getAttribute("href"),
    "https://www.google.com/maps/place//data=!4m4!3m3!1s0x477983a3cc4c3b4f:0x641962f142805885!9m1!1b1");
  assert.deepEqual(await links.evaluateAll(a => a.map(el => new URL(el.href).hostname)),
    ["www.instagram.com","www.facebook.com","www.google.com","www.tripadvisor.it","restaurantguru.it","www.sluurpy.it"]);
  assert.equal(await page.locator(".map-tile").getAttribute("href"),"https://maps.google.com/?cid=7212905066552907909");
  assert.equal(await page.locator(".phone-tile").getAttribute("href"),"tel:+390427541232");
  assert.equal(await page.locator(".wa-tile").getAttribute("href"),"https://wa.me/393802453757");
  assert.equal(await page.locator(".wa-tile img").getAttribute("src"),"/assets/social/whatsapp.webp");
  assert.equal(await page.locator(".phone-tile img").getAttribute("src"),"/assets/social/smartphone.webp");
  assert.equal(await page.locator(".studio-credit").getAttribute("href"),"https://mementostudio.it");
  assert.deepEqual(await links.locator(".tile-bottom > span:first-child").allTextContents(),["Instagram","Facebook","Google Reviews","Tripadvisor","Restaurant Guru","Sluurpy"]);
  await center(page.locator("#social"));await Promise.all((await links.locator("img").all()).map(el=>el.evaluate(im=>im.decode())));
  for (const image of (await links.locator("img").all()).slice(0,2)) {
    const inset = await image.evaluate(im => {
      const r=im.getBoundingClientRect();
      const rendered=Math.max(r.height, r.width*im.naturalHeight/im.naturalWidth);
      const y=(r.height-rendered)*parseFloat(getComputedStyle(im).objectPosition.split(" ")[1])/100;
      // The two emblems occupy the band from 23% to 63% in their original square images.
      return [(y+.23*rendered)/r.height,(y+.63*rendered)/r.height];
    });
    assert.ok(inset[0]>.08 && inset[1]<.8,"Keep both social marks fully inside their 2:1 frames");
  }
  const first=links.first();
  await page.mouse.move(1,1); await tick(page);
  assert.ok(await first.locator("img").evaluate(im=>getComputedStyle(im).filter === "brightness(1)"));
  if (!touch) {
    await first.hover(); await tick(page);
    assert.ok(await first.locator("img").evaluate(im=>getComputedStyle(im).filter === "brightness(1.14)"));
    assert.equal(await first.evaluate(el=>getComputedStyle(el).color),"rgb(240, 212, 147)");
    assert.equal(await first.locator(".tile-arrow").evaluate(el=>getComputedStyle(el).color),"rgb(240, 212, 147)");
    assert.equal(await first.locator("canvas").count(),0,"Reduced motion disables particle animation");
  }
  for (const lang of ["it", "en", "de", "fr"]) {
    await page.locator(`[data-lang="${lang}"]`).click();
    await contactTextFits(page);
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
      assert.doesNotMatch(html, /legal-draft|bozza per la revisione/i);
      assert.equal(await text.locator(".legal-draft").count(), 0);
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

async function contactTextFits(page) {
  const clipped=await page.locator(".bento-grid .bento-tile").evaluateAll(tiles=>tiles.flatMap(tile=>{
    const bounds=tile.getBoundingClientRect();
    return [...tile.querySelectorAll("strong,small,.hours-copy p,.action-label,.social-tile .tile-bottom > span:first-child")].filter(label=>{
      const range=document.createRange();range.selectNodeContents(label);
      return [...range.getClientRects()].some(r=>r.left<bounds.left-1 || r.right>bounds.right+1 || r.top<bounds.top-1 || r.bottom>bounds.bottom+1);
    }).map(label=>label.textContent);
  }));
  assert.deepEqual(clipped,[],"Labels must fit the card");
}

async function finalLayout(page) {
  await tick(page);
  const result = await page.evaluate(() => {
    const rect = node => node.getBoundingClientRect();
    const ok = (a,b) => Math.abs(a-b) < 1.6;
    const content = rect(document.querySelector(".menu-head"));
    const atGutters = el => { const r=rect(el); return ok(r.left,content.left) && ok(r.right,content.right); };
    const titles = [...document.querySelectorAll(".spread-title")];
    const rooms = [...document.querySelectorAll(".venue-room")];
    const titleGap = room => {
      const title=rect(room.querySelector("h2")), ribbon=rect(room.querySelector(".photo-ribbon"));
      // At the middle of the curved stage, the 4:3 center image has this top edge.
      const photoWidth=room.querySelector(".ribbon-card").offsetWidth;
      return ribbon.top+(ribbon.height-.75*photoWidth)/2-title.bottom;
    };
    const pairs=rooms.slice(1).map((room,i) => {
      const prev=rooms[i].querySelector(".photo-ribbon");
      return [titleGap(room),rect(room.querySelector("h2")).top-rect(prev).bottom];
    });
    const lines=[...document.querySelectorAll("#table-title .spread-line")].map(el=>({text:el.textContent, top:rect(el).top,bottom:rect(el).bottom}));
    const tiles=document.querySelectorAll(".bento-grid a");
    const outer=[...document.querySelectorAll(".bento-grid,.footer-row")];
    const bento=[...document.querySelectorAll(".bento-grid")].map(grid=>[...grid.children].map(el=>{
      const r=rect(el);return {l:r.left,t:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height};
    }));
    return {validTitles:titles.length===8 && titles.every(atGutters),lines, pairs, mobile:innerWidth<=700, firstGap:rect(rooms[0].querySelector("h2")).top-rect(rooms[0]).top,
      menuPad:parseFloat(getComputedStyle(document.querySelector("#menu")).paddingBottom),
      rules:getComputedStyle(document.querySelector("#customer")).borderTopWidth,
      firstRowLabel:document.querySelector("#visit-title").getAttribute("aria-label"), areas:bento,
      blockSizes:[...document.querySelectorAll("#social,#dove")].every(el=>rect(el).height+1>=innerHeight),
      validEdges:outer.every(atGutters)&&[...document.querySelectorAll(".ribbon-stage")].every(el=>ok(rect(el).left,0)&&ok(rect(el).right,innerWidth)),
      shortSides:[...tiles].every(el=>{const r=rect(el);return Math.min(r.width,r.height)>=44;}),
      overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.ok(result.validTitles && result.validEdges && result.blockSizes && result.shortSides && !result.overflow, JSON.stringify(result));
  assert.equal(result.menuPad >= 164 && result.firstGap >= 122,true); assert.equal(result.rules,"0px");
  assert.deepEqual(result.lines.map(l=>l.text),["Ricordi condivisi","dalla community"]);
  assert.ok(result.lines[1].top >= result.lines[0].bottom-1);
  result.pairs.forEach(([next,prev])=>assert.ok(next>=0 && prev>next,`Title distances: own photo ${next}, preceding stage ${prev}`));
  assert.equal(result.firstRowLabel.toUpperCase(),"TI ASPETTIAMO!");
  const [social,visit]=result.areas;
  assert.equal(social.length,6);assert.equal(visit.length,5);
  const [ig,fb,...reviews]=social, [map,logo,hours,wa,phone]=visit;
  const close=(a,b)=>Math.abs(a-b)<1.6;
  const square=tile=>close(tile.w,tile.h);
  const wide=tile=>Math.abs(tile.w/tile.h-2)<.12;
  assert.ok([ig,fb].every(tile=>close(tile.w,2*tile.h)) && reviews.every(square));
  assert.ok([map,wa,phone].every(square) && [logo,hours].every(wide));
  assert.ok(close(logo.w,hours.w) && close(wa.t,phone.t) && close(wa.w,phone.w) && phone.l>wa.r);
  assert.ok(close(logo.l,hours.l) && close(hours.l,wa.l) && close(hours.r,phone.r) && hours.t>logo.b && wa.t>hours.b);
  if(result.mobile) {
    assert.ok(fb.t>ig.b && reviews[0].t>fb.b && close(ig.l,fb.l) && close(ig.r,fb.r));
    assert.ok(close(reviews[0].t,reviews[1].t) && close(reviews[2].t,reviews[3].t) && reviews[2].t>reviews[1].b);
    assert.ok(logo.t>map.b && close(map.w,logo.w) && close(map.l,logo.l));
  } else {
    assert.ok(close(ig.t,fb.t) && fb.l>ig.r && reviews.every(r=>r.t>ig.b && close(r.t,reviews[0].t)));
    assert.ok(close(map.t,logo.t) && logo.l>map.r && close(map.b,phone.b));
  }
  const aligned=await page.locator(".hours-copy").evaluate(el=>{
    const time=el.firstElementChild.getBoundingClientRect(), day=el.lastElementChild.getBoundingClientRect();
    return day.left>=time.right-1 && day.top<time.bottom && day.bottom>time.top;
  });
  assert.ok(aligned, "Closing day and opening hours should share a line");
  assert.equal(await page.locator(".opening-time").innerText(),"18:00 - 23:00");
  assert.equal(await page.locator(".hours-copy p").innerText(),"Chiuso il lunedì");
  assert.equal(await page.locator("#openState,.status-tile").count(),0);
  await contactTextFits(page);
  const footer=page.locator(".visit-footer");
  await footer.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:"instant"}));
  const correct=await footer.evaluate(el=>{
    const blur=document.querySelector(".vr-edge-blur--bottom"), dock=document.querySelector(".vr-dock");
    const links=[...el.querySelectorAll("a")];
    const row=el.querySelector(".footer-row").getBoundingClientRect(), left=el.querySelector("p").getBoundingClientRect(), nav=el.querySelector("nav").getBoundingClientRect(), credit=el.querySelector(".studio-credit").getBoundingClientRect();
    const title=el.querySelector(".studio-credit span"), wordmark=el.querySelector(".studio-credit img").getBoundingClientRect();
    const text=title.getBoundingClientRect();
    return title.textContent==="DESIGN & DEV" && text.right<=wordmark.left && Math.abs((text.top+text.bottom)-(wordmark.top+wordmark.bottom))<2 && Math.abs(row.left-left.left)<1 && Math.abs(row.right-credit.right)<1 && Math.abs((nav.left+nav.right)/2-innerWidth/2)<1.5 &&
      Number(getComputedStyle(el).zIndex)>Number(getComputedStyle(blur).zIndex) &&
      links.every(a=>{ const r=a.getBoundingClientRect();return r.bottom<=dock.getBoundingClientRect().top && a.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)); });
  });
  assert.ok(correct,"Footer columns, hit targets and dock clearance");
}

async function particles(page) {
  const tile=page.locator(".platform-instagram");
  await center(tile);await tile.hover();
  const field=tile.locator("canvas.tile-particles");
  await field.waitFor();
  const sample = () => field.evaluate(c=>{
    const data=c.getContext("2d").getImageData(0,0,c.width,c.height).data;
    let light=0, pixels=0, y=0;
    for(let i=3;i<data.length;i+=4) if(data[i]) { light+=data[i];pixels++; y+=Math.floor((i/4)/c.width)*data[i]; }
    return {light,pixels,y};
  });
  await page.waitForTimeout(260);const start=await sample();
  await page.waitForTimeout(1150);const peak=await sample();
  assert.ok(peak.pixels>start.pixels && peak.light>start.light,"Particle count and intensity grow gradually");
  await page.mouse.move(2,2);await page.waitForTimeout(850);const mid=await sample();
  await page.waitForTimeout(950);const tail=await sample();
  assert.ok(mid.light>tail.light && tail.light>0 && tail.y/tail.light<mid.y/mid.light,"Particles ascend and fade after exit");
  await field.waitFor({state:"detached",timeout:1800});
  const logo=page.locator(".sign-tile");
  await center(logo);await logo.hover();await logo.locator("canvas").waitFor();
  await page.waitForTimeout(650);assert.equal(await logo.locator(".sign-mark").evaluate(e=>getComputedStyle(e,"::after").opacity),"1");
  await page.mouse.move(1,1);await page.waitForTimeout(700);assert.equal(await logo.locator(".sign-mark").evaluate(e=>getComputedStyle(e,"::after").opacity),"0");
}

async function run(layout) {
  const page=await browser.newPage({viewport:{width:layout[0], height:layout[1]},hasTouch:layout[2],isMobile:layout[2],reducedMotion:"reduce"});
  const errors=[], failed=[], first=[];
  page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)failed.push(r.url());});
  page.on("request",r=>first.push(r.url()));
  await page.goto(url);await page.evaluate(()=>document.fonts.ready);await tick(page);
  assert.ok(first.every(link=>!link.includes("/assets/ribbons/")), "Gallery bytes loaded on the menu landing");
  await finalLayout(page);
  if (layout[3]) await galleries(page,layout[2]);
  await contactAndLegal(page,layout[2]);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),"Horizontal page overflow");
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await page.close();console.log(`FINALE_OK ${layout[0]}×${layout[1]} · galleries ${layout[3]} · 12 localized legal views`);
}

try {
  for(const layout of [[1440,900,false,true],[390,844,true,true],[320,568,true,false],[844,390,true,false],[768,1024,true,false],[3440,1440,false,true]]) await run(layout);
  const compact=await browser.newPage({reducedMotion:"reduce"});
  await compact.goto(url);await compact.evaluate(()=>document.fonts.ready);
  for (const [width,height] of [[320,480],[480,320],[568,280],[1199,600],[2560,1080],[3440,640],[5120,1440]]) {
    await compact.setViewportSize({width,height}); await finalLayout(compact);
    if(height<=320) for(const lang of ["fr","de","en","it"]) {
      await compact.locator(`[data-lang="${lang}"]`).click();await contactTextFits(compact);
    }
    const strip=compact.locator("#album-esterno .ribbon-stage");
    await center(strip);await compact.waitForSelector("#album-esterno [data-enhanced]");await strip.focus();
    await compact.keyboard.press("Home");
    for(const fraction of [0,.25,.5,.75]) {
      const coverage=await strip.evaluate((el,offset)=>{
        const pitch=el.querySelector(".ribbon-card").offsetWidth+4;
        el.dispatchEvent(new WheelEvent("wheel",{deltaX:pitch*offset,cancelable:true}));
        const r=el.getBoundingClientRect(), spans=[...el.querySelectorAll(".ribbon-card")].filter(c=>c.style.visibility==="visible").map(c=>c.getBoundingClientRect());
        return [.02,.07,.93,.98].every(f=>spans.some(s=>s.left-5 <=r.width*f && s.right+5>=r.width*f));
      },fraction);
      assert.ok(coverage,`Panorama coverage at ${width}×${height}, offset ${fraction}`);
    }
  }
  await compact.close();console.log("FIT_OK · compact landscape through ultrawide, exact menu gutters, two-line heading and panoramic edge coverage");
  const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:"no-preference"});
  await page.goto(url);
  const room=page.locator("#album-bancone .ribbon-stage");
  await center(room);await page.waitForSelector("#album-bancone [data-enhanced]");await center(room);
  const first=await position(room);await page.waitForFunction(before=>document.querySelector("#album-bancone .ribbon-card").style.transform!==before,first);
  await room.hover();await tick(page);const held=await position(room);await page.waitForTimeout(130);assert.equal(await position(room),held);
  await page.mouse.move(2,2);await page.waitForFunction(before=>document.querySelector("#album-bancone .ribbon-card").style.transform!==before,held);
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));await tick(page);const outside=await position(room);await page.waitForTimeout(130);assert.equal(await position(room),outside);
  await particles(page);
  await page.close();console.log("MOTION_OK · gallery drift, offscreen pause, rising particles with a 3 s exit");
} finally { await browser.close(); }
