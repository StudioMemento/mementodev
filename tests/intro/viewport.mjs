import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const engine = process.env.BROWSER_ENGINE || "chromium";
const pw = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await pw[engine].launch({ headless:true, executablePath:process.env.BROWSER_PATH || process.env.CHROMIUM_PATH });
const shots = process.env.QA_DIR;
if (shots) await mkdir(shots, { recursive:true });

function measureOven() {
  const box = el => el.getBoundingClientRect();
  const ink = el => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect();
  };
  const nav = box(document.querySelector(".vr-dock"));
  const head = box(document.querySelector(".site-top"));
  const oven = document.querySelector("#pizza-slider");
  const area = box(oven);
  const title = ink(oven.querySelector(".oven-heading"));
  const image = box(oven.querySelector(".vr-pizza-card img"));
  const stage = box(oven.querySelector("#forno"));
  const arrows = [...oven.querySelectorAll(".pizza-arrow")].map(box);
  const problems = [];
  for (const caption of oven.querySelectorAll(".pizza-caption")) {
    const name = ink(caption.querySelector("h3"));
    const ingredients = [...caption.querySelectorAll("li")];
    const first = ink(ingredients[0]), last = ink(ingredients.at(-1));
    const aligned = ingredients.every(li => Math.abs(nav.left-box(li).left) < 1);
    const ordered = ingredients.every((li,i) => !i || ink(li).top > ink(ingredients[i-1]).bottom-4);
    if (!aligned || !ordered || name.left < arrows[0].right-1 || name.right > arrows[1].left+1 || name.top < head.bottom-1 || name.bottom > first.top+3 || last.bottom > nav.top-4)
      problems.push({pizza:caption.querySelector("h3").textContent, aligned, ordered, nameTop:name.top, nameBottom:name.bottom, nameLeft:name.left, nameRight:name.right,
        head:head.bottom, ingredientsStart:first.top, end:last.bottom, dock:nav.top});
  }
  return {height:area.height, device:innerHeight, top:area.top, black:getComputedStyle(oven).backgroundColor, problems,
    image:image.width, title:title.top, header:head.bottom, stage:stage.height, overflow:document.documentElement.scrollWidth > innerWidth+1};
}

try {
  const sizes = [[320,480],[320,568],[390,844],[480,320],[568,280],[667,375],[844,390],[768,1024],[1440,900],[2560,1080],[3440,1440]];
  for (const [width,height] of sizes) {
    const page = await browser.newPage({viewport:{width,height}, hasTouch:width<900, isMobile:width<900, reducedMotion:"reduce"});
    try {
      await page.goto(process.env.TEST_URL || "http://127.0.0.1:4173");
      await page.evaluate(() => document.fonts.ready);
      const oven = page.locator("#pizza-slider");
      for (const lang of ["en","de","fr","it"]) {
        await page.locator('[data-lang="'+lang+'"]').click();
        await oven.evaluate(el => scrollTo({top:scrollY+el.getBoundingClientRect().top, behavior:"instant"}));
        await page.waitForFunction(lang=>document.documentElement.lang===lang,lang);
        const info = await page.evaluate(measureOven);
        assert.ok(!info.overflow && Math.abs(info.top)<1 && Math.abs(info.device-info.height)<1 && info.image>85 && info.stage>72, JSON.stringify({width,height,lang,info}));
        assert.equal(info.black,"rgb(0, 0, 0)");
        assert.ok(info.title>info.header-2, JSON.stringify({width,height,lang,info}));
        assert.deepEqual(info.problems.slice(0,2),[], width+"×"+height+" "+lang+" "+JSON.stringify(info.problems.slice(0,2)));
      }
      if (shots && [320,390,568,844,1440,3440].includes(width)) {
        const rafIndex = await oven.locator(".pizza-caption h3").evaluateAll(all => all.findIndex(h=>h.textContent==="Raf"));
        await oven.locator("#forno").focus({preventScroll:true});
        await page.keyboard.press("Home");
        for (let i=0;i<rafIndex;i++) await page.keyboard.press("ArrowRight");
        await page.waitForFunction(()=>document.querySelector('.pizza-caption[aria-hidden="false"] h3').textContent==="Raf");
        await page.keyboard.press("Tab");
        await page.evaluate(()=>document.activeElement?.blur());
        await page.screenshot({path:shots+"/forno-"+width+".jpg", type:"jpeg", quality:78});
        if ([390,1440].includes(width)) {
          for (const [sel,label] of [["#asporto .crust-card","asporto"],[".map-photo","mappa"],[".menu-art","menu"]]) {
            const item = page.locator(sel).first();
            await item.scrollIntoViewIfNeeded();
            await item.evaluate(async el=>{const img=el.querySelector("img"); if(img) await img.decode();});
            await item.screenshot({path:shots+"/"+label+"-"+width+".jpg",type:"jpeg",quality:80});
          }
        }
      }
      console.log(engine,width+"×"+height,"40 captions × 4 languages fit above dock");
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
