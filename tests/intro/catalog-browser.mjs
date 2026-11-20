import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const engine = process.env.BROWSER_ENGINE || "chromium";
const playwright = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const path = process.env.BROWSER_PATH || (engine === "chromium" ? process.env.CHROMIUM_PATH : undefined);
const browser = await playwright[engine].launch({ headless: true, executablePath: path });
const { FORNO: pizzas } = JSON.parse(await readFile("src/data/menu.json", "utf8"));

try {
  for (const [width, height] of [[390,844], [1440,900]]) {
    const page = await browser.newPage({ viewport:{width,height}, hasTouch:width < 500, isMobile:width < 500, reducedMotion:"reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const files = new Set();
    page.on("request", request => {
      if (request.url().includes("/assets/pizze/")) files.add(new URL(request.url()).pathname);
    });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:4173");
    await page.evaluate(() => document.fonts.ready);
    const oven = page.locator("#pizza-slider");
    const stage = oven.locator("#forno");
    assert.equal(await oven.locator(".pizza-dot,.pizza-count").count(), 0);
    assert.ok(await oven.locator(".vr-pizza-card img[src]").count() < pizzas.length / 2);
    assert.ok(files.size > 0 && files.size < pizzas.length / 2);

    for (const language of ["en", "de", "fr", "it"]) {
      await page.locator('[data-lang="' + language + '"]').click();
      await page.waitForFunction(lang => document.documentElement.lang === lang, language);
      const cards = await page.locator(".pizza-caption").evaluateAll(all => all.map(el =>
        [el.querySelector("h3").textContent, [...el.querySelectorAll("li")].map(li=>li.textContent).join(", ").toLowerCase()]));
      const menu = await page.locator("#cat-classiche [data-menu-item], #cat-audaci [data-menu-item], #cat-bianche [data-menu-item]").evaluateAll(all => all.map(el =>
        [el.querySelector(".nome").textContent, el.querySelector(".desc").textContent.toLowerCase()]));
      assert.deepEqual(cards, menu);
      assert.ok(await page.locator("#asporto h2").textContent());
    }

    const shift = async key => {
      const before = await page.evaluate(() => scrollY);
      await page.keyboard.press(key);
      const after = await page.evaluate(() => scrollY);
      assert.ok(Math.abs(after - before) <= 1, "A horizontal selection moved the page vertically");
    };
    await oven.evaluate(el => scrollTo({top:scrollY+el.getBoundingClientRect().top,behavior:"instant"}));
    await stage.focus({preventScroll:true});
    const waitForIndex = i => page.waitForFunction(index =>
      document.querySelectorAll(".pizza-caption")[index].getAttribute("aria-hidden") === "false",i);
    await shift("End");
    await waitForIndex(pizzas.length-1);
    await shift("ArrowRight");
    for (const [index, [file, name]] of pizzas.entries()) {
      await waitForIndex(index);
      assert.equal(await oven.locator('.pizza-caption[aria-hidden="false"] h3').textContent(),name);
      const img=stage.locator('[data-forno-index="' + index + '"] img').first();
      const resource=await img.evaluate(async im => { await im.decode(); return {url:new URL(im.currentSrc).pathname, width:im.naturalWidth, height:im.naturalHeight}; });
      assert.ok(["/"+file, "/"+file.replace(/\.webp$/,"-768.webp")].includes(resource.url));
      assert.ok(resource.width > 0 && resource.width === resource.height);
      if (index < pizzas.length-1) await shift("ArrowRight");
    }
    assert.ok(await oven.locator(".vr-pizza-card img[src]").count() < pizzas.length / 2, "Previously visited photos should leave the image window");
    await shift("Home");
    await waitForIndex(0);
    await oven.locator(".previous").click();
    await waitForIndex(pizzas.length-1);
    await oven.locator(".next").click();
    await waitForIndex(0);

    const card = page.locator("#asporto .crust-card");
    await card.scrollIntoViewIfNeeded();
    const dimensions = await card.evaluate(async el => {
      const image=el.querySelector("img"); await image.decode();
      const card=el.getBoundingClientRect(), picture=image.getBoundingClientRect(), copy=el.querySelector(".takeaway-copy").getBoundingClientRect();
      return {crossed:picture.right > card.right+1 || copy.right > card.right+1 || copy.bottom > card.bottom+1,
        overlay:copy.top >= picture.top && copy.bottom <= picture.bottom+1, file:new URL(image.currentSrc).pathname,
        shape:getComputedStyle(el).transform, overflow:document.documentElement.scrollWidth > innerWidth};
    });
    assert.ok(!dimensions.crossed && !dimensions.overflow);
    assert.equal(dimensions.file.includes("mobile"),width < 640);
    assert.ok(dimensions.overlay);
    assert.equal(dimensions.shape,"none");
    assert.ok(await page.locator(".menu-art-window").evaluateAll(all =>
      all.length > 0 && all.every(el => getComputedStyle(el).maskImage === "none")));
    if (width > 1000) {
      await page.emulateMedia({ reducedMotion:"no-preference" });
      const hoverCard = async shell => {
        await shell.evaluate(async el => {
          el.scrollIntoView({block:"center",behavior:"instant"});
          await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
        });
        await shell.hover({position:{x:30,y:30}});
      };
      const crust=page.locator("#cornicione .crust-card-shell").first();
      await hoverCard(crust);
      await page.waitForFunction(()=>{
        const card=document.querySelector("#cornicione .crust-card");
        return card.parentElement.dataset.tiltActive==="true" && getComputedStyle(card).transform.startsWith("matrix3d");
      });
      assert.equal(await crust.locator("img").evaluate(el=>getComputedStyle(el).transform),"none");
      const shell=page.locator("#asporto .crust-card-shell");
      await hoverCard(shell);
      await page.waitForFunction(() => document.querySelector("#asporto .crust-card-shell").dataset.tiltActive==="true");
      assert.equal(await card.evaluate(el => getComputedStyle(el).getPropertyValue("--card-scale").trim()),"1.1");
      await page.waitForFunction(()=>getComputedStyle(document.querySelector("#asporto .crust-card")).transform.startsWith("matrix3d"));
      assert.equal(await card.locator("img").evaluate(el=>getComputedStyle(el).transform),"none");
    }
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(engine,width+"×"+height,"40 responsive images, four translations, keyboard loop, fixed vertical position, takeaway layout and category artwork OK");
  }
} finally { await browser.close(); }
