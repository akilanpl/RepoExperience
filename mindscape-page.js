import { mountMindscapeExperience } from './mindscape-experience.js';
const host=document.querySelector('#experience-host');
const experience=mountMindscapeExperience(host);experience.show(true);
const playground=host.querySelector('.mindscape-experience');playground.id='playground';playground.dataset.readingSection='Try the foundation';
const process=host.querySelector('.experience-process');process.id='execution';process.dataset.readingSection='Inside the execution';
const comparison=host.querySelector('.mindscape-comparison');comparison.id='comparison';comparison.dataset.readingSection='How it differs';
let cameFromPortfolio=false;
try{const entry=JSON.parse(sessionStorage.getItem('akilan:mindscape:entry')||'null');sessionStorage.removeItem('akilan:mindscape:entry');cameFromPortfolio=Boolean(entry&&Date.now()-entry.at<30000&&new URL(document.referrer||location.href).origin===location.origin);if(cameFromPortfolio)history.replaceState({...history.state,mindscapeFromPortfolio:true},'');}catch{}
const close=document.querySelector('.article-close');
function goBack(event){if(event&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return;if(history.state?.mindscapeFromPortfolio){event?.preventDefault();history.back();}}
close.addEventListener('click',goBack);
document.querySelector('.article-stamp').addEventListener('click',goBack);
document.querySelector('.article-return').addEventListener('click',goBack);
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.defaultPrevented&&!event.target.closest('input,textarea,select,button')){if(history.state?.mindscapeFromPortfolio)history.back();else location.assign(close.href);}});
const navigation=document.querySelector('.article-navigation'),rail=document.querySelector('.reading-rail'),mobile=document.querySelector('.reading-mobile'),select=mobile.querySelector('select');
let last=scrollY,raf,sections=[],scrollTimer;
function buildRail(){
  sections=[...document.querySelectorAll('[data-reading-section]')].filter(el=>!el.hidden);
  rail.replaceChildren();select.replaceChildren();
  for(const section of sections){const a=document.createElement('a');a.href=`experience/mindscape/#${section.id}`;a.innerHTML='<i aria-hidden="true"></i><span></span>';a.querySelector('span').textContent=section.dataset.readingSection;a.addEventListener('click',e=>{e.preventDefault();section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});rail.append(a);const option=document.createElement('option');option.value=section.id;option.textContent=section.dataset.readingSection;select.append(option);}paint();
}
function paint(){raf=undefined;const y=scrollY,view=innerHeight,total=document.documentElement.scrollHeight-view,anchor=y+view*.35;navigation.classList.toggle('away',y>last+5&&y>24);if(Math.abs(y-last)>5)last=y;
  let active=0;sections.forEach((section,index)=>{if(section.getBoundingClientRect().top+y<=anchor)active=index;});
  [...rail.children].forEach((a,index)=>{const top=sections[index].getBoundingClientRect().top+y,end=sections[index+1]?.getBoundingClientRect().top+y||document.querySelector('.article-footer').offsetTop;const fill=index<active?1:index>active?0:Math.max(0,Math.min(1,(anchor-top)/Math.max(1,end-top)));a.style.setProperty('--fill',fill);if(index===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  select.value=sections[active]?.id||'';mobile.querySelector('.reading-percent').textContent=`${Math.round(Math.max(0,Math.min(1,y/Math.max(1,total)))*100)}%`;
  const shown=y>220&&document.querySelector('.article-footer').getBoundingClientRect().top>view*.4;rail.classList.toggle('shown',shown);mobile.classList.toggle('shown',shown);
}
select.addEventListener('change',()=>document.getElementById(select.value)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
addEventListener('scroll',()=>{rail.classList.add('scrolling');clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>rail.classList.remove('scrolling'),400);if(!raf)raf=requestAnimationFrame(paint);},{passive:true});addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(paint);});
new MutationObserver(buildRail).observe(process,{attributes:true,attributeFilter:['hidden']});
buildRail();
