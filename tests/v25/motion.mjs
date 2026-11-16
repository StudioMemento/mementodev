import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import {runInNewContext} from 'node:vm';
const code=stripTypeScriptTypes((await readFile('src/hooks/carouselMotion.ts','utf8')).replaceAll('export ',''));
const {createMotion,advance,seek,captionOpacity,loopDistance}=runInNewContext(code+';({createMotion,advance,seek,captionOpacity,loopDistance})');
function run(rate, velocity, auto, seconds){const m=createMotion();m.position=.37;m.velocity=velocity;for(let i=0;i<rate*seconds;i++)advance(m,1/rate,auto);return m;}
const coast=run(60,1,0,8);
assert.ok(Math.abs(coast.position-.67)<.00004,'Release must coast to a fractional position, not a slide center');
assert.equal(coast.target,null);assert.equal(coast.velocity,0);
for(const rate of[30,90,120])assert.ok(Math.abs(run(rate,1,0,8).position-coast.position)<.00004,'Friction must be frame-rate independent');
assert.ok(Math.abs(run(60,0,.075,20).position-run(120,0,.075,20).position)<1e-10);
const still=createMotion();still.position=.372;assert.equal(advance(still,.016,0),false);assert.equal(still.position,.372);
const m=createMotion();seek(m,3);let previous=0;for(let i=0;i<120;i++){advance(m,1/60,0);assert.ok(m.position>=previous&&m.position<=3);previous=m.position;}assert.equal(m.position,3);
assert.equal(captionOpacity(0),1);assert.equal(captionOpacity(1),0);
for(let x=0;x<1;x+=.001){assert.ok(captionOpacity(x)>=captionOpacity(x+.001));assert.ok(Math.abs(captionOpacity(x)-captionOpacity(x+.001))<.006,'No abrupt caption opacity changes');}
assert.equal(loopDistance(0,9.75,10),.25);assert.equal(loopDistance(9,.25,10),-1.25);
console.log('MOTION_OK — fractional release, frame-rate independent inertia, continuous caption opacity, explicit eased seeks.');

for(let x=0;x<=1;x+=.001)assert.equal(captionOpacity(x)*captionOpacity(1-x),0,'Adjacent captions must never overlap');
