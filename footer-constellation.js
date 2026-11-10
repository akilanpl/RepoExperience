import { projects } from './projects.js';

function mountFooterConstellation() {
  const host = document.querySelector('.footer .signature');
  if (!host) return;
  const style = document.createElement('style');
  style.textContent = `
    .signature.constellation{position:relative;isolation:isolate;height:clamp(260px,32vw,390px);padding:0;background:none;-webkit-text-fill-color:initial;cursor:default;outline-offset:8px}
    .constellation .signature-word{position:absolute;inset:0;display:grid;place-items:center;background:repeating-linear-gradient(135deg,var(--blue) 0 1px,#8dc8f5 1px 3px,transparent 3px 5px);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;transition:opacity 320ms ease;pointer-events:none}
    .constellation canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 320ms ease}
    .constellation .constellation-node{position:absolute;left:var(--x);top:var(--y);display:flex;flex-direction:column;align-items:center;gap:7px;transform:translate(-50%,-35%) scale(.85);opacity:0;pointer-events:none;transition:opacity 360ms ease,transform 600ms cubic-bezier(.22,1,.36,1);font:500 12px/1.2 Geist,Arial,sans-serif;letter-spacing:-.02em;color:#275d88;-webkit-text-fill-color:currentColor;white-space:nowrap;text-decoration:none!important}
    .constellation-node img{width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 4px 9px #1a6aac14);transition:transform 240ms ease}
    .constellation-node:hover img,.constellation-node:focus-visible img{transform:translateY(-4px) scale(1.08)}
    .constellation .constellation-caption{position:absolute;bottom:12px;left:0;right:0;margin:0;font:400 14px/1.5 Geist,Arial,sans-serif;letter-spacing:-.02em;color:#667c8e;-webkit-text-fill-color:currentColor;opacity:0;transform:translateY(6px);transition:opacity 400ms ease,transform 500ms ease;pointer-events:none}
    .constellation .constellation-hint{position:absolute;bottom:12px;left:0;right:0;font:400 11px/1.5 Geist,Arial,sans-serif;letter-spacing:.02em;color:#8596a4;-webkit-text-fill-color:currentColor;transition:opacity 250ms ease;pointer-events:none}
    .constellation[data-revealed="true"] .signature-word,.constellation[data-revealed="true"] .constellation-hint{opacity:0}
    .constellation[data-revealed="true"] canvas,.constellation[data-revealed="true"] .constellation-caption{opacity:1;transform:none}
    .constellation[data-revealed="true"] .constellation-node{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto;transition-delay:100ms}
    @media(max-width:760px){.signature.constellation{height:300px}.constellation .constellation-node{left:var(--mx);top:var(--my);font-size:10px;gap:6px}.constellation-node img{width:34px;height:34px}.constellation .constellation-caption{font-size:12px;bottom:10px}.constellation .constellation-hint{font-size:10px}}
    @media(prefers-reduced-motion:reduce){.constellation *{transition:none!important}.constellation-node:hover img{transform:none}}
  `;
  document.head.append(style);
  host.removeAttribute('aria-hidden');
  host.classList.add('constellation');
  host.tabIndex = 0;
  host.setAttribute('role', 'group');
  host.setAttribute('aria-label', 'Akilan. Hover, focus, or tap to reveal my project constellation.');
  host.dataset.revealed = 'false';
  host.replaceChildren();
  const word = document.createElement('span');
  word.className = 'signature-word';
  word.textContent = 'Akilan';
  word.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.append(word, canvas);
  const entries = [
    [0, 'mindscape', 16, 42, 18, 25],
    [7, 'nyrc', 34, 22, 50, 24],
    [2, 'praxis', 56, 36, 82, 26],
    [3, 'worldspeak', 80, 25, 18, 62],
    [1, 'solarops', 72, 67, 50, 61],
    [4, 'rlb', 40, 70, 82, 63]
  ];
  const nodes = entries.map(([index, slug, x, y, mx, my]) => {
    const project = projects[index];
    const link = document.createElement('a');
    link.className = 'constellation-node';
    link.href = `experience/${slug}/`;
    link.style.cssText = `--x:${x}%;--y:${y}%;--mx:${mx}%;--my:${my}%`;
    link.tabIndex = -1;
    link.setAttribute('aria-hidden', 'true');
    link.setAttribute('aria-label', `Explore ${project.name}`);
    const image = document.createElement('img');
    image.src = `assets/${project.art}`;
    image.alt = '';
    image.width = image.height = 48;
    const label = document.createElement('span');
    label.textContent = project.name;
    link.append(image, label);
    host.append(link);
    return link;
  });
  const caption = document.createElement('p');
  caption.className = 'constellation-caption';
  caption.textContent = 'Research instinct. Builder at heart.';
  const hint = document.createElement('span');
  hint.className = 'constellation-hint';
  hint.textContent = matchMedia('(hover: hover)').matches ? 'A name. A constellation of things built. Hover to explore.' : 'Tap to explore the things I build.';
  host.append(caption, hint);
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, points = [], active = false, hovering = false, focused = false, toggled = false;
  let amount = 0, frame = 0, previous = 0, visible = false;
  function anchors() {
    const small = matchMedia('(max-width: 760px)').matches;
    return entries.map((entry) => [width * entry[small ? 4 : 2] / 100, height * entry[small ? 5 : 3] / 100]);
  }
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const sample = document.createElement('canvas');
    sample.width = width;
    sample.height = height;
    const ink = sample.getContext('2d', { willReadFrequently: true });
    const font = getComputedStyle(host);
    ink.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    ink.textAlign = 'center';
    ink.textBaseline = 'middle';
    ink.fillText('Akilan', width / 2, height / 2);
    const pixels = ink.getImageData(0, 0, width, height).data;
    points = [];
    const step = width < 500 ? 5 : 7;
    for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] > 100) points.push([x, y]);
    }
    wake();
  }
  function draw(now) {
    frame = 0;
    const elapsed = Math.min((now - previous) / 1000 || .016, .04);
    previous = now;
    const goal = active ? 1 : 0;
    amount = reduced.matches ? goal : amount + (goal - amount) * (1 - Math.exp(-elapsed * 5));
    const blend = amount * amount * (3 - 2 * amount);
    ctx.clearRect(0, 0, width, height);
    const centers = anchors();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(73,161,237,${.28 * blend})`;
    ctx.beginPath();
    for (const [a,b] of [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,5],[2,4]]) {
      ctx.moveTo(...centers[a]);
      ctx.lineTo(...centers[b]);
    }
    ctx.stroke();
    points.forEach(([x,y], i) => {
      const center = centers[i % centers.length];
      const angle = i * 2.39996 + (reduced.matches ? 0 : now * .00004);
      const radius = (width < 500 ? 23 : 40) + (i % 7) * 3;
      const tx = center[0] + Math.cos(angle) * radius;
      const ty = center[1] + Math.sin(angle) * radius * .65;
      ctx.globalAlpha = .25 + (i % 5) * .12;
      ctx.fillStyle = '#49a1ed';
      ctx.beginPath();
      ctx.arc(x + (tx-x) * blend, y + (ty-y) * blend, blend < .5 ? 1.2 : .8 + (i % 3) * .25, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (visible && !document.hidden && !reduced.matches && (active || Math.abs(goal - amount) > .002)) frame = requestAnimationFrame(draw);
  }
  function wake() { if (!frame) { previous = performance.now(); frame = requestAnimationFrame(draw); } }
  function update() {
    active = hovering || focused || toggled;
    host.dataset.revealed = String(active);
    nodes.forEach(link => { link.tabIndex = active ? 0 : -1; link.setAttribute('aria-hidden', String(!active)); });
    wake();
  }
  host.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovering = true; update(); } });
  host.addEventListener('pointerleave', () => { hovering = false; update(); });
  host.addEventListener('focusin', event => { focused = event.target.matches(':focus-visible'); update(); });
  host.addEventListener('focusout', event => { if (!host.contains(event.relatedTarget)) { focused = false; toggled = false; update(); } });
  host.addEventListener('click', event => { if (!event.target.closest('a') && (event.pointerType === 'touch' || !matchMedia('(hover: hover)').matches)) { toggled = !toggled; update(); } });
  host.addEventListener('keydown', event => {
    if (event.target === host && ['Enter',' '].includes(event.key)) { event.preventDefault(); toggled = !toggled; focused = toggled; update(); }
    if (event.key === 'Escape') { event.preventDefault(); hovering = focused = toggled = false; update(); }
  });
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } }).observe(host);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (visible) wake(); });
  reduced.addEventListener('change', wake);
  document.fonts.ready.then(resize);
  resize();
}
if (document.readyState === 'complete') mountFooterConstellation();
else document.addEventListener('DOMContentLoaded', mountFooterConstellation, { once: true });
