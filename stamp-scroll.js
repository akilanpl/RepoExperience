export function mountStampScroll(section) {
  const stage = section.querySelector('.postage-stage');
  const viewport = section.querySelector('.stamp-window');
  const rail = section.querySelector('.stamp-collection');
  const progress = section.querySelector('.stamp-progress > span');
  const previous = section.querySelector('#stamp-previous');
  const next = section.querySelector('#stamp-next');
  const cards = [...rail.children];
  const compact = matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)');
  let travel = 0;
  let scrollRange = 0;
  let frame = 0;
  let pinned = false;
  let step = 0;

  function paint() {
    frame = 0;
    let position;
    if (pinned) {
      const offset = -section.getBoundingClientRect().top;
      position = Math.max(0, Math.min(1, offset / Math.max(1, scrollRange)));
      rail.style.transform = `translate3d(${-travel * position}px,0,0)`;
    } else {
      position = viewport.scrollLeft / Math.max(1, travel);
      rail.style.transform = '';
    }
    progress.style.transform = `scaleX(${position})`;
    previous.disabled = position <= .001;
    next.disabled = position >= .999;
    cards.forEach((card, index) => {
      const phase = position * Math.PI * 2 + index * .7;
      card.style.setProperty('--scroll-tilt', `${pinned ? Math.sin(phase) * 1.8 : 0}deg`);
      card.style.setProperty('--scroll-lift', `${pinned ? Math.cos(phase) * 7 : 0}px`);
    });
  }

  function requestPaint() {
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function measure() {
    pinned = !compact.matches && stage.offsetHeight < innerHeight;
    section.classList.toggle('postage-pinned', pinned);
    travel = Math.max(0, rail.scrollWidth - viewport.clientWidth);
    step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : viewport.clientWidth;
    scrollRange = travel * .75;
    section.style.height = pinned ? `${stage.offsetHeight + scrollRange}px` : '';
    if (pinned) viewport.scrollLeft = 0;
    paint();
  }

  function moveTo(position, smooth = true) {
    const offset = Math.max(0, Math.min(travel, position));
    if (pinned) {
      const top = scrollY + section.getBoundingClientRect().top + offset / Math.max(1, travel) * scrollRange;
      window.scrollTo({ top, behavior: smooth && !compact.matches ? 'smooth' : 'instant' });
    } else {
      viewport.scrollTo({ left: offset, behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' });
    }
    requestPaint();
  }

  function currentOffset() {
    return pinned ? Math.max(0, Math.min(travel, -section.getBoundingClientRect().top / Math.max(1, scrollRange) * travel)) : viewport.scrollLeft;
  }

  previous.addEventListener('click', () => moveTo(currentOffset() - step));
  next.addEventListener('click', () => moveTo(currentOffset() + step));
  viewport.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const position = event.key === 'Home' ? 0 : event.key === 'End' ? travel : currentOffset() + (event.key === 'ArrowLeft' ? -step : step);
    moveTo(position);
  });
  rail.addEventListener('focusin', (event) => {
    const item = event.target.closest('li');
    if (!item) return;
    const left = item.offsetLeft;
    const offset = currentOffset();
    if (left < offset || left + item.offsetWidth > offset + viewport.clientWidth) {
      moveTo(left - (viewport.clientWidth - item.offsetWidth) / 2, false);
    }
  });

  addEventListener('scroll', requestPaint, { passive: true });
  viewport.addEventListener('scroll', requestPaint, { passive: true });
  addEventListener('resize', measure);
  compact.addEventListener('change', measure);
  new ResizeObserver(measure).observe(stage);
  measure();
}
