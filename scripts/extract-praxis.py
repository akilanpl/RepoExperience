"""Normalize allowlisted public evidence from a read-only Praxis checkout."""
import argparse, json, pathlib, subprocess
p=argparse.ArgumentParser(); p.add_argument('source',type=pathlib.Path); args=p.parse_args()
root=pathlib.Path(__file__).resolve().parents[1]; dest=root/'demos/praxis/data'
sha=subprocess.check_output(['git','-C',str(args.source),'rev-parse','HEAD'],text=True).strip()
def provenance(path):
 return dict(repository='https://github.com/akilanpl/praxis',commit=sha,path=path,normalized_on='2026-11-10',sanitization='Explicit public field allowlist; no account/run/target IDs, fingerprints, credentials, endpoint configuration, or local paths. Outputs, checks and simulation traces retained verbatim. Original hashes identify source evidence, not normalized-file digests or independent verification.')
def save(name,path,data):
 (dest/name).write_text(json.dumps(dict(provenance=provenance(path),**data),indent=2,ensure_ascii=False)+'\n')
suites=[]
for f in sorted((args.source/'packages/scenarios').glob('*.json')):
 d=json.loads(f.read_text())
 if d.get('schema_version')=='praxis.suite.v1':
  suites.append(dict(provenance=provenance(str(f.relative_to(args.source))),suite=d))
save('suite-definitions.json','packages/scenarios/',dict(suites=suites))
for entry in suites:
 slug=entry['suite']['slug']
 for mode in ['passing','failing']:
  path=f'evidence/review/acceptance/suite-runs/{slug}-{mode}.json'; d=json.loads((args.source/path).read_text())
  keys=['runner_version','adapter_version','target_name','target_kind','suite_slug','suite_version','suite_hash','seed','trust','status','summary','duration_ms','evidence_hash']
  report={k:d[k] for k in keys};report['execution']=d['configuration']['execution']
  report['tasks']=[{k:t[k] for k in ['id','prompt','category','output','assertions','passed','latency_ms','attempts','error','tool_trace','artifact']} for t in d['tasks']]
  save(f'{slug}-{mode}.json',path,dict(evidence_kind='owned-http-recording' if slug=='http-application' else 'deterministic-fixture',report=report))
path='evidence/review/acceptance/browser/run-1.json'; d=json.loads((args.source/path).read_text())['result']
report={k:d[k] for k in keys};report['execution']=d['configuration']['execution']
report['tasks']=[{k:t[k] for k in ['id','prompt','category','output','assertions','passed','latency_ms','attempts','error','tool_trace','artifact','provider_metadata']} for t in d['tasks']]
save('recorded-model-run.json',path,dict(evidence_kind='recorded-real-inference',report=report))
print(f'Extracted {len(suites)} suites at {sha}')
