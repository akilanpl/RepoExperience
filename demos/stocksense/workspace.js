const groups = {
  Overview: { dashboard: ['Dashboard','▦'] },
  Operations: { receipts: ['Receipts','▤'], deliveries: ['Deliveries','▱'], transfers: ['Transfers','⇄'], adjustments: ['Adjustments','◇'] },
  Inventory: { products: ['Products','⬡'], stock: ['Stock','▣'], history: ['Move History','◷'] },
  'Master data': { warehouses: ['Warehouses','⌂'], locations: ['Locations','⌖'] },
};
const pages = Object.assign({}, ...Object.values(groups));
const operations = {
  receipts: { label:'Receipt', prefix:'RCP', description:'Incoming operations that bring stock into a location when validated.', to:'A', quantity:100 },
  deliveries: { label:'Delivery', prefix:'DLV', description:'Outgoing operations that ship stock from a location when validated.', from:'B', quantity:20 },
  transfers: { label:'Transfer', prefix:'TRF', description:'Internal movements between stock locations.', from:'A', to:'B', quantity:30 },
  adjustments: { label:'Adjustment', prefix:'ADJ', description:'Counted corrections that raise or lower on-hand quantity at one location.', to:'B', quantity:8 },
};
const screen = document.querySelector('#screen');
const dialog = document.querySelector('dialog');
const nav = document.querySelector('nav');
const key = 'stocksense-inventory-v1';
const initial = () => ({
  products:[{sku:'FINALS-WIDGET',name:'Widget'}],
  warehouses:['Finals Warehouse'],
  locations:[{id:'A',name:'Rack A',warehouse:'Finals Warehouse'},{id:'B',name:'Rack B',warehouse:'Finals Warehouse'}],
  orders:[], balances:{}, moves:[],
});
let state = initial();
try { state = JSON.parse(sessionStorage.getItem(key)) ?? state; } catch {}
let message = '', error = false;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const button = (label, action, primary = false) => `<button type="button" class="${primary ? 'primary' : 'secondary'}" data-action="${action}">${label}</button>`;
const heading = (title,description,control='') => `<div class="heading"><div><h1>${title}</h1><p class="muted">${description}</p></div>${control}</div>`;
const card = (title,body) => `<section class="card"><h2>${title}</h2>${body}</section>`;
const badge = status => `<span class="badge ${status.toLowerCase()}">${status}</span>`;
const balanceKey = (sku,location) => JSON.stringify([sku,location]);
const quantityAt = (sku,location) => state.balances[balanceKey(sku,location)] ?? 0;
const locationName = id => state.locations.find(location => location.id === id)?.name ?? '—';
const productName = sku => state.products.find(product => product.sku === sku)?.name ?? sku;
const rowLink = order => `<a href="#${order.kind}/${order.id}">${esc(order.ref)}</a>`;
const table = (headers,rows) => `<div class="table"><table><thead><tr>${headers.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row => '<tr>' + row.map(value => `<td>${value}</td>`).join('') + '</tr>').join('') : `<tr><td colspan="${headers.length}" class="muted">No records to show.</td></tr>`}</tbody></table></div>`;
const movesTable = moves => table(['When','Type','Product','From','To','Quantity','Reference'], moves.map(move => [
  esc(move.when),operations[move.kind].label,esc(move.sku),esc(locationName(move.from)),esc(locationName(move.to)),move.quantity,rowLink(move),
]));

function currentRoute() {
  const [name,id] = location.hash.slice(1).split('/');
  return [Object.hasOwn(pages,name) ? name : 'dashboard', id];
}
function save(next,messageText) {
  state = next;
  try { sessionStorage.setItem(key,JSON.stringify(state)); } catch {}
  report(messageText);
}
function report(value,isError=false) {
  message = value;
  error = isError;
  document.querySelector('#announcement').textContent = value;
}

