import { examples } from './examples.js';
import { mountThinkingIndicator } from '../../thinking-indicator.js';

const find = selector => document.querySelector(selector);
const stages = [...document.querySelectorAll('.stages li')];
const prompt = find('.prompt');
const activity = find('.activity');
const status = find('.status');
const approval = find('.approval');
const yes = find('.yes');
const result = find('.result');
const drawing = find('svg g');
const composer = find('.composer');
const starts = [...composer.querySelectorAll('.start')];
const exampleResult = find('.example-result');
const originalPlan = approval.querySelector('ol').innerHTML;
let selected;
let sourceFile = 'rangoli.py';
let inspected = [];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let stopOrb = () => {};
let stageTimer;
let drawTimer;
let strokes;

function setStage(index, message) {
  stages.forEach((stage, position) => {
    stage.classList.toggle('done', position < index);
    if (position === index) stage.setAttribute('aria-current', 'step');
    else stage.removeAttribute('aria-current');
  });
  status.textContent = message;
}

function think(active) {
  stopOrb();
  find('.orb').hidden = !active;
  if (active) stopOrb = mountThinkingIndicator(find('.orb'));
}

function afterStage(callback) {
  stageTimer = setTimeout(callback, 1150);
}

function showDrawing() {
  clearInterval(drawTimer);
  drawing.replaceChildren();
  let index = 0;
  const drawStroke = () => {
    const stroke = strokes[index++];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('points', stroke.points.map(point => point.join(',')).join(' '));
    line.setAttribute('stroke', stroke.color);
    drawing.append(line);
    if (index === strokes.length) clearInterval(drawTimer);
  };
  if (reducedMotion.matches) strokes.forEach(drawStroke);
  else {
    drawStroke();
    drawTimer = setInterval(drawStroke, 48);
  }
}

function reviewExample(output) {
  setStage(3, 'Reviewing the implementation and test results…');
  afterStage(() => {
    setStage(4, output.checks.length + ' checks passed. Try the result below.');
    think(false);
    const preview = find('.example-output');
    preview.replaceChildren();
    output.render(preview);
    find('.checks').replaceChildren(...output.checks.map(description => {
      const item = document.createElement('li');
      item.textContent = description;
      return item;
    }));
    exampleResult.hidden = false;
    find('#example-title').focus();
  });
}

function reviewDrawing() {
  setStage(3, 'Reviewing symmetry and preparing the output…');
  afterStage(() => {
    setStage(4, '75 strokes checked. The drawing is ready.');
    think(false);
    result.hidden = false;
    showDrawing();
    find('#result-title').setAttribute('tabindex', '-1');
    find('#result-title').focus();
  });
}

async function testDrawing() {
  setStage(2, 'Testing the exported stroke count and coordinate bounds…');
  try {
    const response = await fetch('rangoli.json');
    if (!response.ok) throw new Error('Trace unavailable');
    strokes = await response.json();
    if (strokes.length !== 75 || !strokes.every(stroke =>
      /^#[a-f0-9]{6}$/i.test(stroke.color) && stroke.points.length >= 2 &&
      stroke.points.every(point => point.length === 2 && point.every(n => Number.isFinite(n) && Math.abs(n) <= 260))
    )) throw new Error('Trace check failed');
    afterStage(reviewDrawing);
  } catch {
    think(false);
    status.textContent = 'The drawing trace could not be verified. Try the approval again.';
    approval.hidden = false;
    yes.focus();
  }
}

function showPlan() {
  const list = approval.querySelector('ol');
  approval.querySelector('.repo-context')?.remove();
  if (selected) {
    list.replaceChildren(...selected.plan.map(step => {
      const item = document.createElement('li');
      item.textContent = step;
      return item;
    }));
  } else {
    list.innerHTML = originalPlan;
  }
  if (inspected.length) {
    const context = document.createElement('div');
    context.className = 'repo-context';
    for (const { file, body } of inspected) {
      const details = document.createElement('details');
      const label = document.createElement('summary');
      const source = document.createElement('pre');
      label.textContent = 'Read ' + file;
      source.textContent = body;
      details.append(label, source);
      context.append(details);
    }
    list.before(context);
  }
  status.textContent = 'Waiting for your plan approval.';
  think(false);
  approval.hidden = false;
  yes.focus();
}

