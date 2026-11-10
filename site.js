import { projects } from './projects.js';
import { mountOrb, pauseOrbs } from './orb.js';
import { mountStampScroll } from './stamp-scroll.js';
import { mountStampPreviews } from './stamp-preview.js';

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const select = (selector) => document.querySelector(selector);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const skin = (project) => `--panel:${project.bg};--fg:${project.fg}`;
const mark = (project) => `<img src="assets/${project.art}" alt="" draggable="false" loading="lazy">`;



function projectPreview(index) {
  return `<span class="orb-preview" data-orb="${index}"></span>`;
}

select('#features').innerHTML = projects.slice(0, 2).map((project, index) => `
  <a class="feature" href="${project.url}" style="${skin(project)}">
    <span class="feature-visual">${projectPreview(index)}<span class="jump" aria-hidden="true">↗</span></span>
    <div class="tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
    <h3>${project.headline}</h3><p>${project.name} · ${project.description}</p>
  </a>`).join('');

select('#experiments').innerHTML = projects.slice(2).map((project, index) => `
  <a class="tile" href="${project.url}" style="${skin(project)}" aria-label="${project.name}">
    ${projectPreview(index + 2)}
  </a>`).join('');

document.querySelectorAll('[data-orb]').forEach((element) => {
  const index = Number(element.dataset.orb);
  mountOrb(element, projects[index], index);
});

let projectMotionPaused = motion.matches || Boolean(navigator.connection?.saveData);
const motionControl = document.createElement('button');
motionControl.type = 'button';
motionControl.className = 'motion-control';
select('#work').prepend(motionControl);

function updateProjectMotion() {
  pauseOrbs(projectMotionPaused);
  motionControl.setAttribute('aria-pressed', String(projectMotionPaused));
  motionControl.textContent = projectMotionPaused ? 'Play project motion' : 'Pause project motion';
}
motionControl.addEventListener('click', () => {
  projectMotionPaused = !projectMotionPaused;
  updateProjectMotion();
});
motion.addEventListener('change', () => {
  projectMotionPaused = motion.matches;
  updateProjectMotion();
});
updateProjectMotion();


const stampCategories = [
  'Cognitive research', 'Solar operations', 'Model evaluation', 'Accessible communication',
  'Agent engineering', 'Inventory systems', 'Data intelligence', 'Local companion',
  'Retrieval systems', 'Multiplayer experience', 'Space simulation', 'Workplace safety',
  'Engineering portfolio',
];
const stampTitles = [
  ['Mindscape'], ['Solar', 'Ops'], ['Praxis'], ['World', 'Speak'],
  ['Relax', 'Lemme Build'], ['Stock', 'Sense'], ['Survey', 'Intelligence'], ['NYRC'],
  ['Enterprise', 'RAG'], ['The', 'Atrium'], ['Space', 'Debris Sim'], ['Workplace', 'Safety'],
  ['Engineering', 'Portfolio'],
];
const stampColors = [
  ['#3678b3', '#e6eff8'], ['#9b6b29', '#f6ecd8'], ['#7857ad', '#eee8f7'],
  ['#b05d4c', '#f7e8e2'], ['#4d6e55', '#e7eee5'], ['#3d8067', '#e0eee7'],
  ['#396e9a', '#e6eff7'], ['#8a689f', '#eee6f3'], ['#4b7e73', '#e2eeeb'],
  ['#8b7057', '#f0e9df'], ['#4e6fa6', '#e6ebf5'], ['#ab7d38', '#f5ebd8'],
  ['#5e7479', '#e8edee'],
];

const stampOrder = [0, 4, 7, 6, 2, 3, 1, 5, 8, 9, 10, 11, 12];
select('#project-stamps').innerHTML = stampOrder.map((index, position) => {
  const project = projects[index];
  const [, paper] = stampColors[index];
  const ink = ['#fa3caf','#ff9900','#00a9ef','#7854ff','#ff9900','#16a878','#00a9ef','#00a9ef','#7955dc','#ed6575','#2077ef','#f99b00','#248a9b'][index];
  const number = String(position + 1).padStart(2, '0');
  return `<li>
    <a class="project-stamp" href="${project.url}" data-project="${index}" aria-haspopup="dialog" aria-label="Open project: ${project.name}"
      style="--stamp-ink:${ink};--stamp-paper:${paper};--stamp-angle:${[-2, 1.5, -1, 2][index % 4]}deg">
      <span class="stamp-art">
        
        <img src="assets/stamp-art-${index + 1}.svg" alt="${project.name} pictorial print" width="400" height="400" loading="lazy" decoding="async">
        
        
      </span>
      <span class="stamp-label">
        <span class="stamp-series" aria-hidden="true">PROJECT / ${number}</span>
        <span class="stamp-title">${stampTitles[index].join('<br>')}</span>
        <span class="stamp-number" aria-hidden="true">${number}</span>
      </span>
    </a>
  </li>`;
}).join('');

mountStampScroll(select('#projects'));
mountStampPreviews(select('#project-stamps'), projects);