function dashboard() {
  const pending = kind => state.orders.filter(order => order.kind === kind && ['Draft','Ready'].includes(order.status));
  const stocked = state.products.filter(product => state.locations.some(location => quantityAt(product.sku,location.id) > 0)).length;
  const metrics = [['Total Products in Stock',stocked],['Low Stock',0],['Out of Stock',Object.values(state.balances).filter(value => value === 0).length],
    ['Pending Receipts',pending('receipts').length],['Pending Deliveries',pending('deliveries').length],['Internal Transfers Scheduled',pending('transfers').length]];
  return heading('Dashboard','Operational snapshot for stock, receipts, deliveries, and internal transfers.')
    + '<div class="metrics">' + metrics.map(([label,value]) => `<article class="card metric"><span>${label}</span><strong>${value}</strong></article>`).join('') + '</div>'
    + card('Recent Stock Movements',movesTable(state.moves.slice(0,6)))
    + card('Pending Operations',table(['Type','Reference','Status'],state.orders.filter(order => ['Draft','Ready'].includes(order.status)).map(order => [operations[order.kind].label,rowLink(order),badge(order.status)])));
}
function filterable(headers, rows, statusFilter=false) {
  const options = statusFilter ? '<label>Status<select id="status-filter"><option value="">All statuses</option><option>Draft</option><option>Ready</option><option>Done</option><option>Canceled</option></select></label>' : '';
  return `<div class="card"><div class="filters"><label>Search<input type="search" id="search" placeholder="Search by reference, SKU, or location"></label>${options}</div><div id="results">${table(headers,rows)}</div></div>`;
}
function updateFilters() {
  const query = screen.querySelector('#search')?.value.trim().toLowerCase() ?? '';
  const status = screen.querySelector('#status-filter')?.value ?? '';
  for (const row of screen.querySelectorAll('#results tbody tr')) {
    row.hidden = !row.textContent.toLowerCase().includes(query) || Boolean(status && row.querySelector('.badge')?.textContent !== status);
  }
}

function operationList(kind) {
  const config = operations[kind];
  const rows = state.orders.filter(order => order.kind === kind).map(order => [
    rowLink(order),esc(order.sku),esc(locationName(order.from)),esc(locationName(order.to)),order.quantity,esc(order.created),badge(order.status),`<a href="#${kind}/${order.id}">View</a>`,
  ]);
  return heading(pages[kind][0],config.description,button('+ Create ' + config.label,'create',true))
    + filterable(['Reference','SKU','From','To / Count location','Quantity','Created','Status',''],rows,true);
}
function operationDetail(order) {
  const info = operations[order.kind];
  const controls = order.status === 'Draft' ? button('Mark ready','ready',true) + button('Cancel operation','cancel')
    : order.status === 'Ready' ? button('Validate','validate',true) + button('Cancel operation','cancel') : '';
  return `<p><a href="#${order.kind}">← Back to ${pages[order.kind][0]}</a></p>
    ${heading(esc(order.ref) + ' ' + badge(order.status),info.description,`<div class="actions">${controls}</div>`)}
    <div class="details">${card('Operation',`<dl><dt>Type</dt><dd>${info.label}</dd><dt>Status</dt><dd>${order.status}</dd><dt>Created</dt><dd>${esc(order.created)}</dd></dl>`)}
    ${card('Locations',`<dl><dt>Source</dt><dd>${esc(locationName(order.from))}</dd><dt>Destination / Count location</dt><dd>${esc(locationName(order.to))}</dd></dl>`)}</div>
    ${card('Operation lines',table(['Product','SKU',order.kind === 'adjustments' ? 'Counted' : 'Requested','Processed'],[[esc(productName(order.sku)),esc(order.sku),order.quantity,order.status === 'Done' ? order.quantity : '—']]))}`;
}
function render() {
  const [name,id] = currentRoute();
  document.querySelector('#section-name').textContent = pages[name][0];
  nav.innerHTML = Object.entries(groups).map(([group,items]) => `<p>${group}</p>` + Object.entries(items).map(([page,[label,icon]]) =>
    `<a href="#${page}" ${page === name ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}</a>`).join('')).join('');
  const order = state.orders.find(item => String(item.id) === id && item.kind === name);
  let body;
  if (name === 'dashboard') body = dashboard();
  else if (operations[name]) body = order ? operationDetail(order) : operationList(name);
  else if (name === 'stock') body = heading('Stock','Current quantities by product and location.')
    + filterable(['Product','SKU','Warehouse','Location','On hand'],state.products.flatMap(product => state.locations.map(location =>
      [esc(product.name),esc(product.sku),esc(location.warehouse),esc(location.name),quantityAt(product.sku,location.id)])));
  else if (name === 'history') body = heading('Move History','Trace each posted stock movement.')
    + '<div class="card"><div class="filters"><label>Search<input id="search" type="search" placeholder="Reference or SKU"></label></div><div id="results">' + movesTable(state.moves) + '</div></div>';
  else {
    const master = {
      products:['Add Product',['Name','SKU','Unit'],state.products.map(product => [esc(product.name),esc(product.sku),'PCS'])],
      warehouses:['Add Warehouse',['Warehouse'],state.warehouses.map(warehouse => [esc(warehouse)])],
      locations:['Add Location',['Location','Code','Warehouse'],state.locations.map(location => [esc(location.name),esc(location.id),esc(location.warehouse)])],
    }[name];
    body = heading(pages[name][0],'Manage the demo inventory directory.',button('+ ' + master[0],'create',true)) + filterable(master[1],master[2]);
  }
  const feedback = message ? `<p class="message ${error ? 'error' : ''}">${esc(message)}</p>` : '';
  screen.innerHTML = feedback + body;
}

