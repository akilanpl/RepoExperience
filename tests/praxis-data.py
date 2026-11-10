"""Source equality, summary consistency, sanitization and contract regression checks."""
import json, pathlib, sys, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1];DATA=ROOT/'demos/praxis/data'
SOURCE=pathlib.Path(sys.argv.pop()) if len(sys.argv)>1 else None
class PublicEvidence(unittest.TestCase):
 def test_suites(self):
  entries=json.loads((DATA/'suite-definitions.json').read_text())['suites']
  self.assertEqual(len(entries),6);self.assertEqual(sum(len(e['suite']['tasks']) for e in entries),40)
  for e in entries:
   if SOURCE:self.assertEqual(e['suite'],json.loads((SOURCE/e['provenance']['path']).read_text()))
  t=next(e['suite'] for e in entries if e['suite']['slug']=='structured-agent')['tasks'][0]
  self.assertEqual(t['id'],'route-outage');self.assertEqual(t['passing_fixture'],dict(priority='urgent',team='technical'))
 def test_report_evidence(self):
  for file in DATA.glob('*.json'):
   d=json.loads(file.read_text());self.assertEqual(d['provenance']['commit'],'75243f70731fb5b8001ff39c64d83af9a02120b5')
   if 'report' not in d:continue
   with self.subTest(file=file.name):
    r=d['report'];s=r['summary'];self.assertEqual(s['passed'],sum(t['passed'] for t in r['tasks']))
    self.assertEqual(s['assertions_passed'],sum(a['passed'] for t in r['tasks'] for a in t['assertions']))
    self.assertEqual(s['assertions_total'],sum(len(t['assertions']) for t in r['tasks']))
    if SOURCE:
     original=json.loads((SOURCE/d['provenance']['path']).read_text());original=original.get('result',original)
     for key in r:
      if key=='execution':self.assertEqual(r[key],original['configuration']['execution'])
      elif key=='tasks':
       for task,source in zip(r[key],original[key]):
        for field in task:self.assertEqual(task[field],source[field])
      else:self.assertEqual(r[key],original[key])
 def test_sanitization(self):
  forbidden={'target_id','request_fingerprint','password','token','session','owner_id','endpoint','username','created_at','finished_at','configuration'}
  def check(x):
   if isinstance(x,dict):
    self.assertFalse(set(x)&forbidden)
    for value in x.values():check(value)
   elif isinstance(x,list):
    for value in x:check(value)
  for f in DATA.glob('*.json'):
   check(json.loads(f.read_text()));self.assertNotIn('127.0.0.1',f.read_text());self.assertNotIn('/workspace/',f.read_text())
 def test_historical_result(self):
  r=json.loads((DATA/'recorded-model-run.json').read_text())['report']
  self.assertEqual((r['summary']['passed'],r['summary']['total'],r['summary']['assertions_passed']),(0,8,0))
  self.assertAlmostEqual(r['duration_ms'],64372.706);self.assertIn("don't have the capability to access the chat server",r['tasks'][0]['output'])
  self.assertEqual(r['trust'],'self-reported')
 def test_failing_is_not_relabelled(self):
  a=json.loads((DATA/'structured-agent-passing.json').read_text())['report'];b=json.loads((DATA/'structured-agent-failing.json').read_text())['report']
  self.assertEqual(a['summary']['passed'],8);self.assertEqual(a['summary']['assertions_passed'],24)
  self.assertNotEqual(a['tasks'][0]['output'],b['tasks'][0]['output'])
  self.assertEqual(b['tasks'][0]['output']['priority'],'incorrect')
  self.assertTrue(b['tasks'][0]['assertions'][0]['passed']);self.assertFalse(b['tasks'][0]['assertions'][1]['passed'])
if __name__=='__main__':unittest.main()
