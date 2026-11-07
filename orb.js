import { MODE_FRAMES, paintFrame, resolvePreset } from './vendor/thinking-orbs/engine.es.js';
import { logoTargets } from './logo-targets.js';
import { morphFrame } from './particle-morph.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const orbs = new Set();
let animationFrame;
let paused = false;
let lastPaint = 0;
let previousTime;

const states = [
  'searching', 'working', 'solving', 'listening', 'composing', 'shaping',
  'connecting', 'breathing', 'weaving', 'shaping', 'working', 'solving',
  'composing',
];

function draw(orb) {
  const { context, width, height } = orb;
  if (!width || !height) return;
  orb.x += (orb.targetX - orb.x) * .09;
  orb.y += (orb.targetY - orb.y) * .09;
  const diameter = Math.min(width * .49, height * .73);
  const x = (width - diameter) / 2 + orb.x * diameter * .06;
  const y = (height - diameter) / 2 - height * .025 + orb.y * diameter * .045;
  const preset = orb.preset;
  const thinking = MODE_FRAMES[preset.mode](diameter, orb.clock * preset.speed * .65, preset.opts);
  const amount = orb.morph * orb.morph * (3 - 2 * orb.morph);
  const frame = morphFrame(thinking, orb.logo, diameter, amount);
  const color = orb.logo.color;
  const tint = {
    r: parseInt(color.slice(1, 3), 16) * amount,
    g: parseInt(color.slice(3, 5), 16) * amount,
    b: parseInt(color.slice(5, 7), 16) * amount,
  };
  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(x, y);
  paintFrame(context, frame, false, amount ? tint : undefined);
  context.restore();
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const orb = [...orbs].find((item) => item.element === entry.target);
    if (orb) {
      orb.visible = entry.isIntersecting;
      if (orb.visible) draw(orb);
    }
  }
  schedule();
}, { threshold: .05 });

function paint(time) {
  animationFrame = undefined;
  const elapsed = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, .08);
  previousTime = time;
  for (const orb of orbs) {
    if (!orb.visible) continue;
    if (!orb.active && orb.morph === 0) orb.clock += elapsed;
    const goal = orb.active ? 1 : 0;
    orb.morph += (goal - orb.morph) * (1 - Math.exp(-elapsed * 7));
    if (Math.abs(goal - orb.morph) < .001) orb.morph = goal;
  }
  if (!document.hidden && time - lastPaint >= 1000 / 30) {
    for (const orb of orbs) {
      if (orb.visible) {
        draw(orb);
      }
    }
    lastPaint = time;
  }
  schedule();
}

function schedule() {
  if (animationFrame || paused || reducedMotion.matches || document.hidden || ![...orbs].some((orb) => orb.visible)) return;
  animationFrame = requestAnimationFrame(paint);
}

export function mountOrb(element, project, index) {
  const preset = resolvePreset(states[index], 64);
  element.innerHTML = `<canvas class="thinking-orb" aria-hidden="true"></canvas>
    <span class="orb-caption" aria-hidden="true">${project.name}<span>Explore project ↗</span></span>`;
  const canvas = element.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const orb = {
    element, context, preset, logo: logoTargets[index],
    morph: 0, active: false, hovered: false, focused: false,
    clock: .6 + index * .17,
    width: 0, height: 0,
    x: 0, y: 0, targetX: 0, targetY: 0,
    visible: false,
  };
  orbs.add(orb);
  function updateActive() {
    orb.active = orb.hovered || orb.focused;
    if (reducedMotion.matches || paused) {
      orb.morph = orb.active ? 1 : 0;
      draw(orb);
    }
    schedule();
  }
  element.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    orb.hovered = true;
    updateActive();
  });
  const link = element.closest('a');
  link?.addEventListener('focus', () => {
    orb.focused = true;
    updateActive();
  });
  link?.addEventListener('blur', () => {
    orb.focused = false;
    updateActive();
  });

  const resize = new ResizeObserver(([entry]) => {
    orb.width = entry.contentRect.width;
    orb.height = entry.contentRect.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(orb.width * ratio);
    canvas.height = Math.round(orb.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(orb);
  });
  resize.observe(element);
  element.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const bounds = element.getBoundingClientRect();
    orb.targetX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    orb.targetY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
  });
  element.addEventListener('pointerleave', () => {
    orb.targetX = orb.targetY = 0;
    orb.hovered = false;
    updateActive();
  });
  observer.observe(element);
}

export function pauseOrbs(value) {
  paused = value;
  previousTime = undefined;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = undefined;
  for (const orb of orbs) {
    if (reducedMotion.matches || paused) orb.morph = orb.active ? 1 : 0;
    if (orb.visible) draw(orb);
  }
  schedule();
}

reducedMotion.addEventListener('change', () => pauseOrbs(paused));
document.addEventListener('visibilitychange', () => { previousTime = undefined; schedule(); });