function showForm(name) {
  const info = operations[name];
  const locationOptions = selected => state.locations.map(location => `<option value="${esc(location.id)}" ${selected === location.id ? 'selected' : ''}>${esc(location.name)}</option>`).join('');
  const productOptions = state.products.map(product => `<option value="${esc(product.sku)}">${esc(product.name)} (${esc(product.sku)})</option>`).join('');
  const title = info ? 'Create ' + info.label.toLowerCase() : {products:'Add product',warehouses:'Add warehouse',locations:'Add location'}[name];
  const fields = info ? `<label>Reference<input name="ref" maxlength="60" placeholder="Generated when blank"></label>
    ${info.from ? `<label>Source location<select name="from">${locationOptions(info.from)}</select></label>` : ''}
    ${info.to ? `<label>${name === 'adjustments' ? 'Count location' : 'Destination location'}<select name="to">${locationOptions(info.to)}</select></label>` : ''}
    <label>Product<select name="sku">${productOptions}</select></label>
    <label>${name === 'adjustments' ? 'Counted quantity' : 'Quantity'}<input name="quantity" type="number" min="${name === 'adjustments' ? 0 : 1}" max="1000000" step="1" value="${info.quantity}" required></label>`
    : `<label>Name<input name="name" maxlength="60" required></label>
      ${name === 'products' ? '<label>SKU<input name="sku" maxlength="30" required></label>' : ''}
      ${name === 'locations' ? `<label>Location code<input name="code" maxlength="30" required></label><label>Warehouse<select name="warehouse">${state.warehouses.map(item => `<option>${esc(item)}</option>`).join('')}</select></label>` : ''}`;
  dialog.innerHTML = `<h2 id="dialog-title">${title}</h2><p class="muted">${info ? 'Save a draft. Stock changes only when the operation is validated.' : 'Add a record for this browser session.'}</p><form data-kind="${name}">${fields}<p class="form-error" role="alert"></p><div class="actions"><button type="button" data-close>Cancel</button><button class="primary">${info ? 'Save draft' : 'Save'}</button></div></form>`;
  dialog.showModal();
}

