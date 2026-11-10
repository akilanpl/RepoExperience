import { projects } from './projects.js';
import { experiences, architectureDetails } from './project-experiences.js';
import { productTours } from './product-tour.js';
import { sourceRevisions } from './project-revisions.js';

const index = Number(document.body.dataset.project);
const project = projects[index];
const config = experiences.find(entry => entry.index === index);
const tour = productTours[config.slug];
const revision = sourceRevisions[index];
const query = selector => document.querySelector(selector);

document.title = project.name + ' — Product walkthrough';
query('#project-name').textContent = project.name;
query('.project-intro-title').textContent = 'Explore ' + project.name;
query('.repo-link').href = project.url;
query('.readme-link').href = project.url + '/blob/' + revision + '/README.md';
query('.source-revision').textContent = revision.slice(0, 12);

const choices = query('.tour-options');
const surface = query('.tour-surface');
const notes = query('.tour-notes');
const source = query('.tour-source');
const open = query('.tour-open');
let activeAsset;

function selectStep(index) {
  const [title, instruction, path, asset] = tour.steps[index];
  [...choices.children].forEach((button, position) => {
    button.setAttribute('aria-pressed', String(position === index));
  });
  query('.tour-title').textContent = title;
  notes.textContent = instruction;
  source.href = project.url + (path.includes('.') ? '/blob/' : '/tree/') + revision + '/' + path.split('/').map(encodeURIComponent).join('/');
  const continuousPraxis = config.slug === 'praxis' && surface.querySelector('iframe');
  const assetChanged = asset !== activeAsset && !continuousPraxis;
  if (continuousPraxis) {
    // A same-document hash update retains suite, mode, selection and replay state.
    continuousPraxis.contentWindow.location.replace(new URL(asset, document.baseURI).href);
    continuousPraxis.title = project.name + ' — ' + title;
  }
  activeAsset = asset;
  if (assetChanged) {
    surface.replaceChildren();
    surface.hidden = true;
  }
  open.hidden = !asset;
  if (!asset) {
    query('.tour-mode').textContent = 'Local workflow';
    return;
  }

  open.href = asset;
  const local = asset.startsWith('http:');
  const live = asset.startsWith('https:');
  const capture = asset.endsWith('.png');
  query('.tour-mode').textContent = live ? 'Live website' : local ? 'Local runtime required' : capture ? 'Original repository capture' : asset.endsWith('.pdf') ? 'Original document' : asset.startsWith('demos/praxis/#') ? 'Interactive demonstration · source-derived snapshots' : asset.startsWith('demos/praxis/') ? 'Original evaluation artifact' : asset === 'demos/worldspeak/cafe.html' ? 'Interactive practice scene' : asset.startsWith('demos/stocksense/#') ? 'Interactive StockSense workspace' : asset.startsWith('demos/solarops/') ? 'Interactive SolarOps workspace' : asset.startsWith('demos/workplace-safety/#') ? 'Interactive safety workspace' : asset.startsWith('demos/survey/') ? 'Interactive reconstruction from the recording' : asset === 'demos/nyrc/experience.html' ? 'Interactive desktop and concept film' : asset === 'demos/rlb/' ? 'Interactive task demo' : asset === 'demos/enterprise-rag/' ? 'Interactive retrieval console' : asset === 'demos/space-debris/' ? 'Interactive mission simulation' : asset === 'demos/atrium/match.html' ? 'Recorded multiplayer match' : asset === 'demos/atrium/' ? 'Original character picker' : 'Original browser interface';
  open.textContent = live ? 'Open live portfolio ↗' : local ? 'Open locally after setup ↗' : capture ? 'View full capture ↗' : 'Open full view ↗';

  if (!assetChanged) return;
  if (capture) {
    const image = document.createElement('img');
    image.src = asset;
    image.alt = project.name + ' — ' + title;
    surface.append(image);
  } else if (!local && !asset.endsWith('.pdf')) {
    const frame = document.createElement('iframe');
    frame.src = asset;
    frame.title = project.name + ' — ' + title;
    frame.loading = 'lazy';
    surface.append(frame);
  }
  surface.hidden = surface.childElementCount === 0;
}

tour.steps.forEach(([title], index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'prompt-option';
  button.textContent = title;
  button.addEventListener('click', () => selectStep(index));
  choices.append(button);
});
selectStep(0);

config.workflow.forEach((name, index) => {
  const item = document.createElement('li');
  item.innerHTML = '<span></span><div><h4></h4><p></p></div>';
  item.querySelector('span').textContent = String(index + 1).padStart(2, '0');
  item.querySelector('h4').textContent = name;
  item.querySelector('p').textContent = architectureDetails[config.kind][index];
  query('.project-workflow').append(item);
});

try {
  const entry = JSON.parse(sessionStorage.getItem('akilan:mindscape:entry') || 'null');
  sessionStorage.removeItem('akilan:mindscape:entry');
  if (entry && Date.now() - entry.at < 30000 && document.referrer && new URL(document.referrer).origin === location.origin) {
    history.replaceState({...history.state, fromPortfolio: true}, '');
  }
} catch {}
for (const link of document.querySelectorAll('[data-close]')) {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !history.state?.fromPortfolio) return;
    event.preventDefault();
    history.back();
  });
}
addEventListener('keydown', event => {
  if (event.key === 'Escape' && !event.defaultPrevented) query('.article-close').click();
});
let previousScroll = scrollY;
addEventListener('scroll', () => {
  const delta = scrollY - previousScroll;
  if (Math.abs(delta) < 5) return;
  query('.article-navigation').classList.toggle('away', delta > 0 && scrollY > 24);
  previousScroll = scrollY;
}, {passive: true});
