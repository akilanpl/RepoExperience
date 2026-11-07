import { MODE_FRAMES, paintFrame, resolvePreset } from './vendor/thinking-orbs/engine.es.js';
export function mountThinkingIndicator(canvas){
  const context=canvas.getContext?.('2d');if(!context)return ()=>{};
  const size=88,scale=Math.min(devicePixelRatio||1,2),preset=resolvePreset('solving',64);
  canvas.width=canvas.height=Math.round(size*scale);context.scale(scale,scale);
  let frame,stopped=false,last=0;const start=performance.now();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(now){if(stopped)return;if(!document.hidden&&now-last>1000/30){context.clearRect(0,0,size,size);context.save();context.translate(8,8);paintFrame(context,MODE_FRAMES[preset.mode](72,reduced?0:(now-start)/1000*preset.speed,preset.opts),false);context.restore();last=now;}if(!reduced)frame=requestAnimationFrame(draw);}
  draw(start+40);return ()=>{stopped=true;cancelAnimationFrame(frame);};
}
