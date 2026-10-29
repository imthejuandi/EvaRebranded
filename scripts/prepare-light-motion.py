"""Package the genuine dashboard screen recording for scroll-scrub delivery."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CAPTURE=Path('/workspace/eva-light-dashboard-capture')
meta=json.loads((CAPTURE/'capture.json').read_text())
source=ROOT/'media/source/tasso-light';source.mkdir(parents=True,exist_ok=True)
out=ROOT/'public/art/tasso-light';out.mkdir(parents=True,exist_ok=True)
movie=source/'dashboard-live.mp4'
def run(args):subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args],check=True)
# The browser crop keeps the actual heading, example badge, complete signature,
# privacy controls, and the selected-result panel. The crop ends at its border.
frames=meta['frames'];assert len(frames)>24,'Incomplete browser screencast'
concat=CAPTURE/'recording.ffconcat'
lines=['ffconcat version 1.0']
for index,frame in enumerate(frames):
    duration=frames[index+1]['timestamp']-frame['timestamp'] if index+1<len(frames) else .08
    lines.extend(["file '"+frame['file']+"'",'duration '+str(max(.001,duration))])
lines.append("file '"+frames[-1]['file']+"'")
concat.write_text('\n'.join(lines)+'\n')
run(['-safe','0','-i',str(concat),'-t','8','-vf','crop=1296:1080:264:90,scale=1200:1000:flags=lanczos,fps=24,tpad=stop_mode=clone:stop_duration=1','-frames:v','192','-an','-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(movie)])
run(['-ss','2.5','-i',str(movie),'-frames:v','1','-q:v','2',str(out/'insight.jpg')])
atlases=[]
for index in range(24):
    name=f'insight-{index+1:02}.webp'
    run(['-i',str(movie),'-vf',f'select=between(n\\,{index*8}\\,{index*8+7}),tile=4x2','-frames:v','1','-c:v','libwebp','-quality','84',str(out/name)])
    atlases.append('/art/tasso-light/'+name)
manifest_path=ROOT/'lib/site-content/tasso-light-cinematic.json'
manifest=json.loads(manifest_path.read_text())
manifest['scenes'][2]={'id':'insight','ready':True,'poster':'/art/tasso-light/insight.jpg','frameWidth':1200,'frameHeight':1000,'fps':24,'frameCount':192,'columns':4,'rows':2,'framesPerSheet':8,'atlases':atlases}
manifest['scenes'][2]['states']=[{'id':'signature','frame':12},{'id':'apob','frame':56},{'id':'hscrp','frame':124},{'id':'closed','frame':184}]
manifest['carrier']['ready']=True
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
provenance={'source_route':'/es/dashboard','capture':{k:v for k,v in meta.items() if k not in ['frames','captureEpoch']},'capturedPngFrames':len(frames),'video':'media/source/tasso-light/dashboard-live.mp4','sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'frameCount':192,'fps':24,'dimensions':[1200,1000],'atlases':atlases,'carrier_source':'Generated photographic envelope cutout referenced to the existing Light return image; an unbranded creative packaging prop. Actual UI footage remains an unchanged lossless browser capture.','carrier_asset':manifest['carrier']['src'],'carrier_rendering':'Transparent photographic silhouette with an opaque inset backing; stage edits occur under the backed central paper face.','asset_bytes':sum(p.stat().st_size for p in out.iterdir() if p.is_file())}
(ROOT/'docs/tasso-light-motion-assets.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'movie':str(movie),'frames':192,'atlases':len(atlases),'asset_bytes':provenance['asset_bytes']}),flush=True)
