from pathlib import Path
from PIL import Image
import json,re,sys
root=Path('/workspace/eva-in-place-qa/range-slim-v69')
def lum(rgb):
 c=[v/255 for v in rgb];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
phase=sys.argv[1] if len(sys.argv)>1 else 'preflight'
d=json.loads((root/f'{phase}.json').read_text());results=[]
for p in d['profiles']:
 c=p['contrast'];g=c['glass'];im=Image.open(root/f"{'' if phase=='preflight' else 'native-'}background-{p['locale']}-{p['width']}.png").convert('RGB')
 for t in c['labels']:
  b=t['box'];rect=(max(0,int(b['x']-g['x'])),max(0,int(b['y']-g['y'])),min(im.width,int(b['right']-g['x']+1)),min(im.height,int(b['bottom']-g['y']+1)))
  if rect[2]<=rect[0] or rect[3]<=rect[1]:continue
  rgb=tuple(map(int,re.findall(r'\d+',t['color'])[:3]));fg=lum(rgb);minimum=min((max(fg,lum(bg))+.05)/(min(fg,lum(bg))+.05) for bg in im.crop(rect).get_flattened_data());required=3 if t['size']>=24 else 4.5
  results.append({'locale':p['locale'],'width':p['width'],'text':t['text'],'foreground':t['color'],'size':t['size'],'minimumContrast':round(minimum,2),'required':required,'passed':minimum>=required})
r={'phase':phase,'method':'Conservative whole text rectangle against actual painted glass with text made transparent; grain, gradients and rim retained. Not a glyph-pixel estimate.','passed':all(x['passed'] for x in results),'profiles':len(d['profiles']),'minimum':min(x['minimumContrast'] for x in results),'results':results};(root/f'{phase}-contrast.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:r[k] for k in ['passed','profiles','minimum']}));print(json.dumps([x for x in results if not x['passed']],ensure_ascii=False));raise SystemExit(0 if r['passed'] else 1)
