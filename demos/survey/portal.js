const screen = document.querySelector('#screen');
const dialog = document.querySelector('dialog');
const nav = document.querySelector('nav');
const sections = {
  overview: 'Overview', batches: 'Batches', review: 'Review queue', analytics: 'Analytics',
  detectors: 'Detectors', investigations: 'Investigations', enumerators: 'Enumerators',
  clusters: 'Clusters', districts: 'Districts', reports: 'Reports', settings: 'Settings',
};
const stages = ['Ingestion', 'Parquet', 'SIRL', 'Rules', 'Statistics', 'Intelligence', 'ML', 'Fusion / Risk', 'Explanation'];
const snapshot = [['M036',46],['M024',25],['M028',20],['M019',18],['M034',17],['M007',16],['M020',15],['M031',15],['M015',15],['M012',15],['M006',13],['M017',13],['M027',12],['M023',12],['M025',11],['M040',11],['M029',11],['M038',11],['M014',10]];
let records = [];
let fileName = 'Survey demo · 40 records';
let sample = true;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

function parseCsv(csv) {
  const rows = [];
  let row = [], field = '', quoted = false;
  csv = csv.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n') + '\n';
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"' && quoted && csv[i + 1] === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && (char === ',' || char === '\n')) {
      row.push(field.trim());
      field = '';
      if (char === '\n') {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else field += char;
  }
  const headers = rows.shift();
  if (quoted || !headers?.includes('respondent_id') || !rows.length || rows.some(cells => cells.length !== headers.length)) {
    throw new Error('Choose a valid CSV with a respondent_id column and at least one record.');
  }
  return rows.map(cells => Object.fromEntries(headers.map((key, i) => [key, cells[i]])));
}

const heading = (label, title, intro) => `<p class="label">${label}</p><h1>${title}</h1><p class="intro">${intro}</p>`;
const metric = (label, value) => `<div class="metric"><span class="label">${label}</span><strong>${value}</strong></div>`;
const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('')}</tbody></table></div>`;
const pipeline = completed => `<div class="pipeline">${stages.map(stage => `<span>${stage}${completed ? '<small>● COMPLETED</small>' : ''}</span>`).join('')}</div>`;
const reviewData = () => sample ? snapshot : [];
const recordButton = id => `<button type="button" data-record="${esc(id)}">${esc(id)}</button>`;
const metrics = () => `<div class="metrics">${metric('Total records', records.length)}${metric('Normal', sample ? 21 : '—')}${metric('Confirmed validation issues', sample ? 0 : '—')}${metric('Investigation required', sample ? 0 : '—')}${metric('High risk', sample ? 0 : '—')}${metric('AI explanations', sample ? 'Partial' : '—')}</div>`;

for (const [id, name] of Object.entries(sections)) {
  nav.insertAdjacentHTML('beforeend', `<a href="#${id}"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 6h6M5 10h4"/></svg>${name}</a>`);
}

function showReview() {
  screen.innerHTML = heading('Review queue', 'Quality investigation queue', 'Inspect the signals and evidence that led to review. A supervisor makes the final decision.')
    + `<div class="metrics">${metric('Records in this view', reviewData().length)}${metric('Open investigations', 0)}</div>
    <div class="card filters"><input type="search" placeholder="Search record ID" aria-label="Search record ID"><select aria-label="Severity"><option value="">All severities</option><option>Medium</option><option>Low</option></select></div><div id="review-table"></div>`;
  const query = screen.querySelector('input');
  const severity = screen.querySelector('select');
  const update = () => {
    const results = reviewData().filter(([id, risk]) => id.toLowerCase().includes(query.value.trim().toLowerCase())
      && (!severity.value || severity.value === (risk >= 25 ? 'Medium' : 'Low')));
    screen.querySelector('#review-table').innerHTML = results.length
      ? table(['ID','Risk','Classification','Primary signal','Status','Evidence','Investigation'], results.map(([id,risk]) => [
          recordButton(id), `${risk} <span class="badge">${risk >= 25 ? 'MEDIUM' : 'LOW'}</span>`,
          '<span class="badge">UNUSUAL PATTERN</span>', 'Statistical outlier', 'Review', 'Rules · Statistics · ML', '—',
        ]))
      : '<p class="card">No matching review records.</p>';
  };
  query.addEventListener('input', update);
  severity.addEventListener('change', update);
  update();
}

