import { experiences } from './project-experiences.js';
// Full-viewport pictorial expansion, with the stamp travelling from its source.
export function mountStampPreviews(rail, projects) {
  const dialog=document.createElement('dialog');
  dialog.className='stamp-dialog';dialog.setAttribute('aria-labelledby','stamp-preview-title');
  dialog.innerHTML='<canvas class="stamp-pixels" aria-hidden="true"></canvas><div class="stamp-expanded-scroll"><div class="stamp-expanded-sheet"><div class="stamp-expanded-art"><img alt=""></div><article class="stamp-expanded-copy"><p class="preview-eyebrow"></p><h3 id="stamp-preview-title"></h3><p class="preview-description"></p><a class="preview-pills"><span>Explore project</span><span aria-hidden="true">↗</span></a></article></div></div><button class="stamp-close" aria-label="Close project preview">×</button>';
  document.body.append(dialog);
  const experienceLink=dialog.querySelector('.preview-pills');
  experienceLink.addEventListener('click',event=>{
    if(!source||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    image.style.viewTransitionName='mindscape-stamp';
    try{sessionStorage.setItem('akilan:mindscape:entry',JSON.stringify({at:Date.now()}));sessionStorage.setItem('akilan:mindscape:return',JSON.stringify({at:Date.now(),y:scrollY,project:Number(source.dataset.project)}));}catch{}
  });
  const art=dialog.querySelector('.stamp-expanded-art'),image=art.querySelector('img'),canvas=dialog.querySelector('canvas');
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let source,busy=false,oldOverflow,frame,original,origin;
  const ease=t=>1-Math.pow(1-t,4);
  function transform(){const b=art.getBoundingClientRect();return `translate(${origin.left+origin.width/2-b.left-b.width/2}px,${origin.top+origin.height/2-b.top-b.height/2}px) scale(${origin.width/b.width}) rotate(${source.style.getPropertyValue('--stamp-angle')||'0deg'})`;}
  let pixelPainter, driftFrame, driftStart=0;
  function stopDrift(){cancelAnimationFrame(driftFrame);driftFrame=undefined;}
  function startDrift(){
    stopDrift(); if(reduced())return;
    driftStart=performance.now();let last=-1;
    const tick=now=>{
      if(!dialog.open||dialog.dataset.phase==='closing')return;
      const step=Math.floor((now-driftStart)/180);
      if(!document.hidden&&step!==last){pixelPainter?.(1,step);last=step;}
      driftFrame=requestAnimationFrame(tick);
    };
    driftFrame=requestAnimationFrame(tick);
  }
  async function pixels(from,to,duration){
    stopDrift();cancelAnimationFrame(frame);const ctx=canvas.getContext('2d');
    const cols=Math.ceil(innerWidth/24),rows=Math.ceil(innerHeight/24);canvas.width=cols*8;canvas.height=rows*8;
    const temp=document.createElement('canvas');temp.width=cols;temp.height=rows;temp.getContext('2d').drawImage(image,0,0,cols,rows);const data=temp.getContext('2d').getImageData(0,0,cols,rows).data;
    // The picture is the field: cloud rows drift, ground rows move more slowly.
    // Checker cells preserve the reference's ordered dither at full-screen scale.
    const patternCanvas=document.createElement('canvas');patternCanvas.width=patternCanvas.height=2;
    const pc=patternCanvas.getContext('2d');pc.fillStyle='#fff';pc.fillRect(0,0,2,2);pc.clearRect(0,0,1,1);pc.clearRect(1,1,1,1);
    const checker=ctx.createPattern(patternCanvas,'repeat');
    pixelPainter=(progress,step=0)=>{
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const n=Math.abs((Math.sin(x*12.9898+y*78.233)*43758.5453)%1);if(n>progress)continue;
        const band=Math.floor(y/4),shift=y<rows*.6?Math.floor(step/2)+band%3:Math.floor(step/5);
        const sx=((x+shift)%cols+cols)%cols,i=(y*cols+sx)*4;
        ctx.fillStyle=`rgb(${data[i]} ${data[i+1]} ${data[i+2]})`;ctx.fillRect(x*8,y*8,8,8);
        const light=(data[i]+data[i+1]+data[i+2])/3;
        if(light>=247){ctx.globalAlpha=.13;ctx.fillStyle=source.style.getPropertyValue('--stamp-ink');ctx.fillRect(x*8,y*8,8,8);ctx.globalAlpha=1;}
        if(light>175){ctx.fillStyle=checker;ctx.fillRect(x*8,y*8,8,8);}
      }
    };
    const start=performance.now();return new Promise(resolve=>{function draw(now){const t=reduced()?1:Math.min(1,(now-start)/duration),p=from+(to-from)*Math.ceil(ease(t)*12)/12;pixelPainter(p);
      if(t<1)frame=requestAnimationFrame(draw);else resolve();}frame=requestAnimationFrame(draw);});
  }
  async function close(){if(busy||!dialog.open)return;busy=true;dialog.dataset.phase='closing';
    await Promise.all([art.animate([{transform:'none'},{transform:transform()}],{duration:reduced()?0:300,easing:'cubic-bezier(.23,1,.32,1)',fill:'forwards'}).finished,pixels(1,0,300)]);
    image.style.viewTransitionName='';
    dialog.close();art.getAnimations().forEach(a=>a.cancel());source.style.visibility=original;document.documentElement.style.overflow=oldOverflow;source.focus({preventScroll:true});busy=false;
  }
  rail.addEventListener('click',async event=>{const card=event.target.closest('.project-stamp');if(!card||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();if(busy||dialog.open)return;busy=true;source=card;
    const project=projects[Number(card.dataset.project)];origin=card.querySelector('.stamp-art').getBoundingClientRect();original=card.style.visibility;
    const isMindscape=Number(card.dataset.project)===0;
    experienceLink.querySelector('span').textContent=project.name==='Praxis'?'Read project note':'Experience the live';
    dialog.querySelector('.stamp-expanded-scroll').scrollTop=0;
    image.style.viewTransitionName='';
    image.src=card.querySelector('img').src;image.alt=project.name+' pictorial postcard';await image.decode();
    dialog.querySelector('h3').textContent=project.name;dialog.querySelector('.preview-eyebrow').textContent=project.tags.join(' / ');dialog.querySelector('.preview-description').textContent=isMindscape?'Mindscape studies reasoning as explicit state changes. It records observations, actions, and outcomes so an evaluator can replay how an answer was produced.':project.description;experienceLink.href=isMindscape?'experience/mindscape/':`experience/${experiences.find(e=>e.index===Number(card.dataset.project)).slug}/`;
    oldOverflow=document.documentElement.style.overflow;dialog.dataset.phase='start';dialog.showModal();document.documentElement.style.overflow='hidden';card.style.visibility='hidden';
    dialog.querySelector('.stamp-close').focus({preventScroll:true});
    const from=transform();dialog.dataset.phase='opening';
    await Promise.all([art.animate([{transform:from},{transform:'none'}],{duration:reduced()?0:800,easing:'cubic-bezier(.23,1,.32,1)'}).finished,pixels(0,1,720)]);
    dialog.dataset.phase='open';busy=false;startDrift();
  });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(reduced()){stopDrift();pixelPainter?.(1);}else if(dialog.open&&!busy)startDrift();});
  window.addEventListener('resize',()=>{if(dialog.open&&!busy)pixels(1,1,0).then(startDrift);});
  dialog.querySelector('.stamp-close').addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.querySelector('.stamp-expanded-scroll').addEventListener('click',e=>{if(e.target.classList.contains('stamp-expanded-scroll')||e.target.classList.contains('stamp-expanded-sheet'))close();});
  async function restorePostcard(event){
    let state;try{state=JSON.parse(sessionStorage.getItem('akilan:mindscape:return')||'null');sessionStorage.removeItem('akilan:mindscape:return');}catch{}
    if(!state||Date.now()-state.at>1800000)return;
    image.style.viewTransitionName='';
    if(event?.persisted&&dialog.open){startDrift();return;}
    await document.fonts.ready;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:state.y,behavior:'instant'});if(!dialog.open)rail.querySelector(`[data-project="${state.project}"]`)?.click();}));
  }
  window.addEventListener('pageshow',restorePostcard);
  // Module scripts can finish after the initial pageshow on a history reload.
  if(document.readyState==='complete')restorePostcard();
  art.addEventListener('pointermove',e=>{if(reduced()||busy)return;const b=art.getBoundingClientRect();image.style.transform=`rotateX(${-(e.clientY-b.top-b.height/2)/b.height*12}deg) rotateY(${(e.clientX-b.left-b.width/2)/b.width*12}deg)`;});art.addEventListener('pointerleave',()=>image.style.transform='');
}
