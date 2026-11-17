import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { loadSideSquares } from './load-side-squares.mjs';

const field = await loadSideSquares();
const p = field.preset;
assert.equal(p.squareColor, '#c6ab70'); assert.equal(p.backgroundColor, '#090909');

// Judge visible output in CSS pixels and seconds, not just preset field names.
const fineAndCalm = square => {
  assert.ok(square.size >= .4 && square.size <= 1.2, 'Grain must stay below 1.2 CSS pixels');
  const period = 2 * Math.PI / square.rate;
  assert.ok(period >= 10 && period <= 22, 'A full fade cycle must take 10–22 seconds');
};
assert.throws(() => fineAndCalm({ size: 5.7, rate: .4 }), /Grain/);
assert.throws(() => fineAndCalm({ size: .7, rate: 2 * Math.PI * 2 }), /fade cycle/);

const layouts = [];
for (const [width, height, fraction] of [[320,568,.1],[390,844,.1],[768,1024,.15],[1199,900,.15],[1200,900,.2],[1440,900,.2],[2399,1440,.2],[2400,1440,.3],[3440,1440,.3],[7680,2160,.3]]) {
  const gutter = width * fraction;
  const left = field.createSquares(gutter, height, 120);
  const right = field.createSquares(gutter, height, 1033);
  const ratio = field.pixelRatio(gutter, height, 3);
  const pixels = 2 * Math.floor(gutter * ratio) * Math.floor(height * ratio);
  assert.ok(pixels <= p.maxPixels); assert.ok(ratio <= p.maxDpr);
  assert.ok(left.length > 0 && right.length > 0);
  assert.ok(left.length <= p.maxSquaresPerSide && right.length <= p.maxSquaresPerSide);
  assert.deepEqual(left, field.createSquares(gutter, height, 120), 'A remount must not randomize the pattern');
  for (const square of [...left, ...right]) {
    fineAndCalm(square);
    assert.ok(square.x >= 0 && square.x + square.size <= gutter);
    assert.ok(square.y >= 0 && square.y + square.size <= height);
    const mirroredX = width - square.x - square.size;
    assert.ok(mirroredX >= width - gutter, 'Right squares entered the reading column');
    for (let t = 0; t < 22; t += .13) {
      const alpha = field.brightness(square, t);
      assert.ok(Number.isFinite(alpha) && alpha >= 0 && alpha <= 1);
      assert.ok(Math.abs(field.brightness(square, t + 1/30) - alpha) < .014, 'Per-frame brightness changes too abruptly');
    }
  }
  const sizes = left.map(s => s.size).sort((a,b) => a-b);
  const periods = left.map(s => 2 * Math.PI / s.rate).sort((a,b) => a-b);
  assert.ok(sizes[Math.floor(sizes.length*.9)] - sizes[Math.floor(sizes.length*.1)] > .4, 'Size variation is too uniform');
  assert.ok(periods[Math.floor(periods.length*.9)] - periods[Math.floor(periods.length*.1)] > 8, 'Fade durations must differ');
  assert.equal(new Set(left.map(s=>s.y)).size, left.length, 'Repeated grid rows remain');
  assert.ok(left.filter(s => s.x < gutter * .3).length > left.filter(s => s.x > gutter * .7).length, 'Density must diminish toward the content');
  assert.notEqual(field.brightness(left[0], 0), field.brightness(left[0], .25));
  layouts.push({ width, height, left: left.length, right: right.length, pixels });
}
const fadeField = field.createSquares(400, 900, 120);
const thirds = [0,1,2].map(part => fadeField.filter(s => s.x >= part*400/3 && s.x < (part+1)*400/3));
assert.ok(thirds[0].length > thirds[1].length * 2 && thirds[1].length > thirds[2].length * 2, 'Density must fall smoothly toward the menu');
const edge = { ...fadeField[0], peak: .8, phase: Math.PI / 2 };
assert.ok(field.brightness(edge, 0) > .79, 'The alpha bounds need a positive bright fixture');
const innerSquares = fadeField.filter(s=>s.x>320);
assert.ok(innerSquares.length > 0, 'The inner-edge fade check needs actual squares');
assert.ok(innerSquares.every(s=>s.peak < .4), 'Inner-edge fade must damp even a bright square');
const unchangedGeometry = JSON.stringify(fadeField);
const temporal = [0,3,6,9].map(t => fadeField.map(s=>field.brightness(s,t)));
assert.notDeepEqual(temporal[0], temporal[1], 'Three seconds must show a gentle change');
assert.equal(JSON.stringify(fadeField), unchangedGeometry, 'Animation may not move, resize or regenerate squares');

