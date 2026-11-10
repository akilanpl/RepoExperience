// Static fixture adapter: only these committed JSON resources may be fetched.
const screen = document.querySelector('#screen');
// Keep the skip target out of hash-based workspace routing.
document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  const main = document.querySelector('#main');
  main.focus();
  main.scrollIntoView();
});
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const json = value => JSON.stringify(value, null, 2);
const code = value => `<pre tabindex="0">${escape(typeof value === 'string' ? value : json(value))}</pre>`;
const badge = passed => `<span class="badge ${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</span>`;
const sourceUrl = provenance => `${provenance.repository}/blob/${provenance.commit}/${provenance.path}`;
const navItems = [['workspace','Dashboard'],['models','Models'],['agents','Agents'],['apps','HTTP applications'],['suites','Suites'],['run','Launch evaluation'],['evidence','Runs & evidence'],['artifacts','Artifacts'],['compare','Compare'],['arena','Blind Arena'],['reports','Reports']];
document.querySelector('nav').innerHTML = navItems.map(([id,title]) => `<a href="#${id}">${title}<span aria-hidden="true">→</span></a>`).join('');
const cache = new Map();
async function resource(name) {
  if (!cache.has(name)) cache.set(name, fetch(`data/${name}.json`).then(r => {
    if (!r.ok) throw Error(`Unable to load committed data: ${name}`);
    return r.json();
  }).catch(error => {cache.delete(name); throw error;}));
  return cache.get(name);
}
let suites, suite, selectedTask = 'route-outage', mode = new URLSearchParams(location.search).get('mode') === 'recorded' ? 'recorded' : 'passing', dataset, area, timer, progress = 0, runState = 'ready', loadVersion = 0;
const modes = () => suite.slug === 'http-application'
  ? [['passing','Recorded passing HTTP fixture'],['failing','Recorded failing HTTP fixture']]
  : [['passing','Deterministic passing fixture'],['failing','Deterministic failing fixture'], ...(suite.slug === 'structured-agent' ? [['recorded','Recorded real model evaluation']] : [])];
