import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const motion=(await readFile('src/hooks/carouselMotion.ts','utf8')).replaceAll('export ','');
const source=await readFile('src/hooks/useCarousel.ts','utf8');
const code=stripTypeScriptTypes(motion+'\n'+source.slice(source.indexOf('export function')).replace('export function','function'));
const slots=[],effects=[],frames=new Map(),timers=new Map(),ios=[],ros=[],listeners=new Map();
let cursor=0,dirty=false,id=0,clock=100,result,width=5120,cardWidth=500,reads=0;
const same=(a,b)=>a&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
const hooks={useRef:v=>slots[cursor++]||=({current:v}),useState:init=>{const n=cursor++,s=slots[n]||={value:typeof init==='function'?init():init};return [s.value,v=>{v=typeof v==='function'?v(s.value):v;if(v!==s.value){s.value=v;dirty=true}}]},useCallback:(fn,deps)=>{const n=cursor++;if(!same(slots[n]?.deps,deps))slots[n]={fn,deps};return slots[n].fn},useEffect:(fn,deps)=>{const n=cursor++,old=slots[n];if(!same(old?.deps,deps)){slots[n]={deps,cleanup:old?.cleanup};effects.push({n,fn})}},useDialog:()=>({modal:null})};
const element=()=>({style:{},dataset:{},getBoundingClientRect:()=>{reads++;return {width:cardWidth}}});
let cards=[];const captions=Array.from({length:10},element);
const stage={...element(),querySelectorAll:()=>cards,getBoundingClientRect:()=>{reads++;return {width}},classList:{add(){},remove(){}},hasPointerCapture:()=>false};
const root={querySelectorAll:()=>captions};
const media={matches:false,addEventListener(){},removeEventListener(){}};
const scope={...hooks,useLayoutEffect:hooks.useEffect,Math,Set,document:{hidden:false,addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)},matchMedia:()=>media,performance:{now:()=>clock},wrap:(i,n)=>(i%n+n)%n,requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),clearTimeout:id=>timers.delete(id),window:{setTimeout:fn=>{timers.set(++id,fn);return id}},IntersectionObserver:class{constructor(fn){this.fn=fn;ios.push(this)}observe(){}disconnect(){}},ResizeObserver:class{constructor(fn){this.fn=fn;ros.push(this)}observe(){}disconnect(){}}};
vm.createContext(scope);vm.runInContext(code,scope);
function commit(){let passes=0;do{assert.ok(++passes<8);dirty=false;cursor=0;result=scope.useCarousel(10,'it');cards=Array.from({length:result.renderCount},(_,i)=>cards[i]||element());result.rootRef.current=root;result.stageRef.current=stage;for(const {n,fn} of effects.splice(0)){slots[n].cleanup?.();slots[n].cleanup=fn()}}while(dirty)}
function tick(){clock+=16;const jobs=[...frames.values()];frames.clear();jobs.forEach(fn=>fn(clock));if(dirty)commit()}
function check(){const centers=[];cards.forEach((c,i)=>{if(c.style.visibility==='visible'){const x=Number(c.style.transform.match(/\+ ([-\d.]+)px/)[1]);if(Math.abs(x)<width/2+cardWidth/2){assert.ok(result.isLoaded(i%10));centers.push(x)}}});centers.sort((a,b)=>a-b);assert.ok(centers[0]-cardWidth/2<0-width/2);assert.ok(centers.at(-1)+cardWidth/2>width/2);for(let i=1;i<centers.length;i++)assert.ok(Math.abs(centers[i]-centers[i-1]-cardWidth-16)<.01)}
commit();assert.equal(result.renderCount,20);check();ios.at(-1).fn([{isIntersecting:true}]);const cached=reads;for(let i=0;i<240;i++)tick();assert.equal(reads,cached);check();
width=7680;ros.at(-1).fn();if(dirty)commit();assert.equal(result.renderCount,20);check();
width=390;cardWidth=312;ros.at(-1).fn();if(dirty)commit();assert.equal(result.renderCount,10);assert.ok(cards.filter(c=>c.style.visibility==='visible').length<7);
width=3440;cardWidth=500;ros.at(-1).fn();if(dirty)commit();assert.equal(result.renderCount,10);check();
slots.forEach(s=>s.cleanup?.());assert.equal(frames.size,0);assert.equal(listeners.size,0);
console.log('INTRO_BELT_RUNTIME_OK — physical slots adapt 10↔20, current geometry survives resizing, visible images are loaded, no per-frame measurements, cleanup.');
