const pages = {
  overview: ['Overview','▦',0],
  monitoring: ['Recorded Monitoring','◉',30],
  incidents: ['Incident Center','♧',50],
  zones: ['Zone Management','⬠',69],
  analytics: ['Analytics','▥',84],
  model: ['Model Performance','◈',95],
  camera: ['AI Camera Monitor','▣',110],
  integration: ['Integration','⚙',144],
};
const descriptions = {
  overview:'Review the warehouse recording and recent safety events.',
  monitoring:'Recorded workers, detected tracks, and restricted-zone activity.',
  incidents:'Review recorded safety events and acknowledge them in this session.',
  zones:'Inspect the recorded restricted zone or edit the preview settings.',
  analytics:'Review the incident counts and acknowledgment state.',
  model:'Inspect the benchmark evidence and its measurement boundaries.',
  camera:'See the separate camera monitor workflow in the recording.',
  integration:'Inspect the recorded PipeGen replay and its source.',
};
const incidents = [
  {id:'6c5b78c4', time:'03:23:53 pm', confidence:88},
  {id:'3da55579', time:'03:23:52 pm', confidence:90},
];
const video = document.querySelector('video');
const screen = document.querySelector('#screen');
const dialog = document.querySelector('dialog');
const nav = document.querySelector('nav');
const acknowledgmentKey = 'sentinel-preview-acknowledged';
const acknowledged = new Set(JSON.parse(sessionStorage.getItem(acknowledgmentKey) || '[]'));
let zone = {name:'RestrictedZone',confidence:50,shown:true};
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const card = (title, body) => `<section class="card"><h2>${title}</h2>${body}</section>`;
const metric = (name, value) => `<div class="card metric"><p class="muted">${name}</p><strong>${value}</strong></div>`;
const status = id => acknowledged.has(id) ? 'Acknowledged' : 'Needs review';
const incidentTable = rows => `<div class="table"><table><thead><tr><th>Date &amp; time</th><th>Event</th><th>Zone / Camera</th><th>Severity</th><th>Confidence</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows.map(item => `<tr><td>18 Oct 2026, ${item.time}</td><td>Observed Zone Entry</td><td>RestrictedZone · warehouse-01</td><td class="high">High</td><td>${item.confidence}%</td><td>${status(item.id)}</td><td><button type="button" data-incident="${item.id}">View incident ${item.id}</button></td></tr>`).join('')}</tbody></table></div>`;
const seek = time => {
  if (video.readyState) video.currentTime = time;
  else video.addEventListener('loadedmetadata', () => { video.currentTime = time; }, {once:true});
};
function render() {
  const requested = location.hash.slice(1);
  const page = Object.hasOwn(pages,requested) ? requested : 'overview';
  const [title,,time] = pages[page];
  document.querySelector('#section').textContent = title;
  nav.innerHTML = Object.entries(pages).map(([key,[name,icon]]) => `<a href="#${key}" ${key === page ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${name}</a>`).join('');
  let body = '';
  if (page === 'overview' || page === 'monitoring') {
    body = card('Warehouse FP16 v2 · Recorded safety replay','<p class="muted">Warehouse footage and the PipeGen interface from the supplied screen recording.</p><div class="actions"><button type="button" class="primary" data-replay>Play recording</button></div>');
    if (page === 'overview') body += card('Recent incidents',incidentTable(incidents));
  } else if (page === 'incidents') {
    body = card('Incident history', `<div class="actions"><label>Review status <select id="filter"><option>All statuses</option><option>Needs review</option><option>Acknowledged</option></select></label><button type="button" data-export>Export JSON</button></div><div id="rows">${incidentTable(incidents)}</div>`);
  } else if (page === 'zones') {
    body = card('Zone workspace', `<form id="zone-form"><label>Zone name<input name="name" required maxlength="40" value="${esc(zone.name)}"></label><label>Minimum confidence (%)<input name="confidence" type="number" min="0" max="100" required value="${zone.confidence}"></label><div class="actions"><button class="primary">Save preview settings</button><button type="button" data-overlay>${zone.shown ? 'Hide' : 'Show'} overlay</button></div></form><div class="zone-preview" data-shown="${zone.shown}"><img src="warehouse-preview.jpg" alt="Warehouse frame from the recording"><span class="zone-marker"></span></div><p class="muted">Preview settings are local to this session.</p>`);
  } else if (page === 'analytics') {
    body = `<div class="grid">${metric('Recorded incidents',incidents.length)}${metric('Needs review',incidents.length-acknowledged.size)}${metric('Acknowledged',acknowledged.size)}</div>`
      + card('Severity distribution','<p class="high">High · 2 recorded zone entries</p>');
  } else {
    body = card(title,`<p class="muted">${page === 'camera' ? 'The recording shows camera input selection and monitoring. Live inference requires the original service.' : page === 'model' ? 'The recording distinguishes engine benchmarks from full-pipeline and formal accuracy measurements.' : 'The walkthrough shows the recorded warehouse replay and its PipeGen source metadata.'}</p><div class="actions"><button type="button" class="primary" data-replay>Play recorded section</button></div>`);
  }
  screen.innerHTML = `<p class="label">Hazard Zone Sentinel</p><h1>${title}</h1><p class="muted">${descriptions[page]}</p>${body}`;
  video.pause();
  seek(time);
}
screen.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-replay')) {
    video.closest('section').scrollIntoView({block:'nearest'});
    video.play().catch(() => {});
  }
  if (button.hasAttribute('data-overlay')) {
    zone.shown = !zone.shown;
    screen.querySelector('.zone-preview').dataset.shown = String(zone.shown);
    button.textContent = (zone.shown ? 'Hide' : 'Show') + ' overlay';
  }
  if (button.hasAttribute('data-export')) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(incidents.map(item => ({...item,status:status(item.id)})),null,2)],{type:'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentinel-incidents.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  const item = incidents.find(entry => entry.id === button.dataset.incident);
  if (!item) return;
  dialog.innerHTML = `<p class="label">Incident details</p><h2 id="incident-title">Observed Zone Entry</h2><p class="muted">18 Oct 2026 · ${item.time}</p><div class="card"><p>RestrictedZone · warehouse-01</p><p class="high">High · ${item.confidence}% confidence</p><p id="incident-status" role="status">${status(item.id)}</p></div><div class="actions">${acknowledged.has(item.id) ? '' : `<button class="primary" type="button" data-ack="${item.id}">Acknowledge incident</button>`}<form method="dialog"><button>Close</button></form></div>`;
  dialog.showModal();
});
screen.addEventListener('change', event => {
  if (event.target.id !== 'filter') return;
  const filter = event.target.value;
  screen.querySelector('#rows').innerHTML = incidentTable(incidents.filter(item => filter === 'All statuses' || status(item.id) === filter));
});
screen.addEventListener('submit', event => {
  if (event.target.id !== 'zone-form') return;
  event.preventDefault();
  const data = new FormData(event.target);
  zone = {...zone,name:data.get('name'),confidence:Number(data.get('confidence'))};
  const button = event.target.querySelector('button[type="submit"], button:not([type])');
  button.textContent = 'Preview settings saved';
});
dialog.addEventListener('click', event => {
  const id = event.target.closest('[data-ack]')?.dataset.ack;
  if (!id) return;
  acknowledged.add(id);
  sessionStorage.setItem(acknowledgmentKey, JSON.stringify([...acknowledged]));
  dialog.querySelector('#incident-status').textContent = status(id);
  event.target.disabled = true;
  const filter = screen.querySelector('#filter');
  if (filter) filter.dispatchEvent(new Event('change',{bubbles:true}));
  else screen.querySelector('.table').outerHTML = incidentTable(incidents);
});
addEventListener('hashchange', render);
render();
