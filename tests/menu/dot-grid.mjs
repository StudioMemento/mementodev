import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { performance } from 'node:perf_hooks';
import vm from 'node:vm';

const directory='src/components/menu/dot-grid/';
const source=async name=>(await readFile(directory+name+'.ts','utf8')).replace(/^import .*;\n/gm,'').replace(/export /g,'');
const core=stripTypeScriptTypes(await source('preset')+'\nconst s=DOT_GRID;\n'+await source('physics'));
const pure=vm.createContext({performance});vm.runInContext(core,pure);
const preset=vm.runInContext('DOT_GRID',pure);
assert.equal(preset.dotSize,2);assert.equal(preset.gap,48);assert.equal(preset.proximity,180);
assert.equal(preset.baseColor,'#252524');assert.equal(preset.activeColor,'#a89b7b');
assert.equal(preset.tension,.5);assert.equal(preset.bounce,.5);assert.equal(preset.returnDuration,1.5);
assert.equal(preset.stretch,2);assert.equal(preset.fade,.5);assert.equal(preset.glow,.5);
assert.equal(preset.swell,0);assert.equal(preset.shockStrength,0);assert.equal(preset.clickShock,false);assert.equal(preset.intro,false);

// Measure the real spring simulation and instance packing, not a synthetic stand-in.
// These CPU measurements exclude WebGL submission, GPU rasterization and the browser compositor.
const benchmark=[];
for(const [width,height] of [[390,844],[1440,900],[3440,1440],[7680,2160]]){
  const g=pure.gridLayout(width,height,3), field=pure.createField(g);
  assert.ok(g.count<=preset.maxDots);assert.ok(Math.floor(width*g.ratio)*Math.floor(height*g.ratio)<=preset.maxPixels);
  assert.equal(g.count,g.cols*g.rows);assert.ok(g.ratio<=1.5);
  const original=[...field.instances];const times=[];
  for(let i=0;i<900;i++){
    field.move(width/2+Math.sin(i/17)*150,height/2+Math.cos(i/23)*90,1+i*1000/60);
    const start=performance.now();field.step(1/60);if(i>=120)times.push(performance.now()-start);
  }
  assert.notDeepEqual([...field.instances],original,'A moving pointer must move/light dots');
  assert.ok([...field.instances].every(Number.isFinite));
  field.leave();let ticks=0;while(!field.settled()&&ticks++<480)field.step(1/60);
  assert.ok(field.settled(),'The simulation must settle and allow its clock to stop');field.snap();
  assert.deepEqual([...field.instances],original,'Settled dots must return to their original positions');
  times.sort((a,b)=>a-b);
  benchmark.push({width,height,dots:g.count,pixels:Math.floor(width*g.ratio)*Math.floor(height*g.ratio),cpuMeanMs:times.reduce((a,b)=>a+b,0)/times.length,cpuP95Ms:times[Math.floor(times.length*.95)],settleSeconds:ticks/60});
}

