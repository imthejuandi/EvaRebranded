import sys,termios,json,urllib.request,hashlib,re
from pathlib import Path
if sys.stdin.isatty():
 a=termios.tcgetattr(sys.stdin.fileno());a[3]&=~termios.ECHO;termios.tcsetattr(sys.stdin.fileno(),termios.TCSANOW,a)
print('Ready for baseline read-only input (hidden).',flush=True)
j=json.loads(sys.stdin.readline());token=j['bearer'];base='https://eva-content-review.jdlagop.chatgpt.site'
rows=[]
for locale in ['en','es']:
 p=Path('/workspace/eva-in-place-qa/problem-pilot-20261126/baseline/dist/client')/(locale+'.html');local=p.read_bytes()
 req=urllib.request.Request(base+'/'+locale,headers={'OAI-Sites-Authorization':'Bearer '+token})
 with urllib.request.urlopen(req,timeout=40) as r:remote=r.read();status=r.status
 def assets(b):return sorted(set(re.findall(rb'(?:src|href)="(/assets/[^"?]+)',b)))
 l=assets(local);q=assets(remote)
 rows.append({'locale':locale,'status':status,'archived_html_sha256':hashlib.sha256(local).hexdigest(),'served_html_sha256':hashlib.sha256(remote).hexdigest(),'html_bytes_equal':local==remote,'compiled_asset_lists_equal':l==q,'compiled_asset_count':len(l)})
 assert status==200 and l==q
out=Path('/workspace/eva-in-place-qa/problem-pilot-20261126/native-baseline-fingerprint.json');out.write_text(json.dumps({'source':'Original v70 native GET compared with pinned release archive; headers/token not retained.','rows':rows},indent=2)+'\n')
print(json.dumps(rows),flush=True)
