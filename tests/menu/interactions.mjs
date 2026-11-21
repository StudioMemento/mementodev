import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {transformWithOxc} from 'vite';
const jsx=(type,props)=>({type,props:props||{}});
async function source(path,bindings){
 const {code}=await transformWithOxc(await readFile(path,'utf8'),path,{jsx:{runtime:'automatic'}});
 const runnable=code.replace(/^import\s[\s\S]*?;\n/gm,'').replace(/^export\s*\{[\s\S]*?;\n/gm,'').replaceAll('export default ','').replaceAll('export ','');
 const scope=vm.createContext({_jsx:jsx,_jsxs:jsx,_Fragment:'fragment',console,...bindings});vm.runInContext(runnable,scope);return scope;
}
const clone=v=>JSON.parse(JSON.stringify(v));
const nodes=(node,predicate)=>{const out=[];const visit=n=>{if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(visit);return}if(typeof n.type==='function')return visit(n.type(n.props));if(predicate(n))out.push(n);visit(n.props.children)};visit(node);return out};
// Run the real navigation hook through mount, dependency changes, resize and cleanup.
const slots=[],effects=[],ios=[],ros=[],listeners=new Map(),classes=new Set();let cursor=0,dirty=false,language='it',state,reduced=false,targetId='',scrollRequest,hash='';
const same=(a,b)=>a&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
const hooks={useRef:v=>slots[cursor++]||=({current:v}),useState:init=>{const n=cursor++,s=slots[n]||={value:init};return [s.value,v=>{if(v!==s.value){s.value=v;dirty=true}}]},useEffect:(fn,deps)=>{const n=cursor++,old=slots[n];if(!same(old?.deps,deps)){slots[n]={deps,cleanup:old?.cleanup};effects.push({n,fn})}}};
let geometryReads=0;
const buttons=Array.from({length:8},(_,i)=>({get offsetLeft(){geometryReads++;return 2+i*100},get offsetWidth(){geometryReads++;return 94},style:{values:new Map(),setProperty(k,v){this.values.set(k,v)},removeProperty(k){this.values.delete(k)}}}));
const ids=['classiche','audaci','bianche','calzoni','cucina','stuzzicherie','dolci','bevande'];
const rail={clientWidth:320,scrollWidth:800,scrollLeft:0,children:buttons,querySelector:q=>buttons[ids.indexOf(q.match(/data-go="([^"]+)"/)[1])],scrollTo:v=>{scrollRequest=v;rail.scrollLeft=Math.max(0,Math.min(v.left,rail.scrollWidth-rail.clientWidth))},scrollBy:v=>{scrollRequest=v;rail.scrollLeft=Math.max(0,Math.min(rail.scrollLeft+v.left,rail.scrollWidth-rail.clientWidth))},addEventListener:(k,f)=>listeners.set('rail:'+k,f),removeEventListener:k=>listeners.delete('rail:'+k)};
const wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k)}};
const win={innerHeight:844,addEventListener:(k,f)=>listeners.set('window:'+k,f),removeEventListener:k=>listeners.delete('window:'+k)};
const nav=await source('src/components/menu/useMenuNavigation.ts',{...hooks,window:win,matchMedia:()=>({matches:reduced}),history:{replaceState:(_a,_b,url)=>{hash=url}},document:{querySelectorAll:()=>ids.map(id=>({id:'cat-'+id})),getElementById:id=>({scrollIntoView:options=>{targetId=id;scrollRequest=options}})},IntersectionObserver:class{constructor(fn,options){this.fn=fn;this.options=options;this.observed=[];ios.push(this)}observe(el){this.observed.push(el)}disconnect(){this.disconnected=true}},ResizeObserver:class{constructor(fn){this.fn=fn;this.observed=[];ros.push(this)}observe(el){this.observed.push(el)}disconnect(){this.disconnected=true}}});
function commit(){let rounds=0;do{assert.ok(++rounds<5);cursor=0;dirty=false;state=nav.useMenuNavigation(language);state.chips.current=rail;state.wrap.current=wrapper;for(const {n,fn}of effects.splice(0)){slots[n].cleanup?.();slots[n].cleanup=fn()}}while(dirty)}
commit();assert.equal(state.active,'classiche');assert.equal(scrollRequest.left,0,'First pill must clamp to exactly zero');assert.equal(buttons[0].style.values.get('--chip-edge'),'none');
const cachedReads=geometryReads;
rail.scrollLeft=-18;listeners.get('rail:scroll')();assert.equal(buttons[0].style.values.get('--chip-edge'),'none','Safari overscroll must not fade the first pill');assert.ok(!classes.has('can-l'));rail.scrollLeft=0;
assert.equal(nav.chipEdgeMask(2,94,320,false,true),'none');assert.equal(nav.chipEdgeMask(60,94,320,true,true),'none');assert.ok(nav.chipEdgeMask(-15,94,320,true,true).includes('transparent 15px'));assert.equal(nav.chipEdgeMask(224,94,320,true,false),'none');
assert.equal(geometryReads,cachedReads,'Rail scrolling must reuse cached layout');assert.equal(ios[0].observed.length,8);assert.equal(ros[0].observed.length,9);assert.ok(classes.has('can-r'));assert.ok(!classes.has('can-l'));
state.nudge(1);listeners.get('rail:scroll')();assert.ok(classes.has('can-l'));assert.equal(scrollRequest.behavior,'smooth');
state.select('dolci');assert.equal(targetId,'cat-dolci');assert.equal(hash,'#cat-dolci');commit();assert.equal(state.active,'dolci');assert.ok(!classes.has('can-r'));
ios.at(-1).fn([{target:{id:'cat-audaci'},isIntersecting:true}]);commit();assert.equal(state.active,'audaci');
reduced=true;state.select('bevande');assert.equal(scrollRequest.behavior,'instant');commit();assert.equal(scrollRequest.left,480);assert.equal(buttons.at(-1).style.values.get('--chip-edge'),'none');
rail.scrollLeft=500;listeners.get('rail:scroll')();assert.equal(buttons.at(-1).style.values.get('--chip-edge'),'none');assert.ok(!classes.has('can-r'));rail.scrollLeft=480;
state.nudge(-1);assert.equal(scrollRequest.behavior,'instant');
rail.clientWidth=1000;listeners.get('window:resize')();ros.at(-1).fn();assert.ok(!classes.has('can-l'));assert.ok(!classes.has('can-r'));assert.ok(ios[0].disconnected);
language='de';commit();assert.equal(ros.at(-1).observed.length,9);assert.ok(ros.at(-2).disconnected);
slots.forEach(s=>s.cleanup?.());assert.equal(listeners.size,0);assert.ok(ros.at(-1).disconnected);assert.ok(ios.at(-1).disconnected);
// The measured font ratio follows the CSS content width without a resize callback.
let effect, width=320, scale=.25, ratio=3, tracking=.26, fitWrites=0, fontReady;
const fontSize=()=>width*scale;
const label={getBoundingClientRect:()=>({width:fontSize()*(ratio+tracking)})};
const heading={firstElementChild:label,style:{setProperty:(key,value)=>{
 assert.equal(key,'--menu-title-scale');scale=Number(value);assert.ok(Number.isFinite(scale));fitWrites++;
}}};
const title=await source('src/components/menu/MenuTitle.tsx',{
 useRef:()=>({current:heading}),useLayoutEffect:fn=>{effect=fn},
 getComputedStyle:()=>({fontSize:fontSize()+'px',letterSpacing:fontSize()*tracking+'px'}),
 document:{fonts:{ready:{then:fn=>{fontReady=fn}}}}
});
const fits=()=>assert.ok(Math.abs(fontSize()*ratio-width)<.001);
title.useTitleFit('Menù');let cleanup=effect();fits();
ratio=3.85;fontReady();fits();
const beforeResize=fitWrites;width=1200;fits();width=0;fits();width=960;fits();
assert.equal(fitWrites,beforeResize);
cleanup();const oldReady=fontReady;ratio=8;title.useTitleFit('Die Speisekarte');cleanup=effect();fits();
width=0;const lastWrites=fitWrites;fontReady();assert.equal(fitWrites,lastWrites);
cleanup();fontReady();oldReady();assert.equal(fitWrites,lastWrites);

