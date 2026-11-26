from pathlib import Path
import subprocess,hashlib,json
base='58bac762100a18c440b38429dee95f4663194e2d'
old=lambda f:subprocess.check_output(['git','show',base+':'+f])
files=['components/story/ScrollStory.tsx','components/story/BiomarkerGallery.tsx','components/story/guided-result-story.css']
new=['components/story/ResultsProblem.tsx','lib/site-content/results-problem-copy.ts']
tracked=subprocess.check_output(['git','diff',base,'--name-only','--','app','components','lib','public','package.json','package-lock.json','.openai/hosting.json'],text=True).splitlines()
untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard','--','app','components','lib','public'],text=True).splitlines()
assert set(tracked).issubset(set(files+new)),tracked
assert set(untracked).issubset(set(new)),untracked
assert set(tracked+untracked)==set(files+new)
f=files[0];s=Path(f).read_bytes().replace(b"import {ResultsProblem} from './ResultsProblem';\n",b'').replace(b' <ResultsProblem calm={calm}/>\n',b'');s=s.replace(b"    let active = candidates.map",b"    const active = candidates.map"); approved_helper=b"    const gallery = document.getElementById('biomarcadores');\n    const galleryBounds = gallery?.getBoundingClientRect();\n    // The collapsed gallery still owns its chapter until it has left the viewport.\n    if (active?.id === 'una-senal' && galleryBounds && galleryBounds.height < window.innerHeight * .5 && galleryBounds.bottom > 1)\n        active = gallery ?? active;\n";assert approved_helper in s;s=s.replace(approved_helper,b'');assert s==old(f),'Unexpected ScrollStory change beyond import+mount+approved position helper'
f=files[2];s=Path(f).read_bytes();s=b'\n'.join(line for line in s.split(b'\n') if not line.startswith(b'.results-problem .results-problem-lead') and not line.startswith(b'@media(max-width:700px){.results-problem .results-problem-lead'));assert s==old(f),'Unrelated style change'
protected=['components/story/GuidedResultStory.tsx','components/story/HeroKitCta.tsx','components/story/EvaWordmark.tsx','components/story/EvaFilm.tsx','components/story/TrackedRunner.tsx','components/story/RunnerArrival.tsx','app/hero-entrance.css','app/hero-kit.css','lib/site-content/alex-story-copy.ts','lib/site-content/range-proof-copy.ts','lib/story-scroll-timing.ts','lib/hero-layout.ts','public/art/eva-official-logo.png']
for f in protected:assert Path(f).read_bytes()==old(f),f
r={'passed':True,'baseline':base,'changed_runtime_files':files+new,'source_hashes':{f:hashlib.sha256(Path(f).read_bytes()).hexdigest() for f in files+new},'protected_file_hashes':{f:hashlib.sha256(Path(f).read_bytes()).hexdigest() for f in protected},'hero_implementation_byte_equal_excluding_approved_position_helper':True,'approved_helper_exception':'Defer signal only while preceding short results gallery remains visible; fixes observed regression. All entrance/effects/JSX/destinations byte-identical.','all_other_tracked_runtime_files_unchanged':True}
Path('docs/problem-pilot-20261126/final-source-diff-tests.json').write_text(json.dumps(r,indent=2)+'\n')
print(json.dumps({'passed':True,'changed_files':len(files+new),'protected_named_files':len(protected),'all_other_tracked_runtime_files':'unchanged'}))