function render() {
  const route = location.hash.slice(1) || 'overview';
  const active = ['upload','batch'].includes(route) ? 'batches' : route;
  for (const link of nav.querySelectorAll('a')) {
    if (link.hash === '#' + active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  document.querySelector('#batch-name').textContent = fileName;
  if (route === 'review') { showReview(); return; }
  if (route === 'overview') {
    screen.innerHTML = heading('Overview', 'Survey data quality intelligence', 'Review incoming survey batches, quality signals, and cases that need supervisor attention.')
      + metrics() + `<section class="card"><h2>Quality signal breakdown</h2><div class="metrics">${metric('Review + confirmed',reviewData().length)}${metric('Open investigations',0)}</div><a class="button" href="#review">Open review queue</a></section>
        <section class="card"><h2>Data readiness</h2>${pipeline(sample)}<a class="button primary" href="#upload">Ingest survey data</a> <a class="button" href="#batch">View active batch</a></section>`;
  } else if (route === 'batches') {
    screen.innerHTML = heading('Batches','Survey batches','Open the active batch or ingest another survey extract.')
      + '<div class="actions"><a class="button primary" href="#upload">New batch</a></div>'
      + table(['Batch','Records','Status'], [[`<a href="#batch">${esc(fileName)}</a>`, records.length, sample ? 'Completed · recording' : 'Imported locally']]);
  } else if (route === 'upload') {
    screen.innerHTML = heading('New batch','Ingest survey data','Upload a survey extract or use the bundled 40-record example.')
      + `<form class="card"><p class="label">Data source</p><div class="actions"><span class="button">Upload CSV</span><button type="button" id="use-sample">Use sample CSV</button></div><label class="drop"><strong>Drop your CSV file here</strong><span>or browse from your computer</span><input type="file" accept=".csv,text/csv" required></label><button class="primary">Submit CSV</button><p class="notice" role="status">Imported records stay in this browser session.</p></form>
      <section class="card"><h2>Processing pipeline</h2><p class="notice">The original application runs these stages after ingestion.</p>${pipeline(false)}</section>`;
    const form = screen.querySelector('form');
    const input = form.querySelector('input');
    const drop = form.querySelector('.drop');
    async function load(file) {
      if (!file) return;
      try {
        records = parseCsv(await file.text());
        fileName = file.name;
        sample = false;
        location.hash = 'batch';
      } catch (error) { form.querySelector('[role=status]').textContent = error.message; }
    }
    form.addEventListener('submit', event => { event.preventDefault(); load(input.files[0]); });
    drop.addEventListener('dragover', event => event.preventDefault());
    drop.addEventListener('drop', event => { event.preventDefault(); load(event.dataTransfer.files[0]); });
    form.querySelector('#use-sample').addEventListener('click', () => { restoreSample(); location.hash = 'batch'; });
  } else if (route === 'batch') {
    const riskById = new Map(reviewData());
    const sorted = [...records].sort((a,b) => (riskById.get(b.respondent_id) ?? 0) - (riskById.get(a.respondent_id) ?? 0));
    screen.innerHTML = heading('Batch detail',esc(fileName),sample ? 'Completed batch from the recording. Open a record to inspect the bundled sample fields.' : 'Local CSV preview. Run the original service to assess this batch.')
      + '<div class="actions"><a class="button" href="#upload">Ingest survey data</a><a class="button primary" href="#review">View results</a></div>'
      + metrics() + pipeline(sample) + table(['Record','Status','Severity','Risk','District','Enumerator'], sorted.map(record => {
        const risk = riskById.get(record.respondent_id);
        return [recordButton(record.respondent_id), sample ? (risk ? 'REVIEW' : 'NORMAL') : 'IMPORTED', risk >= 25 ? 'MEDIUM' : sample ? 'LOW' : '—', risk ?? (sample ? 0 : '—'), esc(record.district_code), esc(record.enumerator_id)];
      }));
  } else if (route === 'investigations') {
    screen.innerHTML = heading('Investigations','Investigations','Follow reviewed survey records through supervisor investigations.')
      + '<section class="card"><h2>Open investigations</h2><p class="notice">No open investigations in this preview.</p><div class="actions"><a class="button" href="#review">Open review queue</a></div></section>';
  } else if (route === 'reports') {
    screen.innerHTML = heading('Reports','Reports & exports','Download the bundled survey extract to explore the record format.')
      + '<section class="card"><h2>Survey demo export</h2><div class="actions"><a class="button primary" href="sample.csv" download>Download sample CSV</a></div></section>';
  } else if (route === 'detectors' || route === 'settings') {
    screen.innerHTML = heading(sections[route],sections[route],'Open the original application to configure the survey pipeline and workspace.')
      + `<div class="card">${pipeline(false)}</div>`;
  } else {
    const column = { analytics: 'employment_status', enumerators: 'enumerator_id', clusters: 'cluster_id', districts: 'district_code' }[route] ?? 'district_code';
    const counts = new Map();
    for (const record of records) {
      const key = record[column] || '—';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    screen.innerHTML = heading(sections[route] ?? 'Analytics', sections[route] ?? 'Analytics', 'Record counts for the active batch.')
      + table(['Group','Records'], [...counts].map(([key,count]) => [esc(key),count]));
  }
}

screen.addEventListener('click', event => {
  const button = event.target.closest('[data-record]');
  if (!button) return;
  const row = records.find(record => record.respondent_id === button.dataset.record);
  const fields = row ? Object.entries(row).filter(([key]) => key !== 'notes') : [];
  dialog.querySelector('#record').innerHTML = `<p class="label">Survey record</p><h1 id="record-title">${esc(button.dataset.record)}</h1><dl>${fields.map(([key,value]) => `<dt>${esc(key.replaceAll('_',' '))}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`;
  dialog.showModal();
});

let sampleRows;
function restoreSample() {
  records = sampleRows;
  sample = true;
  fileName = 'Survey demo · 40 records';
}

try {
  const response = await fetch('sample.csv');
  if (!response.ok) throw new Error();
  sampleRows = parseCsv(await response.text());
  restoreSample();
  addEventListener('hashchange', render);
  render();
} catch {
  screen.textContent = 'The sample data could not be loaded. Reload the page to try again.';
}
