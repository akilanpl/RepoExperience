import './analytics.js';

const groups = {
  focus: [
    ['Research', 'Reasoning, retrieval, and evaluation that expose the evidence behind an outcome.',1],
    ['Systems', 'Records, permissions, and state transitions that keep a workflow coherent.',6],
    ['Interfaces', 'Product experiences that let people see and try the underlying work.',8],
  ],
  projects: [
    ['Mindscape', 'Research into explicit reasoning states and replayable experiments.',1],
    ['Relax Lemme Build', 'An engineering runtime with plan review and recoverable publication.',5],
    ['SolarOps', 'An installation workflow connecting customers, sales, field teams, and inventory.',2],
    ['WorldSpeak', 'English and Tamil communication with deliberate speech approval.',4],
  ],
  tools: [
    ['Python', 'Research experiments, simulation, and backend services.',11],
    ['TypeScript & React', 'Interactive frontends, local tools, and product workflows.',5],
    ['Data & retrieval', 'PostgreSQL, SQLite, Qdrant, and evidence-oriented services.',9],
    ['Three.js', 'Spatial interfaces and interactive worlds.',10],
  ],
};
const answers = {
  approach: 'I start with what the person needs to do, then work through the state, data, and failure cases behind it. The interaction and implementation need to tell the same story.',
  research: 'Mindscape studies reasoning through explicit state changes. Its experiments retain observations, actions, and outcomes so the path to an answer can be inspected.',
  now: 'My collection spans Mindscape, RLB, NYRC, WorldSpeak, and operational tools including SolarOps and StockSense. The project pages include working previews and implementation details.',
};
const tabs = [...document.querySelectorAll('[role=tab]')];
const panel = document.querySelector('#work-panel');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function selectTab(tab) {
  for (const item of tabs) {
    item.setAttribute('aria-selected',String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  }
  panel.setAttribute('aria-labelledby',tab.id);
  const list = document.createElement('div');
  list.className = 'panel-list';
  for (const [name,description,art] of groups[tab.dataset.tab]) {
    const row = document.createElement('div');
    row.className = 'panel-row';
    row.style.setProperty('--row',list.children.length);
    const image = document.createElement('img');
    image.src = 'assets/project-'+art+'.svg';
    image.alt = '';
    const body = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = name;
    const text = document.createElement('p');
    text.textContent = description;
    body.append(title,text);
    row.append(image,body);
    list.append(row);
  }
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden','true');
  copy.classList.add('panel-clone');
  for(const row of copy.children) row.classList.add('panel-clone');
  panel.replaceChildren(list,copy);
  reelOffset = 0;
  panel.scrollTop = 0;
}
for (const [index,tab] of tabs.entries()) {
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',event=>{
    const movement = {ArrowRight:1,ArrowLeft:-1};
    let next;
    if (event.key === 'Home') next=0;
    else if (event.key === 'End') next=tabs.length-1;
    else if (event.key in movement) next=(index+movement[event.key]+tabs.length)%tabs.length;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
}
let reelOffset=0;
selectTab(tabs[0]);
for (const question of document.querySelectorAll('[data-question]')) {
  question.addEventListener('click',()=>{
    for (const item of document.querySelectorAll('[data-question]')) item.setAttribute('aria-pressed',String(item === question));
    const answer = document.querySelector('.question-answer');
    answer.hidden = false;
    answer.textContent = answers[question.dataset.question];
  });
}
document.querySelector('#copy-email').addEventListener('click',async()=>{
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('akilanpalaniyappan105@gmail.com');
    status.textContent = 'Email copied.';
  } catch { status.textContent = 'akilanpalaniyappan105@gmail.com'; }
});
const cards = [...document.querySelectorAll('.visual-card')];
const gitStage = document.querySelector('.git-stage');
const gitSvg = gitStage.querySelector('svg');
const header = document.querySelector('.header');
let previous = scrollY;
function updateScroll() {
  const current = scrollY;
  // The reference keeps its navigation available as the grid moves below it.
  header.classList.remove('away');
  previous = current;
  for (const [index,card] of cards.entries()) {
    const rect=card.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.8)));
    const spread=reduced.matches ? 0 : (1-progress);
    const column=innerWidth<=520 ? 0 : index%(innerWidth<=850 ? 2 : 3);
    card.style.setProperty('--spread-x',(column-1)*spread*65+'px');
    card.style.setProperty('--spread-y',spread*(22+column*18)+'px');
  }
  const bounds=gitStage.getBoundingClientRect();
  const progress=Math.max(0,Math.min(1,(innerHeight-bounds.top)/(innerHeight*.85)));
  gitSvg.style.setProperty('--git-y',(1-progress)*150+'px');
  gitSvg.style.setProperty('--git-scale',.82+progress*.18);
}
let scrollFrame;
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{updateScroll();scrollFrame=undefined;});},{passive:true});
addEventListener('resize',updateScroll);
updateScroll();

let lastReelTime,drag;
function animateReel(now) {
  const dt=lastReelTime ? Math.min(now-lastReelTime,80)/1000 : 0;
  lastReelTime=now;
  const height=panel.firstElementChild?.offsetHeight || 0;
  if(!document.hidden && !reduced.matches && !drag && !panel.matches(':focus-within') && height>panel.clientHeight) {
    reelOffset=(reelOffset+dt*(panel.matches(':hover') ? 5 : 18))%height;
    panel.scrollTop=reelOffset;
  }
  requestAnimationFrame(animateReel);
}
panel.addEventListener('scroll',()=>{
  const height=panel.firstElementChild?.offsetHeight || 0;
  reelOffset=panel.scrollTop;
  if(height && reelOffset>=height) panel.scrollTop=reelOffset-=height;
},{passive:true});
panel.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0) return;
  drag={y:event.clientY,top:panel.scrollTop};
  panel.setPointerCapture(event.pointerId);
});
panel.addEventListener('pointermove',event=>{
  if(drag) panel.scrollTop=drag.top+drag.y-event.clientY;
});
for(const name of ['pointerup','pointercancel','lostpointercapture']) panel.addEventListener(name,()=>{drag=undefined;});
requestAnimationFrame(animateReel);

const askForm=document.querySelector('.ask-form');
askForm.addEventListener('submit',event=>{
  event.preventDefault();
  const query=askForm.querySelector('input').value.trim().toLowerCase();
  if(!query)return;
  const key=/mindscape|research|reason/.test(query) ? 'research' : /now|project|work/.test(query) ? 'now' : 'approach';
  const output=document.querySelector('.question-answer');
  output.hidden=false;
  output.textContent=answers[key];
});
const clock = document.querySelector('#chennai-time');
function updateClock() {clock.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date());}
updateClock();
setInterval(updateClock,60000);