// Run the real lifecycle, physics and renderer with deterministic browser/WebGL surfaces.
// This verifies scheduling, resource ownership and input semantics; it is not a GPU render test.
const listeners=new Map(),raf=new Map(),ios=[],ros=[];
let id=0,clock=0,reduced=false,hidden=false,reads=0,contexts=0,draws=0,width=390,height=844;
let support=true,compile=true,disposedObservers=0;
const resources=new Set(),uniforms=new Map(),uploads=[];
const target=name=>({dataset:{},addEventListener(type,fn,options){listeners.set(name+':'+type,{fn,options});},removeEventListener(type){listeners.delete(name+':'+type);}});
const resource=kind=>{const item={kind,id:++id};resources.add(item);return item;};
const gl=new Proxy({
  createProgram:()=>resource('program'),createShader:()=>resource('shader'),createBuffer:()=>resource('buffer'),createVertexArray:()=>resource('vao'),
  deleteProgram:item=>resources.delete(item),deleteShader:item=>resources.delete(item),deleteBuffer:item=>resources.delete(item),deleteVertexArray:item=>resources.delete(item),
  getShaderParameter:()=>compile,getProgramParameter:()=>true,getUniformLocation:(_p,name)=>name,
  uniform1f:(key,v)=>uniforms.set(key,v),uniform1i:(key,v)=>uniforms.set(key,v),uniform3f:(key,...v)=>uniforms.set(key,v),
  drawArraysInstanced:(_mode,_first,_vertices,count)=>{assert.ok(count<=2400);draws++;},
  bufferSubData:(_a,_b,data)=>uploads.push([...data]),
}, {get:(obj,key)=>key in obj?obj[key]:key.toUpperCase()===key?0:()=>{}});
const canvas={...target('canvas'),width:300,height:150,hidden:false,getContext:()=>{contexts++;return support?gl:null;}};
const win={...target('window'),scrollY:0,devicePixelRatio:3};
const section={...target('section'),getBoundingClientRect:()=>{reads++;return {top:2000-win.scrollY,left:0,width,height:15000};}};
const layer={...target('layer'),querySelector:()=>canvas,getBoundingClientRect:()=>{reads++;return {top:Math.max(0,2000-win.scrollY),left:0,width,height};}};
const doc={...target('document'),get hidden(){return hidden;},fonts:{ready:Promise.resolve()}};
const media={...target('media'),get matches(){return reduced;}};
const scope=vm.createContext({performance,console,window:win,document:doc,matchMedia:()=>media,
  requestAnimationFrame:fn=>{raf.set(++id,fn);return id;},cancelAnimationFrame:key=>raf.delete(key),
  ResizeObserver:class{constructor(fn){this.fn=fn;ros.push(this);}observe(){}disconnect(){disposedObservers++;}},
  IntersectionObserver:class{constructor(fn){this.fn=fn;ios.push(this);}observe(){}disconnect(){disposedObservers++;}},
});
vm.runInContext(core+'\n'+stripTypeScriptTypes(await source('renderer')+'\n'+await source('controller')),scope);
const fire=(name,event={})=>listeners.get(name).fn(event);
const tick=(ms=1000/60)=>{clock+=ms;const jobs=[...raf.values()];raf.clear();jobs.forEach(fn=>fn(clock));};
const drain=()=>{let ticks=0;while(raf.size&&ticks++<600)tick();assert.equal(raf.size,0,'RAF must stop');};
let engine=scope.mountDotGrid(section,layer,false);await Promise.resolve();drain();
assert.equal(contexts,0,'Offscreen background must not allocate a WebGL context');
win.scrollY=2000;ios.at(-1).fn([{isIntersecting:true}]);drain();
assert.equal(contexts,1);assert.equal(draws,1,'Idle initialization needs one draw');
assert.equal(engine.stats().state,'idle');assert.equal(canvas.hidden,false);
assert.equal(uniforms.get('uStretch'),2);assert.equal(uniforms.get('uSwell'),0);assert.equal(uniforms.get('uFade'),.5);
assert.equal(resources.size,4,'Only one program, one VAO and two buffers survive compilation');
const measured=reads;
for(let i=0;i<20;i++)fire('section:pointermove',{pointerType:'mouse',clientX:70+i*9,clientY:400,timeStamp:clock+i*8});
assert.equal(raf.size,1,'Burst input must coalesce to one scheduled frame');tick();
assert.equal(reads,measured,'Pointer input must not read layout');
let before=draws;for(let i=0;i<60;i++)tick();
assert.ok(draws-before<=31,'Mobile draw frequency must be capped at 30fps');
fire('section:pointerleave',{pointerType:'mouse'});drain();assert.equal(reads,measured);assert.equal(engine.stats().state,'idle');
before=draws;for(let i=0;i<120;i++)tick();assert.equal(draws,before,'No idle redraws');
for(const name of ['section:touchstart','section:touchmove','window:touchend','window:touchcancel'])assert.equal(listeners.get(name).options.passive,true);
fire('section:touchstart',{touches:[{clientX:80,clientY:400}],timeStamp:clock});
fire('section:touchmove',{touches:[{clientX:190,clientY:410}],timeStamp:clock+30});tick();
win.scrollY+=100;fire('window:scroll');fire('section:touchmove',{touches:[{clientX:230,clientY:440}],timeStamp:clock+30});tick();
assert.equal(reads,measured,'Native scroll/touch interaction must reuse cached geometry');
fire('window:touchend');drain();assert.equal(engine.stats().state,'idle');
fire('section:touchstart',{touches:[{clientX:90,clientY:400}],timeStamp:clock});fire('section:touchmove',{touches:[{},{}],timeStamp:clock+20});drain();
fire('section:pointermove',{pointerType:'mouse',clientX:180,clientY:300,timeStamp:clock});
engine.setPaused(true);assert.equal(raf.size,0);before=draws;fire('section:pointermove',{pointerType:'mouse',clientX:100,clientY:300,timeStamp:clock});tick();assert.equal(draws,before);
engine.setPaused(false);drain();hidden=true;fire('document:visibilitychange');fire('section:touchstart',{touches:[{clientX:90,clientY:400}],timeStamp:clock});assert.equal(raf.size,0);
hidden=false;fire('document:visibilitychange');drain();reduced=true;fire('media:change');assert.equal(canvas.hidden,true);assert.equal(layer.dataset.ready,'false');assert.equal(raf.size,0);
reduced=false;fire('media:change');drain();assert.equal(canvas.hidden,false);
let prevented=false;fire('canvas:webglcontextlost',{preventDefault(){prevented=true;}});assert.ok(prevented);assert.equal(canvas.hidden,true);assert.equal(raf.size,0);assert.equal(resources.size,0);
fire('canvas:webglcontextrestored');drain();assert.equal(resources.size,4);
width=3440;height=1440;ros.at(-1).fn();tick();drain();assert.ok(engine.stats().dots<=2400);assert.ok(engine.stats().pixels<=3_000_000);
ios.at(-1).fn([{isIntersecting:false}]);assert.equal(raf.size,0);before=draws;fire('section:pointermove',{pointerType:'mouse',clientX:100,clientY:300,timeStamp:clock});tick();assert.equal(draws,before);
engine.dispose();await Promise.resolve();assert.equal(raf.size,0);assert.equal(listeners.size,0);assert.equal(resources.size,0);assert.equal(canvas.width*canvas.height,1);assert.equal(disposedObservers,2);

// Failed allocation/compilation must leave a static background and free partial resources.
for(const mode of ['unavailable','compile-failure','reduced']){
  support=mode!=='unavailable';compile=mode!=='compile-failure';reduced=mode==='reduced';
  engine=scope.mountDotGrid(section,layer,false);await Promise.resolve();ios.at(-1).fn([{isIntersecting:true}]);drain();
  assert.equal(canvas.hidden,true);assert.equal(resources.size,0);engine.dispose();assert.equal(listeners.size,0);
}
const css=await readFile('src/styles/menu.css','utf8');assert.ok(!css.includes('.menu-art:hover'));assert.ok(!css.includes('.menu-art::after'));
await mkdir('test-results/menu',{recursive:true});await writeFile('test-results/menu/dot-grid-performance.json',JSON.stringify({scope:'CPU simulation + instance packing; no GPU/browser measurement',benchmark},null,2));
console.log('DOT_GRID_CPU '+JSON.stringify(benchmark));
console.log('DOT_GRID_OK — requested preset; bounded dots/pixels; passive touch with native scrolling; no layout reads in animation/input; one coalesced RAF; 30fps mobile cap; zero idle/offscreen/hidden/dialog work; reduced-motion and WebGL fallbacks; context restoration; complete resource cleanup.');
