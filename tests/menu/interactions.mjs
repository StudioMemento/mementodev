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
const buttons=Array.from({length:8},(_,i)=>({offsetLeft:i*100,offsetWidth:94}));
const ids=['classiche','audaci','bianche','calzoni','cucina','stuzzicherie','dolci','bevande'];
const rail={clientWidth:320,scrollWidth:800,scrollLeft:0,children:buttons,querySelector:q=>buttons[ids.indexOf(q.match(/data-go="([^"]+)"/)[1])],scrollTo:v=>{scrollRequest=v;rail.scrollLeft=Math.max(0,Math.min(v.left,rail.scrollWidth-rail.clientWidth))},scrollBy:v=>{scrollRequest=v;rail.scrollLeft=Math.max(0,Math.min(rail.scrollLeft+v.left,rail.scrollWidth-rail.clientWidth))},addEventListener:(k,f)=>listeners.set('rail:'+k,f),removeEventListener:k=>listeners.delete('rail:'+k)};
const wrapper={classList:{toggle:(k,on)=>on?classes.add(k):classes.delete(k)}};
const win={innerHeight:844,addEventListener:(k,f)=>listeners.set('window:'+k,f),removeEventListener:k=>listeners.delete('window:'+k)};
const nav=await source('src/components/menu/useMenuNavigation.ts',{...hooks,window:win,matchMedia:()=>({matches:reduced}),history:{replaceState:(_a,_b,url)=>{hash=url}},document:{querySelectorAll:()=>ids.map(id=>({id:'cat-'+id})),getElementById:id=>({scrollIntoView:options=>{targetId=id;scrollRequest=options}})},IntersectionObserver:class{constructor(fn,options){this.fn=fn;this.options=options;this.observed=[];ios.push(this)}observe(el){this.observed.push(el)}disconnect(){this.disconnected=true}},ResizeObserver:class{constructor(fn){this.fn=fn;this.observed=[];ros.push(this)}observe(el){this.observed.push(el)}disconnect(){this.disconnected=true}}});
function commit(){let rounds=0;do{assert.ok(++rounds<5);cursor=0;dirty=false;state=nav.useMenuNavigation(language);state.chips.current=rail;state.wrap.current=wrapper;for(const {n,fn}of effects.splice(0)){slots[n].cleanup?.();slots[n].cleanup=fn()}}while(dirty)}
commit();assert.equal(state.active,'classiche');assert.equal(ios[0].observed.length,8);assert.equal(ros[0].observed.length,9);assert.ok(classes.has('can-r'));assert.ok(!classes.has('can-l'));
state.nudge(1);listeners.get('rail:scroll')();assert.ok(classes.has('can-l'));assert.equal(scrollRequest.behavior,'smooth');
state.select('dolci');assert.equal(targetId,'cat-dolci');assert.equal(hash,'#cat-dolci');commit();assert.equal(state.active,'dolci');assert.ok(!classes.has('can-r'));
ios.at(-1).fn([{target:{id:'cat-audaci'},isIntersecting:true}]);commit();assert.equal(state.active,'audaci');
reduced=true;state.select('bevande');assert.equal(scrollRequest.behavior,'instant');commit();state.nudge(-1);assert.equal(scrollRequest.behavior,'instant');
rail.clientWidth=1000;listeners.get('window:resize')();ros.at(-1).fn();assert.ok(!classes.has('can-l'));assert.ok(!classes.has('can-r'));assert.ok(ios[0].disconnected);
language='de';commit();assert.equal(ros.at(-1).observed.length,9);assert.ok(ros.at(-2).disconnected);
slots.forEach(s=>s.cleanup?.());assert.equal(listeners.size,0);assert.ok(ros.at(-1).disconnected);assert.ok(ios.at(-1).disconnected);
// Actual title fitting: font load, resize, a long translation, zero size and unmount.
let effect,width=320,fontSize=80,ratio=4,fitWrites=0,fontReady;
const label={getBoundingClientRect:()=>({width:fontSize*ratio})};
const heading={firstElementChild:label,get clientWidth(){return width},style:{setProperty:(key,value)=>{assert.equal(key,'--menu-title-size');fontSize=parseFloat(value);fitWrites++}}};
const fits=[];
const title=await source('src/components/menu/MenuTitle.tsx',{useRef:()=>({current:heading}),useLayoutEffect:fn=>{effect=fn},ResizeObserver:class{constructor(fn){this.fn=fn;fits.push(this)}observe(){}disconnect(){this.disconnected=true}},getComputedStyle:()=>({fontSize:`${fontSize}px`}),document:{fonts:{ready:{then:fn=>{fontReady=fn}}}}});
title.useTitleFit('Il Menù');let cleanup=effect();assert.equal(fontSize*ratio,width);const firstWrites=fitWrites;fits.at(-1).fn();assert.equal(fitWrites,firstWrites);
ratio=3.85;fontReady();assert.ok(Math.abs(fontSize*ratio-width)<.001);width=1200;fits.at(-1).fn();assert.ok(Math.abs(fontSize*ratio-width)<.001);
cleanup();const oldReady=fontReady;ratio=8;title.useTitleFit('Die Speisekarte');cleanup=effect();assert.ok(Math.abs(fontSize*ratio-width)<.001);
width=0;fits.at(-1).fn();assert.ok(Number.isFinite(fontSize));const lastWrites=fitWrites;cleanup();fontReady();oldReady();assert.equal(fitWrites,lastWrites);assert.ok(fits.at(-1).disconnected);
// Execute item handlers and the real dialog render/cancel/click handlers.
const allergen=await source('src/data/allergen-info.ts',{});const getAllergenInfo=vm.runInContext('getAllergenInfo',allergen);
const data=JSON.parse(await readFile('src/data/menu.json','utf8')),allergens=JSON.parse(await readFile('src/data/allergens.json','utf8'));
let currentLang='it',opened,closed=0,modal;
const copy={allergens:'Allergeni',close:'Chiudi',allergenIncluded:'Presente in questo piatto',allergenNote:'Chiedi al personale per ulteriori informazioni',frozenTitle:'Prodotti surgelati',frozen:'Surgelato all’origine o in assenza del fresco.'};
const shared={getAllergenInfo,useDialog:()=>({open:v=>{opened=v},modal,close:()=>{closed++},update:()=>{}}),useI18n:()=>({language:currentLang,copy,ui:{legal_notes:'Note legali'}}),translateName:n=>n,translateDescription:n=>n,data};
const items=await source('src/components/Menu.tsx',shared);
const row=['Deliziosa','Bordo ripieno di ricotta, pomodoro, mozzarella di Bufala in cottura','13,00','1 · 7'];
let view=items.MenuItem({row});const name=nodes(view,n=>n.type==='button'&&n.props.className==='nome')[0];name.props.onClick();const fromName=clone(opened);nodes(view,n=>n.props.className==='allergen-trigger')[0].props.onClick();assert.deepEqual(clone(opened),fromName);assert.equal(opened.codes,'1 · 7');
const noCodes=items.ItemName({name:'Acqua naturale'});noCodes.props.onClick();assert.equal(opened.name,'Acqua naturale');assert.equal(items.ItemName({name:'Coperto'}).type,'span');
let nativeOpen=false;const rootStyle={overflow:'auto'},dialogRef={current:{showModal:()=>{nativeOpen=true},close:()=>{nativeOpen=false}}};
const dialog=await source('src/components/Dialogs.tsx',{...shared,allergens,privacy:'',cookies:'',legal:'',useRef:()=>dialogRef,useLayoutEffect:fn=>{effect=fn},document:{documentElement:{style:rootStyle}},useDrag:()=>({}),Icon:()=>null,Photo:()=>null,wrap:(v,n)=>(v%n+n)%n});
for(const lang of ['it','en','de','fr']){
 currentLang=lang;modal={kind:'allergens',name:row[0],description:row[1],codes:'1 · 7 *'};view=dialog.Dialogs();
 const rows=nodes(view,n=>n.type==='li');assert.equal(rows.length,15);assert.equal(rows.filter(n=>n.props.className==='contains').length,3);
 const mount=effect();assert.equal(nativeOpen,true);assert.equal(rootStyle.overflow,'hidden');
 for(const target of [{kind:'body'},{kind:'description'},{kind:'title'}]){const before=closed;view.props.onClick({target,currentTarget:{}});assert.equal(closed,before+1)}
 let stopped=false;nodes(view,n=>n.props.className==='modal-close')[0].props.onClick({stopPropagation:()=>{stopped=true}});assert.ok(stopped);
 let prevented=false;view.props.onCancel({preventDefault:()=>{prevented=true}});assert.ok(prevented);
 mount();assert.equal(nativeOpen,false);assert.equal(rootStyle.overflow,'auto');
}
modal={kind:'legal',slug:'privacy'};view=dialog.Dialogs();const before=closed;view.props.onClick({target:{},currentTarget:{}});assert.equal(closed,before,'Legal content must not close on inside click');const outside={};view.props.onClick({target:outside,currentTarget:outside});assert.equal(closed,before+1);
console.log('MENU_INTERACTIONS_OK — fitted title/font loading/resize/translations; 8-category scrollspy, edge cues and reduced motion; item and number triggers, 15 allergen rows in four languages, any-click/Escape/close handlers, scroll-lock cleanup and legal-dialog isolation.');