// Exercise the real painter and lifecycle against deterministic browser surfaces.
const listeners = new Map(), jobs = new Map(), ios = [], ros = [];
let serial = 0, clock = 0, reads = 0, width = 390, height = 844, gutter = 39;
let hidden = false, reduced = false, available = true, clears = 0, fills = 0, observersDisposed = 0;
const rectangles = [];
const target = name => ({
  addEventListener(type, fn, options) { listeners.set(name + ':' + type, { fn, options }); },
  removeEventListener(type) { listeners.delete(name + ':' + type); },
});
const canvases = [0, 1].map(side => ({
  width: 300, height: 150,
  get clientWidth() { reads++; return gutter; },
  getContext() {
    return available ? {
      setTransform() {}, clearRect() { clears++; }, beginPath() {},
      rect(x,y,w,h) { assert.ok(x >= 0 && x + w <= gutter + .001); assert.ok(y >= 0 && y + h <= height + .001); rectangles.push([side,x,y,w,h]); },
      fill() { fills++; },
    } : null;
  },
}));
const viewport = {
  dataset: {}, querySelectorAll: () => canvases,
  get clientWidth() { reads++; return width; },
  get clientHeight() { reads++; return height; },
};
const document = { ...target('document'), get hidden() { return hidden; } };
const window = { ...target('window'), devicePixelRatio: 3 };
const media = { ...target('media'), get matches() { return reduced; } };
const runtime = await loadSideSquares({ document, window, matchMedia: () => media,
  requestAnimationFrame(fn) { jobs.set(++serial, fn); return serial; },
  cancelAnimationFrame(id) { jobs.delete(id); },
  ResizeObserver: class { constructor(fn) { this.fn = fn; ros.push(this); } observe() {} disconnect() { observersDisposed++; } },
  IntersectionObserver: class { constructor(fn) { this.fn = fn; ios.push(this); } observe() {} disconnect() { observersDisposed++; } },
});
const fire = name => listeners.get(name).fn();
const tick = (ms = 1000 / 60) => { clock += ms; const current = [...jobs.values()]; jobs.clear(); current.forEach(fn => fn(clock)); };
let engine = runtime.mountSideSquares({}, viewport, false);
assert.equal(jobs.size, 0); assert.equal(clears, 0, 'Nothing is painted outside the menu');
ios.at(-1).fn([{ isIntersecting: true }]); assert.equal(jobs.size, 1);
const initialReads = reads;
for (let i = 0; i < 120; i++) tick();
assert.ok(engine.stats().frames >= 50 && engine.stats().frames <= 61, 'Paint frequency exceeds the 30Hz limit');
assert.equal(reads, initialReads, 'Animation may not read layout');
assert.equal(clears, engine.stats().frames * 2);
assert.ok(fills <= engine.stats().frames * 62, 'Opacity grouping must bound fill calls');
assert.equal(engine.stats().state, 'running'); assert.ok(rectangles.length > 0);
assert.ok([...listeners.keys()].every(name => !/pointer|touch|mouse|scroll/.test(name)), 'Decoration must not handle input or scrolling');

engine.setPaused(true); assert.equal(jobs.size, 0);
let count = clears; for (let i = 0; i < 120; i++) tick(); assert.equal(clears, count);
engine.setPaused(false); assert.equal(jobs.size, 1); tick();
hidden = true; fire('document:visibilitychange'); assert.equal(jobs.size, 0);
count = clears; tick(); assert.equal(clears, count);
hidden = false; fire('document:visibilitychange'); tick();
reduced = true; fire('media:change'); assert.equal(jobs.size, 0); assert.equal(engine.stats().state, 'static');
count = clears; for (let i = 0; i < 120; i++) tick(); assert.equal(clears, count);
reduced = false; fire('media:change'); tick();
width = 3440; height = 1440; gutter = width * .3;
for (let i = 0; i < 20; i++) ros.at(-1).fn();
assert.ok(jobs.size <= 2, 'Resize must coalesce with the single animation frame');
tick(); tick(); assert.ok(engine.stats().pixels <= p.maxPixels); assert.ok(engine.stats().squares <= 2400);
ios.at(-1).fn([{ isIntersecting: false }]); assert.equal(jobs.size, 0); assert.equal(engine.stats().state, 'paused');
count = clears; tick(); assert.equal(clears, count);
engine.dispose(); assert.equal(jobs.size, 0); assert.equal(listeners.size, 0); assert.equal(observersDisposed, 2);
assert.ok(canvases.every(c => c.width * c.height === 1));
// Unavailable Canvas and opening the menu with reduced motion must stay functional.
for (const mode of ['unavailable', 'reduced', 'dialog']) {
  available = mode !== 'unavailable'; reduced = mode === 'reduced';
  engine = runtime.mountSideSquares({}, viewport, mode === 'dialog');
  ios.at(-1).fn([{ isIntersecting: true }]);
  assert.equal(jobs.size, 0); engine.dispose(); assert.equal(listeners.size, 0);
}
const css = await readFile('src/styles/menu.css', 'utf8');
assert.ok(css.includes('background:#090909')); assert.ok(css.includes('width:var(--vr-gutter)'));
assert.ok(!css.includes('menu-dot')); assert.ok(!css.includes('.menu-art:hover'));
await assert.rejects(access('src/components/menu/dot-grid'));
await assert.rejects(access('src/components/menu/MenuDotGrid.tsx'));
const baseline = await readFile('src/styles/clean.css', 'utf8');
for (const rule of ['--vr-gutter: 10vw; --vr-content: 80vw', '--vr-gutter:15vw; --vr-content:70vw', '--vr-gutter:20vw; --vr-content:60vw', '--vr-gutter:30vw; --vr-content:40vw']) assert.ok(baseline.includes(rule));
console.log('SIDE_SQUARES_LAYOUTS ' + JSON.stringify(layouts));
console.log('BLINKING_SQUARES_OK — fine CSS-pixel grain; slow independent 10–22s fades; varied sizes and irregular positions; controlled falloff; 10/15/20/30% side confinement; no input listeners or per-frame layout reads; 30Hz paint cap; one clock; bounded pixels/squares/fills; hidden/offscreen/dialog pause; reduced-motion static frame; complete cleanup.');
