import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('../tests/v25/motion.mjs');
await import('../tests/v25/scheduler.mjs');
await import('../tests/hero/runtime.mjs');
await import('../tests/hero/chrome.mjs');
await import('../tests/intro/carousel.mjs');
await import('../tests/intro/tilt.mjs');
const hash=b=>createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(await readFile('tests/menu/immutable-baseline.json','utf8'));
assert.notEqual(hash(Buffer.from('same')),hash(Buffer.from('different')));
for(const [p,h] of Object.entries(baseline))assert.equal(hash(await readFile(p)),h,`Out-of-scope change: ${p}`);
const normalizeLayout=s=>s.split('\n').filter(line=>!line.startsWith('.allergen-')).join('\n')
 .replace(' .allergen-list li { grid-template-columns:22px minmax(75px,.7fr) minmax(0,1.3fr); gap:10px; } .allergen-name { font-size:12px; overflow-wrap:break-word; } .allergen-description { font-size:13px; }','')
 .replace('/* Native dialogs: an opaque surface, no full-screen filtering or animation. */','/* Native photo/legal surfaces. Allergen presentation is scoped in menu.css. */');
assert.equal(await readFile('src/styles/clean.css','utf8'),normalizeLayout(await readFile('tests/menu/layout-approved.css','utf8')),'Layout outside allergens changed');
const approvedI18n = await readFile('tests/menu/i18n-approved.tsx','utf8');
assert.equal(await readFile('src/i18n.tsx','utf8'),approvedI18n.replace('Chiedi al personale per ulteriori informazioni','Per ulteriori informazioni, chiedi al personale.'),'Unrequested translation/copy changes');
const html=await readFile('dist/index.html','utf8');
const old=await readFile('tests/v25/menu-carta-v24.html','utf8');
function balanced(s,start,tag){let depth=0;for(const m of s.slice(start).matchAll(new RegExp(`<\\/?${tag}\\b[^>]*>`,'g'))){depth+=m[0].startsWith('</')?-1:1;if(!depth)return s.slice(start,start+m.index+m[0].length);}throw Error(`Unclosed ${tag}`)}
const text=s=>s.replace(/<br\s*\/?\s*>/g,'\n').replace(/<[^>]*>/g,'').replaceAll('<!-- -->','').trim();
function entries(s){return [...s.matchAll(/<div class="item\b[^>]*data-menu-item="([^"]*)"/g)].map(m=>{
 const entry=balanced(s,m.index,'div');
 const field=cls=>{const match=entry.match(new RegExp(`<(span|button|p)\\b[^>]*class="${cls}"[^>]*>`));return match?text(balanced(entry,match.index,match[1])):''};
 const grid=entry.match(/<div class="pricegrid">/);
 return [m[1],field('nome'),field('qualifier'),field('prezzo'),field('desc'),field('allergen-trigger'),grid?text(balanced(entry,grid.index,'div')):''];
})}
const data=JSON.parse(await readFile('src/data/menu.json','utf8'));
const bottled=new Set(data.BOTTIGLIA.flatMap(group=>group[2].map(row=>row[0])));
const before=entries(old).map(row=>bottled.has(row[0])?row.map((field,i)=>i===4?field.replaceAll('\n',' '):field):row);
const after=entries(html);assert.ok(before.length>80);assert.equal(after.length,before.length);before.forEach((row,i)=>assert.deepEqual(after[i],row,`Menu item information changed: ${row[0]}`));
assert.equal(bottled.size,7);
for(const name of bottled){const item=html.match(new RegExp(`<div class="item" data-menu-item="${name}"`));assert.ok(item);const markup=balanced(html,item.index,'div');const description=markup.match(/<p class="desc">(.*?)<\/p>/)[1];assert.ok(!description.includes('<br'),'Bottle description still has a forced line break');}
assert.ok(html.includes('IPA 0,5 l'));
assert.match(html,/<p class="dolci-note">Chiedi al personale la disponibilità del giorno!<\/p>/);
// Prove the comparison can detect a changed price, not just a missing section.
const modified=html.replace(/(<span class="prezzo">)[^<]+/,'$1INVALID');assert.notDeepEqual(entries(modified),before);
const start=html.indexOf('<section id="home"');assert.ok(start>=0);
assert.equal(balanced(html,start,'section'),await readFile('tests/intro/hero-approved.html','utf8'));
assert.ok(html.includes('ViaRoma_3.7_MENU — preview'));assert.ok(html.includes('noindex,nofollow'));
assert.equal((html.match(/class="crust-card"/g)||[]).length,3);
assert.equal((html.match(/class="menu-dot-grid"/g)||[]).length,0);
const menuMarkup=balanced(html,html.indexOf('<section id="menu"'),'section');
assert.equal((menuMarkup.match(/<canvas class="menu-side-band"/g)||[]).length,2);
assert.ok(menuMarkup.includes('class="menu-side-background" aria-hidden="true"'));
const css=await readFile('src/styles/menu.css','utf8');
assert.ok(!css.includes('.menu-art:hover')&&!css.includes('.menu-art::after'),'Obsolete artwork hover layers remain');
const head=balanced(html,html.indexOf('<header class="menu-head"'),'header');
assert.equal(text(head),'Menù');assert.equal((head.match(/<h2/g)||[]).length,1);
const rail=balanced(html,html.indexOf('<nav class="chips scrollable"'),'nav');
assert.deepEqual([...rail.matchAll(/<button[^>]+data-go="[^"]+"[^>]*>(.*?)<\/button>/g)].map(m=>text(m[1])),['Classiche','Audaci','Bianche','Calzoni','Cucina','Snack','Dolci','Bevande']);
const items=[...html.matchAll(/<div class="item\b[^>]*data-menu-item="([^"]*)"/g)];
const multiPriceNames=new Set([...data.SPINA,...data.VINI].map(row=>row[0]));
for(const m of items){
 const s=balanced(html,m.index,'div');
 if(m[1]!=='Coperto')assert.match(s,/<button type="button" class="nome" aria-haspopup="dialog"/);
 assert.equal(s.includes('class="dots" aria-hidden="true"'),!multiPriceNames.has(m[1]));
 if(multiPriceNames.has(m[1])){
  const cells=[...s.matchAll(/<span class="drink-price-cell">/g)].map(c=>text(balanced(s,c.index,'span')));
  const draught=data.SPINA.find(row=>row[0]===m[1]);
  const sizes=draught?['0,3 l','0,5 l','Caraffa 1,5 l']:['Calice','Caraffa 0,5 l','Bottiglia 0,75 l'];
  const prices=draught?draught.slice(2,5):data.VINI.find(row=>row[0]===m[1]).slice(1,4);
  assert.deepEqual(cells,sizes.map((size,i)=>`${size}: ${prices[i]}`),`Incorrect format/price association: ${m[1]}`);
 }
}
assert.deepEqual(Object.keys(JSON.parse(await readFile('package.json','utf8')).dependencies).sort(),['react','react-dom']);
console.log(`MENU_SCOPE_OK — ${Object.keys(baseline).length} protected files unchanged; ${before.length} entries retain names, description text, prices, qualifiers and allergen codes; all 18 draught/wine format-price pairs verified; hero/intro and original assets retained.`);
