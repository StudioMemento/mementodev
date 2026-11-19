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
    const dots = oven.locator(".pizza-dot");
    assert.equal(await dots.count(), pizzas.length);
    assert.ok(await oven.locator(".vr-pizza-card img[src]").count() < pizzas.length / 2);
    assert.ok(files.size > 0 && files.size < pizzas.length / 2);

    for (const language of ["en", "de", "fr", "it"]) {
      await page.locator('[data-lang="' + language + '"]').click();
      await page.waitForFunction(lang => document.documentElement.lang === lang, language);
      const cards = await page.locator(".pizza-caption").evaluateAll(all => all.map(el =>
        [el.querySelector("h3").textContent, el.querySelector("p").textContent.toLowerCase()]));
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
    const stage = oven.locator("#forno");
    await stage.evaluate(el => scrollTo({top:scrollY + el.getBoundingClientRect().top - 85,behavior:"instant"}));
    await dots.first().focus();
    await shift("End");
    await page.waitForFunction(() => document.querySelector(".pizza-dot:last-child").getAttribute("aria-pressed")==="true");
    await shift("ArrowRight");
    for (const [index, [file, name]] of pizzas.entries()) {
      const active = dots.nth(index);
      await page.waitForFunction(index => document.querySelectorAll(".pizza-dot")[index].getAttribute("aria-pressed")==="true",index);
      assert.ok(await active.evaluate(el => {
        const dot=el.getBoundingClientRect(), rail=el.parentElement.getBoundingClientRect();
        return el === document.activeElement && dot.left >= rail.left-1 && dot.right <= rail.right+1;
      }));
      assert.equal(await oven.locator('.pizza-caption[aria-hidden="false"] h3').textContent(),name);
      const img=stage.locator('[data-forno-index="' + index + '"] img').first();
      const resource=await img.evaluate(async im => { await im.decode(); return {url:new URL(im.currentSrc).pathname, width:im.naturalWidth, height:im.naturalHeight}; });
      assert.ok(["/"+file, "/"+file.replace(/\.webp$/,"-768.webp")].includes(resource.url));
      assert.ok(resource.width > 0 && resource.width === resource.height);
      if (index < pizzas.length-1) await shift("ArrowRight");
    }
    assert.ok(await oven.locator(".vr-pizza-card img[src]").count() < pizzas.length / 2, "Previously visited photos should leave the image window");
    await shift("Home");
    await page.waitForFunction(() => document.querySelector(".pizza-dot").getAttribute("aria-pressed")==="true");
    assert.equal(await oven.locator('.pizza-dot[tabindex="0"]').count(),1);

    const card = page.locator("#asporto .crust-card");
    await card.scrollIntoViewIfNeeded();
    const dimensions = await card.evaluate(async el => {
      const image=el.querySelector("img"); await image.decode();
      const card=el.getBoundingClientRect(), picture=image.getBoundingClientRect(), copy=el.querySelector(".takeaway-copy").getBoundingClientRect();
      return {crossed:picture.right > card.right+1 || copy.right > card.right+1 || copy.bottom > card.bottom+1,
        mobile:picture.bottom <= copy.top+1, file:new URL(image.currentSrc).pathname,
        shape:getComputedStyle(el).transform, overflow:document.documentElement.scrollWidth > innerWidth};
    });
    assert.ok(!dimensions.crossed && !dimensions.overflow);
    assert.equal(dimensions.file.includes("mobile"),width < 640);
    assert.equal(dimensions.mobile,width < 640);
    assert.equal(dimensions.shape,"none");
    assert.ok(await page.locator(".menu-art-window").evaluateAll(all =>
      all.length > 0 && all.every(el => getComputedStyle(el).maskImage === "none")));
    if (width > 1000) {
      await page.emulateMedia({ reducedMotion:"no-preference" });
      const shell=page.locator("#asporto .crust-card-shell");
      await shell.hover({ position:{x:30,y:30} });
      await page.waitForFunction(() => document.querySelector("#asporto .crust-card-shell").dataset.tiltActive==="true");
      assert.equal(await card.evaluate(el => el.style.getPropertyValue("--tilt-scale")),"1.1");
    }
    assert.deepEqual(errors,[]);
    await page.close();
    console.log(engine,width+"×"+height,"40 responsive images, four translations, keyboard loop, fixed vertical position, takeaway layout and category artwork OK");
  }
} finally { await browser.close(); }
