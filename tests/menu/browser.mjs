import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const modulePath=process.env.PLAYWRIGHT_MODULE || (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/index.mjs' : 'playwright');
const {chromium}=await import(modulePath);
const browser=await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
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

  await page.evaluate(()=>window.scrollTo({top:document.querySelector('#cat-audaci').getBoundingClientRect().top+scrollY-140,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('[data-go="audaci"]').getAttribute('aria-current')==='location');
  const layout=await page.evaluate(()=>{
   const style=(el,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(el)[k]]));
   const item=document.querySelector('[data-menu-item="Burrata e Crudo"]'),name=item.querySelector('.nome'),price=item.querySelector('.prezzo'),rail=document.querySelector('.chipbar-inner');
   return {nav:style(document.querySelector('.chipbar'),['zIndex']),blur:style(document.querySelector('.vr-edge-blur'),['zIndex']),rail:style(rail,['backgroundColor']),pill:style(document.querySelector('.chips button.on'),['backgroundImage','backdropFilter']),category:style(document.querySelector('.mcat-head'),['textAlign']),tag:style(document.querySelector('.mcat .tag'),['fontSize']),dots:style(item.querySelector('.dots'),['display','backgroundImage','height','opacity']),name:name.getBoundingClientRect().toJSON(),price:price.getBoundingClientRect().toJSON(),priceColor:getComputedStyle(price).color,desc:item.querySelector('.desc').getBoundingClientRect().toJSON(),chevron:document.querySelector('.chipchev.r').getBoundingClientRect().toJSON(),railRect:rail.getBoundingClientRect().toJSON(),categoryBorder:getComputedStyle(document.querySelector('#cat-audaci')).borderTopWidth};
  });
  assert.ok(+layout.nav.zIndex>+layout.blur.zIndex);assert.equal(layout.rail.backgroundColor,'rgba(0, 0, 0, 0)');
  assert.equal(layout.pill.backdropFilter,'blur(22px)');assert.equal(layout.category.textAlign,'center');assert.ok(parseFloat(layout.tag.fontSize)>=18);assert.equal(layout.categoryBorder,'0px');
  assert.notEqual(layout.dots.display,'none');assert.equal(layout.dots.height,'1px');assert.equal(layout.dots.opacity,'1');assert.ok(layout.dots.backgroundImage.includes('repeating-linear-gradient'));assert.ok(layout.dots.backgroundImage.includes('rgb(37, 37, 36)'));assert.ok(layout.dots.backgroundImage.includes('8px'));assert.equal(layout.priceColor,'rgb(218, 193, 139)');assert.ok(layout.name.right<=layout.price.left);
  if(width<768){assert.ok(layout.desc.right<=layout.price.left+1);assert.ok(layout.chevron.left>=layout.railRect.right-1);assert.ok(layout.chevron.right<=width+1);}
  if(width>=768){
   const inactive=page.locator('.chips button:not(.on)').first();await inactive.hover();
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.chips button:not(.on)')).color==='rgb(255, 255, 255)');
   const art=page.locator('#cat-audaci .menu-art');
   const snapshot=el=>{
    const style=(target,pseudo,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(target,pseudo)[k]]));
    return {frame:style(el,'::before',['borderImageSource','borderTopWidth','borderBottomWidth','filter','transitionDuration']),after:getComputedStyle(el,'::after').content,mask:getComputedStyle(el.querySelector('.menu-art-window')).maskImage,image:style(el.querySelector('img'),null,['filter','transform','opacity','mixBlendMode']),containerFilter:getComputedStyle(el).filter};
   };
   const before=await art.evaluate(snapshot);
   await art.hover();const after=await art.evaluate(snapshot);
   assert.deepEqual(after,before,'Image hover changed the image or stroke/fade geometry');
   assert.equal(before.frame.borderTopWidth,'1px');assert.equal(before.frame.borderBottomWidth,'1px');assert.equal(before.frame.filter,'none');assert.equal(before.frame.transitionDuration,'0s');assert.equal(before.after,'none');
   assert.equal(before.image.filter,'none');assert.equal(before.containerFilter,'none');
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
  const bottles=await page.locator('.drink-bottle-group .desc').evaluateAll(els=>els.map(el=>({text:el.textContent,breaks:el.querySelectorAll('br').length,overflow:el.scrollWidth>el.clientWidth+1})));
  assert.equal(bottles.length,7);assert.ok(bottles.every(b=>!b.breaks&&!b.overflow));assert.ok(bottles.some(b=>b.text==='IPA 0,5 l'));
  const note=await page.locator('.dolci-note').evaluate(el=>({text:el.textContent,align:getComputedStyle(el).textAlign,color:getComputedStyle(el).color,size:parseFloat(getComputedStyle(el).fontSize)}));
  assert.equal(note.text,'Chiedi al personale la disponibilità del giorno!');assert.equal(note.align,'center');assert.equal(note.color,'rgb(218, 193, 139)');assert.ok(note.size>=22);
  const drinks=[];
  for(const lang of ['de','fr','en','it']){
   await page.locator('.lang button').filter({hasText:new RegExp(`^${lang.toUpperCase()}$`)}).click();
   const rows=await page.locator('.drink-row').evaluateAll(els=>els.map(el=>{
    const rect=node=>node.getBoundingClientRect().toJSON();
    return {name:el.dataset.menuItem,row:rect(el),label:rect(el.querySelector('.label')),grid:rect(el.querySelector('.pricegrid')),dots:el.querySelectorAll('.dots').length,cells:[...el.querySelectorAll('.drink-price-cell')].map(cell=>({cell:rect(cell),label:rect(cell.querySelector('.drink-size-label')),price:rect(cell.querySelector('b')),visibleLabel:getComputedStyle(cell.querySelector('.drink-size-label')).position==='static',overflow:cell.scrollWidth>cell.clientWidth+1}))};
   }));
   assert.equal(rows.length,6);
   for(const row of rows){
    assert.equal(row.dots,0);assert.equal(row.cells.length,3);
    assert.ok(row.grid.right<=row.row.right+1);
    for(const cell of row.cells){assert.equal(cell.overflow,false);assert.equal(cell.visibleLabel,width<768);assert.ok(cell.price.right<=row.row.right+1);}
    if(width<768){assert.ok(row.grid.top>=row.label.bottom+11);assert.ok(Math.abs(row.label.width-row.row.width)<1);assert.ok(row.cells.every(c=>c.price.top>=c.label.bottom));assert.ok(row.cells.every(c=>Math.abs(c.price.bottom-row.cells[0].price.bottom)<1));}
    else assert.ok(row.grid.left>=row.label.right+23);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   drinks.push({lang,rows});
  }
  await page.locator('#drinks-draught').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/draught-${width}.png`});
  await page.locator('#drinks-wines').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/wines-${width}.png`});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>window.scrollTo({top:document.querySelector('#cat-audaci').getBoundingClientRect().top+scrollY-140,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('.menu-side-viewport')?.dataset.state==='running');
  const bands=await page.locator('.menu-side-viewport').evaluate(el=>({
   viewport:el.getBoundingClientRect().toJSON(),
   content:document.querySelector('#cat-audaci').getBoundingClientRect().toJSON(),
   surfaces:[...el.querySelectorAll('canvas')].map(c=>({rect:c.getBoundingClientRect().toJSON(),pixels:c.width*c.height})),
   events:getComputedStyle(el.parentElement).pointerEvents,
   background:getComputedStyle(document.querySelector('#menu')).backgroundColor,
  }));
  assert.equal(bands.surfaces.length,2);assert.equal(bands.events,'none');assert.equal(bands.background,'rgb(9, 9, 9)');
  assert.ok(bands.surfaces.reduce((n,c)=>n+c.pixels,0)<=1_600_000);
  assert.ok(bands.surfaces[0].rect.right<=bands.content.left+1);
  assert.ok(bands.surfaces[1].rect.left>=bands.content.right-1);
  assert.ok(bands.viewport.height<=height+1);
  const fraction=width>=2400?.3:width>=1200?.2:width>=768?.15:.1;
  assert.ok(Math.abs(bands.surfaces[0].rect.width-Math.min(width*fraction,520))<1);
  await page.screenshot({path:`${out}/side-squares-${width}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.menu-side-viewport').dataset.state==='static');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await trigger.click();await page.locator('dialog').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('.menu-side-viewport').dataset.state==='paused');
  await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('.menu-side-viewport').dataset.state==='paused');
  results.push({width,height,heading,layout,dialog,bottles,note,drinks,bands});await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
console.log('MENU_BROWSER_OK — 320–3440px, static artwork, original side squares confined to gutters; reduced-motion/dialog/offscreen pause; menu and allergen regression checks.');
