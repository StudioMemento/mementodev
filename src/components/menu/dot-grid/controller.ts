import { DOT_GRID, gridLayout } from "./preset";
import { createField } from "./physics";
import { createRenderer } from "./renderer";

export interface GridController {
  setPaused(value: boolean): void;
  dispose(): void;
  stats(): { frames:number; state:string; dots:number; pixels:number; ratio:number; cpuMeanMs:number; cpuMaxMs:number };
}

/** One canvas, one scheduled frame, no layout reads during pointer events or animation. */
export function mountDotGrid(section:HTMLElement, layer:HTMLElement, initiallyPaused=false):GridController {
  const canvas=layer.querySelector("canvas")!;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let layout=gridLayout(1,1,1), field=createField(layout);
  let renderer:ReturnType<typeof createRenderer>=null;
  let disposed=false,visible=false,paused=initiallyPaused,lost=false,failed=false,touching=false;
  let frame=0,measureFrame=0,last=0,state="static",frames=0,cpuSum=0,cpuMax=0;
  let left=0,top=0,bottom=0;

  const eligible=()=>!disposed&&visible&&!document.hidden&&!paused&&!reduced.matches&&!lost&&!failed;
  const setState=(value:string)=>{ if(value!==state){state=value;layer.dataset.gridState=value;} };
  const fallback=()=>{layer.dataset.ready="false";canvas.hidden=true;};
  const prepare=()=>{
    if(renderer)return true;
    try { renderer=createRenderer(canvas); } catch { renderer=null; }
    if(!renderer){failed=true;fallback();setState("static");return false;}
    renderer.resize(layout);
    return true;
  };
  const draw=(now:number)=>{
    frame=0;
    if(!eligible())return;
    const interval=1000/(layout.width<768?DOT_GRID.mobileFps:DOT_GRID.desktopFps);
    if(last&&now-last<interval-.5){frame=requestAnimationFrame(draw);return;}
    const start=performance.now();
    if(!prepare())return;
    field.step(last?Math.min(.05,(now-last)/1000):interval/1000);last=now;
    const done=field.settled();
    if(done)field.snap();
    renderer!.draw(field.instances);
    if(layer.dataset.ready!=="true"){canvas.hidden=false;layer.dataset.ready="true";}
    const cpu=performance.now()-start;frames++;cpuSum+=cpu;cpuMax=Math.max(cpuMax,cpu);
    setState(done?"idle":"running");
    if(!done)frame=requestAnimationFrame(draw);
  };
  const wake=()=>{if(eligible()&&!frame){last=0;frame=requestAnimationFrame(draw);}};
  const sync=()=>{
    cancelAnimationFrame(frame);frame=0;last=0;touching=false;field.reset();
    if(eligible())wake();
    else {setState(reduced.matches||failed||lost?"static":"paused");if(reduced.matches||failed||lost)fallback();}
  };
  const measure=()=>{
    measureFrame=0;if(disposed)return;
    const bounds=section.getBoundingClientRect(),view=layer.getBoundingClientRect();
    left=view.left;top=bounds.top+window.scrollY;bottom=top+bounds.height;
    const next=gridLayout(Math.max(1,Math.round(view.width)),Math.max(1,Math.round(view.height)),window.devicePixelRatio);
    if(next.width!==layout.width||next.height!==layout.height||next.ratio!==layout.ratio){
      layout=next;field=createField(layout);renderer?.resize(layout);wake();
    }
  };
  const queueMeasure=()=>{if(!disposed&&!measureFrame)measureFrame=requestAnimationFrame(measure);};
  const move=(clientX:number,clientY:number,time:number)=>{
    if(!eligible())return;
    // Native sticky positioning is reconstructed from cached document bounds.
    const canvasTop=Math.max(top-window.scrollY,Math.min(0,bottom-window.scrollY-layout.height));
    field.move(clientX-left,clientY-canvasTop,time||performance.now());wake();
  };
  const leave=()=>{field.leave();wake();};
  const onPointer=(event:PointerEvent)=>{if(event.pointerType==="mouse")move(event.clientX,event.clientY,event.timeStamp);};
  const onPointerLeave=(event:PointerEvent)=>{if(event.pointerType==="mouse")leave();};
  const onTouchStart=(event:TouchEvent)=>{
    touching=event.touches.length===1&&eligible();
    if(touching){const p=event.touches[0];move(p.clientX,p.clientY,event.timeStamp);}else leave();
  };
  const onTouchMove=(event:TouchEvent)=>{
    if(!touching)return;
    if(event.touches.length!==1){touching=false;leave();return;}
    const p=event.touches[0];move(p.clientX,p.clientY,event.timeStamp);
  };
  const onTouchEnd=()=>{if(touching){touching=false;leave();}};
  const onBlur=()=>{touching=false;leave();};
  const onScroll=()=>{if(!touching&&field.pointer.inside)leave();};
  const onLost=(event:Event)=>{event.preventDefault();lost=true;renderer?.dispose();renderer=null;sync();};
  const onRestored=()=>{lost=false;failed=false;sync();};

  const resize=new ResizeObserver(queueMeasure);resize.observe(section);resize.observe(layer);
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});visibility.observe(section);
  section.addEventListener("pointermove",onPointer,{passive:true});
  section.addEventListener("pointerleave",onPointerLeave,{passive:true});
  // Passive Touch Events continue during native page scrolling after pointercancel.
  section.addEventListener("touchstart",onTouchStart,{passive:true});
  section.addEventListener("touchmove",onTouchMove,{passive:true});
  window.addEventListener("touchend",onTouchEnd,{passive:true});
  window.addEventListener("touchcancel",onTouchEnd,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",queueMeasure,{passive:true});
  window.addEventListener("blur",onBlur);
  document.addEventListener("visibilitychange",sync);
  reduced.addEventListener("change",sync);
  canvas.addEventListener("webglcontextlost",onLost);
  canvas.addEventListener("webglcontextrestored",onRestored);
  measure();
  void document.fonts.ready.then(queueMeasure);
  return {
    setPaused(value){if(paused!==value){paused=value;sync();}},
    stats:()=>({frames,state,dots:layout.count,pixels:canvas.width*canvas.height,ratio:layout.ratio,cpuMeanMs:frames?cpuSum/frames:0,cpuMaxMs:cpuMax}),
    dispose(){
      disposed=true;cancelAnimationFrame(frame);cancelAnimationFrame(measureFrame);
      resize.disconnect();visibility.disconnect();renderer?.dispose();renderer=null;
      section.removeEventListener("pointermove",onPointer);section.removeEventListener("pointerleave",onPointerLeave);
      section.removeEventListener("touchstart",onTouchStart);section.removeEventListener("touchmove",onTouchMove);
      window.removeEventListener("touchend",onTouchEnd);window.removeEventListener("touchcancel",onTouchEnd);
      window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",queueMeasure);window.removeEventListener("blur",onBlur);
      document.removeEventListener("visibilitychange",sync);reduced.removeEventListener("change",sync);
      canvas.removeEventListener("webglcontextlost",onLost);canvas.removeEventListener("webglcontextrestored",onRestored);
      canvas.width=canvas.height=1;fallback();
    },
  };
}