// Exercise the actual item handlers and check the same summary is used in static and modal views.
const info=await source('src/data/allergen-info.ts',{__FOOD_PUBLIC__:{}});
const getAllergenInfo=info.getAllergenInfo, foodId=info.foodId;
assert.deepEqual(clone(getAllergenInfo('Example','tonno, burro e soia','').codes),[]);
assert.deepEqual(clone(getAllergenInfo('Patatine Fritte','','1 - 4 - *').codes),[1,4]);
assert.equal(getAllergenInfo('Patatine Fritte','','1 - 4 - *').frozen,true);
const data=JSON.parse(await readFile('src/data/menu.json','utf8'));
let opened,closed=0,modal;
const copy={allergens:'Allergeni',close:'Chiudi',frozenTitle:'Prodotti surgelati',frozen:'Surgelato'};
const shared={getAllergenInfo,foodId,releaseCopy:{it:{legend:'Legenda'}},useDialog:()=>({open:v=>{opened=v},modal,close:()=>{closed++},update:()=>{}}),useI18n:()=>({language:'it',copy,ui:{legal_notes:'Note legali'}}),translateName:n=>n,translateDescription:n=>n,data,AllergenSummary:()=>null,AllergenLegend:()=>null};
const items=await source('src/components/Menu.tsx',shared);
const row=['Deliziosa','Bordo ripieno di ricotta','13,00','1 · 7'];
const view=items.MenuItem({row});
const name=nodes(view,n=>n.type==='a'&&n.props.className==='nome')[0];
const number=nodes(view,n=>n.props.className==='allergen-trigger')[0];
assert.equal(name.props.href,number.props.href);
const event={button:0,preventDefault(){}};
name.props.onClick(event);const fromName=clone(opened);number.props.onClick(event);assert.deepEqual(clone(opened),fromName);
opened=null;name.props.onClick({...event,ctrlKey:true});assert.equal(opened,null);
for (const drink of [...data.ACQUA_BIBITE,...data.BOTTIGLIA.flatMap(group=>group[2])]) {
  const view=items.MenuItem({row:drink,showAllergens:false});
  assert.equal(nodes(view,n=>n.props['aria-haspopup']==='dialog').length,0);
}
assert.equal(items.ItemName({name:'Coperto'}).type,'span');
const effectsList=[],rootStyle={overflow:'auto'};
let nativeOpen=false;
const dialogRef={current:{showModal(){nativeOpen=true},close(){nativeOpen=false}}};
const dialog=await source('src/components/Dialogs.tsx',{...shared,useRef:()=>dialogRef,useLayoutEffect:fn=>effectsList.push(fn),document:{documentElement:{style:rootStyle}},Icon:()=>null,LegalReader:()=>null});
for (const state of [{kind:'allergens',name:row[0],description:row[1],codes:row[3]},{kind:'legal',slug:'privacy'}]) {
  modal=state;const node=dialog.Dialogs();
  const mounts=effectsList.splice(0).map(fn=>fn());
  assert.equal(nativeOpen,true);assert.equal(rootStyle.overflow,'hidden');
  let before=closed;node.props.onClick({target:{},currentTarget:{}});assert.equal(closed,before);
  const outside={};node.props.onClick({target:outside,currentTarget:outside});assert.equal(closed,++before);
  node.props.onCancel({preventDefault(){}});assert.equal(closed,++before);
  nodes(node,n=>n.props.className==='modal-close')[0].props.onClick({stopPropagation(){}});assert.equal(closed,++before);
  mounts.forEach(fn=>fn?.());assert.equal(nativeOpen,false);assert.equal(rootStyle.overflow,'auto');
}
console.log('MENU_INTERACTIONS_OK — category rail, reduced motion, item and code links, explicit sources, modal contents and close/focus lifecycle.');