const ring = select('#ring');
ring.innerHTML = projects.map((project) => `
  <a class="logo" href="${project.url}" style="${skin(project)}" aria-label="${project.name}" title="${project.name}">${mark(project)}</a>`).join('');
const logos = [...ring.children];
let angle = -.18;
let target = angle;
let gesture;
let suppressClick = false;
let ringVisible = false;
let skyVisible = true;
let worldVisible = false;
let lastTime = 0;
let heroProgress = 0;

function drawRing() {
  const width = ring.clientWidth;
  const height = ring.clientHeight;
  const small = width < 660;
  const gap = Math.PI * 2 / logos.length;
  logos.forEach((logo, index) => {
    const phase = angle + index * gap;
    const depth = (Math.sin(phase) + 1) / 2;
    const x = Math.cos(phase) * width * (small ? .44 : .445);
    const y = Math.sin(phase) * height * (small ? .34 : .29);
    const scale = .60 + .65 * depth;
    logo.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${scale})`;
    logo.style.opacity = String(.36 + .64 * depth);
    logo.style.filter = `blur(${(1 - depth) * 1.5}px)`;
    logo.style.zIndex = String(Math.round(depth * 10));
  });
}

const turn = (direction) => {
  target += direction * Math.PI * 2 / logos.length;
  if (motion.matches) {
    angle = target;
    drawRing();
  }
};
select('#previous').addEventListener('click', () => turn(-1));
select('#next').addEventListener('click', () => turn(1));
ring.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  turn(event.key === 'ArrowLeft' ? -1 : 1);
});
ring.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  gesture = { x: event.clientX, angle, pointer: event.pointerId };
  suppressClick = false;
});
ring.addEventListener('pointermove', (event) => {
  if (!gesture || event.pointerId !== gesture.pointer) return;
  const delta = event.clientX - gesture.x;
  if (Math.abs(delta) < 6 && !suppressClick) return;
  suppressClick = true;
  ring.setPointerCapture(event.pointerId);
  target = gesture.angle + delta / 115;
  if (motion.matches) {
    angle = target;
    drawRing();
  }
});
function endDrag() { gesture = undefined; }
ring.addEventListener('pointerup', endDrag);
ring.addEventListener('pointercancel', endDrag);
ring.addEventListener('pointerleave', () => { if (!suppressClick) endDrag(); });
ring.addEventListener('click', (event) => {
  if (suppressClick && event.detail) event.preventDefault();
  suppressClick = false;
});

const hero = select('.hero');
const heroStage = select('.hero-stage');
const heroCopy = select('.hero-copy');
const heroNext = select('.hero-next');

function updateHero() {
  const distance = Math.max(1, hero.offsetHeight - heroStage.offsetHeight);
  heroProgress = motion.matches ? 0 : clamp(-hero.getBoundingClientRect().top / distance, 0, 1);
  const contraction = heroProgress * heroProgress * (3 - 2 * heroProgress);
  const size = Math.min(innerWidth * .075, 96);
  const insetX = contraction * (1 - size / heroStage.clientWidth) * 50;
  const insetY = contraction * (1 - size / heroStage.clientHeight) * 50;
  sky.style.clipPath = `inset(${insetY - contraction * 6}% ${insetX}% ${insetY + contraction * 6}% ${insetX}%)`;
  heroCopy.style.opacity = String(1 - clamp(heroProgress / .45, 0, 1));
  heroCopy.style.transform = `translateY(${-heroProgress * 36}px) scale(${1 - heroProgress * .06})`;
  heroNext.style.opacity = String(clamp((heroProgress - .48) / .40, 0, 1));
  heroNext.style.transform = `translateY(${(1 - contraction) * 45}px)`;
}

const sky = select('#sky');
const skyContext = sky.getContext('2d');
const blue = '#49a1ed';
const pale = '#92cbf6';
const patternCanvas = document.createElement('canvas');
patternCanvas.width = patternCanvas.height = 4;
const patternContext = patternCanvas.getContext('2d');
patternContext.fillStyle = pale;
patternContext.fillRect(0, 0, 2, 2);
patternContext.fillRect(2, 2, 2, 2);
const skyDither = skyContext.createPattern(patternCanvas, 'repeat');

function drawSky(time) {
  const { width, height } = sky;
  const step = clamp(Math.round(width / 66), 10, 23);
  skyContext.fillStyle = '#ffffff';
  skyContext.fillRect(0, 0, width, height);
  const t = time * .00016;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const u = x / width;
      const v = y / height;
      const edge = Math.hypot((u - .5) * 1.68, (v - .51) * 2.7);
      const noise = Math.sin(u * 18 + v * 9 + t) * .135
        + Math.cos(u * 30 - v * 17 - t * .61) * .09
        + Math.sin(u * 67 + v * 44 + t * .28) * .055;
      const value = (edge + noise + Math.max(0, v - .75) * 1.2) * (1 - heroProgress) + (1.08 + noise * 2.4) * heroProgress;
      if (value < .94) continue;
      skyContext.fillStyle = value > 1.18 ? blue : value > 1.055 ? pale : skyDither;
      skyContext.fillRect(x, y, step, step);
    }
  }
}

const globe = select('#globe');
const context = globe.getContext('2d');
const stage = select('.world-stage');
const pin = select('#pin');
const land = new Image();
let landData;
land.onload = () => {
  const texture = document.createElement('canvas');
  texture.width = 720;
  texture.height = 360;
  const paint = texture.getContext('2d', { willReadFrequently: true });
  paint.drawImage(land, 0, 0);
  landData = paint.getImageData(0, 0, 720, 360).data;
  drawGlobe();
};
land.src = 'assets/land.svg';

const radians = Math.PI / 180;
const latitude = 13.0827 * radians;
const longitude = 80.2707 * radians;
const globeDither = context.createPattern(patternCanvas, 'repeat');
function drawGlobe() {
  const rect = stage.getBoundingClientRect();
  const progress = motion.matches || getComputedStyle(select('.world-sticky')).position !== 'sticky' ? 1 : clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
  const ease = 1 - (1 - progress) ** 3;
  const centerLon = longitude - (1 - ease) * 1.18;
  const centerLat = (.25 + .1 * (1 - ease));
  const sinLat = Math.sin(centerLat);
  const cosLat = Math.cos(centerLat);
  const center = 240;
  const radius = 229;
  context.clearRect(0, 0, 480, 480);
  for (let y = 6; y < 480; y += 10) {
    for (let x = 6; x < 480; x += 10) {
      const nx = (x + 5 - center) / radius;
      const ny = (center - y - 5) / radius;
      const rr = nx * nx + ny * ny;
      if (rr >= 1) continue;
      const z = Math.sqrt(1 - rr);
      const lat = Math.asin(ny * cosLat + z * sinLat);
      const lon = centerLon + Math.atan2(nx, z * cosLat - ny * sinLat);
      const ix = ((Math.floor(lon / radians * 2 + 360) % 720) + 720) % 720;
      const iy = clamp(Math.floor(180 - lat / radians * 2), 0, 359);
      const ground = landData && landData[(iy * 720 + ix) * 4 + 3] > 100;
      const light = nx * -.32 + ny * .28 + z * .46;
      const fleck = Math.sin(x * .093 + y * .047) * Math.cos(y * .077 - x * .028);
      context.fillStyle = ground ? (light > .26 ? '#ffffff' : '#c1e2fd')
        : (light + fleck * .36 > .46 ? pale : light + fleck * .27 > .16 ? globeDither : '#499fe8');
      context.fillRect(x, y, 10, 10);
    }
  }
  const delta = longitude - centerLon;
  const pinX = Math.cos(latitude) * Math.sin(delta);
  const pinY = cosLat * Math.sin(latitude) - sinLat * Math.cos(latitude) * Math.cos(delta);
  const facing = sinLat * Math.sin(latitude) + cosLat * Math.cos(latitude) * Math.cos(delta);
  pin.style.left = `${(center + pinX * radius) / 4.8}%`;
  pin.style.top = `${(center - pinY * radius) / 4.8}%`;
  pin.style.opacity = String(clamp(facing * 3, 0, 1));
}

function resize() {
  sky.width = heroStage.clientWidth;
  sky.height = heroStage.clientHeight;
  updateHero();
  drawSky(performance.now());
  drawGlobe();
  drawRing();
  updateHero();
}
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === sky) skyVisible = entry.isIntersecting;
    if (entry.target === stage) worldVisible = entry.isIntersecting;
    if (entry.target === ring) ringVisible = entry.isIntersecting;
  }
});
[sky, stage, ring].forEach((element) => observer.observe(element));
let lastSky = 0;
let lastScroll = -1;
function tick(time) {
  const delta = Math.min((time - lastTime) / 1000, .05);
  lastTime = time;
  if (!motion.matches) {
    if (skyVisible && time - lastSky > 100) {
      updateHero();
      drawSky(time);
      lastSky = time;
    }
    if (worldVisible && scrollY !== lastScroll) {
      drawGlobe();
      lastScroll = scrollY;
    }
    if (ringVisible) {
      if (!gesture && !ring.matches(':focus-within')) target += delta * .085;
      angle += (target - angle) * .13;
      drawRing();
    }
  }
  requestAnimationFrame(tick);
}
motion.addEventListener('change', resize);
addEventListener('resize', resize);
resize();
requestAnimationFrame(tick);

const clock = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const updateClock = () => { select('#local-time').textContent = clock.format(new Date()); };
updateClock();
setInterval(updateClock, 10000);

// Only inspect links that point to real sections on this page.
const sectionLinks = [...document.querySelectorAll('.header nav a')].flatMap((link) => {
  const url = new URL(link.href);
  if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return [];
  const section = url.hash === '#home' ? document.querySelector('.hero') : document.getElementById(url.hash.slice(1));
  return section ? [{ link, section }] : [];
});
function updateNavigation() {
  const marker = innerHeight * .36;
  const current = sectionLinks.find(({ section }) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= marker && rect.bottom > marker;
  })?.link;
  sectionLinks.forEach(({ link }) => {
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
addEventListener('scroll', () => { updateNavigation(); updateHero(); }, { passive: true });
addEventListener('resize', updateNavigation);
updateNavigation();
