const find = selector => document.querySelector(selector);
const form = find('#mission');
const phases = ['Prelaunch','Ascent','Collection','Return'];
const materialNames = ['metal','plastic','electronics','organic'];
const finalStep = 30;
let phase = 0;
let timer;
let altitude = 500;
let telemetry = [];
let thrusters = [[],[],[]];
const randomBetween = (min,max) => min + Math.random()*(max-min);
const orbitalSpeed = () => Math.sqrt(398600.4418/(6371+altitude))*1000;
const status = value => { find('#mission-status').textContent = value; };

function log(message) {
  const list = find('#log');
  const line = document.createElement('li');
  line.textContent = String(telemetry.length).padStart(2,'0') + ' · ' + message;
  list.prepend(line);
}
function plot(selector, index, max, unit) {
  const x = step => 38 + (step-1)*250/(finalStep-1);
  const y = value => 96 - value*80/max;
  const lines = [0,max/2,max].map(value => `<line class="chart-grid" x1="38" x2="288" y1="${y(value)}" y2="${y(value)}"/><text x="4" y="${y(value)+3}">${value}</text>`).join('');
  const points = telemetry.map(row => x(row[0])+','+y(row[index])).join(' ');
  find(selector).innerHTML = lines + `<polyline class="chart-line" points="${points}"/><text x="38" y="112">Step 1</text><text x="218" y="112">30 · ${unit}</text>`;
}
function render() {
  const last = telemetry.at(-1);
  const loads = thrusters.map(items => items.reduce((sum,item) => sum+item.mass,0));
  const active = timer !== undefined;
  const ended = telemetry.length >= finalStep;
  const metrics = [['Step',telemetry.length + ' / ' + finalStep],['Phase',phases[phase]],['Temperature',last ? last[1].toFixed(1)+' °C' : '—'],['Avg. speed',last ? Math.round(last[2])+' m/s' : '—'],['Collected mass',loads.reduce((a,b)=>a+b,0).toFixed(1)+' kg']];
  find('#metrics').innerHTML = metrics.map(([label,value]) => `<div class="card metric"><p class="label">${label}</p><strong>${value}</strong></div>`).join('');
  find('#loads').innerHTML = thrusters.map((items,index) => {
    const materials = materialNames.filter(material => items.some(item => item.material === material));
    return `<div class="source"><h3>Thruster ${index+1} · ${loads[index].toFixed(1)} kg</h3><p class="muted">${items.length} captures${materials.length ? ' · '+materials.join(', ') : ''}</p></div>`;
  }).join('');
  document.querySelectorAll('.phase span').forEach((marker,index) => {
    if (index === phase) marker.setAttribute('aria-current','step');
    else marker.removeAttribute('aria-current');
  });
  for (const input of form.querySelectorAll('input')) input.disabled = phase > 0;
  find('#start').disabled = active || ended;
  find('#start').textContent = phase ? 'Resume mission' : 'Start mission';
  find('#pause').disabled = !active;
  find('#step').disabled = active || ended;
  find('#telemetry').disabled = !last;
  find('#debris').disabled = !last;
  plot('#temperature',1,500,'°C');
  plot('#speed',2,8000,'m/s');
}
function begin() {
  if (phase) return true;
  if (!form.reportValidity()) return false;
  altitude = Number(form.elements.altitude.value);
  phase = 1;
  log(form.elements.rocket.value + ' launched under ' + form.elements.commander.value + '.');
  return true;
}
function stop() {
  clearInterval(timer);
  timer = undefined;
}
function tick() {
  const step = telemetry.length+1;
  const temperatures = [[80,200],[200,500],[120,260],[80,200]];
  const speeds = phase === 1 ? [4000,7600] : phase === 2 ? [orbitalSpeed()-50,orbitalSpeed()+50] : [3000,7000];
  const average = thrusters.reduce(sum => sum+randomBetween(...speeds),0)/thrusters.length;
  telemetry.push([step,randomBetween(...temperatures[phase]),average]);
  if (phase === 1 && step === 10) {
    phase = 2;
    log('Three thrusters deployed for collection.');
  }
  if (phase === 2 && step === 25) {
    phase = 3;
    log('Collection window closed. Preparing return / disposal.');
  }
  if (phase === 2) {
    thrusters.forEach((items,index) => {
      if (Math.random() >= .6) return;
      const sample = Math.random();
      const material = materialNames[sample < .5 ? 0 : sample < .7 ? 1 : sample < .9 ? 2 : 3];
      const mass = Number(randomBetween(5,40).toFixed(1));
      items.push({material,mass});
      log('Thruster '+(index+1)+' captured '+mass+' kg of '+material+'.');
    });
  }
  if (step === finalStep) {
    stop();
    log('Browser mission replay complete.');
    status('Mission complete. Inspect loads or export the session.');
  } else {
    status(timer === undefined ? 'Step recorded. Select Step once or resume.' : phases[phase]+' in progress.');
  }
  render();
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (timer !== undefined || telemetry.length >= finalStep || !begin()) return;
  timer = setInterval(tick,500);
  tick();
});
find('#pause').addEventListener('click', () => { stop(); status('Mission paused.'); render(); });
find('#step').addEventListener('click', () => { if (begin()) tick(); });
find('#reset').addEventListener('click', () => {
  stop();
  phase = 0;
  telemetry = [];
  thrusters = [[],[],[]];
  find('#log').replaceChildren();
  status('Ready for launch.');
  render();
});
function download(name, header, rows) {
  const url = URL.createObjectURL(new Blob([header+'\n'+rows.map(row=>row.join(',')).join('\n')+'\n'],{type:'text/csv'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = name+'.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
find('#telemetry').addEventListener('click', () => download('telemetry','time_step,temperature_C,avg_speed_m_s',telemetry));
find('#debris').addEventListener('click', () => download('debris','thruster_id,material,mass_kg',thrusters.flatMap((items,index)=>items.map(item=>[index+1,item.material,item.mass]))));
addEventListener('pagehide', () => {
  stop();
  if (phase && telemetry.length < finalStep) status('Mission paused.');
  render();
});
render();
