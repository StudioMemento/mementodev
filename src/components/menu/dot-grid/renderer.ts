/*! React Bits DotGrid shaders, Copyright (c) 2026 David Haz; MIT + Commons Clause, /licenses/ReactBits.txt.
 * Retained from upstream blob 47c3c28ae805d84a83e663030f4187185196d0fb. */
import { DOT_GRID as s } from "./preset";
import type { Layout } from "./physics";

const VERTEX = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in vec2 aState;

uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uStretch;
uniform float uGlow;

out vec2 vLocal;
out vec2 vPoint;
out float vLength;
out float vRadius;
out float vEnergy;

void main() {
  float energy = aState.x;
  float radius = 0.5 * uSize * aState.y * (1.0 + uSwell * energy);
  float speed = length(aMotion.zw);
  float angle = speed > 0.001 ? atan(aMotion.w, aMotion.z) : 0.0;
  float axis = floor(angle / 1.5707963 + 0.5) * 1.5707963;
  angle = axis + (angle - axis) * smoothstep(8.0, 70.0, speed);
  vec2 dir = vec2(cos(angle), sin(angle));
  float halfLength = min(uSize * 2.0, speed * uStretch * 0.02);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * vec2(halfLength + pad, pad);
  vec2 point = aMotion.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  vLocal = local;
  vPoint = point;
  vLength = halfLength;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 vLocal;
in vec2 vPoint;
in float vLength;
in float vRadius;
in float vEnergy;

uniform vec2 uResolution;
uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uOpacity;
uniform float uFade;
uniform int uShape;

out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  float d;
  if (uShape == 1) {
    float corner = vRadius * 0.3;
    vec2 q = abs(vLocal) - vec2(vLength + vRadius, vRadius) + corner;
    d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - corner;
  } else {
    d = length(vec2(max(abs(vLocal.x) - vLength, 0.0), vLocal.y)) - vRadius;
  }
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float alpha = body + (1.0 - body) * halo;
  vec3 color = mix(uBase, uActive, clamp(vEnergy * 1.2, 0.0, 1.0));
  float fade = 1.0;
  if (uFade > 0.0) {
    vec2 edge = min(vPoint, uResolution - vPoint) / (uFade * 0.4 * min(uResolution.x, uResolution.y));
    fade = smootherstep01(edge.x) * smootherstep01(edge.y);
  }
  alpha *= uOpacity * fade;
  outColor = vec4(color * alpha, alpha);
}
`;


export function createRenderer(canvas:HTMLCanvasElement) {
  const gl=canvas.getContext("webgl2",{alpha:true,premultipliedAlpha:true,antialias:false,powerPreference:"low-power"});
  if(!gl)return null;
  const shaders:WebGLShader[]=[];
  const program=gl.createProgram();
  if(!program)return null;
  for(const [type,source] of [[gl.VERTEX_SHADER,VERTEX],[gl.FRAGMENT_SHADER,FRAGMENT]] as const) {
    const shader=gl.createShader(type);
    if(!shader){shaders.forEach(v=>gl.deleteShader(v));gl.deleteProgram(program);return null;}
    shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){shaders.forEach(v=>gl.deleteShader(v));gl.deleteProgram(program);return null;}
    gl.attachShader(program,shader);
  }
  gl.linkProgram(program);shaders.forEach(v=>{gl.detachShader(program,v);gl.deleteShader(v);});
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null;}
  const vao=gl.createVertexArray(),corners=gl.createBuffer(),buffer=gl.createBuffer();
  if(!vao||!corners||!buffer){gl.deleteBuffer(corners);gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);return null;}
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER,corners);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,4,gl.FLOAT,false,24,0);gl.vertexAttribDivisor(1,1);
  gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,24,16);gl.vertexAttribDivisor(2,1);
  gl.bindVertexArray(null);gl.useProgram(program);
  const uniform=(name:string)=>gl.getUniformLocation(program,name);
  const resolution=uniform("uResolution");
  for(const [name,value] of Object.entries({uSize:s.dotSize,uSwell:s.swell,uStretch:s.stretch,uGlow:s.glow,uOpacity:1,uFade:s.fade}))gl.uniform1f(uniform(name),value);
  gl.uniform1i(uniform("uShape"),0);
  for(const [name,color] of [["uBase",s.baseColor],["uActive",s.activeColor]]) {
    const rgb=[1,3,5].map(index=>parseInt(color.slice(index,index+2),16)/255);
    gl.uniform3f(uniform(name),rgb[0],rgb[1],rgb[2]);
  }
  gl.clearColor(0,0,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  return {
    resize(g:Layout) {
      canvas.width=Math.max(1,Math.floor(g.width*g.ratio));canvas.height=Math.max(1,Math.floor(g.height*g.ratio));
      gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);gl.uniform2f(resolution,g.width,g.height);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,g.count*6*4,gl.DYNAMIC_DRAW);
    },
    draw(instances:Float32Array) {
      gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,instances);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,4,instances.length/6);gl.bindVertexArray(null);
    },
    dispose(){gl.deleteBuffer(corners);gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);}
  };
}

