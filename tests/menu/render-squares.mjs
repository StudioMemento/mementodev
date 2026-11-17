// Optional native Canvas 2D raster check. This is not a browser/GPU benchmark.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { loadSideSquares } from './load-side-squares.mjs';
const modulePath = process.env.SQUARES_CANVAS_MODULE || (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/@napi-rs/canvas/index.js');
const { createCanvas } = await import(modulePath);
const effect = await loadSideSquares();
await mkdir('test-results/menu', { recursive: true });
const measurements = [];
for (const [width, height, fraction] of [[390,844,.1],[768,1024,.15],[1440,900,.2],[3440,1440,.3]]) {
  const band = width * fraction, ratio = effect.pixelRatio(band, height, 3);
  const fields = [120,1033].map(seed => effect.createSquares(band, height, seed));
  const surfaces = fields.map(() => createCanvas(Math.floor(band * ratio), Math.floor(height * ratio)));
  const painters = surfaces.map((canvas, i) => {
    const ctx = canvas.getContext('2d'); ctx.scale(canvas.width / band, canvas.height / height);
    return effect.createPainter(ctx, fields[i], band, height, !!i);
  });
  const times = [];
  for (let n = 0; n < 230; n++) {
    const start = performance.now(); for (const paint of painters) paint(n / 30);
    if (n >= 30) times.push(performance.now() - start);
  }
  times.sort((a,b) => a-b);
  measurements.push({ width, height, squares: fields.reduce((n,s) => n+s.length,0), pixels: surfaces.reduce((n,c) => n+c.width*c.height,0), meanMs: times.reduce((a,b)=>a+b,0)/times.length, p95Ms: times[Math.floor(times.length*.95)] });
  const output = createCanvas(width, height), ctx = output.getContext('2d');
  for (const seconds of [0,3,6]) {
    ctx.fillStyle = '#090909'; ctx.fillRect(0, 0, width, height);
    painters.forEach(paint => paint(seconds));
    ctx.drawImage(surfaces[0], 0, 0, band, height); ctx.drawImage(surfaces[1], width-band, 0, band, height);
    const middle = ctx.getImageData(Math.ceil(band), 0, Math.floor(width-band)-Math.ceil(band), height).data;
    for (let i = 0; i < middle.length; i += 4) assert.ok(middle[i]===9 && middle[i+1]===9 && middle[i+2]===9 && middle[i+3]===255, 'A rendered pixel entered the reading column');
    await writeFile(`test-results/menu/side-squares-field-${width}-${seconds}s.png`, output.toBuffer('image/png'));
  }
}
// Same framing and three-second intervals as the supplied close-up references.
const strip = createCanvas(540 * 3, 780), stripCtx = strip.getContext('2d');
stripCtx.fillStyle = '#090909'; stripCtx.fillRect(0,0,strip.width,strip.height);
for (const [index, seconds] of [0,3,6].entries()) {
  const canvas = createCanvas(540,780);
  effect.createPainter(canvas.getContext('2d'), effect.createSquares(540,780,120),540,780,false)(seconds);
  stripCtx.drawImage(canvas,index*540,0);
}
await writeFile('test-results/menu/side-squares-three-seconds.png', strip.toBuffer('image/png'));
const report = { scope: 'Local native Canvas 2D drawing and rasterization; excludes browser compositor, page blur and physical devices', measurements };
await writeFile('test-results/menu/side-squares-performance.json', JSON.stringify(report,null,2));
console.log('SIDE_SQUARES_RENDER_OK ' + JSON.stringify(report));
