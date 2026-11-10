// A cursor-controlled blueprint lens, clipped to the footer lettering.
function mountBlueprintSignature() {
  const host = document.querySelector('.footer .signature');
  if (!host) return;
  const style = document.createElement('style');
  style.textContent = `
    .signature.blueprint-signature{position:relative;isolation:isolate;height:clamp(180px,28vw,350px);padding:0;background:none;-webkit-text-fill-color:initial;outline-offset:6px;touch-action:pan-y}
    .blueprint-signature .blueprint-word{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
    .blueprint-word>span{background:repeating-linear-gradient(135deg,var(--blue) 0 1px,#8dc8f5 1px 3px,transparent 3px 5px);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
    .blueprint-signature canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 280ms ease}
    .blueprint-signature[data-revealed="true"] canvas{opacity:1}
    @media(prefers-reduced-motion:reduce){.blueprint-signature canvas{transition:none}}
  `;
  document.head.append(style);
  host.removeAttribute('aria-hidden');
  host.classList.add('blueprint-signature');
  host.tabIndex = 0;
  host.setAttribute('role','img');
  host.setAttribute('aria-label','Akilan. Move over my name to reveal a blueprint of circuits, orbits, and code.');
  host.dataset.revealed = 'false';
  host.innerHTML = '<span class="blueprint-word" aria-hidden="true"><span>Akilan<i class="blueprint-baseline" style="display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline"></i></span></span><canvas aria-hidden="true"></canvas>';
  const canvas = host.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const texture = document.createElement('canvas');
  const ink = texture.getContext('2d');
  const mask = document.createElement('canvas');
  const letters = mask.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,ratio=1,radius=100,frame=0,active=false,hovered=false,focused=false,tapped=false;
  let x=0,y=0,targetX=0,targetY=0;
  function resize() {
    width=host.clientWidth; height=host.clientHeight;
    ratio=Math.min(devicePixelRatio||1,2);
    for(const layer of [canvas,texture,mask]) { layer.width=Math.round(width*ratio); layer.height=Math.round(height*ratio); }
    for(const context of [ctx,ink,letters]) context.setTransform(ratio,0,0,ratio,0,0);
    radius=Math.min(112,width*.23);
    x=targetX=width*.5; y=targetY=height*.5;
    const text=host.querySelector('.blueprint-word>span');
    const font=getComputedStyle(text);
    const box=text.getBoundingClientRect();
    const bounds=host.getBoundingClientRect();
    letters.clearRect(0,0,width,height);
    letters.font=`${font.fontStyle} ${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    letters.textBaseline='alphabetic';
    const size=parseFloat(font.fontSize);
    const baseline=host.querySelector('.blueprint-baseline').getBoundingClientRect().top-bounds.top;
    let left=box.left-bounds.left;
    const spacing=parseFloat(font.letterSpacing)||0;
    if ('letterSpacing' in letters) { letters.letterSpacing=font.letterSpacing; letters.fillText('Akilan',left,baseline); }
    else for(const letter of 'Akilan') { letters.fillText(letter,left,baseline); left+=letters.measureText(letter).width+spacing; }
    drawTexture(); wake();
  }
  function drawTexture() {
    ink.clearRect(0,0,width,height);
    ink.fillStyle='#dff2ff'; ink.fillRect(0,0,width,height);
    ink.strokeStyle='#599adf33'; ink.lineWidth=.65;
    ink.beginPath();
    for(let i=0;i<width;i+=16){ink.moveTo(i,0);ink.lineTo(i,height);}
    for(let i=0;i<height;i+=16){ink.moveTo(0,i);ink.lineTo(width,i);}
    ink.stroke();
    ink.strokeStyle='#1766a7'; ink.lineWidth=1.3;
    for(let i=0;i<12;i++){
      const px=20+i*97, py=height*.28+(i%4)*24;
      ink.beginPath();ink.moveTo(px,py);ink.lineTo(px+26,py);ink.lineTo(px+44,py+18);ink.lineTo(px+44,py+63);ink.lineTo(px+81,py+63);ink.stroke();
      for(const [cx,cy] of [[px,py],[px+81,py+63]]){ink.beginPath();ink.arc(cx,cy,2.4,0,Math.PI*2);ink.fillStyle='#dff2ff';ink.fill();ink.stroke();}
    }
    for(const [cx,cy] of [[width*.3,height*.6],[width*.72,height*.45]]){
      ink.save();ink.translate(cx,cy);ink.strokeStyle='#245f99';ink.lineWidth=1;
      for(let i=0;i<3;i++){ink.beginPath();ink.ellipse(0,0,55+i*15,21+i*6,-.55+i*.48,0,Math.PI*2);ink.stroke();}
      ink.beginPath();ink.arc(0,0,3,0,Math.PI*2);ink.fillStyle='#1766a7';ink.fill();ink.restore();
    }
    ink.font='10px ui-monospace, SFMono-Regular, Consolas, monospace';ink.fillStyle='#134e80';
    const snippets=['state → step → verify','f(x) = Σ wᵢxᵢ','observe(); build();','replay(trace)','while (curious) build();'];
    for(let i=0;i<9;i++) ink.fillText(snippets[i%snippets.length],12+i*131,height*.28+(i%3)*49);
    ink.globalCompositeOperation='destination-in';ink.drawImage(mask,0,0,width,height);ink.globalCompositeOperation='source-over';
  }
  function draw() {
    frame=0;
    const ease=reduced.matches?1:.2;
    x+=(targetX-x)*ease; y+=(targetY-y)*ease;
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.clip();
    ctx.drawImage(texture,0,0,width,height);
    ctx.restore();
    if(active&&!reduced.matches&&(Math.abs(targetX-x)>.15||Math.abs(targetY-y)>.15)) wake();
  }
  function wake(){if(!frame)frame=requestAnimationFrame(draw);}
  function update(){active=hovered||focused||tapped;host.dataset.revealed=String(active);if(active)wake();}
  function point(event){const box=host.getBoundingClientRect();targetX=Math.max(0,Math.min(width,event.clientX-box.left));targetY=Math.max(0,Math.min(height,event.clientY-box.top));wake();}
  host.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;point(event);update();}});
  host.addEventListener('pointermove',event=>{if(event.pointerType!=='touch'||tapped)point(event);});
  host.addEventListener('pointerleave',()=>{hovered=false;update();});
  host.addEventListener('focus',()=>{focused=host.matches(':focus-visible');targetX=width*.5;targetY=height*.5;update();});
  host.addEventListener('blur',()=>{focused=tapped=false;update();});
  host.addEventListener('click',event=>{if(event.pointerType==='touch'||!matchMedia('(hover:hover)').matches){tapped=!tapped;point(event);update();}});
  host.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();hovered=focused=tapped=false;update();}
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();focused=true;targetX=Math.max(0,Math.min(width,targetX+(event.key==='ArrowLeft'?-32:event.key==='ArrowRight'?32:0)));targetY=Math.max(0,Math.min(height,targetY+(event.key==='ArrowUp'?-24:event.key==='ArrowDown'?24:0)));update();wake();}
    if(['Enter',' '].includes(event.key)){event.preventDefault();tapped=!tapped;focused=tapped;update();}
  });
  new ResizeObserver(resize).observe(host);
  document.fonts.ready.then(resize);
  reduced.addEventListener('change',wake);
  resize();
}
if(document.readyState==='complete')mountBlueprintSignature();
else document.addEventListener('DOMContentLoaded',mountBlueprintSignature,{once:true});

function mountFooterName() {
  const heading = document.querySelector('#contact .footer-top h2');
  if (!heading || heading.textContent.trim() !== 'Akilan P L') return;
  const style = document.createElement('style');
  style.textContent = `
    .footer-name-toggle{display:inline-flex;align-items:baseline;position:relative;vertical-align:baseline;border:0;padding:0;background:none;color:inherit;font:inherit;letter-spacing:inherit;white-space:nowrap;width:var(--short);transition:width 430ms cubic-bezier(.22,1,.36,1)}
    .footer-name-toggle .name-short,.footer-name-toggle .name-long{transition:opacity 220ms ease,transform 430ms cubic-bezier(.22,1,.36,1)}
    .footer-name-toggle .name-long{position:absolute;left:0;top:50%;font-size:.60em;transform:translate(-8px,-50%) scaleX(.82);transform-origin:left;opacity:0}
    .footer-name-toggle:is(:focus-visible,[aria-pressed="true"]){width:var(--long)}
    .footer-name-toggle:is(:focus-visible,[aria-pressed="true"]) .name-short{opacity:0;transform:translateX(8px)}
    .footer-name-toggle:is(:focus-visible,[aria-pressed="true"]) .name-long{opacity:1;transform:translate(0,-50%) scaleX(1)}
    @media(hover:hover){.footer-name-toggle:hover{width:var(--long)}.footer-name-toggle:hover .name-short{opacity:0;transform:translateX(8px)}.footer-name-toggle:hover .name-long{opacity:1;transform:translate(0,-50%) scaleX(1)}}
    @media(max-width:380px){.footer-name-toggle .name-long{font-size:.46em}}
    @media(prefers-reduced-motion:reduce){.footer-name-toggle,.footer-name-toggle span{transition:none!important}}
  `;
  document.head.append(style);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'footer-name-toggle';
  button.setAttribute('aria-label', 'Palaniyappan');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span class="name-short" aria-hidden="true">P L</span><span class="name-long" aria-hidden="true">PALANIYAPPAN</span>';
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') === 'false'));
  });
  heading.replaceChildren('Akilan ', button);
  const measure = () => {
    button.style.setProperty('--short', button.querySelector('.name-short').offsetWidth + 'px');
    button.style.setProperty('--long', button.querySelector('.name-long').offsetWidth + 'px');
  };
  measure();
  document.fonts.ready.then(measure);
  new ResizeObserver(measure).observe(heading);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountFooterName, { once: true });
} else {
  mountFooterName();
}
