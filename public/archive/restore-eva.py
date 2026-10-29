#!/usr/bin/env python3
"""Restore an EVA archive containing RESTORE-MANIFEST.json. No extra packages.
Usage: python3 restore-eva.py VERSION.zip BASE.zip OUTPUT_DIRECTORY
"""
import hashlib,json,sys,zipfile
from pathlib import Path

def restore(patch_path,base_path,out):
 out=Path(out)
 if out.exists() and any(out.iterdir()):raise ValueError('Choose an empty output directory.')
 with zipfile.ZipFile(patch_path) as patch,zipfile.ZipFile(base_path) as base:
  manifest=json.loads(patch.read('RESTORE-MANIFEST.json'))
  if Path(base_path).name!=manifest['base']:raise ValueError('Required base: '+manifest['base'])
  validated=[]
  for name,spec in manifest['files'].items():
   target=(out/name).resolve()
   if not target.is_relative_to(out.resolve()):raise ValueError('Unsafe archive path')
   data=(base if spec['source']=='base' else patch).read(spec.get('sourcePath',name))
   if hashlib.sha256(data).hexdigest()!=spec['sha256']:raise ValueError('Hash mismatch: '+name)
   validated.append((target,data))
  for target,data in validated:
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 return len(validated)
if __name__=='__main__':
 if len(sys.argv)!=4:raise SystemExit(__doc__)
 print('Restored and verified',restore(*sys.argv[1:]),'files.')
