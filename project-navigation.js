import { projects } from './projects.js';
import { experiences } from './project-experiences.js';

// Follow the same reading order as the homepage postcard collection.
export const projectOrder = [0, 4, 7, 6, 2, 3, 1, 5, 8, 9, 10, 11, 12];
const routes = new Map([[0, 'mindscape'], ...experiences.map(({index, slug}) => [index, slug])]);
const slug = location.pathname.match(/\/experience\/([^/]+)/)?.[1];
const currentIndex = [...routes].find(([, route]) => route === slug)?.[0];

const globe = '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>';
const download = '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>';
const book = '<path d="M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>';
const desktop = '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-5 0h10"/>';
const server = '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6h.01M7 17h.01"/>';
const svg = (paths) => `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const setupPaths = {
  0: 'integrations/hybrid/README.md',
  1: 'README.md#getting-started',
  2: 'README.md#start-locally',
  3: 'README.md#run-locally',
  4: 'docs/LOCAL_DEVELOPMENT.md',
  5: 'README.md#run-locally',
  6: 'README.md#run-locally',
  7: 'README.md#get-started',
  8: 'README.md#quick-start',
  9: 'README.md#run',
  10: 'README.md#run-locally',
  11: 'README.md#getting-started',
  12: 'README.md#run-locally'
};

function pill(label, href, icon) {
  const link = document.createElement('a');
  link.className = 'pill project-resource';
  link.href = href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  const text = document.createElement('span');
  text.textContent = label;
  const mark = document.createElement('b');
  mark.setAttribute('aria-hidden', 'true');
  mark.innerHTML = svg(icon);
  link.append(text, mark);
  return link;
}

function mountProjectNavigation() {
  if (currentIndex === undefined) return;
  const project = projects[currentIndex];
  const nextIndex = projectOrder[(projectOrder.indexOf(currentIndex) + 1) % projectOrder.length];
  const next = projects[nextIndex];
  const previousCard = document.querySelector('.article-return');
  if (previousCard) {
    // Replace the node so the old "back to collection" handlers cannot intercept it.
    const card = document.createElement('a');
    card.className = 'article-return project-next';
    card.href = `experience/${routes.get(nextIndex)}/`;
    card.setAttribute('aria-label', `Continue to ${next.name}`);
    const image = document.createElement('img');
    image.src = `assets/stamp-art-${nextIndex + 1}.svg`;
    image.alt = `${next.name} postcard`;
    image.width = image.height = 300;
    image.loading = 'lazy';
    const copy = document.createElement('span');
    copy.innerHTML = '<small>Up next</small><strong></strong><p></p><span aria-hidden="true">↗</span>';
    copy.querySelector('strong').textContent = next.name;
    copy.querySelector('p').textContent = next.description;
    card.append(image, copy);
    previousCard.replaceWith(card);
  }

  let sources = document.querySelector('#scope > .experience-sources, #research > .experience-sources');
  if (!sources) {
    const section = document.createElement('section');
    section.className = 'article-prose article-end';
    const title = document.createElement('h2');
    title.textContent = 'Run locally';
    sources = document.createElement('div');
    sources.className = 'experience-sources';
    section.append(title, sources);
    document.querySelector('.project-next')?.before(section);
  }
  if (sources) {
    sources.classList.add('project-resources');
    sources.setAttribute('aria-label', `${project.name} setup and downloads`);
    const setup = pill('Local setup', currentIndex === 2 ? `${project.url}/blob/codex/praxis-final-release/docs/operations/LOCAL_INSTALLATION_RECOVERY.md` : `${project.url}/blob/HEAD/${setupPaths[currentIndex]}`, book);
    const source = pill('Download source', currentIndex === 2 ? `${project.url}/archive/refs/heads/codex/praxis-final-release.zip` : `${project.url}/archive/HEAD.zip`, download);
    sources.replaceChildren(setup, source);

    const platforms = document.createElement('span');
    platforms.className = 'project-platforms';
    // Platform labels describe the documented interface/build targets, not binaries.
    let label = 'Web';
    let icon = globe;
    if (currentIndex === 2) { label = 'Linux · macOS 15 · source build'; icon = desktop; }
    if (currentIndex === 7) { label = 'macOS · Windows · Linux'; icon = desktop; }
    if (currentIndex === 4) { label = 'Web · Windows desktop build'; icon = desktop; }
    if (currentIndex === 8) { label = 'API · Docker'; icon = server; }
    if (currentIndex === 10) { label = 'Desktop · Python'; icon = desktop; }
    platforms.innerHTML = svg(icon);
    platforms.append(document.createTextNode(label));
    source.querySelector('span').append(platforms);

    if (currentIndex === 3) {
      sources.append(pill('Open web app', 'https://worldspeak-akilanpl.vercel.app', globe));
    }
    if (currentIndex === 7) {
      const note = document.createElement('p');
      note.className = 'project-download-note';
      note.textContent = 'Source build: macOS Apple silicon / Intel, Windows x64, and Debian / Ubuntu x64. See local setup for requirements.';
      sources.append(note);
    }
  }
}

if (document.readyState === 'complete') mountProjectNavigation();
else document.addEventListener('DOMContentLoaded', mountProjectNavigation, { once: true });
