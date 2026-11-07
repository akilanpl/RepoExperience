const screen = document.querySelector('#screen');
const nav = document.querySelector('nav');
const picker = document.querySelector('select');
const notice = document.querySelector('#notice');
const roles = {
  customer: ['Customer','Preview Explorer','What are your plans for today?','Track your rooftop solar enquiry, quotations, and installation.', {store:'Solar store', enquiries:'My enquiries', new:'New solar enquiry', quotes:'Quotations', jobs:'Installation work', tickets:'Support tickets'}],
  sales: ['Sales','Rahul Iyer','Ready to review feasibility today?','Screen enquiries, review surveys, and manage customer quotations.', {enquiries:'Enquiry funnel', surveys:'Site feasibility surveys', quotes:'Quotations'}],
  technician: ['Technician','Kavya Rao','Ready for your next site visit?','Record site measurements and update assigned installation work.', {surveys:'Field surveys', jobs:'Installation jobs'}],
  warehouse: ['Warehouse','Imran Sheikh','What solar inventory needs dispatch today?','Review physical stock and record equipment handoffs.', {picking:'Picking queue', stock:'Physical inventory'}],
  support: ['Support','Meera Krishnan','Ready to review customer requests?','Triage incoming service requests and check warranty coverage.', {tickets:'Support inbox', warranty:'Warranty operations'}],
  admin: ['Admin','Asha Menon','Solar operations & your team today?','Review team accounts and company operations.', {employees:'Employees', finance:'Finance & reports'}],
};
const defaultData = { enquiry: null, stage: 'new', ticket: null };
const key = 'solarops-preview-v1';
let data = defaultData;
try { data = JSON.parse(sessionStorage.getItem(key)) ?? defaultData; } catch {}
let route;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const badge = value => `<span class="badge">${esc(value)}</span>`;
const heading = (title, description) => `<h2>${title}</h2><p class="intro">${description}</p>`;
const link = (role, page, label, primary = false) => `<a class="button ${primary ? 'primary' : ''}" href="#${role}/${page}">${label}</a>`;
const action = (name, label) => `<button class="primary" type="button" data-action="${name}">${label}</button>`;
const card = (title, body) => `<section class="card"><h3>${title}</h3>${body}</section>`;
const table = (headers, rows) => `<div class="table"><table><thead><tr>${headers.map(item => `<th scope="col">${item}</th>`).join('')}</tr></thead><tbody>${rows.map(row => '<tr>' + row.map(item => `<td>${item}</td>`).join('') + '</tr>').join('')}</tbody></table></div>`;
const stages = {
  submitted: 'Submitted', qualified: 'Qualified', assigned: 'Assigned', surveyed: 'Survey submitted',
  quoted: 'Quotation issued', accepted: 'Accepted for demo fulfilment', dispatched: 'Dispatched', installed: 'Installed',
};
const money = amount => '₹' + Number(amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const products = [
  ['Solar panel 540 W','solar-panel-540w',5500],
  ['On-grid inverter 5 kW','solar-inverter-5kw',37000],
  ['Solar battery 5 kWh','solar-battery-5kwh',68000],
];
const glyphs = {home:'▦',store:'▣',enquiries:'▤',new:'⊕',quotes:'▧',surveys:'▦',jobs:'⚒',picking:'▱',stock:'◇',tickets:'♧',warranty:'◈',employees:'♙',finance:'▥'};
const stat = (title,value,detail) => `<article class="stat"><i aria-hidden="true">◇</i><h3>${title}</h3><strong>${value}</strong><small>${detail}</small></article>`;

for (const [role,[label]] of Object.entries(roles)) picker.add(new Option(label,role));
picker.addEventListener('change', () => { location.hash = picker.value + '/home'; });

function commit(patch, message, page) {
  data = {...data,...patch};
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
  notice.textContent = message;
  if (page) location.hash = route[0] + '/' + page;
  else render();
}

function dashboard(role) {
  const [label,name,title,description,pages] = roles[role];
  const first = {customer:'new',sales:'enquiries',technician:'surveys',warehouse:'picking',support:'tickets',admin:'employees'}[role];
  const calls = {customer:'New solar enquiry',sales:'Review enquiries',technician:'Open field surveys',warehouse:'View picking queue',support:'Open support inbox',admin:'Manage employees'};
  const summaries = {
    customer:[['My enquiries',data.enquiry ? 1 : 0,'Recorded submissions'],['Quotations',['quoted','accepted','dispatched','installed'].includes(data.stage) ? 1 : 0,'Issued records'],['Confirmed orders',['accepted','dispatched','installed'].includes(data.stage) ? 1 : 0,'Demo order records']],
    sales:[['Enquiry funnel',data.enquiry ? 1 : 0,'Recorded submissions'],['Quotations',data.quote ? 1 : 0,'Issued records']],
    technician:[['Assigned surveys',data.stage === 'assigned' ? 1 : 0,'Field visits'],['Installations',data.stage === 'installed' ? 1 : 0,'Completed work']],
    warehouse:[['Inventory positions',3,'Component and location balances'],['Deliveries',['dispatched','installed'].includes(data.stage) ? 1 : 0,'Recorded dispatches']],
    support:[['Support tickets',data.ticket ? 1 : 0,'Customer requests'],['Open',data.ticket?.status === 'Open' ? 1 : 0,'Awaiting triage']],
    admin:[['Operations staff',5,'Workspace personnel'],['Active accounts',5,'Demo roster']],
  };
  return `<p class="eyebrow">SolarOps / Your connected workspace</p><div class="row"><h1>Hello, ${name}</h1>${badge(label)}</div>
    <p class="muted">Solar projects, people and records — together in one place.</p>
    <div class="hero"><div><h2>Hi, ${name.split(' ')[0]}! <span class="eyebrow">✺</span><br>${title}</h2><p class="muted">${description}</p></div>
    <div class="metrics"><article class="stat"><i aria-hidden="true">✚</i>${link(role,first,calls[role],true)}</article>${summaries[role].map(values => stat(...values)).join('')}</div></div>
    <p class="strip">▣ &nbsp; This workspace uses sample records and saves your changes for this browser session.</p>
    <p class="eyebrow">SolarOps / Operations</p><h2>${label === 'Technician' ? 'Field engineering' : label === 'Warehouse' ? 'Inventory & dispatch' : 'Your ' + label.toLowerCase() + ' workspace'}</h2>
    <div class="grid"><section class="card focus"><p class="eyebrow">Workspace focus</p><h2>${title}</h2><p class="muted">${description}</p></section><section class="card"><h3>Workspace pages</h3><div class="actions">${Object.entries(pages).map(([page,name]) => link(role,page,name)).join('')}</div></section></div>`;
}

function enquiryForm() {
  return heading('New solar connection enquiry','Submit your rooftop requirements for a sales review.')
    + `<form class="card form-grid" data-form="enquiry">
      <label>Contact name<input name="name" required value="Preview Explorer" maxlength="80"></label>
      <label>Mobile<input name="mobile" type="tel" placeholder="Optional demo number"></label>
      <label>Email<input type="email" name="email" value="explorer@example.com" required></label>
      <label>Preferred capacity<select name="capacity"><option>3 kW</option><option>5 kW</option><option>8 kW</option></select></label>
      <label>Connection type<select name="connection"><option>On-grid</option><option>Off-grid</option><option>Hybrid</option></select></label>
      <label>Estimated monthly electricity bill (₹)<input type="number" min="0" name="bill" value="5000" required></label>
      <label>Site address<input name="address" value="Demo site" required maxlength="120"></label><label>Address line 2<input name="address2"></label>
      <label>City<input name="city" value="Chennai" required maxlength="60"></label><label>State<input name="state" value="Tamil Nadu"></label>
      <label>PIN code<input name="pin" inputmode="numeric" pattern="[0-9]{6}" value="600001"></label>
      <div class="full actions"><button class="primary">Submit enquiry</button></div></form>`;
}

function workflow(role,page) {
  const enquiry = data.enquiry;
  const status = badge(stages[data.stage] ?? 'No enquiry');
  if (page === 'new') return enquiryForm();
  if (page === 'store') {
    return heading('Solar store','Explore equipment and request a rooftop installation.')
      + '<div class="grid">' + products.map(([name, image, amount]) => `<article class="card product"><img src="products/${image}.jpg" alt=""><h3>${name}</h3><p class="muted">${money(amount)}</p><div class="actions">${link(role,'new','Request an enquiry',true)}</div></article>`).join('') + '</div>';
  }
  if (page === 'enquiries') {
    const next = role === 'sales' && data.stage === 'submitted' ? action('qualify','Qualify enquiry') : '';
    return heading(role === 'sales' ? 'Enquiry funnel' : 'My enquiries','Review recorded submissions and their current status.')
      + (enquiry ? card('ENQ-DEMO-0001', table(['Contact','Status','System','Bill'], [[esc(enquiry.name),status,esc(enquiry.capacity + ' · ' + enquiry.connection),money(enquiry.bill)]]) + `<div class="actions">${next}${role === 'sales' ? link(role,'surveys','Open site surveys') : ''}</div>`)
        : card('No enquiries yet',`<div class="actions">${link('customer','new','New enquiry',true)}</div>`));
  }
  if (page === 'surveys') {
    const next = role === 'sales'
      ? data.stage === 'qualified' ? action('assign','Assign to Kavya Rao') : data.stage === 'surveyed' ? action('quote','Generate quotation and BOM') : ''
      : data.stage === 'assigned' ? `<form class="form-grid" data-form="survey"><label>Roof direction<select name="direction"><option>South</option><option>East</option><option>West</option></select></label><label>Shadow-free area (m²)<input name="area" type="number" min="1" required value="28"></label><label>Cable distance (m)<input name="distance" type="number" min="1" required value="35"></label><label>Survey notes<input name="notes" value="Clear cable route"></label><div class="full actions"><button class="primary">Submit survey</button></div></form>` : '';
    return heading(role === 'sales' ? 'Site Feasibility Surveys' : 'Assigned Rooftop Field Surveys','Recorded site measurements and field evidence.')
      + card(enquiry ? 'SUR-DEMO-0001' : 'No surveys yet', `<p class="muted">${esc(enquiry?.address)} ${esc(enquiry?.city)}</p><div class="actions">${status}</div>
      ${data.survey ? `<p class="muted">Roof direction ${esc(data.survey.direction)} · Area ${esc(data.survey.area)} m² · Cable ${esc(data.survey.distance)} m</p>` : ''}<div class="actions">${next}</div>`);
  }
  if (page === 'quotes') {
    return heading('Quotations','Review the proposal and its bill of materials.')
      + (data.quote ? card('QTN-DEMO-0001 · Version 1',`<div class="actions">${status}</div>` + table(['Item','Quantity','Amount'], [['Solar panel 540 W',8,money(44000)],['On-grid inverter',1,money(37000)],['Installation service',1,money(15000)],['Demo total','',money(96000)]])
        + `<div class="actions">${role === 'customer' && data.stage === 'quoted' ? action('accept','Accept and release demo order') : ''}</div><p class="muted">The live workspace verifies payment before releasing an order.</p>`) : card('No quotations issued','<p class="muted">Sales can issue a quotation after the technician submits a survey.</p>'));
  }
  if (page === 'picking') {
    return heading('Picking queue','Review the equipment for orders released to fulfilment.')
      + (['accepted','dispatched','installed'].includes(data.stage) ? card('ORD-DEMO-0001',`<div class="actions">${status}</div>` + table(['Component','Location','Quantity'], [['PANEL-540','MAIN',8],['INV-ONG','MAIN',1]]) + `<div class="actions">${data.stage === 'accepted' ? action('dispatch','Confirm pick and dispatch') : ''}</div>`) : card('No orders ready to pick','<p class="muted">An accepted demo order appears here.</p>'));
  }
  if (page === 'jobs') {
    return heading(role === 'technician' ? 'Assigned installation jobs' : 'Installation work','Track installation after equipment dispatch.')
      + (['dispatched','installed'].includes(data.stage) ? card('JOB-DEMO-0001',`<p class="muted">${esc(enquiry?.address)} · ${esc(enquiry?.city)}</p><div class="actions">${status}${role === 'technician' && data.stage === 'dispatched' ? action('install','Record installation complete') : ''}</div>`) : card('No installation jobs','<p class="muted">A job appears when the warehouse dispatches the demo order.</p>'));
  }
  if (page === 'tickets') {
    const open = role === 'customer' && !data.ticket ? '<form data-form="ticket" class="form-grid"><label class="full">Describe your issue<textarea name="description" required maxlength="500"></textarea></label><div class="full"><button class="primary">Submit ticket</button></div></form>' : '';
    return heading(role === 'customer' ? 'Support & warranty' : 'Support inbox','Review and triage customer service requests.')
      + (data.ticket ? card('TKT-DEMO-0001',`<div class="row"><p>${esc(data.ticket.description)}</p>${badge(data.ticket.status)}</div><div class="actions">${role === 'support' && data.ticket.status === 'Open' ? action('triage','Mark under review') : ''}</div>`) : card('No tickets yet',open));
  }
  if (page === 'stock') return heading('Physical Inventory & Locations','On-hand quantities by component and location.') + card('Inventory positions',table(['Component','Location','On hand'],[['PANEL-540','MAIN','91'],['INV-ONG','MAIN','9'],['BAT-1KWH','MAIN','18']]));
  if (page === 'warranty') return heading('Warranty operations','Review coverage associated with installed equipment.') + card('Coverage register', data.stage === 'installed' ? table(['Installation','Equipment','Coverage'],[['JOB-DEMO-0001','Solar panel and inverter','Demo installation recorded']]) : '<p class="muted">No installation has been recorded in this session.</p>');
  if (page === 'employees') return heading('Employees','Review the workspace team roster.') + card('Operations staff',table(['Name','Role'],Object.values(roles).slice(1).map(([name,person]) => [person,name])));
  return heading('Company-wide executive analytics','Review demo order activity and recorded payments.') + '<div class="metrics">' + stat('Issued quotation value',data.quote ? money(96000) : money(0),'Demo proposals') + stat('Recorded cash',money(0),'No live payments in this workspace') + '</div>';
}

function render() {
  const [requestedRole, requestedPage] = location.hash.slice(1).split('/');
  const role = Object.hasOwn(roles,requestedRole) ? requestedRole : 'customer';
  const pages = roles[role][4];
  const page = Object.hasOwn(pages,requestedPage) ? requestedPage : 'home';
  route = [role,page];
  picker.value = role;
  document.querySelector('.home').href = '#' + role + '/home';
  nav.innerHTML = Object.entries({home:'Dashboard',...pages}).map(([id,name]) =>
    `<a href="#${role}/${id}" aria-label="${name}" title="${name}" ${id === page ? 'aria-current="page"' : ''}><span aria-hidden="true">${glyphs[id]}</span></a>`).join('');
  screen.innerHTML = page === 'home' ? dashboard(role) : workflow(role,page);
}

screen.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const values = Object.fromEntries(new FormData(form));
  if (form.dataset.form === 'enquiry') commit({enquiry:values, stage:'submitted', survey:null, quote:false},'Enquiry submitted. Open Sales to review it.','enquiries');
  if (form.dataset.form === 'survey') commit({survey:values, stage:'surveyed'},'Survey submitted. Open Sales to generate the quotation.');
  if (form.dataset.form === 'ticket') commit({ticket:{description:values.description,status:'Open'}},'Support ticket submitted.');
});
const transitions = {
  qualify: ['submitted',{stage:'qualified'},'Enquiry qualified. Open site surveys to assign it.'],
  assign: ['qualified',{stage:'assigned'},'Assigned to Kavya Rao. Open the Technician workspace.'],
  quote: ['surveyed',{stage:'quoted',quote:true},'Quotation issued. Open Customer to review it.','quotes'],
  accept: ['quoted',{stage:'accepted'},'Demo order released. Open Warehouse to pick it.'],
  dispatch: ['accepted',{stage:'dispatched'},'Equipment dispatched. Open Technician to record installation.'],
  install: ['dispatched',{stage:'installed'},'Installation recorded. Coverage is visible in Support.'],
};
screen.addEventListener('click', event => {
  const name = event.target.closest('[data-action]')?.dataset.action;
  if (name === 'triage' && data.ticket?.status === 'Open') {
    commit({ticket:{...data.ticket,status:'Under review'}},'Ticket moved to review.');
    return;
  }
  if (!Object.hasOwn(transitions,name)) return;
  const [required,patch,message,page] = transitions[name];
  if (data.stage === required) commit(patch,message,page);
});

addEventListener('hashchange', render);
render();
