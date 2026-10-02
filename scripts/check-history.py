"""Verify every deduplicated historical source/media entry against its SHA-256."""
import hashlib,json,sys,zipfile
from pathlib import Path
root=Path(sys.argv[1] if len(sys.argv)>1 else 'dist/client/archive')
archives=entries=0
for path in root.glob('*.zip'):
 with zipfile.ZipFile(path) as patch:
  if 'RESTORE-MANIFEST.json' not in patch.namelist():
   assert patch.testzip() is None, f'Corrupt archive: {path.name}'
   continue
  m=json.loads(patch.read('RESTORE-MANIFEST.json'))
  with zipfile.ZipFile(root/m['base']) as base:
   for name,spec in m['files'].items():
    assert not Path(name).is_absolute() and '..' not in Path(name).parts
    data=(base if spec['source']=='base' else patch).read(spec.get('sourcePath',name))
    assert hashlib.sha256(data).hexdigest()==spec['sha256'], f'{path.name}: {name}'
    entries+=1
  archives+=1
assert archives>=11, 'Missing preserved history manifests'
print(f'History: {archives} manifest archives and {entries} original files verified losslessly.')
