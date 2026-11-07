import { mountThinkingIndicator } from './thinking-indicator.js';
const REPO='https://github.com/akilanpl/mindscape';
const explanations={
  multiply:t=>`Multiply ${t.state_before.left_digits[t.action.position]} × ${t.state_before.right_digits[t.action.row_position]}, then add the incoming carry of ${t.state_before.carry}. Write ${t.result.written_digit} and carry ${t.result.carry}.`,
  flush:t=>`Append the remaining carry. This partial row is now ${t.state_after.row_value}.`,
  accumulate:t=>`Shift the partial row by ${t.state_before.row_position} decimal place${t.state_before.row_position===1?'':'s'} and add it to the total: ${t.state_after.accumulated}.`,
  finish:t=>`Apply the operand sign (${t.state_before.sign===1?'positive':'negative'}) to materialize the final answer: ${t.state_after.answer}.`,
};
export function mountMindscapeExperience(scroll, {thinkingMs=3000}={}){
  const section=document.createElement('section');section.className='mindscape-experience';section.hidden=true;section.setAttribute('aria-labelledby','mindscape-live-title');
  section.innerHTML=`<div class="experience-heading"><span class="experience-kicker">MINDSCAPE / INSIDE THE SYSTEM</span><h2 id="mindscape-live-title">Inspect the result.<br><em>Account for every step.</em></h2><p>Three domains. Three inspectable methods. Explore arithmetic, recursive code, and electric-field superposition.</p></div>
  <div class="mindscape-chat"><header><div><img src="assets/project-1.svg" alt="" width="32" height="32"><span>Mindscape<small>Execution explorer</small></span></div><button type="button" class="chat-reset">New example ↺</button></header>
  <div class="chat-log" role="log" aria-label="Mindscape conversation" aria-live="polite"><div class="chat-welcome"><span class="chat-spark" aria-hidden="true">✳</span><h3>Choose a computation to inspect.</h3><p>Choose a domain to inspect its output, execution evidence, and method-specific checks.</p></div></div>
  <div class="prompt-options" aria-label="Suggested questions"></div>
  <form class="chat-composer"><label for="mindscape-prompt">Your question</label><div><textarea id="mindscape-prompt" rows="2" readonly placeholder="Choose one of the suggested questions above"></textarea><button type="submit" disabled aria-label="Run selected example">↑</button></div><p>Recorded foundation and hybrid-tool runs. No live neural inference.</p></form><p class="experience-status" role="status"></p></div>
  <section class="experience-process" hidden aria-labelledby="mindscape-process-title"><div class="process-heading"><span class="experience-kicker">BENEATH THE ANSWER</span><h3 id="mindscape-process-title">Evidence you can inspect.</h3><p>Inspect the evidence appropriate to each method: state transitions, interpreter snapshots, or physical-law calculations.</p></div><div class="trace-workspace"><div class="trace-controls"><span class="trace-counter"></span><div><button type="button" class="trace-prev" aria-label="Previous evidence step">←</button><button type="button" class="trace-next" aria-label="Next evidence step">→</button></div></div><input class="trace-range" type="range" min="0" value="0" aria-label="Evidence step"><div class="trace-step" aria-live="polite"></div><div class="state-comparison"></div><details class="trace-json"><summary>Inspect the original evidence record</summary><pre></pre></details></div>
  <div class="replay-receipt"><div><span class="receipt-state">✓ Replay verified</span><p>The original Python verifier reconstructed the full trajectory and validated the completed goal and final answer.</p></div><button type="button" class="tamper-check">What if a carry changes?</button><p class="tamper-result" role="status"></p></div></section>
  <section class="mindscape-comparison" aria-labelledby="comparison-title"><span class="experience-kicker">WHAT CHANGES?</span><h3 id="comparison-title">Different outputs.<br>Different evidence.</h3><div class="comparison-columns"><article><span>01 / PLAIN LLM RESPONSE</span><h4>A generated response</h4><p>A plain language-model call produces tokens conditioned on its context. A written explanation is part of that response; it does not, by itself, establish that the described operations were executed.</p><div class="comparison-flow">Prompt → generated response</div></article><article><span>02 / MINDSCAPE EXECUTION</span><h4>An identified computation</h4><p>Mindscape separates method from evidence. The foundation preserves replayable state transitions; the optional hybrid integration uses bounded code and physics tools. Each result identifies which method produced it and what was checked.</p><div class="comparison-flow">Input → identified method → result → method-specific checks</div></article></div><p class="comparison-limit">The showcase combines a foundation example with two tools from the optional hybrid integration. It does not run Qwen or a learned Mindscape model. LLM applications can also use tools and verifiers; these curated cases demonstrate capability and evidence, not peak model accuracy or a comparative benchmark.</p><div class="experience-sources"><a href="${REPO}/blob/main/src/mindscape/environments/multiplication/environment.py" target="_blank" rel="noreferrer">Execution source ↗</a><a href="${REPO}/blob/main/src/mindscape/verification/verifier.py" target="_blank" rel="noreferrer">Replay verifier ↗</a><a href="${REPO}/blob/main/integrations/hybrid/mindscape_delivery/solvers.py" target="_blank" rel="noreferrer">Code interpreter ↗</a><a href="${REPO}/blob/main/integrations/hybrid/mindscape_delivery/advanced.py" target="_blank" rel="noreferrer">Physics tool ↗</a><a href="${REPO}" target="_blank" rel="noreferrer">Full research ↗</a></div></section>`;
  scroll.append(section);
  const q=s=>section.querySelector(s),options=q('.prompt-options'),composer=q('form'),input=q('textarea'),submit=q('[type="submit"]'),log=q('.chat-log'),status=q('.experience-status');
  const welcome=log.innerHTML;let data,selected,current,position=0,altered=false,loading,pending=false,pendingTimer,stopThinking=()=>{},runId=0;
  async function load(){
    if(data)return data;if(loading)return loading;
    status.textContent='Loading the recorded showcase…';
    loading=fetch('assets/mindscape-examples.json').then(r=>{if(!r.ok)throw Error('Unable to load');return r.json();}).then(value=>{data=value;options.replaceChildren();
      for(const example of data.examples){const button=document.createElement('button');button.type='button';button.className='prompt-option';button.textContent=example.title;button.setAttribute('aria-label',example.prompt);button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>select(example));options.append(button);}
      status.textContent='Math, coding, and physics. Choose a domain to begin.';return data;
    }).catch(()=>{status.textContent='Examples could not load. Close and reopen this experience to retry.';loading=null;return null;});return loading;
  }
  function select(example){if(pending)return;selected=example;input.value=example.prompt;submit.disabled=false;[...options.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(data.examples[i]===example)));input.focus({preventScroll:true});}
  function records(example){
    if(example.subject==='math')return example.trajectory.transitions;
    if(example.subject==='coding')return example.raw_result.trace;
    return example.raw_result.steps;
  }
  const format=value=>value===undefined||value===null?'—':typeof value==='object'?JSON.stringify(value):String(value);
  function trace(){
    const list=records(current),t=list[position],kind=current.subject;
    q('.trace-counter').textContent=`${String(position+1).padStart(2,'0')} / ${list.length} ${kind==='math'?'transitions':kind==='coding'?'snapshots':'worked steps'}`;
    q('.trace-prev').disabled=position===0;q('.trace-next').disabled=position===list.length-1;q('.trace-range').value=position;
    const title=document.createElement('h4'),detail=document.createElement('p');let rows,headers=['State','Before','After'];
    if(kind==='math'){
      title.textContent=t.event.name.replaceAll('_',' ');detail.textContent=explanations[t.action.name](t);
      rows=[['phase','Phase'],['carry','Carry'],['row_value','Partial row'],['accumulated','Accumulated total'],['answer','Answer']].map(([key,label])=>[label,t.state_before[key],t.state_after[key]]);
    }else if(kind==='coding'){
      title.textContent=`Line ${t.line} · call depth ${t.call_depth}`;
      detail.textContent=current.code.split('\n')[t.line-1]?.trim()||'Execution snapshot';
      headers=['Recorded field','Previous snapshot','Current snapshot'];const prev=list[position-1];
      rows=[['Call depth',prev?.call_depth,t.call_depth],['Output count',prev?.output_count,t.output_count],['Scope variables',prev?.variables,t.variables]];
    }else{
      title.textContent=position===0?'Assumptions and axes':position===list.length-1?'Net field':'Charge contribution '+position;detail.textContent=t;
      headers=['Input','Value','Unit'];rows=[['Observation point','(0, 0)','m'],['Charge 1','+3 at (−0.30, 0)','μC; m'],['Charge 2','−2 at (0, 0.40)','μC; m'],['Charge 3','+1 at (0.30, 0.40)','μC; m'],['Supplied constant k','9 × 10⁹','N·m²/C²']];
    }
    q('.trace-step').replaceChildren(title,detail);
    const table=document.createElement('table'),head=document.createElement('thead'),hr=document.createElement('tr'),body=document.createElement('tbody');
    for(const label of headers){const th=document.createElement('th');th.scope='col';th.textContent=label;hr.append(th);}head.append(hr);
    for(const values of rows){const row=document.createElement('tr');values.forEach((value,index)=>{const cell=document.createElement(index?'td':'th');if(!index)cell.scope='row';cell.textContent=format(value);row.append(cell);});body.append(row);}
    table.append(head,body);q('.state-comparison').replaceChildren(table);
    q('.trace-json pre').textContent=JSON.stringify(kind==='physics'?{step:position+1,worked_step:t,input:current.input,method:current.raw_result.method,verification:current.raw_result.verification}:t,null,2);
  }
  function cancelThinking(){runId++;clearTimeout(pendingTimer);stopThinking();stopThinking=()=>{};pending=false;composer.removeAttribute('aria-busy');for(const b of options.children)b.disabled=false;submit.disabled=!selected;}
  composer.addEventListener('submit',event=>{event.preventDefault();if(!selected||pending)return;current=selected;position=0;altered=false;pending=true;const id=++runId;
    composer.setAttribute('aria-busy','true');submit.disabled=true;for(const b of options.children)b.disabled=true;
    q('.experience-process').hidden=true;log.replaceChildren();const question=document.createElement('div');question.className='chat-message chat-user';question.textContent=current.prompt;
    const thinking=document.createElement('div');thinking.className='chat-thinking';thinking.innerHTML='<canvas aria-hidden="true"></canvas><div><span>Thinking</span><p>Preparing the recorded execution for inspection.</p></div>';log.append(question,thinking);
    status.textContent='Opening the recorded trace. This short transition does not run model inference.';stopThinking=mountThinkingIndicator(thinking.querySelector('canvas'));
    pendingTimer=setTimeout(()=>{if(id!==runId)return;stopThinking();pending=false;composer.removeAttribute('aria-busy');for(const b of options.children)b.disabled=false;submit.disabled=false;

    log.replaceChildren();const user=document.createElement('div');user.className='chat-message chat-user';user.textContent=current.prompt;
    const answer=document.createElement('div');answer.className='chat-message chat-answer';const label=document.createElement('span');label.className='answer-label';label.textContent=`MINDSCAPE / ${current.subject.toUpperCase()} / RECORDED RUN`;
    const result=document.createElement(current.subject==='coding'?'pre':'p');result.className='chat-result';result.textContent=current.display_answer;
    const description=document.createElement('p');description.textContent=current.summary;answer.append(label,result,description);
    if(current.code){const code=document.createElement('details');code.className='showcase-code';const summary=document.createElement('summary');summary.textContent='Inspect the Python program';const pre=document.createElement('pre');pre.textContent=current.code;code.append(summary,pre);answer.append(code);}
    if(current.subject==='physics'){const diagram=document.createElement('div');diagram.className='field-diagram';diagram.innerHTML='<svg viewBox="0 0 420 230" role="img" aria-label="Three point charges and the resultant electric field at the origin. Schematic, not to scale."><defs><marker id="field-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#557f9c"/></marker></defs><path d="M35 170H385M180 205V20" stroke="#dce2e7"/><path d="M180 170L325 125" stroke="#557f9c" stroke-width="3" marker-end="url(#field-arrow)"/><g fill="#8299ac"><circle cx="65" cy="170" r="7"/><circle cx="180" cy="45" r="7"/><circle cx="330" cy="45" r="7"/></g><circle cx="180" cy="170" r="4" fill="#333"/><g fill="#717c85" font-family="Geist,Arial,sans-serif" font-size="11"><text x="37" y="195">+3 μC</text><text x="150" y="28">−2 μC</text><text x="303" y="28">+1 μC</text><text x="190" y="191">Origin</text><text x="306" y="110">Net E</text><text x="30" y="222">Cartesian components · schematic</text></g></svg>';answer.append(diagram);}
    log.append(user,answer);
    q('.experience-process').hidden=false;q('.trace-range').max=records(current).length-1;q('.tamper-result').textContent='';q('.tamper-check').textContent=current.challenge_label;
    q('.receipt-state').textContent='✓ '+current.evidence_label;q('.replay-receipt>div>p').textContent=current.evidence_description;
    trace();status.textContent=`${current.subject[0].toUpperCase()+current.subject.slice(1)}: recorded ${current.subject==='math'?'foundation':'hybrid-tool'} execution. No neural inference was run.`;
    },thinkingMs);
  });
  q('.chat-reset').addEventListener('click',()=>{cancelThinking();selected=null;current=null;input.value='';submit.disabled=true;log.innerHTML=welcome;q('.experience-process').hidden=true;[...options.children].forEach(b=>b.setAttribute('aria-pressed','false'));status.textContent='Choose another example to explore.';});
  q('.trace-prev').addEventListener('click',()=>{if(position>0){position--;trace();}});q('.trace-next').addEventListener('click',()=>{if(position<records(current).length-1){position++;trace();}});q('.trace-range').addEventListener('input',e=>{position=Number(e.target.value);trace();});
  q('.tamper-check').addEventListener('click',()=>{
    altered=!altered;
    q('.tamper-result').textContent=altered?(current.subject==='math'?`Recorded tamper test: adding 1 to the first result’s carry was rejected by the Python verifier. ${current.tamper_verification.errors.join('. ')}. The final answer cannot validate an altered trace.`:current.challenge_result):'Original recorded example restored.';
    q('.tamper-check').textContent=altered?'Restore the original example':current.challenge_label;
  });
  return {show(enabled){if(!enabled){cancelThinking();if(log.querySelector('.chat-thinking'))log.innerHTML=welcome;}section.hidden=!enabled;scroll.classList.toggle('has-experience',enabled);if(enabled)load();},focus(){section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});options.querySelector('button')?.focus({preventScroll:true});}};
}
