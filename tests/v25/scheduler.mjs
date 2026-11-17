import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import {runInNewContext} from 'node:vm';
// Execute the production hook with deterministic React slots/observers/clocks.
const motion=(await readFile('src/hooks/carouselMotion.ts','utf8')).replaceAll('export ','');
const source=await readFile('src/hooks/useCarousel.ts','utf8');
const code=stripTypeScriptTypes(motion+'\n'+source.slice(source.indexOf('export function')).replace('export function','function'));
const slots=[],effects=[],raf=new Map(),timers=new Map(),ios=[],ros=[],listeners=new Map();
let cursor=0,dirty=false,clock=100,id=1,result,modal=null;
const same=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>Object.is(x,b[i]));
const hooks={
 useRef(x){return slots[cursor++]||=( {current:x} );},
 useState(init){const n=cursor++,s=slots[n]||={value:typeof init==='function'?init():init};return[s.value,v=>{const next=typeof v==='function'?v(s.value):v;if(next!==s.value){s.value=next;dirty=true;}}];},
 useCallback(fn,deps){const n=cursor++;if(!same(slots[n]?.deps,deps))slots[n]={fn,deps};return slots[n].fn;},
 useEffect(fn,deps){const n=cursor++,old=slots[n];if(!same(old?.deps,deps)){slots[n]={deps,cleanup:old?.cleanup};effects.push({n,fn});}},
 useDialog(){return{modal};},
};
let layoutReads=0;
class Element {
 constructor(){this.style={};this.dataset={};this.capture=new Set();this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x)};}
 getBoundingClientRect(){layoutReads++;return{width:300};}
 setPointerCapture(x){this.capture.add(x)} hasPointerCapture(x){return this.capture.has(x)} releasePointerCapture(x){this.capture.delete(x)}
}
const cards=Array.from({length:10},()=>new Element()),captions=Array.from({length:10},()=>new Element());
const stage=Object.assign(new Element(),{querySelectorAll:()=>cards});
const root={querySelectorAll:()=>captions,contains:e=>e===stage};
const media={matches:false,addEventListener(_,fn){this.fn=fn},removeEventListener(){this.fn=null}};
const document={hidden:false,addEventListener(t,fn){listeners.set(t,fn)},removeEventListener(t){listeners.delete(t)}};
const context={...hooks,useLayoutEffect:hooks.useEffect,document,matchMedia:()=>media,performance:{now:()=>clock},wrap:(i,n)=>(i%n+n)%n,
 requestAnimationFrame:fn=>{const n=id++;raf.set(n,fn);return n},cancelAnimationFrame:n=>raf.delete(n),
 clearTimeout:n=>timers.delete(n),window:{setTimeout:(fn,delay)=>{const n=id++;timers.set(n,{fn,at:clock+delay});return n}},
 IntersectionObserver:class{constructor(fn){this.fn=fn;ios.push(this)}observe(){}disconnect(){this.disconnected=true}},
 ResizeObserver:class{constructor(fn){this.fn=fn;ros.push(this)}observe(){}disconnect(){this.disconnected=true}},
};
const hook=runInNewContext(code+';useCarousel',context);
function commit(){let n=0;do{assert.ok(++n<8);dirty=false;cursor=0;result=hook(10,'it');result.rootRef.current=root;result.stageRef.current=stage;for(const {n,fn}of effects.splice(0)){slots[n].cleanup?.();slots[n].cleanup=fn();}}while(dirty)}
function frame(dt=16){clock+=dt;for(const[n,t]of[...timers])if(t.at<=clock){timers.delete(n);t.fn()}const f=[...raf.values()];raf.clear();f.forEach(fn=>fn(clock));if(dirty)commit();}
function settle(){for(let i=0;i<300&&raf.size;i++)frame();assert.equal(raf.size,0,'Idle or paused slider must stop RAF');}
function visible(v){ios.at(-1).fn([{isIntersecting:v}]);}
function event(x,y){return{button:0,isPrimary:true,pointerId:1,clientX:x,clientY:y,currentTarget:stage,target:stage,pointerType:'mouse',preventDefault(){}};}
commit();assert.equal(raf.size,0);assert.equal(timers.size,0);
visible(true);const reads=layoutReads;for(let i=0;i<120;i++)frame();assert.equal(layoutReads,reads,'No layout reads in animation loop');assert.equal(raf.size,1);
result.rootBind.onPointerEnter({pointerType:'mouse'});settle();assert.equal(timers.size,0);
const before=cards[0].style.transform;
result.bind.onPointerDown(event(250,50));clock+=20;result.bind.onPointerMove(event(190,50));frame();assert.notEqual(cards[0].style.transform,before);
clock+=200;result.bind.onPointerUp(event(190,50));frame();const released=cards[0].style.transform;settle();assert.equal(cards[0].style.transform,released,'No center snapping after a held fractional drag');
result.bind.onPointerDown(event(250,50));result.bind.onPointerMove(event(249,90));assert.equal(stage.capture.size,0,'Vertical scroll must not be captured');result.bind.onPointerUp(event(249,90));settle();
result.rootBind.onPointerLeave({pointerType:'mouse'});clock+=6000;frame();assert.equal(raf.size,1);
visible(false);assert.equal(raf.size,0);assert.equal(timers.size,0);
visible(true);document.hidden=true;listeners.get('visibilitychange')();assert.equal(raf.size,0);
document.hidden=false;listeners.get('visibilitychange')();frame();assert.equal(raf.size,1);
modal={kind:'photo'};commit();assert.equal(raf.size,0);modal=null;commit();frame();assert.equal(raf.size,1);
media.matches=true;media.fn();settle();assert.equal(timers.size,0);
result.move(1);frame();settle();assert.ok(captions.some(c=>c.style.opacity==='1.0000'),'Reduced-motion navigation must still work');
slots.forEach(s=>s.cleanup?.());assert.equal(raf.size,0);assert.equal(timers.size,0);assert.equal(listeners.size,0);assert.ok(ios.every(x=>x.disconnected)&&ros.every(x=>x.disconnected));
console.log('SCHEDULER_OK — offscreen/hidden/dialog/reduced/hover pause, drag axis, no snap, no frame layout reads, cleanup.');