for (const button of starts) {
  button.addEventListener('click', async () => {
    if (composer.hidden) return;
    selected = examples[button.dataset.example];
    inspected = [];
    setSourceFile(selected?.file ?? 'rangoli.py');
    find('.thread-body h1').textContent = selected?.title ?? 'Animated rangoli';
    find('.subtitle').textContent = selected?.prompt ?? 'Build a Python Turtle drawing from a single prompt.';
    prompt.querySelector('p:last-child').textContent = selected?.prompt ?? 'Design an animated rangoli using Turtle in Python.';
    composer.hidden = true;
    prompt.hidden = activity.hidden = false;
    think(true);
    setStage(0, selected?.planning ?? 'Planning the geometry, colors, animation and validation…');
    try {
      if (selected?.inspect) inspected = await selected.inspect();
      afterStage(showPlan);
    } catch {
      think(false);
      setStage(-1, 'Could not read the sample repository. Select the example to retry.');
      prompt.hidden = false;
      composer.hidden = false;
    }
  });
}

yes.addEventListener('click', () => {
  if (approval.hidden) return;
  approval.hidden = true;
  think(true);
  setStage(1, selected?.coding ?? 'Loading the prepared Python Turtle implementation…');
  afterStage(() => {
    if (!selected) {
      testDrawing();
      return;
    }
    setStage(2, selected.testing);
    afterStage(() => {
      try {
        reviewExample(selected.run());
      } catch (error) {
        think(false);
        status.textContent = 'A check failed: ' + error.message;
        approval.hidden = false;
        yes.focus();
      }
    });
  });
});

find('.replay').addEventListener('click', showDrawing);
for (const reset of document.querySelectorAll('.reset')) {
  reset.addEventListener('click', () => {
    clearInterval(drawTimer);
    drawing.replaceChildren();
    setStage(-1, '');
    result.hidden = exampleResult.hidden = prompt.hidden = activity.hidden = true;
    composer.hidden = false;
    starts[0].focus();
  });
}
addEventListener('pagehide', () => {
  clearTimeout(stageTimer);
  clearInterval(drawTimer);
  stopOrb();
});

const sourceView = find('#source-view');
const taskView = find('#task-view');
const editorTabs = [...document.querySelectorAll('.editor-tabs button')];
let sourceLoaded;

function setSourceFile(file) {
  sourceFile = file;
  const name = file.split('/').at(-1);
  for (const button of document.querySelectorAll('[data-view="source"]')) {
    button.lastChild.textContent = ' ' + name;
    button.querySelector('span').textContent = name.endsWith('.py') ? 'Py' : 'JS';
  }
  sourceView.querySelector('.source-toolbar span').textContent = file;
  sourceView.querySelector('a').href = file;
  find('.example-download').href = file;
}

for (const button of document.querySelectorAll('[data-view]')) {
  button.addEventListener('click', async () => {
    const isSource = button.dataset.view === 'source';
    taskView.hidden = isSource;
    sourceView.hidden = !isSource;
    for (const tab of editorTabs) {
      tab.setAttribute('aria-pressed', String(tab.dataset.view === button.dataset.view));
    }
    if (!isSource || sourceLoaded === sourceFile) return;
    const file = sourceFile;
    sourceLoaded = undefined;
    const code = sourceView.querySelector('code');
    code.textContent = 'Loading ' + file + '…';
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error('Source unavailable');
      const source = await response.text();
      const lines = source.trimEnd().split('\n').map(text => {
        const line = document.createElement('span');
        line.textContent = text || ' ';
        return line;
      });
      if (file !== sourceFile) return;
      code.replaceChildren(...lines);
      sourceLoaded = file;
    } catch {
      if (file === sourceFile) code.textContent = 'Could not open ' + file + '. Select the tab to retry.';
    }
  });
}
