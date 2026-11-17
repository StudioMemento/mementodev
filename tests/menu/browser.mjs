import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const modulePath=process.env.PLAYWRIGHT_MODULE || (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/index.mjs' : 'playwright');
const {chromium}=await import(modulePath);
const browser=await chromium.launch({headless:true});
const url=process.env.TEST_URL || 'http://127.0.0.1:4175/';
const out=process.env.QA_DIR || 'test-results/menu';
await mkdir(out,{recursive:true});
const results=[],errors=[];
try {
 for(const [width,height] of [[320,568],[390,844],[430,932],[768,1024],[1440,900],[3440,1440]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<768,isMobile:width<768});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>window.scrollTo({top:document.querySelector('#menu').offsetTop-100,behavior:'instant'}));
  await page.waitForFunction(()=>Math.abs(document.querySelector('.menu-head h2 span').getBoundingClientRect().width-parseFloat(getComputedStyle(document.querySelector('.menu-head h2 span')).letterSpacing)-document.querySelector('.menu-head h2').clientWidth)<1);
  const heading=await page.locator('.menu-head').evaluate(el=>({text:el.textContent.trim(),children:el.children.length,rect:el.getBoundingClientRect().toJSON(),title:el.querySelector('span').getBoundingClientRect().toJSON(),tracking:parseFloat(getComputedStyle(el.querySelector('span')).letterSpacing),overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(heading.text,'Menù');assert.equal(heading.children,1);assert.equal(heading.overflow,false);assert.ok(heading.tracking>12);assert.ok(Math.abs(heading.rect.width-(heading.title.width-heading.tracking))<1);
  await page.screenshot({path:`${out}/title-${width}.png`});
  for(const lang of ['de','fr','en','it']){
   await page.locator('.lang button').filter({hasText:new RegExp(`^${lang.toUpperCase()}$`)}).click();
   await page.waitForFunction(()=>Math.abs(document.querySelector('.menu-head h2 span').getBoundingClientRect().width-parseFloat(getComputedStyle(document.querySelector('.menu-head h2 span')).letterSpacing)-document.querySelector('.menu-head h2').clientWidth)<1);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.chips').evaluate(el=>el.scrollTo({left:0,behavior:'instant'}));
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.chips button')).maskImage==='none');
  const first=await page.locator('.chips').evaluate(el=>({rail:el.getBoundingClientRect().toJSON(),first:el.querySelector('button').getBoundingClientRect().toJSON(),mask:getComputedStyle(el).maskImage}));
  assert.equal(first.mask,'none','Rail masking isolates satin blur');assert.ok(first.first.left>=first.rail.left);assert.ok(first.first.right<=first.rail.right);

  await page.evaluate(()=>window.scrollTo({top:document.querySelector('#cat-audaci').offsetTop-140,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('[data-go="audaci"]').getAttribute('aria-current')==='location');
  const layout=await page.evaluate(()=>{
   const style=(el,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(el)[k]]));
   const item=document.querySelector('[data-menu-item="Burrata e Crudo"]'),name=item.querySelector('.nome'),price=item.querySelector('.prezzo'),rail=document.querySelector('.chipbar-inner');
   return {nav:style(document.querySelector('.chipbar'),['zIndex']),blur:style(document.querySelector('.vr-edge-blur'),['zIndex']),rail:style(rail,['backgroundColor']),pill:style(document.querySelector('.chips button.on'),['backgroundImage','backdropFilter']),category:style(document.querySelector('.mcat-head'),['textAlign']),tag:style(document.querySelector('.mcat .tag'),['fontSize']),dots:style(item.querySelector('.dots'),['display','backgroundSize']),name:name.getBoundingClientRect().toJSON(),price:price.getBoundingClientRect().toJSON(),priceColor:getComputedStyle(price).color,desc:item.querySelector('.desc').getBoundingClientRect().toJSON(),chevron:document.querySelector('.chipchev.r').getBoundingClientRect().toJSON(),railRect:rail.getBoundingClientRect().toJSON(),categoryBorder:getComputedStyle(document.querySelector('#cat-audaci')).borderTopWidth};
  });
  assert.ok(+layout.nav.zIndex>+layout.blur.zIndex);assert.equal(layout.rail.backgroundColor,'rgba(0, 0, 0, 0)');
  assert.equal(layout.pill.backdropFilter,'blur(22px)');assert.equal(layout.category.textAlign,'center');assert.ok(parseFloat(layout.tag.fontSize)>=18);assert.equal(layout.categoryBorder,'0px');
  assert.notEqual(layout.dots.display,'none');assert.equal(layout.dots.backgroundSize,'8px 2px');assert.equal(layout.priceColor,'rgb(218, 193, 139)');assert.ok(layout.name.right<=layout.price.left);
  if(width<768){assert.ok(layout.desc.right<=layout.price.left+1);assert.ok(layout.chevron.left>=layout.railRect.right-1);assert.ok(layout.chevron.right<=width+1);}
  if(width>=768){
   const inactive=page.locator('.chips button:not(.on)').first();await inactive.hover();
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.chips button:not(.on)')).color==='rgb(255, 255, 255)');
   const art=page.locator('#cat-audaci .menu-art');
   const before=await art.evaluate(el=>[getComputedStyle(el,'::before').backgroundImage,getComputedStyle(el,'::before').backgroundSize,getComputedStyle(el,'::after').backgroundImage,getComputedStyle(el.querySelector('.menu-art-window')).maskImage]);
   await art.hover();const after=await art.evaluate(el=>[getComputedStyle(el,'::before').backgroundImage,getComputedStyle(el,'::before').backgroundSize,getComputedStyle(el,'::after').backgroundImage,getComputedStyle(el.querySelector('.menu-art-window')).maskImage]);assert.deepEqual(after,before,'Image hover changed the stroke/fade geometry');
   assert.ok((await art.locator('img').evaluate(el=>getComputedStyle(el).filter)).includes('0.28'));
  }
  await page.screenshot({path:`${out}/audaci-${width}.png`});
  const trigger=page.locator('[data-menu-item="Burrata e Crudo"] button.nome');
  await trigger.click();await page.locator('dialog.modal-allergens').waitFor({state:'visible'});
  const dialog=await page.locator('.modal-allergens').evaluate(el=>({active:[...el.querySelectorAll('.contains .allergen-code')].map(n=>n.textContent),count:el.querySelectorAll('li').length,bg:getComputedStyle(el).backgroundColor,blur:getComputedStyle(el,'::backdrop').backdropFilter,rows:[...el.querySelectorAll('li')].map(n=>getComputedStyle(n).display),font:parseFloat(getComputedStyle(el.querySelector('li')).fontSize),headerOrder:[...el.querySelector('.modal-header>div').children].map(n=>n.tagName),note:el.querySelector('.allergen-note').textContent,indent:[...el.querySelectorAll('.allergen-text')].map(n=>n.getBoundingClientRect().left),circle:getComputedStyle(el.querySelector('.allergen-code')).borderTopWidth,x:getComputedStyle(el.querySelector('.modal-close')).outlineStyle}));
  assert.deepEqual(dialog.active,['1','7']);assert.equal(dialog.count,15);assert.equal(dialog.bg,'rgba(0, 0, 0, 0)');assert.ok(dialog.blur.includes('blur'));assert.ok(dialog.rows.every(v=>v==='grid'));assert.ok(dialog.font>=15.5);assert.deepEqual(dialog.headerOrder,['H2','P']);assert.equal(dialog.note,'Per ulteriori informazioni, chiedi al personale.');assert.ok(dialog.indent.every(x=>Math.abs(x-dialog.indent[0])<.5));assert.equal(dialog.circle,'0px');assert.equal(dialog.x,'none');
  await page.screenshot({path:`${out}/allergens-${width}.png`});
  await page.locator('.allergen-name').first().click();await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);
  await page.locator('[data-menu-item="Burrata e Crudo"] .allergen-trigger').click();await page.locator('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});
  await trigger.click();await page.locator('dialog').waitFor({state:'visible'});await page.locator('.modal-close').click();await page.locator('dialog').waitFor({state:'detached'});
  results.push({width,height,heading,layout,dialog});await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
console.log('MENU_BROWSER_OK — 320–3440px, four-language tracked title fit, full first pill, white inactive satin navigation above blur, stable artwork hover geometry, outside mobile chevrons, readable rows, 15 allergens, click/Escape/X close and focus restoration.');
