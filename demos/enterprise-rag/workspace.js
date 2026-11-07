const find = selector => document.querySelector(selector);
const roles = {public:0, employee:1, manager:2, admin:3};
const principals = [
  {key:'acme-employee',tenant:'acme',role:'employee'},
  {key:'acme-manager',tenant:'acme',role:'manager'},
  {key:'acme-admin',tenant:'acme',role:'admin'},
  {key:'northwind-employee',tenant:'northwind',role:'employee'},
];
const documents = [
  {tenant:'acme',role:'employee',title:'Leave policy',text:'Acme employees receive 20 paid vacation days annually. Submit leave requests through the employee portal.'},
  {tenant:'acme',role:'public',title:'Security incident reporting',text:'Report suspected security incidents to the Security Operations team within one hour of discovery.'},
  {tenant:'acme',role:'manager',title:'Procurement approvals',text:'Acme procurement purchases above $5,000 require approval from a department manager.'},
  {tenant:'northwind',role:'employee',title:'Leave policy',text:'Northwind employees receive 25 paid vacation days annually.'},
  {tenant:'northwind',role:'public',title:'Security incident reporting',text:'Northwind requires security incidents to be reported within 30 minutes.'},
];
const principal = find('#principal');
const query = find('#query');
const answer = find('#answer');
const citations = find('#citations');
const trace = find('#trace');
const payload = find('#payload');
const ingest = find('#ingest');
const active = () => principals[principal.selectedIndex];
const ignored = new Set('a an and are as at be can do does for from how i in is it many me must of on or the they to was what when which who will with'.split(' '));
const terms = text => new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(word => !ignored.has(word)));
const element = (tag,text) => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};

for (const item of principals) principal.add(new Option(item.key,item.key));
function updateIdentity() {
  const {tenant,role} = active();
  find('#identity').textContent = 'Tenant ' + tenant + ' · Role ' + role;
  for (const field of ingest.elements) field.disabled = role !== 'admin';
  find('#ingest-status').textContent = role === 'admin' ? '' : 'Ingestion requires a tenant administrator.';
}
principal.addEventListener('change', () => {
  updateIdentity();
  answer.textContent = 'Identity changed. Run the query with this key.';
  find('#response-code').textContent = 'Awaiting request';
  citations.replaceChildren();
  trace.replaceChildren();
  payload.hidden = true;
});
for (const button of document.querySelectorAll('[data-query]')) {
  button.addEventListener('click', () => { query.value = button.dataset.query; query.focus(); });
}
find('#query-form').addEventListener('submit', event => {
  event.preventDefault();
  const {tenant,role} = active();
  const input = query.value.trim();
  if (!input) {
    answer.textContent = 'Enter a query to retrieve evidence.';
    find('#response-code').textContent = '422 · Invalid input';
    citations.replaceChildren();
    trace.replaceChildren();
    payload.hidden = true;
    return;
  }
  const words = terms(input);
  const authorized = documents.filter(doc => doc.tenant === tenant && roles[doc.role] <= roles[role]);
  const results = authorized.map(doc => ({
    doc,
    overlap: [...words].filter(word => terms(doc.title + ' ' + doc.text).has(word)).length,
  })).filter(hit => hit.overlap > 0).sort((a,b) => b.overlap-a.overlap).slice(0,3);
  const excerpts = results.map(({doc,overlap},index) => ({label:'DOC ' + index,title:doc.title,excerpt:doc.text,matched_terms:overlap}));
  const response = {
    request_id: crypto.randomUUID(),
    answer: excerpts.length ? excerpts.map(hit => hit.excerpt + ' [' + hit.label + ']').join('\n\n') : 'Insufficient information in the authorized documents.',
    tenant,
    citations: excerpts,
    usage:{prompt_tokens:0,completion_tokens:0,cost_usd:0},
  };
  answer.textContent = response.answer;
  find('#response-code').textContent = '200 · Demo response';
  citations.replaceChildren(...excerpts.map(hit => {
    const details = element('details','');
    details.className = 'source';
    details.append(element('summary',hit.label + ' · ' + hit.title),element('p',hit.excerpt));
    return details;
  }));
  trace.replaceChildren(...[
    'Resolved tenant and role from the selected demo key.',
    'Applied scope filters before ranking. Authorized documents: ' + authorized.length + '.',
    'Retrieved ' + excerpts.length + ' cited excerpts. Generation cost $0.00.',
  ].map(value => element('li',value)));
  payload.querySelector('pre').textContent = JSON.stringify(response,null,2);
  payload.hidden = false;
});
ingest.addEventListener('submit', event => {
  event.preventDefault();
  const {tenant,role} = active();
  if (role !== 'admin') return;
  const form = new FormData(ingest);
  const title = form.get('title').trim();
  const text = form.get('text').trim();
  const access = form.get('role');
  if (!title || !text) {
    find('#ingest-status').textContent = 'Provide a title and document text.';
    return;
  }
  if (!documents.some(doc => doc.tenant === tenant && doc.title === title && doc.text === text && doc.role === access)) {
    documents.push({tenant,role:access,title,text});
  }
  ingest.reset();
  find('#ingest-status').textContent = 'Document indexed for ' + tenant + ' in this session.';
});
updateIdentity();
