/** Adapted from React Bits DotGrid by David Haz (blob 47c3c28ae805d84a83e663030f4187185196d0fb).
 * MIT + Commons Clause: licenses/ReactBits.txt. Shock/intro paths are removed for this preset. */
import { DOT_GRID as s, type gridLayout } from "./preset";
export type Layout = ReturnType<typeof gridLayout>;
const smootherstep = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x*x*x*(x*(x*6-15)+10); };

export function createField(g: Layout) {
  const rest = new Float32Array(g.count*2), offset = new Float32Array(g.count*2);
  const velocity = new Float32Array(g.count*2), force = new Float32Array(g.count*2), next = new Float32Array(g.count*2);
  const instances = new Float32Array(g.count*6);
  const pointer = { x:0, y:0, vx:0, vy:0, time:0, inside:false, presence:0 };
  const zeta=1-.85*s.bounce, omega=4/(zeta*s.returnDuration), stiffness=omega*omega, damping=2*zeta*omega;
  const coupling=(s.tension*900)**2/(g.cell*g.cell), viscosity=Math.sqrt(coupling)*.06;
  const maxStep=Math.min(1/120,1.2/(Math.sqrt(stiffness+8*coupling)+damping+8*viscosity));
  for(let row=0;row<g.rows;row++)for(let col=0;col<g.cols;col++) {
    const i=(row*g.cols+col)*2; rest[i]=g.startX+col*g.cell; rest[i+1]=g.startY+row*g.cell;
  }
  function pack() {
    for(let i=0;i<g.count;i++) {
      const k=i*2, t=i*6, x=rest[k]+offset[k], y=rest[k+1]+offset[k+1];
      let energy=Math.min(1,Math.hypot(velocity[k],velocity[k+1])/380*.85+Math.hypot(offset[k],offset[k+1])/(g.cell*2.2)*.35);
      if(pointer.presence>.001) energy=Math.max(energy,smootherstep(1-Math.hypot(x-pointer.x,y-pointer.y)/s.proximity)*.4*pointer.presence);
      instances[t]=x; instances[t+1]=y; instances[t+2]=velocity[k]; instances[t+3]=velocity[k+1]; instances[t+4]=energy; instances[t+5]=1;
    }
  }
  function move(x:number,y:number,time:number) {
    const inside=x>=0&&y>=0&&x<=g.width&&y<=g.height;
    if(inside&&pointer.inside&&pointer.time) {
      const elapsed=Math.max(4,time-pointer.time)/1000;
      pointer.vx+=((x-pointer.x)/elapsed-pointer.vx)*.6;
      pointer.vy+=((y-pointer.y)/elapsed-pointer.vy)*.6;
    } else pointer.vx=pointer.vy=0;
    pointer.x=x;pointer.y=y;pointer.time=time;pointer.inside=inside;
  }
  function leave() { pointer.inside=false;pointer.time=0; }
  function step(dt:number) {
    dt=Math.min(.05,Math.max(0,dt));
    const speed=Math.hypot(pointer.vx,pointer.vy), drive=pointer.inside?6500*Math.tanh(speed/900)*s.strength:0;
    const dirX=speed>.001?pointer.vx/speed:0, dirY=speed>.001?pointer.vy/speed:0;
    for(let i=0;i<g.count;i++) {
      const k=i*2; let ax=0,ay=0;
      if(drive>0) {
        const ex=rest[k]+offset[k]-pointer.x,ey=rest[k+1]+offset[k+1]-pointer.y,d=Math.hypot(ex,ey);
        if(d<s.proximity) { const weight=smootherstep(1-d/s.proximity)*drive;
          ax=weight*(dirX+(d>.001?ex/d:0)*.6);ay=weight*(dirY+(d>.001?ey/d:0)*.6); }
      }
      force[k]=ax;force[k+1]=ay;
    }
    const steps=Math.max(1,Math.ceil(dt/maxStep)),h=dt/steps,stride=g.cols*2;
    for(let n=0;n<steps;n++) {
      for(let row=0;row<g.rows;row++)for(let col=0;col<g.cols;col++) {
        const k=(row*g.cols+col)*2;
        let lx=-4*offset[k],ly=-4*offset[k+1],mx=-4*velocity[k],my=-4*velocity[k+1];
        if(col>0){lx+=offset[k-2];ly+=offset[k-1];mx+=velocity[k-2];my+=velocity[k-1];}
        if(col<g.cols-1){lx+=offset[k+2];ly+=offset[k+3];mx+=velocity[k+2];my+=velocity[k+3];}
        if(row>0){lx+=offset[k-stride];ly+=offset[k-stride+1];mx+=velocity[k-stride];my+=velocity[k-stride+1];}
        if(row<g.rows-1){lx+=offset[k+stride];ly+=offset[k+stride+1];mx+=velocity[k+stride];my+=velocity[k+stride+1];}
        next[k]=velocity[k]+(force[k]-stiffness*offset[k]-damping*velocity[k]+coupling*lx+viscosity*mx)*h;
        next[k+1]=velocity[k+1]+(force[k+1]-stiffness*offset[k+1]-damping*velocity[k+1]+coupling*ly+viscosity*my)*h;
      }
      for(let k=0;k<offset.length;k++){velocity[k]=next[k];offset[k]+=velocity[k]*h;}
    }
    const decay=Math.exp(-dt/.08);pointer.vx*=decay;pointer.vy*=decay;
    pointer.presence+=((pointer.inside?1:0)-pointer.presence)*(1-Math.exp(-dt/.2));
    pack();
  }
  function settled() {
    if(Math.abs(pointer.vx)+Math.abs(pointer.vy)>1||Math.abs((pointer.inside?1:0)-pointer.presence)>.002)return false;
    for(let k=0;k<offset.length;k++)if(Math.abs(offset[k])>.02||Math.abs(velocity[k])>.5)return false;
    return true;
  }
  function snap() { offset.fill(0);velocity.fill(0);pointer.vx=pointer.vy=0;pointer.presence=pointer.inside?1:0;pack(); }
  function reset() { leave();snap(); }
  pack();
  return { instances,pointer,move,leave,step,settled,snap,reset };
}
