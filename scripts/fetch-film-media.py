"""Download approved generation outputs and make web-sized review posters."""
import argparse
import json
from pathlib import Path
import subprocess
import urllib.request

parser=argparse.ArgumentParser()
parser.add_argument('manifest')
args=parser.parse_args()
for item in json.loads(Path(args.manifest).read_text())['files']:
    target=Path(item['path'])
    if not str(target.resolve()).startswith('/workspace/'):
        raise ValueError('Output must be in this workspace')
    if not item['url'].startswith('https://'):
        raise ValueError('HTTPS media URL required')
    target.parent.mkdir(parents=True,exist_ok=True)
    if not target.exists():
        with urllib.request.urlopen(item['url'],timeout=180) as response:
            temporary=target.with_suffix(target.suffix+'.part')
            temporary.write_bytes(response.read())
            temporary.replace(target)
    if item.get('poster'):
        Path(item['poster']).parent.mkdir(parents=True,exist_ok=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(target),'-frames:v','1','-vf','scale=1600:-2','-q:v','2',item['poster']],check=True)
    if item.get('web_video'):
        web=Path(item['web_video'])
        web.parent.mkdir(parents=True,exist_ok=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(target),'-an','-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',str(web)],check=True)
    if item.get('frames'):
        frames=Path(item['frames']);frames.mkdir(parents=True,exist_ok=True)
        for i,time in enumerate([.1,1.2,2.5,3.8,4.8]):
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(time),'-i',str(target),'-frames:v','1','-vf','scale=1280:-2','-q:v','3',str(frames/f'frame-{i}.jpg')],check=True)
    print(json.dumps({'file':str(target),'bytes':target.stat().st_size}),flush=True)
