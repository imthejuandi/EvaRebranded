"""Create scroll-addressable image sheets from retained source footage."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/art/tasso-scroll'
OUT.mkdir(parents=True,exist_ok=True)
ARCHIVE=ROOT/'media/source/tasso-films'
ARCHIVE.mkdir(parents=True,exist_ok=True)
FRAMES=60

def source(name):
    public=ROOT/'public/art/tasso-films'/name
    return public if public.exists() else ARCHIVE/name

def prepare(item):
    option,scene=item
    original=option=='original'
    src=source('original.mp4' if original else f'{option}-{scene}.mp4')
    start=0 if not original or scene=='collect' else 7.08
    framing='crop=iw:760:0:0,scale=1200:675:force_original_aspect_ratio=decrease,pad=1200:675:(ow-iw)/2:(oh-ih)/2:color=0xf3f0e8' if original else 'scale=1200:675:force_original_aspect_ratio=increase,crop=1200:675'
    prefix=OUT/f'{option}-{scene}'
    command=['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(src),'-t','5','-vf',f'fps=12,{framing},trim=end_frame={FRAMES},tile=3x4:nb_frames=12','-frames:v','5','-c:v','libwebp','-quality','78','-compression_level','5','-threads','2',str(prefix)+'-%02d.webp']
    subprocess.run(command,check=True)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(src),'-frames:v','1','-vf',framing,'-q:v','2',str(prefix)+'.jpg'],check=True)
    paths=[Path(str(prefix)+f'-{i:02}.webp') for i in range(1,6)]
    if not all(p.exists() for p in paths):raise RuntimeError('Incomplete sheet set')
    result={'option':option,'scene':scene,'atlases':['/'+str(p.relative_to(ROOT/'public')) for p in paths],'poster':'/'+str(Path(str(prefix)+'.jpg').relative_to(ROOT/'public')),'bytes':sum(p.stat().st_size for p in paths)}
    print(json.dumps(result),flush=True)
    return result

tasks=[(option,scene) for option in ['original','studio','morning','light'] for scene in ['collect','return']]
with ThreadPoolExecutor(max_workers=2) as pool:
    results=list(pool.map(prepare,tasks))
manifest=ROOT/'lib/site-content/tasso-scroll-options.json'
data=json.loads(manifest.read_text())
for option in data['options']:
    for scene in option['scenes']:
        result=next(r for r in results if r['option']==option['id'] and r['scene']==scene['id'])
        scene.update({'ready':True,'poster':result['poster'],'frameWidth':1200,'frameHeight':675,'fps':12,'frameCount':60,'columns':3,'rows':4,'framesPerSheet':12,'atlases':result['atlases']})
data['dashboard'].update({'ready':True,'src':'/art/tasso-scroll/eva-dashboard.jpg','width':1296,'height':780})
manifest.write_text(json.dumps(data,indent=2)+'\n')
# Retain the paid source renders in the repository, outside the website bundle.
for path in (ROOT/'public/art/tasso-films').glob('*.mp4'):
    shutil.move(str(path),str(ARCHIVE/path.name))
for name in ['studio-insight.jpg','morning-insight.jpg','light-insight.jpg']:
    path=ROOT/'public/art/tasso-films'/name
    if path.exists():shutil.move(str(path),str(ARCHIVE/name))
(ROOT/'docs/tasso-scroll-assets.json').write_text(json.dumps({'framesPerScene':60,'fps':12,'frameWidth':1200,'frameHeight':675,'columns':3,'rows':4,'scenes':results},indent=2)+'\n')
print(json.dumps({'complete':True,'atlasBytes':sum(r['bytes'] for r in results)}),flush=True)
