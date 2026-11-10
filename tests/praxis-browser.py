"""Run against the static server on 8767; requires Playwright and Chromium."""
import json,pathlib,time
from playwright.sync_api import sync_playwright,expect
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'docs/praxis';SHOTS=OUT/'screenshots';SHOTS.mkdir(parents=True,exist_ok=True)
BASE='http://127.0.0.1:8767';results=[];errors=[];bad=[];requests=[]
def passed(name):results.append(name);print('PASS',name,flush=True)
def overflow(page):return page.evaluate('document.documentElement.scrollWidth<=innerWidth')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1280,'height':1000},permissions=['clipboard-read','clipboard-write'])
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
 page.on('request',lambda r:requests.append(r.url))
 page.goto(BASE+'/demos/praxis/');expect(page.locator('h1')).to_have_text('Evaluation workspace');expect(page.locator('.metric')).to_have_text(['6','40','3']);passed('Workspace: six suites, forty scenarios, three kinds')
 page.locator('nav a[href="#suites"]').click();expect(page.locator('#suite')).to_have_value('structured-agent');expect(page.locator('#scenario')).to_have_value('route-outage');expect(page.locator('body')).to_contain_text('production requests return 503');passed('Default source suite and route-outage input')
 suites=page.locator('#suite option').evaluate_all('(es)=>es.map(e=>e.value)')
 for slug in suites:
  page.select_option('#suite',slug);expect(page.locator('#suite')).to_have_value(slug);expect(page.locator('.task-layout')).to_be_visible();expect(page.locator('.task-list button')).to_have_count(4 if slug in ['agent-workflows','http-application'] else 8)
  tasks=page.locator('#scenario option').evaluate_all('(es)=>es.map(e=>e.value)')
  for task in tasks:
   page.select_option('#scenario',task);expect(page.locator('.panel-head h2').first).to_have_text(task)
  page.select_option('#mode','failing');expect(page.locator('#mode')).to_have_value('failing');expect(page.locator('.fail').first).to_be_visible()
 passed('All six suites, forty task definitions and genuine failing snapshots')
 page.select_option('#suite','structured-agent');page.locator('nav a[href="#run"]').click()
 for mode,total,assertions in [('passing','8/8','24/24'),('failing','0/8','8/24'),('recorded','0/8','0/24')]:
  page.select_option('#mode',mode);page.locator('#run-button').click();expect(page.locator('.progress-text')).to_contain_text('8/8 tasks replayed',timeout=5000);expect(page.locator('.metric').nth(0)).to_have_text(total);expect(page.locator('.metric').nth(1)).to_have_text(assertions)
 passed('Passing 8/8, failing 0/8, recorded 0/8; authentic assertion totals')
 page.locator('[data-task="route-outage"]').click();expect(page.locator('h1')).to_have_text('Run evidence');expect(page.locator('body')).to_contain_text("don't have the capability to access the chat server");expect(page.locator('body')).to_contain_text('RECORDED REAL INFERENCE');expect(page.locator('body')).to_contain_text('transformers.js CPU q4');passed('Recorded real output, provider metadata and failed assertion inspector')
 page.locator('[data-copy="output"]').click();expect(page.locator('.toast')).to_have_text('Copied to clipboard');assert "chat server" in page.evaluate('navigator.clipboard.readText()');passed('Output clipboard action')
 for slug,needle in [('agent-workflows','actual purchase state'),('http-application','body.status')]:
  page.select_option('#suite',slug);expect(page.locator('body')).to_contain_text(needle);expect(page.locator('body')).to_contain_text('tool_call' if slug=='agent-workflows' else 'http_request')
  page.select_option('#mode','failing');expect(page.locator('.fail').first).to_be_visible()
 passed('Agent state/permission traces and HTTP response contracts, both outcomes')
 page.locator('nav a[href="#compare"]').click();expect(page.locator('h1')).to_have_text('Matched evaluation matrix');expect(page.locator('body')).to_contain_text('NO AUTHENTIC MATCH RECEIPT');page.locator('nav a[href="#arena"]').click();expect(page.locator('.capture')).to_be_visible();passed('Explanatory comparison and authentic Arena capture')
 page.locator('nav a[href="#reports"]').click();expect(page.locator('#export')).to_be_visible()
 with page.expect_download() as download:page.locator('#export').click()
 exported=json.loads(pathlib.Path(download.value.path()).read_text());assert exported['report']['suite_slug']=='http-application';assert 'provenance' in exported
 page.evaluate('window.print=()=>window.__printed=true');page.locator('#print').click();assert page.evaluate('window.__printed');page.emulate_media(media='print');page.pdf(path='/tmp/praxis-public-report.pdf');page.emulate_media(media='screen');passed('Normalized JSON download and printable report')
 # Keyboard: skip to main, navigate links and operate selects with keys.
 page.goto('about:blank');page.goto(BASE+'/demos/praxis/#suites');page.wait_for_selector('#suite');page.keyboard.press('Tab');expect(page.locator('.skip')).to_be_focused();page.keyboard.press('Enter');expect(page.locator('#main')).to_be_focused();page.locator('#suite').focus();page.keyboard.press('Home');page.keyboard.press('ArrowDown');page.keyboard.press('Enter');expect(page.locator('#suite')).not_to_have_value('structured-agent');assert page.locator('#suite').evaluate('(e)=>getComputedStyle(e).outlineStyle')=='solid';passed('Keyboard skip link, native controls and visible focus')
 # Main page integration: steps update one frame without losing its state.
 page.goto(BASE+'/experience/praxis/');page.wait_for_selector('iframe');frame=page.frames[1];frame.wait_for_selector('h1');frame.evaluate('window.__continuity=42')
 for i,state in enumerate(['workspace','suites','run','evidence','compare']):
  page.locator('.tour-options button').nth(i).click();expect(page.locator('.tour-options button').nth(i)).to_have_attribute('aria-pressed','true');frame.wait_for_function('(s)=>location.hash==="#"+s',arg=state);assert frame.evaluate('window.__continuity')==42
 expect(page.locator('.tour-mode')).to_contain_text('Interactive demonstration');expect(page.locator('.tour-source')).to_have_attribute('href',__import__('re').compile('75243f70731f'))
 links=page.locator('#scope a').evaluate_all('(es)=>es.map(e=>e.href)');assert any('codex/praxis-final-release.zip' in a for a in links);assert any('LOCAL_INSTALLATION_RECOVERY.md' in a for a in links);assert not any('/HEAD/' in a or '/archive/HEAD' in a for a in links);passed('All five tour steps, one persistent iframe, pinned source and release onboarding')
 # Viewport screenshots, page and meaningful full evidence view.
 timings=[]
 for width in [390,768,1024,1280,1440]:
  page.set_viewport_size({'width':width,'height':1000 if width>768 else 900});page.goto(BASE+'/experience/praxis/');page.wait_for_selector('iframe');assert overflow(page),('page overflow',width);page.screenshot(path=str(SHOTS/f'page-{width}.png'),full_page=True)
  page.goto(BASE+'/demos/praxis/#evidence');page.wait_for_selector('.task-layout');assert overflow(page),('demo overflow',width)
  page.screenshot(path=str(SHOTS/f'evidence-{width}.png'),full_page=True)
  page.goto(BASE+'/demos/praxis/#workspace');page.wait_for_selector('h1');assert overflow(page);page.locator('.topbar').click();page.screenshot(path=str(SHOTS/f'workspace-{width}.png'),full_page=True)
  timings.append({'viewport':width,**page.evaluate('''()=>{const n=performance.getEntriesByType('navigation')[0];return {domContentLoaded_ms:Math.round(n.domContentLoadedEventEnd),load_ms:Math.round(n.loadEventEnd),resources:performance.getEntriesByType('resource').length,transfer_bytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0)}}''')})
  for area in ['suites','run','evidence','compare','reports','arena','models','agents','apps','methodology']:
   page.evaluate('(a)=>location.hash=a',area);page.wait_for_function('(a)=>document.querySelector("#breadcrumb").textContent.endsWith(a.toUpperCase())',arg=area);page.wait_for_timeout(70);assert overflow(page),(area,width)
 passed('390/768/1024/1280/1440 screenshots and no document overflow across all states')
 page.emulate_media(reduced_motion='reduce');page.goto(BASE+'/demos/praxis/#run');page.wait_for_selector('#run-button');page.locator('#run-button').click();expect(page.locator('.progress-text')).to_contain_text('8/8 tasks replayed');passed('Reduced-motion replay completes without paced animation')
 # Existing experience smoke checks.
 page.set_viewport_size({'width':1280,'height':1000})
 for slug in ['rlb','nyrc','mindscape','survey-intelligence']:
  page.goto(BASE+'/experience/'+slug+'/');page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_be_visible()
  if slug!='mindscape':expect(page.locator('.tour-options button')).to_have_count(5);expect(page.locator('.tour-surface iframe')).to_have_count(1)
 passed('RLB, NYRC, Mindscape and Survey shared experiences still render')
 page.goto(BASE+'/');page.wait_for_load_state('networkidle');expect(page.locator('[data-project="2"]').first).to_be_visible();page.locator('[data-project="2"]').first.click();page.wait_for_timeout(150);expect(page.locator('body')).to_contain_text('Controlled Beta');passed('Homepage Praxis collection card uses updated beta metadata')
 assert not bad,bad;assert not errors,errors
 # Demo requests stay same-origin and exclusively static resources.
 assert not any('/api/' in u or ':8787' in u or ':8788' in u for u in requests),requests
 passed('No console errors, failed HTTP assets or Praxis API traffic')
 result={'checks':results,'console_errors':errors,'failed_responses':bad,'performance_local_cache_warm':timings,'screenshots':[str(x.relative_to(ROOT)) for x in sorted(SHOTS.glob('*.png'))]}
 (OUT/'browser-results.json').write_text(json.dumps(result,indent=2)+'\n');browser.close()
