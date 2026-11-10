import './project-navigation.js';
// One quiet, continuously turning particle mark; the same particles form the A.
const link = document.querySelector('.header .monogram');
if (link) {
  const canvas = document.createElement('canvas');
  canvas.className = 'nav-orb';
  canvas.setAttribute('aria-hidden', 'true');
  link.append(canvas);
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const size = 32;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = canvas.height = size * ratio;
  ctx.scale(ratio, ratio);
  const sample = document.createElement('canvas');
  sample.width = sample.height = 80;
  const ink = sample.getContext('2d', {willReadFrequently:true});
  let targets = [];
  function sampleLetter() {
    ink.clearRect(0, 0, 80, 80);
    ink.font = 'italic 600 70px Newsreader, Georgia, serif';
    ink.textAlign = 'center';
    ink.textBaseline = 'middle';
    ink.fillText('A', 38, 43);
    const data = ink.getImageData(0, 0, 80, 80).data;
    targets = [];
    for (let y = 6; y < 76; y += 3) for (let x = 5; x < 75; x += 3) {
      if (data[(y * 80 + x) * 4 + 3] > 100) targets.push([x * .4, y * .4]);
    }
    targets.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  sampleLetter();
  document.fonts.ready.then(sampleLetter);
  const count = 190;
  const points = Array.from({length:count}, (_, i) => {
    const y = 1 - 2 * (i + .5) / count;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  }).sort((a,b) => a[0] - b[0]);
  let hover = false, focus = false, amount = 0, previous = 0, frame;
  function draw(now = 0) {
    const elapsed = Math.min((now - previous) / 1000 || 0, .04);
    previous = now;
    const goal = hover || focus ? 1 : 0;
    amount = reduced.matches ? goal : amount + (goal - amount) * (1 - Math.exp(-elapsed * 9));
    const blend = amount * amount * (3 - 2 * amount);
    const time = reduced.matches ? 0 : now * .00032;
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < count; i++) {
      const [x, y, z] = points[i];
      const turnX = x * Math.cos(time) + z * Math.sin(time);
      const depth = z * Math.cos(time) - x * Math.sin(time);
      const ripple = 1 + .075 * Math.sin(time * 4 + y * 7);
      const ox = 16 + turnX * 12.7 * ripple;
      const oy = 16 + y * 12.7 * ripple;
      const target = targets[Math.min(targets.length - 1, Math.floor(i * targets.length / count))] || [16,16];
      ctx.beginPath();
      ctx.arc(ox + (target[0] - ox) * blend, oy + (target[1] - oy) * blend, .48 + .24 * (depth + 1) / 2 + .08 * blend, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(22,25,29,${(.25 + .7 * (depth + 1) / 2) * (1 - blend) + blend})`;
      ctx.fill();
    }
    link.classList.add('orb-ready');
    if (!reduced.matches && !document.hidden || Math.abs(goal - amount) > .005) frame = requestAnimationFrame(draw);
  }
  function wake() { cancelAnimationFrame(frame); previous = performance.now(); frame = requestAnimationFrame(draw); }
  link.addEventListener('pointerenter', () => { hover = true; wake(); });
  link.addEventListener('pointerleave', () => { hover = false; wake(); });
  link.addEventListener('focus', () => { focus = true; wake(); });
  link.addEventListener('blur', () => { focus = false; wake(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(frame); else wake(); });
  reduced.addEventListener('change', wake);
  wake();
}


// One shared sliding highlight follows pointer, keyboard focus, and scroll state.
const nav = document.querySelector('.header nav');
if (nav) {
  document.querySelectorAll('.header nav a, .footer nav a').forEach((item) => {
    if (new URL(item.href).hash === '#projects') item.textContent = 'Experience';
  });
  const items = [...nav.querySelectorAll('a:not(.monogram)')];
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  nav.prepend(indicator);
  nav.classList.add('has-nav-indicator');
  let hovered = null;
  let focused = null;
  let frame = 0;
  function paintNavigation() {
    frame = 0;
    const target = hovered || focused || items.find((item) => item.hasAttribute('aria-current'));
    if (!target) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.height = `${target.offsetHeight}px`;
    indicator.style.transform = `translate3d(${target.offsetLeft}px,${target.offsetTop}px,0)`;
    indicator.style.opacity = '1';
  }
  function requestNavigationPaint() {
    if (!frame) frame = requestAnimationFrame(paintNavigation);
  }
  items.forEach((item) => {
    item.addEventListener('pointerenter', () => { hovered = item; requestNavigationPaint(); });
    item.addEventListener('focus', () => { focused = item; requestNavigationPaint(); });
    item.addEventListener('blur', () => { focused = null; requestNavigationPaint(); });
  });
  nav.addEventListener('pointerleave', () => { hovered = null; requestNavigationPaint(); });
  new MutationObserver(requestNavigationPaint).observe(nav, {
    subtree: true, attributes: true, attributeFilter: ['aria-current']
  });
  new ResizeObserver(requestNavigationPaint).observe(nav);
  document.fonts.ready.then(requestNavigationPaint);
  requestNavigationPaint();
}
