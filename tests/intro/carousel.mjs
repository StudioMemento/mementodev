import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import {runInNewContext} from 'node:vm';
const source=stripTypeScriptTypes((await readFile('src/hooks/carouselMotion.ts','utf8')).replaceAll('export ',''));
const {carouselWindow,loopDistance}=runInNewContext(source+';({carouselWindow,loopDistance})');
const count=10;
let recycled=0,samples=0;
for(const [viewport,cardWidth] of [[320,256],[390,312],[768,322.56],[1440,460.8],[2560,500],[3440,500],[3840,500],[5120,500],[7680,500]]){
 const w=carouselWindow(viewport,cardWidth,count), edge=viewport/2+cardWidth/2;
 assert.ok(w.renderCount>=count&&w.renderCount%count===0);
 assert.ok(w.renderCount*w.step/2>edge,'Physical belt wraps on screen');
 const previous=new Map();
 for(let t=0;t<=w.renderCount*3*100;t++){
  const position=t/100, nearest=Math.round(position);
  const loaded=new Set();for(let d=-w.preload;d<=w.preload;d++)loaded.add(((nearest+d)%count+count)%count);
  const actual=[];
  for(let slot=0;slot<w.renderCount;slot++){
   const d=loopDistance(slot,position,w.renderCount),x=d*w.step,visible=Math.abs(d)<w.radius;
   if(Math.abs(x)<edge){assert.ok(visible,'Visible pizza is culled');assert.ok(loaded.has(slot%count),'Visible pizza image was not preloaded');actual.push(x);}
   const old=previous.get(slot);
   if(old&&Math.abs(x-old.x)>w.step*2){assert.ok(Math.abs(x)>edge&&Math.abs(old.x)>edge,'Recycling teleports a visible pizza');recycled++;}
   if(old&&visible!==old.visible)assert.ok(Math.abs(x)>edge&&Math.abs(old.x)>edge,'Visibility toggles inside viewport');
   previous.set(slot,{x,visible});
  }
  const expected=[];
  for(let offset=-Math.ceil(edge/w.step)-1;offset<=Math.ceil(edge/w.step)+1;offset++){
   const x=(nearest+offset-position)*w.step;if(Math.abs(x)<edge)expected.push(x);
  }
  actual.sort((a,b)=>a-b);expected.sort((a,b)=>a-b);
  assert.equal(actual.length,expected.length,'Gap or duplicated pizza in visible belt');
  actual.forEach((x,i)=>assert.ok(Math.abs(x-expected[i])<1e-7));samples++;
 }
}
assert.ok(recycled>100,'Positive control: wrap boundaries were exercised');
assert.ok(2.6*(500+16)<3440/2+250,'Regression control must reproduce the old ultrawide cutoff');
await import('./carousel-runtime.mjs');
console.log(`INTRO_CAROUSEL_OK — ${samples} positions across 320–7680px, ${recycled} offscreen recycles, full visible coverage and image preload.`);