dialog.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) dialog.close();
});
dialog.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const kind = form.dataset.kind;
  const values = Object.fromEntries([...new FormData(form)].map(([name,value]) => [name,value.trim()]));
  const fail = text => { form.querySelector('.form-error').textContent = text; };
  if (kind === 'reset') {
    dialog.close();
    save(initial(),'Demo inventory reset.');
    location.hash = 'dashboard';
    render();
    return;
  }
  if (operations[kind]) {
    const id = state.orders.length + 1;
    const ref = values.ref || operations[kind].prefix + '-DEMO-' + String(id).padStart(3,'0');
    if (state.orders.some(order => order.ref.toLowerCase() === ref.toLowerCase())) return fail('Choose a unique reference.');
    if (values.from && values.from === values.to) return fail('Choose different source and destination locations.');
    const order = {...values,id,ref,kind,status:'Draft',quantity:Number(values.quantity),created:new Date().toLocaleString()};
    save({...state,orders:[order,...state.orders]},'Draft saved.');
    dialog.close();
    location.hash = kind + '/' + id;
    return;
  }
  if (!values.name || (kind === 'products' && !values.sku) || (kind === 'locations' && !values.code)) {
    return fail('Enter all required fields.');
  }
  if (kind === 'products' && state.products.some(item => item.sku.toLowerCase() === values.sku.toLowerCase())) return fail('This SKU already exists.');
  if (kind === 'warehouses' && state.warehouses.some(item => item.toLowerCase() === values.name.toLowerCase())) return fail('This warehouse already exists.');
  if (kind === 'locations' && state.locations.some(item => item.id.toLowerCase() === values.code.toLowerCase())) return fail('This location code already exists.');
  const item = kind === 'products' ? {name:values.name,sku:values.sku} : kind === 'warehouses' ? values.name
    : {name:values.name,id:values.code,warehouse:values.warehouse};
  save({...state,[kind]:[...state[kind],item]},'Record added.');
  dialog.close();
  render();
});

function updateOrder(order, status) {
  return state.orders.map(item => item.id === order.id ? {...item,status} : item);
}
function validate(order) {
  const {sku,from,to,kind,quantity} = order;
  const available = quantityAt(sku,from);
  if (from && available < quantity) {
    report('Insufficient stock. ' + locationName(from) + ' has ' + available + ' on hand. The operation is still Ready.',true);
    return;
  }
  const destination = quantityAt(sku,to);
  const adjustment = kind === 'adjustments';
  const delta = adjustment ? quantity - destination : quantity;
  const balances = {...state.balances};
  if (from) balances[balanceKey(sku,from)] = available - quantity;
  if (to) balances[balanceKey(sku,to)] = adjustment ? quantity : destination + quantity;
  const move = {...order,when:new Date().toLocaleString(),quantity:Math.abs(delta),from:adjustment && delta < 0 ? to : from,to:adjustment && delta < 0 ? null : to};
  const moves = delta === 0 ? state.moves : [move,...state.moves];
  save({...state,balances,moves,orders:updateOrder(order,'Done')},operations[kind].label + ' validated. ' + (delta ? 'Stock and move history updated.' : 'The count matches stock.'));
}

screen.addEventListener('input',updateFilters);
screen.addEventListener('change',updateFilters);
screen.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  const [name,id] = currentRoute();
  if (action === 'create') { showForm(name); return; }
  const order = state.orders.find(item => String(item.id) === id && item.kind === name);
  if (!order) return;
  if (action === 'ready' && order.status === 'Draft') save({...state,orders:updateOrder(order,'Ready')},'Operation marked ready.');
  if (action === 'cancel' && ['Draft','Ready'].includes(order.status)) save({...state,orders:updateOrder(order,'Canceled')},'Operation canceled.');
  if (action === 'validate' && order.status === 'Ready') validate(order);
  render();
});
document.querySelector('#reset').addEventListener('click', () => {
  dialog.innerHTML = '<h2 id="dialog-title">Reset demo inventory?</h2><p class="muted">This clears the records and stock movements from this browser session.</p><form data-kind="reset"><div class="actions"><button type="button" data-close>Cancel</button><button class="primary">Reset inventory</button></div></form>';
  dialog.showModal();
});
addEventListener('hashchange', render);
render();
