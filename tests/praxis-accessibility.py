"""Usage: python3 tests/praxis-accessibility.py /path/to/axe.min.js"""
import json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1];results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page()
 for width in [390,1280]:
  page.set_viewport_size({'width':width,'height':1000})
  for state in ['workspace','suites','run','evidence','compare','arena','reports','models','agents','apps','methodology']:
   page.goto('http://127.0.0.1:8767/demos/praxis/#'+state);page.wait_for_selector('h1');page.add_script_tag(path=sys.argv[1])
   r=page.evaluate('''async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return {engine:axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,count:v.nodes.length,reasons:[...new Set(v.nodes.flatMap(n=>n.any.map(c=>c.message)))]}))}}''')
   results.append(dict(width=width,state=state,**r))
 browser.close()
(root/'docs/praxis/accessibility-results.json').write_text(json.dumps(results,indent=2)+'\n')
assert not any(r['violations'] for r in results)
print(f'PASS: no automated A/AA violations across {len(results)} views; incomplete checks retained')