const kind = () => suite.slug === 'agent-workflows' ? 'agent' : suite.slug === 'http-application' ? 'application' : 'model';
const heading = (title, description, action = '') => `<div class="title"><div><span class="eyebrow">PRAXIS / REPRODUCIBLE BY DESIGN</span><h1 tabindex="-1">${title}</h1><p>${description}</p></div>${action}</div>`;
const metric = (name, value, note) => `<article class="card"><span class="eyebrow">${name}</span><strong class="metric">${value}</strong><small>${note}</small></article>`;
function disclosure(data = dataset) {
  const real = data.evidence_kind === 'recorded-real-inference';
  const http = data.evidence_kind === 'owned-http-recording';
  return `<div class="notice"><strong>${real ? 'RECORDED REAL INFERENCE — HISTORICAL ACCEPTANCE RESULT' : http ? 'RECORDED OWNED HTTP FIXTURE — HISTORICAL CONTRACT EXECUTION' : 'DETERMINISTIC DEMO FIXTURE — NOT REAL MODEL INFERENCE'}</strong><p>${real ? 'SmolLM2-135M · Transformers.js CPU q4 · Invocation completed; raw output persisted; assertions evaluated. All eight benchmark tasks failed. This is a historical, self-reported result.' : http ? 'The source runner made real requests to an owned regression fixture. This page only replays its saved response evidence; no HTTP application requests are sent.' : 'Prescribed outputs and tool actions test evaluation infrastructure. Trust: demo. They do not measure neural model capability.'}</p></div>`;
}
function selectors(withTask = false) {
  return `<div class="form-grid"><label>Evaluation suite<select id="suite">${suites.map(s => `<option value="${s.slug}" ${suite.slug===s.slug?'selected':''}>${s.slug} · v${s.version} · ${s.tasks.length} tasks</option>`).join('')}</select></label><label>Evidence mode<select id="mode">${modes().map(([id,label])=>`<option value="${id}" ${mode===id?'selected':''}>${label}</option>`).join('')}</select></label></div>${withTask ? `<label class="actions">Scenario<select id="scenario">${suite.tasks.map(t=>`<option ${t.id===selectedTask?'selected':''}>${t.id}</option>`).join('')}</select></label>` : ''}`;
}
function provenance(data = dataset) {
 return `<details><summary>Evidence provenance · ${data.provenance.commit.slice(0,12)}</summary><p><a class="link" href="${sourceUrl(data.provenance)}" target="_blank" rel="noreferrer">${escape(data.provenance.path)} →</a></p>${code(data.provenance)}<p>Source-derived public snapshot, not a live application run. Retained source hashes identify the original evidence; normalized data has a different digest.</p></details>`;
}
function resultTable(report = dataset.report, clickable = true, count = report.tasks.length) {
 return `<div class="tablewrap"><table><thead><tr><th scope="col">Scenario</th><th scope="col">Result</th><th scope="col">Checks passed</th><th scope="col">Source duration</th></tr></thead><tbody>${report.tasks.map((t,i)=>`<tr><td>${clickable ? `<button data-task="${t.id}">${t.id} →</button>` : escape(t.id)}</td><td>${i<count?badge(t.passed):'<span class="badge">QUEUED</span>'}</td><td>${i<count ? `${t.assertions.filter(a=>a.passed).length}/${t.assertions.length}`:'—'}</td><td>${i<count?`${t.latency_ms} ms`:'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function summary(report = dataset.report) {
 const s=report.summary;
 return `<div class="grid">${metric('TASKS PASSED',`${s.passed}/${s.total}`,`${s.failed} failed · ${report.status}`)}${metric('ASSERTIONS',`${s.assertions_passed}/${s.assertions_total}`,'Checks passed in source report')}${metric('SOURCE DURATION',`${(report.duration_ms/1000).toFixed(3)}s`,'Historical execution, not replay time')}</div>`;
}
function taskList() {
 return `<div class="task-list" role="group" aria-label="Evaluated tasks">${suite.tasks.map(t=>`<button data-select-task="${t.id}" aria-pressed="${t.id===selectedTask}">${t.id}</button>`).join('')}</div>`;
}
function inspector(definitionOnly = false) {
 const definition = suite.tasks.find(t=>t.id===selectedTask);
 const task = dataset.report.tasks.find(t=>t.id===selectedTask);
 return `<div class="task-layout">${taskList()}<div><article class="card"><div class="panel-head"><h2>${escape(task.id)}</h2>${badge(task.passed)}</div><div class="meta"><span>${escape(task.category)}</span><span>${task.latency_ms} ms source duration</span><span>${task.artifact.type} · ${task.artifact.mime}</span><span>${task.attempts} attempt(s)</span></div><div class="panel-head"><h3>Actual input / prompt</h3><button class="secondary" data-copy="prompt">Copy input</button></div>${code(definition.prompt)}${definition.api_request ? `<h3 class="actions">HTTP request contract</h3>${code(definition.api_request)}`:''}<details ${definitionOnly?'open':''}><summary>Expected output schema</summary>${code(definition.output_schema)}</details><details><summary>Exact executable assertion definitions</summary>${code({assertions:definition.assertions,state_assertions:definition.state_assertions,allowed_tools:definition.allowed_tools})}</details>${definition.environment?`<details><summary>Initial simulated environment</summary>${code(definition.environment)}</details>`:''}</article><article class="card"><div class="panel-head"><h2>Actual ${kind()==='application'?'HTTP response':'output'}</h2><button class="secondary" data-copy="output">Copy output</button></div>${code(task.output)}<p>${mode==='recorded'?'The model returned prose instead of the required JSON. Inference completed; task requirements were not met.':kind()==='agent'?'A final response is checked separately from the resulting environment state. Inspect the trace below to see what actually changed.':'The status below comes from saved assertion evidence, not from changing a label in the preview.'}</p></article><article class="card"><h2>Assertion-level evidence</h2><div class="tablewrap assertions" tabindex="0" role="region" aria-label="Expected and actual assertion results"><table><thead><tr><th scope="col">Assertion</th><th scope="col">Result</th><th scope="col">Expected</th><th scope="col">Actual</th></tr></thead><tbody>${task.assertions.map(a=>`<tr><td>${escape(a.name)}</td><td>${badge(a.passed)}</td><td>${code(a.expected)}</td><td>${code(a.actual)}</td></tr>`).join('')}</tbody></table></div></article><article class="card"><h2>Execution evidence</h2>${task.tool_trace.length ? `<details open><summary>${kind()==='application'?'HTTP evidence':'Tool trace · permissions and before/after state'}</summary>${code(task.tool_trace)}</details>`:'<p>No tool calls were recorded for this task. Structured tool descriptions are model outputs, not executed tools.</p>'}${task.provider_metadata ? `<details open><summary>Model / provider metadata</summary>${code(task.provider_metadata)}</details>`:''}<details><summary>Artifact identity and execution error</summary>${code({artifact:task.artifact,error:task.error})}</details>${provenance()}</article></div></div>`;
}
function workspace() {
 return heading('Evaluation workspace','Evaluate what AI systems actually do. Follow a versioned task from its input to inspectable evidence.','<a class="button" href="#run">Launch evaluation →</a>')
 + `<div class="grid">${metric('PUBLIC SUITES',suites.length,'Versioned scenario definitions')}${metric('SCENARIOS',suites.reduce((n,s)=>n+s.tasks.length,0),'Public contracts, not held-out tasks')}${metric('EXECUTION KINDS',3,'Model · Agent · Application')}</div><article class="card"><div class="panel-head"><h2>Start with evidence</h2><span class="badge">SOURCE SNAPSHOTS</span></div><p>Generation is only the beginning. Praxis validates schemas, evaluates executable assertions, and persists outputs, failures, traces and conditions.</p><div class="step-line"><span>01 Bind scenarios</span><span>02 Execute adapter</span><span>03 Validate schema</span><span>04 Evaluate assertions</span><span>05 Persist evidence</span></div><div class="actions"><a class="button" href="#suites">Inspect structured-agent →</a><a class="link" href="#compare">Compare compatible evidence</a></div></article><div class="two"><article class="card"><h2>Target registry concepts</h2><ul class="inline-list"><li><a href="#models">Models →</a><br>OpenAI-compatible, Ollama and custom protocols</li><li><a href="#agents">Agents →</a><br>Bounded tools and independent environment checks</li><li><a href="#apps">HTTP applications →</a><br>Owned response contracts, distinct from inference</li></ul></article><article class="card"><h2>Sample run library</h2><p>Curated source reports, not customer activity.</p><ul class="inline-list"><li><button class="secondary" data-open-mode="passing">Structured fixture · 8/8 passed →</button></li><li><button class="secondary" data-open-mode="failing">Failing fixture · inspect failures →</button></li><li><button class="secondary" data-open-mode="recorded">SmolLM2-135M · 0/8 passed →</button></li></ul><a class="link" href="#reports">JSON and printable reports →</a></article></div>`;
}
function launch() {
 const report=dataset.report;
 const done=runState==='completed';
 return heading('Launch evaluation','Replay source evidence in your browser. This deterministic replay sends no requests to a model or application.')
 +`<article class="card">${selectors()}<div class="meta"><span>Target kind: ${report.target_kind}</span><span>Version: ${report.suite_version}</span><span>Tasks: ${report.summary.total}</span><span>Seed: ${report.seed}</span><span>Trust: ${report.trust}</span></div><p>${escape(report.target_name)}</p></article>${disclosure()}<article class="card"><div class="panel-head"><h2>Browser replay</h2><span class="badge">${runState.toUpperCase()}</span></div><p>Accelerated playback of committed task results. Source timings remain attached to each task.</p><div class="actions"><button id="run-button" ${runState==='running'?'disabled':''}>${done?'Replay again':'Run sample evaluation'}</button>${runState==='running'?'<button class="secondary" id="cancel">Stop replay</button>':''}<a class="link" href="#evidence">Open task inspector →</a></div><progress max="${report.tasks.length}" value="${progress}" aria-label="Sample replay task progress"></progress><p class="progress-text" role="status">${progress}/${report.tasks.length} tasks replayed${done?` · ${report.summary.passed} passed · ${report.summary.failed} failed`:''}</p>${resultTable(report,true,progress)}</article>${done?summary():''}`;
}
function reports() {
 return heading('Reports & artifacts','Persisted output and assertion evidence stay together. Export this normalized snapshot or print the report.')+disclosure()+summary()+`<article class="card">${selectors()}<div class="actions"><button id="export">Export normalized JSON ↓</button><button class="secondary" id="print">Print HTML report</button><a class="link" href="data/${mode==='recorded'?'recorded-model-run':`${suite.slug}-${mode}`}.json" target="_blank">Open public JSON →</a></div>${resultTable()}${provenance()}</article><article class="card"><h2>Artifact-first review</h2><p>Each task retains its output type, MIME type, source hash, timing and assertion observations. An artifact hash supports identity and integrity; it does not grant independent verification.</p><a class="link" href="#evidence">Inspect an output and its checks →</a></article>`;
}
async function comparisons() {
 const passing=await resource(`${suite.slug}-passing`), failing=await resource(`${suite.slug}-failing`);
 return heading('Matched evaluation matrix','Compare a contract task by task. Fixture outcomes illustrate the workflow; they do not establish model rankings.')+`<div class="notice"><strong>EXPLANATORY COMPARISON — NO AUTHENTIC MATCH RECEIPT</strong><p>Passing and failing regression reports are shown side by side. This is not an official model comparison or a persisted blind assignment. The real SmolLM2 result has self-reported trust and must not be ranked against demo-trust fixtures.</p></div><article class="card">${selectors()}<p>For a genuine comparison, Praxis requires matching task identity, suite digest/version, seed, target kind, token/temperature/timeout conditions, MIME type and trust, with distinct target identities.</p><div class="meta"><span>Suite ${suite.slug} v${suite.version}</span><span>Seed ${passing.report.seed}</span><span>Passing trust: ${passing.report.trust}</span><span>Failing trust: ${failing.report.trust}</span></div><div class="tablewrap"><table><thead><tr><th scope="col">Task</th><th scope="col">Passing source</th><th scope="col">Failing source</th></tr></thead><tbody>${passing.report.tasks.map((t,i)=>`<tr><td><button data-task="${t.id}">${t.id} →</button></td><td>${badge(t.passed)} · ${t.assertions.filter(a=>a.passed).length}/${t.assertions.length} checks</td><td>${badge(failing.report.tasks[i].passed)} · ${failing.report.tasks[i].assertions.filter(a=>a.passed).length}/${failing.report.tasks[i].assertions.length} checks</td></tr>`).join('')}</tbody></table></div>${provenance(passing)}${provenance(failing)}</article><article class="card"><h2>Why invocation success is not task success</h2><p>SmolLM2-135M completed inference and persisted raw output, but passed 0/8 tasks and 0/24 assertions. A transport success is not evidence of satisfying the requested contract.</p><button class="secondary" data-open-mode="recorded">Inspect the genuine 0/8 result →</button></article><details><summary>Original comparison interface capture</summary><a href="evidence/compare.png" target="_blank"><img class="capture" src="evidence/compare.png" alt="Original Praxis matched evaluation matrix screenshot" loading="lazy"></a></details>`;
}
function arena() {
 return heading('Blind Arena','Understand the local product’s blind A/B workflow without inventing a public vote or ranking.')+`<div class="notice"><strong>EXPLANATORY WORKFLOW — NO VOTE IS SUBMITTED</strong><p>No authentic public comparison receipt is included here. This capture documents the interface, not community results.</p></div><article class="card"><h2>From compatible artifacts to a preference</h2><ol class="inline-list"><li>Match conditions and require distinct target identities.</li><li>Randomize A/B order once and persist the assignment.</li><li>Hide identity metadata until a preference is submitted in the local app.</li><li>Inspect task-level evidence alongside the preference. Human preference and executable assertion results answer different questions.</li></ol><a class="link" href="#compare">Inspect the explanatory task matrix →</a></article><a href="evidence/arena-blind.png" target="_blank"><img class="capture" src="evidence/arena-blind.png" alt="Source Praxis Blind Arena interface; historical demonstration capture"></a>`;
}
function targets(type) {
 const info={models:['Model targets','Model adapters collect text or JSON from OpenAI-compatible, Ollama and custom endpoints. A structured tool description does not mean a tool executed.','structured-agent'],agents:['Agent targets','Agents invoke permissioned tools in a bounded in-memory environment. Final answers and actual state changes are evaluated independently.','agent-workflows'],apps:['HTTP application targets','The local runner checks actual status, content type and response body on an explicitly authorized application. Browser replay makes no application requests.','http-application']}[type];
 return heading(info[0],info[1])+`<article class="card"><h2>Inspect the source example</h2><p>${type==='agents'?'The authorized-refund task checks lookup/policy evidence, actual purchase state, refund totals and allowed tool use. A failing agent can say “refunded” while the purchase remains open.':type==='apps'?'The health-contract task requires HTTP 200 and body.status equal to ok. Passing and failing source reports retain actual HTTP request traces.':'The route-outage task requires priority: urgent and team: technical. Explore passing/failing fixtures or genuine historical SmolLM2 output.'}</p><button data-example="${info[2]}">Open ${info[2]} evidence →</button></article><article class="card"><h2>Configuration belongs in the local product</h2><p>This public preview contains no endpoint registration, API credentials or network connection controls. Install the original app to configure your own targets.</p><a class="link" href="../../experience/praxis/#scope" target="_top">Read local setup and platform requirements →</a></article>`;
}
function methodology() {
 return heading('Methodology & settings','A static, version-matched demonstration of a local-first evaluation product.')+`<article class="card"><h2>Evidence boundaries</h2><p>Public tasks and prescribed fixtures are not a held-out benchmark. Trust is retained from source reports: deterministic fixtures are demo; owned HTTP and historical model execution are self-reported. No operator-verified leaderboard or community score is claimed.</p><p>There are no user settings to save here. The page only fetches allowlisted committed JSON, never a local API. Exported JSON contains the sanitized public snapshot.</p>${provenance()}</article><article class="card"><h2>Source installation</h2><p>MIT licensed. Python 3.12, Node.js 22.12+, npm and a POSIX shell. Controlled-beta qualification covers Linux and macOS 15; native Windows is unsupported. Source installation is required; no prebuilt installer is available.</p><a class="link" href="../../experience/praxis/#scope" target="_top">Installation and recovery instructions →</a></article>`;
}
async function loadData() {
 const version=++loadVersion;
 const next=await resource(mode==='recorded'?'recorded-model-run':`${suite.slug}-${mode}`);
 if(version!==loadVersion)return false;
 dataset=next;return true;
}
async function render(focusHeading = false) {
 const currentArea=location.hash.slice(1)||'workspace';
 area=navItems.some(([id])=>id===currentArea)||currentArea==='methodology'?currentArea:'workspace';
 const stamp=++render.version;
 const focused=document.activeElement?.id;
 document.querySelector('#breadcrumb').textContent=`LAB / ${area==='workspace'?'DASHBOARD':area.toUpperCase()}`;
 document.querySelectorAll('nav a').forEach(a=>{if(a.hash===`#${area}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 let html;
 if(area==='workspace')html=workspace();
 else if(area==='suites')html=heading('Evaluation suites','Explore the exact versioned scenario definitions. Switch outcomes to inspect the corresponding committed report.')+`<article class="card">${selectors(true)}</article>`+disclosure()+inspector(true);
 else if(area==='run')html=launch();
 else if(area==='evidence')html=heading('Run evidence','Trace each result back to its prompt, schema, expected values and observed output.')+`<article class="card">${selectors()}</article>`+disclosure()+summary()+inspector();
 else if(area==='compare')html=await comparisons();
 else if(area==='arena')html=arena();
 else if(['models','agents','apps'].includes(area))html=targets(area);
 else if(area==='reports'||area==='artifacts')html=reports();
 else html=methodology();
 if(stamp!==render.version)return;
 screen.innerHTML=html;screen.setAttribute('aria-busy','false');
 if(focusHeading)screen.querySelector('h1')?.focus({preventScroll:true});
 else if(focused)document.getElementById(focused)?.focus({preventScroll:true});
}
render.version=0;
function resetReplay(){clearInterval(timer);timer=undefined;progress=0;runState='ready';}
async function changeEvidence(slug, nextMode = mode) {
 resetReplay();suite=suites.find(s=>s.slug===slug)||suite;mode=nextMode;
 if(!modes().some(([id])=>id===mode))mode='passing';
 if(!suite.tasks.some(t=>t.id===selectedTask))selectedTask=suite.tasks[0].id;
 if(await loadData())await render();
}
function replay() {
 resetReplay();runState='running';render();
 const tick=()=>{progress++;if(progress===dataset.report.tasks.length){clearInterval(timer);timer=undefined;runState='completed';}if(area==='run')render();};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){progress=dataset.report.tasks.length-1;tick();}
 else timer=setInterval(tick,240);
}
let toastTimer;
function toast(message){document.querySelector('.toast').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>document.querySelector('.toast').textContent='',3000);}
screen.addEventListener('change',event=>{
 if(event.target.id==='suite')changeEvidence(event.target.value).catch(fail);
 if(event.target.id==='mode')changeEvidence(suite.slug,event.target.value).catch(fail);
 if(event.target.id==='scenario'){selectedTask=event.target.value;render();}
});
screen.addEventListener('click',async event=>{
 const button=event.target.closest('button');if(!button)return;
 try {
 if(button.dataset.task){selectedTask=button.dataset.task;if(location.hash==='#evidence')render();else location.hash='evidence';}
 else if(button.dataset.selectTask){selectedTask=button.dataset.selectTask;await render();screen.querySelector(`[data-select-task="${selectedTask}"]`)?.focus({preventScroll:true});}
 else if(button.dataset.openMode){await changeEvidence('structured-agent',button.dataset.openMode);location.hash='evidence';}
 else if(button.dataset.example){await changeEvidence(button.dataset.example,'passing');selectedTask=suite.tasks[0].id;location.hash='evidence';}
 else if(button.id==='run-button')replay();
 else if(button.id==='cancel'){clearInterval(timer);runState='stopped';render();}
 else if(button.dataset.copy){const task=dataset.report.tasks.find(t=>t.id===selectedTask);const value=task[button.dataset.copy];await navigator.clipboard.writeText(typeof value==='string'?value:json(value));toast('Copied to clipboard');}
 else if(button.id==='print')window.print();
 else if(button.id==='export'){const url=URL.createObjectURL(new Blob([json(dataset)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`praxis-${suite.slug}-${mode}-public.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 }catch(error){toast(error.message==='Write permission denied.'?'Copy unavailable in this browser. Select the text in the output panel.':`Action could not complete: ${error.message}`);}
});
function fail(error){screen.innerHTML=`<article class="card" role="alert"><h1>Evidence unavailable</h1><p>${escape(error.message)}</p><button id="retry">Retry loading evidence</button></article>`;screen.setAttribute('aria-busy','false');document.querySelector('#retry').onclick=()=>init().catch(fail);}
async function init(){const data=await resource('suite-definitions');suites=data.suites.map(x=>x.suite);suite=suites.find(s=>s.slug==='structured-agent');if(await loadData())await render();}
addEventListener('hashchange',()=>{if(dataset)render(true).catch(fail);});
init().catch(fail);
